import { SuiClient, SuiObjectResponse } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import Decimal from 'decimal.js';

import {
  CetusPoolResponse,
  CetusVaultLpResponse,
  COIN,
  LiquidStakingResponse,
  LpTokenValueEvent,
  SBUCKFlaskResponse,
  SupraPriceFeedResponse,
  UnihouseResponse,
} from '@/types';
import {
  ALPHAFI_STSUI_SUI_PACKAGE_ID,
  CETUS_VAULT_PACKAGE_ID,
  COIN_DECIMALS,
  COINS_TYPE_LIST,
  DUMMY_ADDRESS,
} from '@/constants';

import { formatUnits, U64FromBytes } from './format';
import { getObjectFields } from './object';

export function computeSupraPrice(res: SuiObjectResponse): number {
  const priceFeed = getObjectFields(res) as SupraPriceFeedResponse;
  const priceBn = priceFeed.value.fields.value;
  const decimals = priceFeed.value.fields.decimal;
  const price = Number(priceBn) / Math.pow(10, decimals);

  return price;
}

export function computeSBUCKPrice(res: SuiObjectResponse): number {
  const priceFeed = getObjectFields(res) as SBUCKFlaskResponse;
  const reserves = priceFeed.reserves;
  const sBuckSupply = priceFeed.sbuck_supply.fields.value;
  const price = Number(reserves) / Number(sBuckSupply);

  return price;
}

export function computeLiquidStakingRate(res: SuiObjectResponse): number {
  const resp = getObjectFields(res) as LiquidStakingResponse;
  const totalSuiSupply = Number(resp.storage.fields.total_sui_supply) / 10 ** 9;
  const totalLstSupply = Number(resp.lst_treasury_cap.fields.total_supply.fields.value) / 10 ** 9;
  const rate = totalSuiSupply / totalLstSupply;

  return rate;
}

export function computeUnihouseRate(res: SuiObjectResponse): number {
  const resp = getObjectFields(res) as UnihouseResponse;
  const debtAmount = Number(formatUnits(BigInt(resp.pipe_debt.fields.value), 9));
  const poolAmount = Number(formatUnits(BigInt(resp.pool), 9));
  const gsuiSupply = Number(formatUnits(BigInt(resp.supply.fields.value), 9));
  const rate = (debtAmount + poolAmount) / gsuiSupply;

  return rate;
}

export const calculateClmmPrice = (sqrtPrice: string, decimalsA: number, decimalsB: number): number => {
  const priceX64 = new Decimal(sqrtPrice).mul(Decimal.pow(2, -64));
  const price = priceX64.pow(2).mul(Decimal.pow(10, decimalsA - decimalsB));

  return price.toNumber();
};

export const getCetusVaultLpPrice = async (
  client: SuiClient,
  lpCoin: COIN,
  coinA: COIN,
  coinB: COIN,
  lpObjectId: string,
  basePrice: number,
): Promise<number> => {
  const lpObject = await client.getObject({
    id: lpObjectId,
    options: {
      showContent: true,
    },
  });
  const { pool } = getObjectFields(lpObject) as CetusVaultLpResponse;

  const poolObject = await client.getObject({
    id: pool,
    options: {
      showContent: true,
    },
  });
  const { current_sqrt_price } = getObjectFields(poolObject) as CetusPoolResponse;
  const poolPrice = calculateClmmPrice(current_sqrt_price, COIN_DECIMALS[coinA], COIN_DECIMALS[coinB]);

  const tx = new Transaction();

  tx.moveCall({
    target: `${CETUS_VAULT_PACKAGE_ID}::fetcher::get_position_amounts`,
    typeArguments: [COINS_TYPE_LIST[coinA], COINS_TYPE_LIST[coinB], COINS_TYPE_LIST[lpCoin]],
    arguments: [tx.object(lpObjectId), tx.object(pool), tx.pure.u64('1000000000')],
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
