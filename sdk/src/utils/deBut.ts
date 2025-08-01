import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { fromBase64 } from '@mysten/sui/utils';

import { phantom } from '@/_generated/_framework/reified';
import { DeWrapper as DeButWrapperStruct } from '@/_generated/de-voting/de-wrapper/structs';
import {
  getCastedWeightByEpoch,
  getPendingRewards,
  getRewardsByEpoch,
  getVotingStateByEpoch,
} from '@/_generated/de-voting/reward-center/functions';
import { DeCenter } from '@/_generated/detoken/de-center/structs';
import { DeToken as DeButPositionStruct } from '@/_generated/detoken/de-token/structs';

import { DeButPosition, DeButWrapper } from '@/types/bucket';
import { CLOCK_OBJECT, COIN_DECIMALS, COINS_TYPE_LIST } from '@/constants';
import { BUCKET_PROTOCOL_TYPE, DEBUT_CONFIG, INITIAL_SUPPLY, VESTING_LOCK_IDS } from '@/constants/deBut';

import { getMultiGetObjects } from './object';

type VestingLockData = {
  released_amount: string;
};

export const getTotalDeButAmount = (deCenter: DeCenter<string, string>): number => {
  const current = Date.now();

  const deButAmount =
    (Number(deCenter.point.bias.bits) -
      (Number(deCenter.point.slope.bits) * (current - Number(deCenter.point.timestamp))) / 10 ** 9) /
    10 ** 9;

  return deButAmount;
};

export const getDeButAmount = (position: DeButPositionStruct<string, string>): number => {
  const current = Date.now();

  if (current > Number(position.end)) {
    return 0;
  }
  const deButAmount =
    (Number(position.point.bias.bits) -
      (Number(position.point.slope.bits) * (current - Number(position.point.timestamp))) / 10 ** 9) /
    10 ** 9;
  const stakeAmount = Number(position.balance.value) / 10 ** COIN_DECIMALS.BUT;

  return Math.min(deButAmount, stakeAmount);
};

export const getCirculatingSupply = async (client: SuiClient): Promise<number> => {
  const lockRes = await getMultiGetObjects({
    client,
    objectIds: [...VESTING_LOCK_IDS],
    options: {
      showContent: true,
    },
  });
  const totalReleasedAmount = lockRes
    .map((data) => {
      const content = data.data?.content;
      if (content === null || content === undefined || content.dataType === 'package') {
        return 0;
      }
      const releasedAmount = (content.fields as VestingLockData).released_amount;

      return Number(releasedAmount) / 10 ** COIN_DECIMALS.BUT;
    })
    .reduce((x, y) => x + y, 0);

  const circulatingSupply = INITIAL_SUPPLY + totalReleasedAmount;

  return circulatingSupply;
};

export const getUserDeButWrapper = async (client: SuiClient, address: string): Promise<DeButWrapper | null> => {
  const { data } = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: DeButWrapperStruct.$typeName },
    options: { showBcs: true },
  });
  if (data.length === 0) {
    return null;
  }
  if (data[0].data?.bcs?.dataType !== 'moveObject') {
    return null;
  }
  if (data[0].data?.bcs?.type === null) {
    return null;
  }
  const deButWrapperObject = DeButWrapperStruct.fromBcs(
    [phantom(COINS_TYPE_LIST.BUT), phantom(BUCKET_PROTOCOL_TYPE)],
    fromBase64(data[0].data.bcs.bcsBytes),
  );
  const deButPositions = deButWrapperObject.tokens.map((position) => ({
    id: position.id,
    stakedButAmount: Number(position.balance.value) / 10 ** COIN_DECIMALS.BUT,
    stakedPeriod: Number(position.end) - Number(position.point.timestamp),
    startDate: Number(position.point.timestamp),
    unlockDate: Number(position.end),
    deButAmount: getDeButAmount(position),
    earlyUnstakable: position.earlyUnlock,
  }));

  return {
    id: deButWrapperObject.id,
    deButPositions,
  };
};

export const getUserDeButPositions = async (client: SuiClient, address: string): Promise<DeButPosition[]> => {
  const { data } = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: DeButPositionStruct.$typeName },
    options: { showBcs: true },
  });
  const deButPositions = data
    .map((position) => {
      if (position.data?.bcs?.dataType !== 'moveObject') {
        return null;
      }
      if (position.data?.bcs?.type === null) {
        return null;
      }
      const positionObject = DeButPositionStruct.fromBcs(
        [phantom(COINS_TYPE_LIST.BUT), phantom(BUCKET_PROTOCOL_TYPE)],
        fromBase64(position.data?.bcs.bcsBytes),
      );
      return {
        id: positionObject.id,
        stakedButAmount: Number(positionObject.balance.value) / 10 ** COIN_DECIMALS.BUT,
        stakedPeriod: Number(positionObject.end) - Number(positionObject.point.timestamp),
        startDate: Number(positionObject.point.timestamp),
        unlockDate: Number(positionObject.end),
        deButAmount: Math.min(
          getDeButAmount(positionObject),
          Number(positionObject.balance.value) / 10 ** COIN_DECIMALS.BUT,
        ),
        earlyUnstakable: positionObject.earlyUnlock,
      };
    })
    .filter((position) => !!position)
    .toSorted((a, b) => a.startDate - b.startDate);

  return deButPositions;
};

export const getUserDropsAmount = async (
  client: SuiClient,
  address: string,
  deButWrapperId: string,
): Promise<number> => {
  const tx = new Transaction();

  getPendingRewards(tx, [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, COINS_TYPE_LIST.DROP], {
    self: tx.sharedObjectRef(DEBUT_CONFIG.objects.shared.rewardCenter),
    deWrapperId: deButWrapperId,
    clock: tx.sharedObjectRef(CLOCK_OBJECT),
  });
  const res = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: address,
  });
  const returnValues = res?.results?.[0]?.returnValues;
  if (!returnValues?.[0]?.[0]) {
    return 0;
  }
  const pendingRewards = bcs.U64.parse(Uint8Array.from(returnValues[0][0]));
  if (pendingRewards === null) {
    return 0;
  }
  return +pendingRewards / 10 ** COIN_DECIMALS.DROP;
};

export const getUserDropsAmountByEpoch = async (
  client: SuiClient,
  address: string,
  deButWrapperId: string,
): Promise<number> => {
  const epoch = BigInt(Math.floor((Date.now() - 388800000) / (86400000 * 7))) - 1n;

  const tx = new Transaction();

  const state = getVotingStateByEpoch(tx, [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, COINS_TYPE_LIST.DROP], {
    self: tx.sharedObjectRef(DEBUT_CONFIG.objects.shared.rewardCenter),
    epoch: tx.pure.u64(epoch),
  });

  getRewardsByEpoch(tx, COINS_TYPE_LIST.DROP, {
    state,
    deWrapperId: tx.pure.id(deButWrapperId),
  });

  const res = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: address,
  });
  const returnValues = res?.results?.[1]?.returnValues;
  if (!returnValues?.[0]?.[0]) {
    return 0;
  }
  const pendingRewards = bcs.U64.parse(Uint8Array.from(returnValues[0][0]));
  if (pendingRewards === null) {
    return 0;
  }
  return +pendingRewards / 10 ** COIN_DECIMALS.DROP;
};

export const getIsUserCheckedIn = async (
  client: SuiClient,
  address: string,
  deButWrapperId: string,
): Promise<boolean> => {
  const epoch = BigInt(Math.floor((Date.now() - 388800000) / (86400000 * 7)));
  const tx = new Transaction();

  getCastedWeightByEpoch(tx, [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, COINS_TYPE_LIST.DROP], {
    self: tx.sharedObjectRef(DEBUT_CONFIG.objects.shared.rewardCenter),
    deWrapperId: deButWrapperId,
    epoch,
  });
  const res = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: address,
  });
  const returnValues = res?.results?.[0]?.returnValues;
  if (!returnValues?.[0]?.[0]) {
    return false;
  }
  const weight = bcs.u64().parse(new Uint8Array(returnValues[0][0]));
  if (weight === null) {
    return false;
  }
  return +weight > 0;
};
