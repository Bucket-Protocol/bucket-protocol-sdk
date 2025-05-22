import { bcs } from '@mysten/sui/bcs';
import { SuiClient, SuiObjectResponse } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import Decimal from 'decimal.js';

import {
  CetusPoolResponse,
  COIN,
  LiquidStakingResponse,
  LpTokenValueEvent,
  SBUCKFlaskResponse,
  SupraPriceFeedResponse,
  UnihouseResponse,
} from '@/types';
import {
  ALPHAFI_STSUI_SUI_PACKAGE_ID,
  BLIZZARD_STAKING_OBJECT_ID,
  CETUS_VAULT_PACKAGE_ID,
  COIN_DECIMALS,
  COINS_TYPE_LIST,
  DUMMY_ADDRESS,
  WALRUS_SYSTEM_OBJECT_ID,
} from '@/constants';

import { formatUnits, U64FromBytes } from './format';
import { getObjectFields } from './object';

export const computeSupraPrice = (res: SuiObjectResponse | undefined): number => {
  if (!res) {
    return 0;
  }
  const priceFeed = getObjectFields(res) as SupraPriceFeedResponse;
  const priceBn = priceFeed.value.fields.value;
  const decimals = priceFeed.value.fields.decimal;
  const price = Number(priceBn) / Math.pow(10, decimals);

  return price;
};

export const computeSbuckRate = (res: SuiObjectResponse | undefined): number => {
  if (!res) {
    return 0;
  }
  const priceFeed = getObjectFields(res) as SBUCKFlaskResponse;
  const reserves = priceFeed.reserves;
  const sBuckSupply = priceFeed.sbuck_supply.fields.value;
  const rate = Number(reserves) / Number(sBuckSupply);

  return rate;
};

export const computeLiquidStakingRate = (res: SuiObjectResponse | undefined): number => {
  if (!res) {
    return 0;
  }
  const resp = getObjectFields(res) as LiquidStakingResponse;
  const totalSuiSupply = Number(resp.storage.fields.total_sui_supply) / 10 ** 9;
  const totalLstSupply = Number(resp.lst_treasury_cap.fields.total_supply.fields.value) / 10 ** 9;
  const rate = totalSuiSupply / totalLstSupply;

  return rate;
};

export const computeHaWalStakingRate = (res: SuiObjectResponse | undefined): number => {
  if (!res) {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resp = getObjectFields(res) as any;
  const totalWalSupply =
    (Number(resp.total_staked) +
      Number(resp.total_rewards) -
      Number(resp.collected_protocol_fees) -
      Number(resp.uncollected_protocol_fees) -
      Number(resp.total_unstaked)) /
    10 ** 9;
  const totalHaWalSupply = Number(resp.hawal_supply) / 10 ** 9;
  const rate = totalWalSupply / totalHaWalSupply;

  return rate;
};

export const computeBlizzardStakingRate = async (client: SuiClient): Promise<number> => {
  const tx = new Transaction();

  const epoch = tx.moveCall({
    target: '0xfdc88f7d7cf30afab2f82e8380d11ee8f70efb90e863d1de8616fae1bb09ea77::system::epoch',
    arguments: [tx.object(WALRUS_SYSTEM_OBJECT_ID)],
  });
  tx.moveCall({
    target: '0x29ba7f7bc53e776f27a6d1289555ded2f407b4b1a799224f06b26addbcd1c33d::blizzard_protocol::to_lst_at_epoch',
    typeArguments: [COINS_TYPE_LIST.wWAL],
    arguments: [tx.object(BLIZZARD_STAKING_OBJECT_ID), epoch, tx.pure.u64(1000000000), tx.pure.bool(false)],
  });
  const { results } = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: DUMMY_ADDRESS,
  });
  const returnValues = results?.[1]?.returnValues;
  if (!returnValues?.[0]?.[0]) {
    return 0;
  }
  const rate = bcs.option(bcs.U64).parse(Uint8Array.from(returnValues[0][0]));

  return rate ? Number(rate) / 10 ** 9 : 0;
};

export const computeUnihouseRate = (res: SuiObjectResponse | undefined): number => {
  if (!res) {
    return 0;
  }
  const resp = getObjectFields(res) as UnihouseResponse;
  const debtAmount = Number(formatUnits(BigInt(resp.pipe_debt.fields.value), 9));
  const poolAmount = Number(formatUnits(BigInt(resp.pool), 9));
  const gsuiSupply = Number(formatUnits(BigInt(resp.supply.fields.value), 9));
  const rate = (debtAmount + poolAmount) / gsuiSupply;

  return rate;
};

export const getScoinRates = (res: SuiObjectResponse | undefined) => {
  if (!res) {
    return 0;
  }
  const resp = getObjectFields(res)?.value?.fields;
  const rate = (Number(resp.cash) + Number(resp.debt) - Number(resp.revenue)) / Number(resp.market_coin_supply);

  return rate;
};

export const calculateClmmPrice = (sqrtPrice: string, decimalsA: number, decimalsB: number): number => {
  const priceX64 = new Decimal(sqrtPrice).mul(Decimal.pow(2, -64));
  const price = priceX64.pow(2).mul(Decimal.pow(10, decimalsA - decimalsB));

  return price.toNumber();
};

export const getCetusVaultLpPrice = async (
  client: SuiClient,
  poolObject: SuiObjectResponse | undefined,
  poolObjectId: string,
  lpObjectId: string,
  lpCoin: COIN,
  coinA: COIN,
  coinB: COIN,
  basePrice: number,
): Promise<number> => {
  if (!poolObject) {
    return 0;
  }
  const { current_sqrt_price } = getObjectFields(poolObject) as CetusPoolResponse;
  const poolPrice = calculateClmmPrice(current_sqrt_price, COIN_DECIMALS[coinA], COIN_DECIMALS[coinB]);

  const tx = new Transaction();

  tx.moveCall({
    target: `${CETUS_VAULT_PACKAGE_ID}::fetcher::get_position_amounts`,
    typeArguments: [COINS_TYPE_LIST[coinA], COINS_TYPE_LIST[coinB], COINS_TYPE_LIST[lpCoin]],
    arguments: [tx.object(lpObjectId), tx.object(poolObjectId), tx.pure.u64('1000000000')],
  });
  const inspectRes = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: DUMMY_ADDRESS,
  });
  const { amount_a, amount_b } = inspectRes.events[0].parsedJson as LpTokenValueEvent;
  const priceA = Number(amount_a) / 10 ** COIN_DECIMALS[coinA];
  const priceB = Number(amount_b) / 10 ** COIN_DECIMALS[coinB];
  const lpPrice = (priceA * poolPrice + priceB) * basePrice;

  return lpPrice;
};

export const getAlphafiStSUIFtPrice = async (
  client: SuiClient,
  priceStSUI: number,
  priceSUI: number,
): Promise<number> => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${ALPHAFI_STSUI_SUI_PACKAGE_ID}::alphafi_bluefin_stsui_sui_ft_pool::get_fungible_token_amounts`,
    typeArguments: [COINS_TYPE_LIST['stSUI'], COINS_TYPE_LIST['SUI'], COINS_TYPE_LIST['stSUI_SUI_ALPHAFI_FT']],
    arguments: [
      tx.object('0x0b45d1e5889b524dc1a472f59651cdedb8e0a2678e745f27975a9b57c127acdd'), // Pool<T0, T1, T2>
      tx.object('0xaec347c096dd7e816febd8397be4cca3aabc094a9a2a1f23d7e895564f859dc2'), // 0x59fd36210b1bf1dcd70d148cd868e059e74b22a660f84c5602cfb8501442322a::alphafi_bluefin_stsui_sui_ft_investor::Investor<T0, T1>
      tx.object('0x73549e0918d10727e324ebeed11ab81ab46f8fadb11078a0641f117d9097b725'), // 0x3492c874c1e3b3e2984e8c41b589e642d4d0a5d6459e5a9cfc2d52fd7c89c267::pool::Pool<T0, T1>
      tx.pure.u64(10 ** COIN_DECIMALS['stSUI_SUI_ALPHAFI_FT']),
    ],
  });
  const { results } = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: DUMMY_ADDRESS,
  });
  const returnValues = results?.[0]?.returnValues;

  if (!returnValues) {
    return 0;
  }
  const amountStSUI = Number(U64FromBytes(returnValues[0][0])) / 10 ** COIN_DECIMALS['stSUI'];
  const amountSUI = Number(U64FromBytes(returnValues[1][0])) / 10 ** COIN_DECIMALS['SUI'];
  const price = amountStSUI * priceStSUI + amountSUI * priceSUI;

  return price;
};
