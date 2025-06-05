import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { fromBase64 } from '@mysten/sui/utils';

import { phantom } from '@/_generated/_framework/reified';
import { DeWrapper as DeWrapperStruct } from '@/_generated/de-voting/de-wrapper/structs';
import {
  getCastedWeightByEpoch,
  getPendingRewards,
  getRewardsByEpoch,
  getVotingStateByEpoch,
} from '@/_generated/de-voting/reward-center/functions';
import { DeCenter } from '@/_generated/detoken/de-center/structs';
import { DeToken } from '@/_generated/detoken/de-token/structs';
import { DeButInfo, DeButPosition, DeButWrapper } from '@/types/bucket';
import { CLOCK_OBJECT, COIN_DECIMALS, COINS_TYPE_LIST } from '@/constants';
import { BUCKET_PROTOCOL_TYPE, DETOKEN_CONFIG, INITIAL_SUPPLY, VESTING_LOCK_IDS } from '@/constants/deBut';

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

export const getDeButAmount = (deToken: DeToken<string, string>): number => {
  const current = Date.now();

  if (current > Number(deToken.end)) {
    return 0;
  }
  const deButAmount =
    (Number(deToken.point.bias.bits) -
      (Number(deToken.point.slope.bits) * (current - Number(deToken.point.timestamp))) / 10 ** 9) /
    10 ** 9;
  const stakeAmount = Number(deToken.balance.value) / 10 ** COIN_DECIMALS.BUT;

  return Math.min(deButAmount, stakeAmount);
};

export const getCirculatingSupply = async (client: SuiClient): Promise<number> => {
  const lockRes = await client.multiGetObjects({
    ids: [...VESTING_LOCK_IDS],
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

export const getDeButInfo = async (client: SuiClient): Promise<DeButInfo> => {
  const deCenter = await client.getObject({
    id: DETOKEN_CONFIG.objects.shared.butDeCenter.objectId,
    options: { showBcs: true },
  });
  const circulatingSupply = await getCirculatingSupply(client);

  if (deCenter.data?.bcs?.dataType !== 'moveObject' || deCenter.data?.bcs?.type === null) {
    return {
      totalStakedButAmount: 0,
      totalDeButAmount: 0,
      circulatingSupply,
    };
  }
  const deCenterObject = DeCenter.fromBcs(
    [phantom(COINS_TYPE_LIST.BUT), phantom(BUCKET_PROTOCOL_TYPE)],
    fromBase64(deCenter.data?.bcs?.bcsBytes),
  );
  return {
    totalStakedButAmount: Number(deCenterObject.lockedTotal) / 10 ** COIN_DECIMALS.BUT,
    totalDeButAmount: Math.min(
      getTotalDeButAmount(deCenterObject),
      Number(deCenterObject.lockedTotal) / 10 ** COIN_DECIMALS.BUT,
    ),
    circulatingSupply,
  };
};

export const getUserDeButWrapper = async (client: SuiClient, address: string): Promise<DeButWrapper | null> => {
  const { data } = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: DeWrapperStruct.$typeName },
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
  const deWrapperObject = DeWrapperStruct.fromBcs(
    [phantom(COINS_TYPE_LIST.BUT), phantom(BUCKET_PROTOCOL_TYPE)],
    fromBase64(data[0].data.bcs.bcsBytes),
  );
  const deTokens = deWrapperObject.tokens.map((deToken) => ({
    id: deToken.id,
    stakedButAmount: Number(deToken.balance.value) / 10 ** COIN_DECIMALS.BUT,
    stakedPeriod: Number(deToken.end) - Number(deToken.point.timestamp),
    startDate: Number(deToken.point.timestamp),
    unlockDate: Number(deToken.end),
    deButAmount: getDeButAmount(deToken),
    earlyUnstakable: deToken.earlyUnlock,
  }));

  return {
    id: deWrapperObject.id,
    deTokens,
  };
};

export const getUserDeButPositions = async (client: SuiClient, address: string): Promise<DeButPosition[]> => {
  const { data } = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: DeToken.$typeName },
    options: { showBcs: true },
  });
  const deTokens = data
    .map((deToken) => {
      if (deToken.data?.bcs?.dataType !== 'moveObject') {
        return null;
      }
      if (deToken.data?.bcs?.type === null) {
        return null;
      }
      const deTokenObject = DeToken.fromBcs(
        [phantom(COINS_TYPE_LIST.BUT), phantom(BUCKET_PROTOCOL_TYPE)],
        fromBase64(deToken.data?.bcs.bcsBytes),
      );
      return {
        id: deTokenObject.id,
        stakedButAmount: Number(deTokenObject.balance.value) / 10 ** COIN_DECIMALS.BUT,
        stakedPeriod: Number(deTokenObject.end) - Number(deTokenObject.point.timestamp),
        startDate: Number(deTokenObject.point.timestamp),
        unlockDate: Number(deTokenObject.end),
        deButAmount: Math.min(
          getDeButAmount(deTokenObject),
          Number(deTokenObject.balance.value) / 10 ** COIN_DECIMALS.BUT,
        ),
        earlyUnstakable: deTokenObject.earlyUnlock,
      };
    })
    .filter((deToken) => !!deToken)
    .toSorted((a, b) => a.startDate - b.startDate);

  return deTokens;
};

export const getUserDropsAmount = async (client: SuiClient, address: string, deWrapperId: string): Promise<number> => {
  const tx = new Transaction();

  getPendingRewards(tx, [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, COINS_TYPE_LIST.DROP], {
    self: tx.sharedObjectRef(DETOKEN_CONFIG.objects.shared.rewardCenter),
    deWrapperId,
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
  deWrapperId: string,
): Promise<number> => {
  const epoch = BigInt(Math.floor((Date.now() - 388800000) / (86400000 * 7))) - 1n;

  const tx = new Transaction();

  const state = getVotingStateByEpoch(tx, [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, COINS_TYPE_LIST.DROP], {
    self: tx.sharedObjectRef(DETOKEN_CONFIG.objects.shared.rewardCenter),
    epoch: tx.pure.u64(epoch),
  });

  getRewardsByEpoch(tx, COINS_TYPE_LIST.DROP, {
    state,
    deWrapperId: tx.pure.id(deWrapperId),
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

export const getIsUserCheckedIn = async (client: SuiClient, address: string, deWrapperId: string): Promise<boolean> => {
  const epoch = BigInt(Math.floor((Date.now() - 388800000) / (86400000 * 7)));
  const tx = new Transaction();

  getCastedWeightByEpoch(tx, [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, COINS_TYPE_LIST.DROP], {
    self: tx.sharedObjectRef(DETOKEN_CONFIG.objects.shared.rewardCenter),
    deWrapperId,
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
