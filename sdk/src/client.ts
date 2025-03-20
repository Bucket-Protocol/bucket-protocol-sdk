import { bcs } from '@mysten/sui/bcs';
import { DevInspectResults, DynamicFieldInfo, getFullnodeUrl, SuiClient, SuiObjectResponse } from '@mysten/sui/client';
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions';

import {
  AF_OBJS,
  AF_SUI_BUCK_LP_REGISTRY_ID,
  AF_USDC_BUCK_LP_REGISTRY,
  AF_USDC_BUCK_LP_REGISTRY_ID,
  BUCKET_OPERATIONS_PACKAGE_ID,
  BUCKET_POINT_CONFIG_OBJ,
  BUCKET_POINT_PACKAGE_ID,
  BUCKET_PROTOCOL_TYPE,
  BUCKETUS_LP_VAULT_05,
  BUCKETUS_TREASURY,
  CETUS_HASUI_SUI_VAULT_LP_OBJECT_ID,
  CETUS_OBJS,
  CETUS_SUI_BUCK_LP_REGISTRY_ID,
  CETUS_USDC_BUCK_LP_REGISTRY,
  CETUS_USDC_BUCK_LP_REGISTRY_ID,
  CLOCK_OBJECT,
  COIN_DECIMALS,
  COINS_TYPE_LIST,
  COLLATERAL_ASSETS,
  CONTRIBUTOR_TOKEN_ID,
  CORE_PACKAGE_ID,
  DETOKEN_CENTER,
  DETOKEN_CONFIG,
  DROPS_COIN_DECIMALS,
  DROPS_COIN_TYPE,
  DUMMY_ADDRESS,
  FOUNTAIN_PACKAGE_ID,
  FOUNTAIN_PERIHERY_PACKAGE_ID,
  GSUI_UNIHOUSE_OBJECT_ID,
  KRIYA_FOUNTAIN_PACKAGE_ID,
  KRIYA_SUI_BUCK_LP_REGISTRY_ID,
  KRIYA_USDC_BUCK_LP_REGISTRY_ID,
  LOCKER_MAP,
  MAX_LOCK_TIME,
  MSUI_LIQUID_STAKING_OBJECT_ID,
  ORACLE_OBJECT,
  PROTOCOL_ID,
  PROTOCOL_OBJECT,
  PSM_BALANCE_IDS,
  PSM_POOL_IDS,
  SBUCK_APR_OBJECT_ID,
  SBUCK_BUCK_LP_REGISTRY,
  SBUCK_BUCK_LP_REGISTRY_ID,
  SBUCK_FLASK_OBJECT,
  SBUCK_FLASK_OBJECT_ID,
  SBUCK_FOUNTAIN_PACKAGE_ID,
  SCABLE_VAULTS,
  SPSUI_LIQUID_STAKING_OBJECT_ID,
  STAKE_PROOF_ID,
  STRAP_FOUNTAIN_IDS,
  STRAP_FOUNTAIN_PACKAGE_ID,
  STRAP_ID,
  STSUI_LIQUID_STAKING_OBJECT_ID,
  SUPRA_HANDLER_OBJECT,
  SUPRA_ID,
  SUPRA_PRICE_FEEDS,
  SUPRA_UPDATE_TARGET,
  SWITCHBOARD_UPDATE_TARGET,
  UNIHOUSE_OBJECT_ID,
} from './constants';
import { STRUCT_BOTTLE_DATA } from './constants/sructs';
import {
  AprResponse,
  BottleInfoResponse,
  BottlePage,
  BucketConstants,
  BucketInfo,
  BucketList,
  BucketProtocolResponse,
  BucketResponse,
  COIN,
  DeCenterResponse,
  DeTokenInfo,
  DeTokenPosition,
  DeTokenResponse,
  DeWrapperInfo,
  DeWrapperResponse,
  FountainInfo,
  FountainList,
  PaginatedBottleSummary,
  PipeResponse,
  ProofObject,
  ProtocolInfo,
  PsmBalanceResponse,
  PsmInfo,
  PsmList,
  SBUCKFlaskResponse,
  ScableCoin,
  StrapFountainInfo,
  StrapFountainList,
  TankInfo,
  TankInfoResponse,
  TankList,
  UserBottleInfo,
  UserDeButInfo,
  UserLpList,
  UserLpProof,
  UserTankList,
} from './types';
import {
  calculateAPR,
  calculateRewardAmount,
  coinFromBalance,
  coinIntoBalance,
  computeLiquidStakingRate,
  computeSBUCKPrice,
  computeSupraPrice,
  computeUnihouseRate,
  formatUnits,
  getAlphafiStSUIFtPrice,
  getCetusVaultLpPrice,
  getCoinSymbol,
  getCoinType,
  getCoinTypeFromPipe,
  getCoinTypeFromTank,
  getDeButAmount,
  getInputCoins,
  getMainCoin,
  getObjectFields,
  getObjectGenerics,
  lpProofToObject,
  ObjectContentFields,
  objectToFountain,
  objectToPsm,
  objectToStrapFountain,
  proofTypeToCoinType,
  U64FromBytes,
} from './utils';

/**
 * @description a TS wrapper over Bucket Protocol Move packages.
 * @param network connection to fullnode: 'mainnet' | 'testnet' | 'devnet' | 'localnet' | string
 * @param owner (optional) address of the current user (default: DUMMY_ADDRESS)
 */
export class BucketClient {
  private rpcEndpoint: string;
  private client: SuiClient;

  constructor(
    public network: string = 'mainnet',
    public owner: string = DUMMY_ADDRESS,
  ) {
    if (network === 'mainnet' || network === 'testnet' || network === 'devnet' || network === 'localnet') {
      this.rpcEndpoint = getFullnodeUrl(network);
    } else {
      this.rpcEndpoint = network as string;
    }

    this.client = new SuiClient({ url: this.rpcEndpoint });
  }

  getSuiClient() {
    return this.client;
  }

  /******************************************************
   ** Data                                             **
   ******************************************************/

  /**
   * @description Get all prices
   */
  async getPrices() {
    const objectNameList = Object.keys(SUPRA_PRICE_FEEDS);

    const [
      sBuckFlaskObj,
      spSuiLiquidStakingObj,
      mSuiRateLiquidStakingObj,
      stSuiLiquidStakingObj,
      gSuiUniHouseObj,
      ...supraPriceObjs
    ] = await this.client.multiGetObjects({
      ids: [
        SBUCK_FLASK_OBJECT_ID,
        SPSUI_LIQUID_STAKING_OBJECT_ID,
        MSUI_LIQUID_STAKING_OBJECT_ID,
        STSUI_LIQUID_STAKING_OBJECT_ID,
        GSUI_UNIHOUSE_OBJECT_ID,
        ...Object.values(SUPRA_PRICE_FEEDS),
      ],
      options: {
        showContent: true,
      },
    });

    const prices: {
      [key: string]: number;
    } = {
      SUI: 0,
      vSUI: 0,
      afSUI: 0,
      haSUI: 0,
      SCA: 0,
      CETUS: 0,
      NAVX: 0,
      WETH: 0,
      sbETH: 0,
      sbWBTC: 0,
      spSUI: 0,
      mSUI: 0,
      stSUI: 0,
      gSUI: 0,
      DEEP: 0,

      BUCK: 1,
      sBUCK: 1,
      USDC: 1,
      wUSDC: 1,
      wUSDT: 1,
      USDY: 1,
      AUSD: 1,
      FDUSD: 1,
      sbUSDT: 1,
      BUCKETUS: 1,
      SCABLE: 1,
      STAPEARL: 1,
      bluefin_BUCK_USDC_LP: 1,
    };

    prices.sBUCK = computeSBUCKPrice(sBuckFlaskObj);

    const spSuiRate = computeLiquidStakingRate(spSuiLiquidStakingObj);
    const mSuiRate = computeLiquidStakingRate(mSuiRateLiquidStakingObj);
    const stSuiRate = computeLiquidStakingRate(stSuiLiquidStakingObj);
    const gSuiRate = computeUnihouseRate(gSuiUniHouseObj);

    supraPriceObjs.map((res, index) => {
      const price = computeSupraPrice(res);

      if (objectNameList[index] === 'usdc_usd') {
        prices.wUSDC = price;
      } else if (objectNameList[index] === 'usdt_usd') {
        prices.wUSDT = price;
      } else if (objectNameList[index] === 'usdy_usd') {
        prices.USDY = price;
      } else if (objectNameList[index] === 'navx_usd') {
        prices.NAVX = price;
      } else if (objectNameList[index] === 'cetus_usd') {
        prices.CETUS = price;
      } else if (objectNameList[index] === 'sca_usd') {
        prices.SCA = price;
      } else if (objectNameList[index] === 'deep_usdt') {
        prices.DEEP = price;
      } else if (objectNameList[index] === 'btc_usd') {
        prices.sbWBTC = price;
      } else if (objectNameList[index] === 'eth_usdt') {
        prices.WETH = (prices.wUSDT ?? 1) * price;
        prices.sbETH = (prices.wUSDT ?? 1) * price;
      } else if (objectNameList[index] === 'sui_usdt') {
        prices.SUI = (prices.wUSDT ?? 1) * price;
      } else if (objectNameList[index] === 'vsui_sui') {
        prices.vSUI = (prices.SUI ?? 1) * price;
      } else if (objectNameList[index] === 'hasui_sui') {
        prices.haSUI = (prices.SUI ?? 1) * price;
      } else if (objectNameList[index] === 'afsui_sui') {
        prices.afSUI = (prices.SUI ?? 1) * price;
      }
    });
    const suiPrice = prices.SUI ?? 0;

    prices.spSUI = suiPrice * spSuiRate;
    prices.mSUI = suiPrice * mSuiRate;
    prices.stSUI = suiPrice * stSuiRate;
    prices.gSUI = suiPrice * gSuiRate;

    prices.haSUI_SUI_CETUS_VT_LP = await getCetusVaultLpPrice(
      this.client,
      'haSUI_SUI_CETUS_VT_LP',
      'haSUI',
      'SUI',
      CETUS_HASUI_SUI_VAULT_LP_OBJECT_ID,
      suiPrice,
    );
    prices.stSUI_SUI_ALPHAFI_FT = await getAlphafiStSUIFtPrice(this.client, prices.stSUI, prices.SUI);

    return prices;
  }

  /**
   * @description update token price using supra oracle
   * @param assetType Asset , e.g "0x2::sui::SUI"
   */
  updateSupraOracle(tx: Transaction, token: string) {
    tx.moveCall({
      target: SWITCHBOARD_UPDATE_TARGET,
      typeArguments: [COINS_TYPE_LIST.SUI],
      arguments: [
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object('0xbca474133638352ba83ccf7b5c931d50f764b09550e16612c9f70f1e21f3f594'),
      ],
    });

    if (token === 'afSUI' || token === 'AF_LP_SUI_SUI') {
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST['SUI']],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID['SUI'] ?? 0),
        ],
      });
      // update afSUI price
      tx.moveCall({
        target: '0x2480d9a3ff2c821061df22c4365316f894c6fa686fbd03ba828fe7c5bef9ad22::afsui_rule::update_price',
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.object('0x2f8f6d5da7f13ea37daa397724280483ed062769813b6f31e9788e59cc88994d'),
          tx.object('0xeb685899830dd5837b47007809c76d91a098d52aabbf61e8ac467c59e5cc4610'),
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
      if (token === 'AF_LP_SUI_SUI') {
        // update afSUI/SUI LP price using afSUI and SUI price
        tx.moveCall({
          target: '0x928ff0be132d9bad7926008780d2a5adfefa1a24559a567dafbfd267d1b1b294::af_lp_rule::update_price',
          typeArguments: [
            '0x42d0b3476bc10d18732141a471d7ad3aa588a6fb4ba8e1a6608a4a7b78e171bf::af_lp::AF_LP',
            COINS_TYPE_LIST.SUI,
            COINS_TYPE_LIST.afSUI,
          ],
          arguments: [
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.object('0x97aae7a80abb29c9feabbe7075028550230401ffe7fb745757d3c28a30437408'),
            tx.sharedObjectRef(CLOCK_OBJECT),
          ],
        });
      }
    } else if (token === 'vSUI') {
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST['SUI']],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID['SUI'] ?? 0),
        ],
      });
      // update vSUI price
      tx.moveCall({
        target: '0x1caed1bf0cc4ca7357989b3a08e487078c6e60277512a8799347010e9ea92e8f::vsui_rule::update_price',
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.object('0x7fa2faa111b8c65bea48a23049bfd81ca8f971a262d981dcd9a17c3825cb5baf'),
          tx.object('0x680cd26af32b2bde8d3361e804c53ec1d1cfe24c7f039eb7f549e8dfde389a60'),
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
    } else if (token === 'haSUI' || token === 'haSUI_SUI_CETUS_VT_LP') {
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST['SUI']],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID['SUI'] ?? 0),
        ],
      });
      // update haSUI price
      tx.moveCall({
        target: '0x4433ab096a71cbcdf70183f465e613955526f321039d9a76be0bd98c5da75382::hasui_rule::update_price',
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.object('0x47b224762220393057ebf4f70501b6e657c3e56684737568439a04f80849b2ca'),
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
      if (token === 'haSUI_SUI_CETUS_VT_LP') {
        tx.moveCall({
          target: '0x656c6d23553950af9bc7e16e4cffa5cdfcd97705e4fddfe5f52eeb38f0cd75ad::cetus_lp_rule::update_price',
          typeArguments: [COINS_TYPE_LIST.haSUI, COINS_TYPE_LIST.SUI, COINS_TYPE_LIST.haSUI_SUI_CETUS_VT_LP],
          arguments: [
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.object('0xde97452e63505df696440f86f0b805263d8659b77b8c316739106009d514c270'),
            tx.object('0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc'),
            tx.sharedObjectRef(CLOCK_OBJECT),
          ],
        });
      }
    } else if (
      token === 'sSUI' ||
      token === 'sSCA' ||
      token === 'sUSDC' ||
      token === 'swUSDC' ||
      token === 'swUSDT' ||
      token === 'sSBETH' ||
      token === 'sDEEP' ||
      token === 'sSBUSDT'
    ) {
      const underlyingToke = token === 'sSBETH' ? 'WETH' : token === 'sSBUSDT' ? 'sbUSDT' : (token.slice(1) as COIN);
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST[underlyingToke]],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID[underlyingToke] ?? 90),
        ],
      });
      const coinType = COINS_TYPE_LIST[token];
      tx.moveCall({
        target: '0xaa4f958759df1be17107e26227bf22c1cb216e7cc2b148d210d46aa0a8f6728d::scoin_rule::update_price',
        typeArguments: [coinType, COINS_TYPE_LIST[underlyingToke]],
        arguments: [
          tx.sharedObjectRef({
            objectId: '0x44f5343585d18d23f5e29a3c70da655c0cd11a9cc1f931c114a1e5323a229442',
            initialSharedVersion: 389243325,
            mutable: false,
          }),
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef({
            objectId: '0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7',
            initialSharedVersion: 7765848,
            mutable: false,
          }),
          tx.sharedObjectRef({
            objectId: '0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9',
            initialSharedVersion: 7765848,
            mutable: true,
          }),
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
    } else if (token === 'spSUI' || token === 'mSUI') {
      const stakingInfoObj = token === 'spSUI' ? SPSUI_LIQUID_STAKING_OBJECT_ID : MSUI_LIQUID_STAKING_OBJECT_ID;
      const coinType = token === 'spSUI' ? COINS_TYPE_LIST.spSUI : COINS_TYPE_LIST.mSUI;
      tx.moveCall({
        target: '0x915d11320f37ddb386367dbce81154e1b4cf83e6a3039df183ac4ae78131c786::ssui_rule::update_price',
        typeArguments: [coinType],
        arguments: [tx.sharedObjectRef(ORACLE_OBJECT), tx.object(stakingInfoObj), tx.sharedObjectRef(CLOCK_OBJECT)],
      });
    } else if (token === 'stSUI' || token === 'stSUI_SUI_ALPHAFI_FT') {
      tx.moveCall({
        target: '0xdfdab1daf15c8b79512001f8eff16f8b07f2c9bbb1cc277d8739eb5338722340::stsui_rule::update_price',
        typeArguments: [COINS_TYPE_LIST.stSUI],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.object(STSUI_LIQUID_STAKING_OBJECT_ID),
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
      if (token === 'stSUI_SUI_ALPHAFI_FT') {
        tx.moveCall({
          target:
            '0x3d078bd7af765ed2889ac67a3d0dd812341403e1f415bd9fd287a4d7f49023aa::alphafi_stsui_sui_rule::update_price',
          typeArguments: [COINS_TYPE_LIST.stSUI, COINS_TYPE_LIST.SUI, COINS_TYPE_LIST.stSUI_SUI_ALPHAFI_FT],
          arguments: [
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.object('0x0b45d1e5889b524dc1a472f59651cdedb8e0a2678e745f27975a9b57c127acdd'),
            tx.object('0xaec347c096dd7e816febd8397be4cca3aabc094a9a2a1f23d7e895564f859dc2'),
            tx.object('0x73549e0918d10727e324ebeed11ab81ab46f8fadb11078a0641f117d9097b725'),
            tx.sharedObjectRef(CLOCK_OBJECT),
          ],
        });
      }
    } else if (token === 'gSUI') {
      const baseToken = token.slice(1) as COIN;
      tx.moveCall({
        target: '0x0e9acfaf47cde01d67ff5bdfe53b74df936650fd52fbde2bf71aaddd7c79b940::gcoin_rule::update_price',
        typeArguments: [COINS_TYPE_LIST[token], COINS_TYPE_LIST[baseToken]],
        arguments: [tx.sharedObjectRef(ORACLE_OBJECT), tx.object(UNIHOUSE_OBJECT_ID), tx.sharedObjectRef(CLOCK_OBJECT)],
      });
    } else {
      tx.moveCall({
        target: SUPRA_UPDATE_TARGET,
        typeArguments: [COINS_TYPE_LIST[token as COIN]],
        arguments: [
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.sharedObjectRef(SUPRA_HANDLER_OBJECT),
          tx.pure.u32(SUPRA_ID[token] ?? 0),
        ],
      });
    }
  }

  /**
   * @description Get encoded BCS Bucket values
   * @returns devInspectTransactionBlock
   */
  private async encodedBucketConstants(): Promise<DevInspectResults> {
    const tx = new Transaction();
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::fee_precision`,
    });
    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::liquidation_rebate`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::flash_loan_fee`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::buck_decimal`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::max_lock_time`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::min_lock_time`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::min_fee`,
    });

    tx.moveCall({
      target: `${CORE_PACKAGE_ID}::constants::max_fee`,
    });

    return await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.owner,
    });
  }

  /**
   * @description Get bucket constants (decoded BCS values)
   * @returns Promise<DecodedBucketConstants | undefined>
   */
  async getBucketConstants(): Promise<BucketConstants | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = await this.encodedBucketConstants();

    if (!results) {
      return undefined;
    }

    const bucketObject = {
      feePrecision: bcs.U64.parse(Uint8Array.from(results.results![0].returnValues[0][0])),
      liquidationRebate: bcs.U64.parse(Uint8Array.from(results.results![1].returnValues[0][0])),
      flashLoanFee: bcs.U64.parse(Uint8Array.from(results.results![2].returnValues[0][0])),
      buckDecimal: bcs.U8.parse(Uint8Array.from(results.results![3].returnValues[0][0])),
      maxLockTime: bcs.U64.parse(Uint8Array.from(results.results![4].returnValues[0][0])),
      minLockTime: bcs.U64.parse(Uint8Array.from(results.results![5].returnValues[0][0])),
      minFee: bcs.U64.parse(Uint8Array.from(results.results![6].returnValues[0][0])),
      maxFee: bcs.U64.parse(Uint8Array.from(results.results![7].returnValues[0][0])),
    };

    return bucketObject;
  }

  /**
   * @description Get protocol information including BUCK supply.
   * @returns Promise<ProtocolInfo>
   */
  async getProtocol(): Promise<ProtocolInfo> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resp: any = await this.client.getObject({
      id: PROTOCOL_ID,
      options: {
        showContent: true,
      },
    });

    const buckSupply = Number(resp.data?.content.fields.buck_treasury_cap.fields.total_supply.fields.value) / 10 ** 9;

    return {
      buckSupply,
    };
  }

  /**
   * @description Get BSR(bucket saving rate) value
   * @returns Promise<number>
   */
  async getBsr(): Promise<number> {
    const res = await this.client.getObject({
      id: SBUCK_APR_OBJECT_ID,
      options: {
        showContent: true,
      },
    });

    const obj = getObjectFields(res) as AprResponse;
    const val = parseFloat(formatUnits(BigInt(obj.rate.fields.value), 16));
    const bsr = ((1 + val / 100 / 365) ** 365 - 1) * 100;
    return bsr;
  }

  /**
   * @description Get sBUCK tvl
   * @returns Promise<number>
   */
  async getSBUCKTvl(): Promise<number> {
    const res = await this.client.getObject({
      id: SBUCK_FLASK_OBJECT_ID,
      options: {
        showContent: true,
      },
    });

    const obj = getObjectFields(res) as SBUCKFlaskResponse;
    const tvl = parseFloat(formatUnits(BigInt(obj.reserves), 9));
    return tvl;
  }

  /**
   * @description Get saving pool's apr
   * @returns Promise<number>
   */
  async getSavingApr(): Promise<number> {
    const bsr = await this.getBsr();

    const lpPrice = 1;
    const suiSupraObj = await this.client.getObject({
      id: SUPRA_PRICE_FEEDS.sui_usdt,
      options: {
        showContent: true,
      },
    });
    const suiPrice = computeSupraPrice(suiSupraObj);

    const { flowAmount, flowInterval, totalWeight } = await this.getFountain(SBUCK_BUCK_LP_REGISTRY_ID);
    const rewardAmount = calculateRewardAmount(flowAmount, flowInterval);
    const apr = ((rewardAmount * 365) / ((totalWeight / 10 ** 9) * lpPrice)) * suiPrice * 100;
    return apr + bsr;
  }

  /**
   * @description Get strap fountain pool's apr
   * @returns Promise<number>
   */
  async getStrapFountainApr(token: COIN): Promise<number> {
    if (!STRAP_FOUNTAIN_IDS[token]) {
      throw new Error('Strap fountain not found');
    }

    const { objectId, rewardType } = STRAP_FOUNTAIN_IDS[token];
    const fountain = await this.getStakeProofFountain(objectId);
    const bucket = await this.getBucket(token);

    const supraObj = await this.client.getObject({
      id:
        rewardType === COINS_TYPE_LIST.SUI
          ? SUPRA_PRICE_FEEDS.sui_usdt
          : rewardType === COINS_TYPE_LIST.SCA
            ? SUPRA_PRICE_FEEDS.sca_usd
            : '',
      options: {
        showContent: true,
      },
    });
    const rewardPrice = computeSupraPrice(supraObj);

    const MCR = Number(bucket.minCollateralRatio) ?? 110;
    const rewardAmount = calculateRewardAmount(fountain.flowAmount, fountain.flowInterval);
    return calculateAPR(rewardAmount, fountain.totalDebtAmount, MCR, rewardPrice);
  }

  /******************************************************
   * CDP                                                *
   ******************************************************/

  /**
   * @description Get all buckets
   */
  async getAllBuckets(): Promise<BucketList> {
    const buckets: BucketList = {};

    try {
      const generalInfo = await this.client.getObject({
        id: PROTOCOL_ID,
        options: {
          showContent: true,
        },
      });
      const generalInfoField = generalInfo.data?.content as BucketProtocolResponse;
      const minBottleSize = generalInfoField.fields.min_bottle_size;

      let objectIds: string[] = [];
      let cursor: string | null = null;
      while (true) {
        const protocolFields = await this.client.getDynamicFields({
          parentId: PROTOCOL_ID,
          cursor,
        });

        objectIds = objectIds.concat(
          protocolFields.data
            .filter((item) => item.objectType.includes('::bucket::Bucket') || item.objectType.includes('::pipe::Pipe'))
            .map((t) => t.objectId),
        );

        if (!protocolFields.hasNextPage) {
          break;
        }
        cursor = protocolFields.nextCursor;
      }

      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: objectIds,
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });

      response
        .filter((t) => t.data?.type?.includes('::bucket::Bucket'))
        .map((res) => {
          const typeId = getCoinType(res.data?.type ?? '') ?? '';
          const token = getCoinSymbol(typeId);
          if (!token) {
            return;
          }

          const fields = getObjectFields(res) as BucketResponse;

          const bucketInfo: BucketInfo = {
            token: token as COIN,
            baseFeeRate: Number(fields.base_fee_rate ?? 5_000),
            bottleTableSize: fields.bottle_table.fields.table.fields.size ?? '',
            bottleTableId: fields.bottle_table.fields.table.fields.id.id ?? '',
            collateralDecimal: fields.collateral_decimal ?? 0,
            collateralVault: fields.collateral_vault ?? '',
            latestRedemptionTime: Number(fields.latest_redemption_time ?? 0),
            minCollateralRatio: fields.min_collateral_ratio ?? '',
            mintedBuckAmount: fields.minted_buck_amount ?? '',
            minBottleSize: minBottleSize,
            maxMintAmount: fields.max_mint_amount ?? '',
            recoveryModeThreshold: fields.recovery_mode_threshold ?? '',
          };

          buckets[token] = bucketInfo;
        });

      // Add pipe ponds
      response
        .filter((t) => t.data?.type?.includes('::pipe::Pipe'))
        .map((res) => {
          const typeId = getCoinTypeFromPipe(res.data?.type ?? '');
          if (!typeId) {
            return;
          }

          const token = getCoinSymbol(typeId);
          if (!token) {
            return;
          }

          const bucket = buckets[token];
          if (bucket) {
            const fields = getObjectFields(res) as PipeResponse;
            const collateralVault = BigInt(bucket.collateralVault);
            const outputAmount = BigInt(fields.output_volume);
            bucket.collateralVault = (collateralVault + outputAmount).toString();
          }
        });
    } catch (error) {
      console.error(error);
    }
    return buckets;
  }

  /**
   * @description Get bucket object from coin
   */
  async getBucket(token: COIN): Promise<BucketInfo> {
    const generalInfo = await this.client.getObject({
      id: PROTOCOL_ID,
      options: {
        showContent: true,
      },
    });
    const generalInfoField = generalInfo.data?.content as BucketProtocolResponse;
    const minBottleSize = generalInfoField.fields.min_bottle_size;

    const coinType = COINS_TYPE_LIST[token];
    const res = await this.client.getDynamicFieldObject({
      parentId: PROTOCOL_ID,
      name: {
        type: `${CONTRIBUTOR_TOKEN_ID}::buck::BucketType<${coinType}>`,
        value: {
          dummy_field: false,
        },
      },
    });
    const fields = getObjectFields(res) as BucketResponse;

    const bucketInfo: BucketInfo = {
      token,
      baseFeeRate: Number(fields.base_fee_rate ?? 5_000),
      bottleTableSize: fields.bottle_table.fields.table.fields.size ?? '',
      bottleTableId: fields.bottle_table.fields.table.fields.id.id ?? '',
      collateralDecimal: fields.collateral_decimal ?? 0,
      collateralVault: fields.collateral_vault ?? '',
      latestRedemptionTime: Number(fields.latest_redemption_time ?? 0),
      minCollateralRatio: fields.min_collateral_ratio ?? '',
      mintedBuckAmount: fields.minted_buck_amount ?? '',
      maxMintAmount: fields.max_mint_amount ?? '',
      recoveryModeThreshold: fields.recovery_mode_threshold ?? '',
      minBottleSize,
    };

    return bucketInfo;
  }

  private async getProofStartUnit(proof: SuiObjectResponse) {
    const token = getCoinSymbol(getObjectGenerics(proof)[0]) as COIN;
    const lstFountain = await this.getStakeProofFountain(STRAP_FOUNTAIN_IDS[token]?.objectId as string);
    const data = await this.client.getDynamicFieldObject({
      parentId: lstFountain.strapId,
      name: {
        type: 'address',
        value: getObjectFields(proof)?.strap_address as string,
      },
    });
    const ret = getObjectFields(data);

    return Number(ret?.value.fields.start_unit ?? 0);
  }

  private parseUserBottleInfo(
    userBottleData: ReturnType<typeof STRUCT_BOTTLE_DATA.parse> | null,
    params: {
      token?: COIN;
      strap?: SuiObjectResponse;
      proof?: SuiObjectResponse;
      startUnit?: number;
    },
  ): UserBottleInfo | null {
    if (!userBottleData) {
      return null;
    }
    const token =
      params.token ||
      (params.strap && getCoinSymbol(getObjectGenerics(params.strap)[0])) ||
      (params.proof && getCoinSymbol(getObjectGenerics(params.proof)[0]));
    if (!token) {
      return null;
    }
    const strapId = params.strap?.data?.objectId ?? params.proof?.data?.objectId;

    return {
      token,
      collateralAmount: Number(userBottleData.coll_amount),
      buckAmount: Number(userBottleData.debt_amount),
      debtAmount: Number(userBottleData.debt_amount),
      ...(!!strapId && { strapId }),
      ...(params.startUnit !== undefined && { startUnit: params.startUnit }),
    };
  }

  /**
   * @description Get positions array for input address
   * @address User address that belong to bottle
   * @returns Promise<BottleInfo>
   */
  async getUserBottles(address: string): Promise<UserBottleInfo[]> {
    if (!address) {
      return [];
    }
    const { data: strapObjs } = await this.client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: STRAP_ID,
      },
      options: {
        showContent: true,
        showType: true,
      },
    });
    const { data: proofObjs } = await this.client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: STAKE_PROOF_ID,
      },
      options: {
        showContent: true,
        showType: true,
      },
    });
    const proofStartUnits = await Promise.all(proofObjs.map((proof) => this.getProofStartUnit(proof)));

    const tx = new Transaction();
    const parseParams: Parameters<typeof this.parseUserBottleInfo>[1][] = [];

    COLLATERAL_ASSETS.forEach((token) => {
      parseParams.push({ token });

      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::utils::try_get_bottle_by_account`,
        typeArguments: [COINS_TYPE_LIST[token]],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), tx.sharedObjectRef(CLOCK_OBJECT), tx.pure.address(address)],
      });
    });
    strapObjs.forEach((strap) => {
      if (!strap.data) {
        return;
      }
      parseParams.push({ strap });

      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::utils::try_get_bottle_by_strap`,
        typeArguments: getObjectGenerics(strap),
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), tx.sharedObjectRef(CLOCK_OBJECT), tx.objectRef(strap.data)],
      });
    });
    proofObjs.forEach((proof, index) => {
      if (!proof.data) {
        return;
      }
      parseParams.push({ proof, startUnit: proofStartUnits[index] });

      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::utils::try_get_bottle_by_proof`,
        typeArguments: getObjectGenerics(proof),
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), tx.sharedObjectRef(CLOCK_OBJECT), tx.objectRef(proof.data)],
      });
    });
    const res = await this.client.devInspectTransactionBlock({
      sender: address,
      transactionBlock: tx,
    });
    const userBottleInfo =
      res.results?.map?.((result) => {
        const bytes = result.returnValues?.[0]?.[0];
        return bytes ? bcs.option(STRUCT_BOTTLE_DATA).parse(Uint8Array.from(bytes)) : null;
      }) ?? [];

    const userBottles = userBottleInfo
      .map((bottleInfo, index) => this.parseUserBottleInfo(bottleInfo, parseParams[index]))
      .filter((userBottle) => !!userBottle);

    return userBottles;
  }

  /**
   * @description Get all bottles by querying `BottleCreated` event.
   * @returns Promise<PaginatedBottleSummary> - otherwise `null` if the upstream data source is pruned.
   */
  async getAllBottles(): Promise<PaginatedBottleSummary> {
    const resp = await this.client.queryEvents({
      query: {
        MoveEventType: `${CORE_PACKAGE_ID}::bucket_events::BottleCreated`,
      },
    });
    const bottles = resp.data.map((event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawEvent: any = event.parsedJson;
      return {
        bottleId: rawEvent.bottle_id as string,
      };
    });

    return {
      data: bottles,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }

  /**
   * @description Get all destroyed bottles by querying `BottleDestroyed` event.
   * @returns Promise<PaginatedBottleSummary> - otherwise `null` if the upstream data source is pruned.
   */
  async getDestroyedBottles(): Promise<PaginatedBottleSummary> {
    const resp = await this.client.queryEvents({
      query: {
        MoveEventType: `${CORE_PACKAGE_ID}::bucket_events::BottleDestroyed`,
      },
    });
    const destroyedBottles = resp.data.map((event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawEvent: any = event.parsedJson;
      return {
        bottleId: rawEvent.bottle_id as string,
      };
    });

    return {
      data: destroyedBottles,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }

  async getBottlesByStep(coinType: string, cursor: string | null, isUpward: boolean): Promise<BottlePage> {
    const tx = new Transaction();

    tx.moveCall({
      target: '0x0e2e9d96beaf27fb80cacb5947f1a0fa36664fe644e968e81263ffccf979d6db::utils::get_bottles_with_direction',
      typeArguments: [coinType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.pure(bcs.option(bcs.Address).serialize(cursor)),
        tx.pure.u64(50),
        tx.pure.u64(951),
        tx.pure.bool(isUpward),
      ],
    });
    const res = await this.client.devInspectTransactionBlock({
      sender: PROTOCOL_ID,
      transactionBlock: tx,
    });
    const returnValues = res?.results?.[0]?.returnValues;
    if (!returnValues || returnValues?.[0]?.[0][0] === 0) {
      return { bottles: [], nextCursor: null };
    } else {
      const bottleVec = returnValues[0];
      const cursorVec = returnValues[1];
      if (!bottleVec) return { bottles: [], nextCursor: null };

      const [value] = bottleVec;
      const [cursor] = cursorVec;
      const bottles = bcs.vector(STRUCT_BOTTLE_DATA).parse(Uint8Array.from(value));
      const nextCursor = bcs.option(bcs.Address).parse(Uint8Array.from(cursor));
      return {
        bottles: bottles.map((data) => {
          const { debtor, coll_amount, debt_amount } = data;
          const collAmount = Number(coll_amount);
          const debtAmount = Number(debt_amount);
          const ncr = collAmount / debtAmount;
          return { debtor, collAmount, debtAmount, ncr };
        }),
        nextCursor,
      };
    }
  }

  /**
   * @description Find insertaion place in tolerance range
   */
  async findInsertionPlace(
    bottleTableId: string,
    targetCR: number,
    tolerance: number,
    coinType: string,
  ): Promise<string | undefined> {
    try {
      let cursor: string | null = null;
      let hasNextPage = true;
      let pageIdx = 0;
      const bottleInfoVec = [];

      while (hasNextPage && pageIdx < tolerance) {
        const bottlesResp = await this.client.getDynamicFields({
          parentId: bottleTableId,
          cursor,
        });

        const bottles = bottlesResp.data;
        const objectIdList = bottles.map((item) => item.objectId);
        const debtorList = bottles.map((item) => item.name.value as string);

        const response: SuiObjectResponse[] = await this.client.multiGetObjects({
          ids: objectIdList,
          options: {
            showContent: true,
            showOwner: true,
          },
        });

        bottleInfoVec.push(
          response.map((res, idx) => {
            const bottleInfo = getObjectFields(res) as BottleInfoResponse;
            const bottleFields = bottleInfo.value.fields.value.fields;
            const ncrDiff = bottleFields.collateral_amount / bottleFields.buck_amount - targetCR;
            return { debtor: debtorList[idx], ncrDiff };
          }),
        );
        cursor = bottlesResp.nextCursor;
        hasNextPage = bottlesResp.hasNextPage;
        ++pageIdx;
      }
      const bottleSamples = bottleInfoVec.flat();
      let minNcrDiff = Infinity;
      let closestDebtor = '';
      let isUpward = true;
      for (const sample of bottleSamples) {
        const ncrDiffAbs = Math.abs(sample.ncrDiff);
        if (ncrDiffAbs < minNcrDiff) {
          minNcrDiff = ncrDiffAbs;
          closestDebtor = sample.debtor;
          isUpward = sample.ncrDiff < 0;
        }
      }
      if (closestDebtor.length === 0) return undefined;
      const stepBottles = await this.getBottlesByStep(coinType, closestDebtor, isUpward);
      const crDiffVec = stepBottles.bottles.map((bottle) => {
        return { debtor: bottle.debtor, crDiff: bottle.ncr - targetCR };
      });
      const result = crDiffVec.find((info) => (isUpward ? info.crDiff >= 0 : info.crDiff < 0));
      if (result) {
        return result.debtor;
      } else {
        return stepBottles.bottles[stepBottles.bottles.length - 1].debtor;
      }
    } catch (error) {
      console.error(error);

      return undefined;
    }
  }

  /**
   * @description Borrow
   * @param tx
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param collateralInput collateral input
   * @param buckOutput
   * @param insertionPlace optional
   * @returns TransactionResult
   */
  borrow(
    tx: Transaction,
    collateralType: string,
    collateralInput: TransactionResult,
    buckOutput: string | TransactionArgument,
    insertionPlace?: string,
    strapId?: string | TransactionArgument,
  ): TransactionResult | null {
    if (strapId) {
      if (strapId === 'new') {
        const [strap] = tx.moveCall({
          target: `${CORE_PACKAGE_ID}::strap::new`,
          typeArguments: [collateralType],
        });
        if (strap) {
          const [buckOut] = tx.moveCall({
            target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::high_borrow_with_strap`,
            typeArguments: [collateralType],
            arguments: [
              tx.sharedObjectRef(PROTOCOL_OBJECT),
              tx.sharedObjectRef(ORACLE_OBJECT),
              strap,
              tx.sharedObjectRef(CLOCK_OBJECT),
              collateralInput,
              typeof buckOutput === 'string' ? tx.pure.u64(buckOutput) : buckOutput,
              tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
            ],
          });
          return [strap, buckOut] as TransactionResult;
        }
      } else {
        return tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::high_borrow_with_strap`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            tx.sharedObjectRef(ORACLE_OBJECT),
            typeof strapId === 'string' ? tx.object(strapId) : strapId,
            tx.sharedObjectRef(CLOCK_OBJECT),
            collateralInput,
            typeof buckOutput === 'string' ? tx.pure.u64(buckOutput) : buckOutput,
            tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
          ],
        });
      }
    } else {
      return tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::high_borrow`,
        typeArguments: [collateralType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          collateralInput,
          typeof buckOutput === 'string' ? tx.pure.u64(buckOutput) : buckOutput,
          tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
        ],
      });
    }

    return null;
  }

  /**
   * @description Top up function
   * @param tx
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param collateralInput collateral input
   * @param forAddress
   * @param insertionPlace optional
   * @returns TransactionResult
   */
  topUp(
    tx: Transaction,
    collateralType: string,
    collateralInput: TransactionResult,
    forAddress: string,
    insertionPlace?: string,
  ) {
    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::high_top_up`,
      typeArguments: [collateralType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        collateralInput,
        tx.pure.address(forAddress),
        tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
        tx.sharedObjectRef(CLOCK_OBJECT),
      ],
    });
  }

  /**
   * @description withdraw
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param collateralAmount
   * @param insertionPlace
   * @returns TransactionResult
   */
  withdraw(
    tx: Transaction,
    assetType: string,
    collateralAmount: string,
    insertionPlace?: string,
    strapId?: string | TransactionArgument,
  ): TransactionResult {
    if (strapId) {
      return tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::withdraw_with_strap`,
        typeArguments: [assetType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(ORACLE_OBJECT),
          typeof strapId === 'string' ? tx.object(strapId) : strapId,
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.pure.u64(collateralAmount),
          tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
        ],
      });
    } else {
      return tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::withdraw`,
        typeArguments: [assetType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(ORACLE_OBJECT),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.pure.u64(collateralAmount),
          tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
        ],
      });
    }
  }

  /**
   * @description Repay borrowed amount
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param buckInput Amount to be repaid
   * @returns TransactionResult
   */
  repay(
    tx: Transaction,
    assetType: string,
    buckInput: TransactionResult,
    strapId?: string | TransactionArgument,
  ): TransactionResult {
    if (strapId) {
      return tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::repay_with_strap`,
        typeArguments: [assetType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          typeof strapId === 'string' ? tx.object(strapId) : strapId,
          buckInput,
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
    } else {
      return tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::repay_debt`,
        typeArguments: [assetType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), buckInput, tx.sharedObjectRef(CLOCK_OBJECT)],
      });
    }
  }

  /**
   * @description redeem
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param buckInput
   * @param insertionPlace
   * @returns TransactionResult
   */
  redeem(tx: Transaction, assetType: string, buckInput: TransactionResult, insertionPlace?: string): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::redeem`,
      typeArguments: [assetType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(ORACLE_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        buckInput,
        tx.pure(bcs.vector(bcs.Address).serialize(insertionPlace ? [insertionPlace] : [])),
      ],
    });
  }

  /**
   * @description Borrow
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param collateralAmount
   * @param borrowAmount
   * @param recipient
   * @param isNewBottle
   * @param isUpdateOracle
   * @param insertionPlace Optional
   * @returns Promise<boolean>
   */
  async getBorrowTx(
    tx: Transaction,
    collateralType: string,
    collateralAmount: string,
    borrowAmount: string,
    recipient: string,
    isUpdateOracle: boolean,
    insertionPlace?: string,
    strapId?: string,
  ): Promise<boolean> {
    const token = getCoinSymbol(collateralType);
    if (!token) {
      return false;
    }

    const collateralInput = await getInputCoins(tx, this.client, recipient, collateralType, collateralAmount);

    const collateralBalance = coinIntoBalance(tx, collateralType, collateralInput);

    if (borrowAmount === '0') {
      this.topUp(
        tx,
        collateralType,
        collateralBalance,
        strapId ? strapId : recipient,
        insertionPlace ? insertionPlace : recipient,
      );
    } else {
      if (isUpdateOracle) {
        this.updateSupraOracle(tx, token);
      }

      const borrowRet = this.borrow(
        tx,
        collateralType,
        collateralBalance,
        tx.pure.u64(borrowAmount),
        insertionPlace ? insertionPlace : strapId ? (strapId === 'new' ? undefined : strapId) : recipient,
        strapId,
      );
      if (borrowRet) {
        if (strapId === 'new') {
          const [strap, buckOut] = borrowRet;
          if (strap && buckOut) {
            const buckCoinBalance = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckOut);
            tx.transferObjects([buckCoinBalance], tx.pure.address(recipient));
            tx.transferObjects([strap], tx.pure.address(recipient));
          }
        } else {
          const buckCoinBalance = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, borrowRet);
          tx.transferObjects([buckCoinBalance], tx.pure.address(recipient));
        }
      }
    }

    return true;
  }

  /**
   * @description Repay
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param repayAmount
   * @param withdrawAmount
   * @param walletAddress
   * @returns Promise<boolean>
   */
  async getRepayTx(
    tx: Transaction,
    collateralType: string,
    repayAmount: string,
    withdrawAmount: string,
    walletAddress: string,
    insertionPlace?: string,
    strapId?: string,
  ): Promise<boolean> {
    const token = getCoinSymbol(collateralType);
    if (!token) {
      return false;
    }
    let _buckCoinInput;

    if (repayAmount === '0') {
      _buckCoinInput = await getMainCoin(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK);
    } else {
      [_buckCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.BUCK, repayAmount);
    }
    const buckCoinInput =
      _buckCoinInput ??
      tx.moveCall({
        target: '0x2::coin::zero',
        typeArguments: [COINS_TYPE_LIST.BUCK],
      });

    this.updateSupraOracle(tx, token);

    // Fully repay
    if (repayAmount === '0' && withdrawAmount === '0') {
      if (strapId) {
        const strap = tx.object(strapId);
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay_with_strap`,
          typeArguments: [collateralType],
          arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), strap, buckCoinInput, tx.sharedObjectRef(CLOCK_OBJECT)],
        });
        // tx.moveCall({
        //   target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::destroy_empty_strap`,
        //   typeArguments: [collateralType],
        //   arguments: [
        //     tx.sharedObjectRef(PROTOCOL_OBJECT),
        //     strap,
        //   ]
        // });
      } else {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay`,
          typeArguments: [collateralType],
          arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), buckCoinInput, tx.sharedObjectRef(CLOCK_OBJECT)],
        });
      }
    } else {
      if (strapId) {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw_with_strap`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.object(strapId),
            tx.sharedObjectRef(CLOCK_OBJECT),
            buckCoinInput,
            tx.pure.u64(withdrawAmount),
            tx.pure(bcs.vector(bcs.Address).serialize([insertionPlace ? insertionPlace : strapId])),
          ],
        });
      } else {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            tx.sharedObjectRef(ORACLE_OBJECT),
            tx.sharedObjectRef(CLOCK_OBJECT),
            buckCoinInput,
            tx.pure.u64(withdrawAmount),
            tx.pure(bcs.vector(bcs.Address).serialize([insertionPlace ? insertionPlace : walletAddress])),
          ],
        });
      }
    }
    return true;
  }

  /**
   * @description Withdraw
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param walletAddress
   * @param strapId Optional
   * @returns Promise<Transaction>
   */
  withdrawSurplus(tx: Transaction, collateralType: string, strap?: TransactionArgument): TransactionResult {
    const token = getCoinSymbol(collateralType);
    if (!token) {
      throw 'Collateral type not supported';
    }

    if (strap) {
      const surplusCollateral = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::withdraw_surplus_with_strap`,
        typeArguments: [collateralType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), strap],
      });
      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::destroy_empty_strap`,
        typeArguments: [collateralType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), strap],
      });
      const surplusCoin = coinFromBalance(tx, collateralType, surplusCollateral);
      return surplusCoin;
    } else {
      const surplusCollateral = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::withdraw_surplus_collateral`,
        typeArguments: [collateralType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
      });
      const surplusCoin = coinFromBalance(tx, collateralType, surplusCollateral);
      return surplusCoin;
    }
  }

  /**
   * @description Get flash borrow transaction
   * @param tx base transaction
   * @param inputs coin with amount
   * @returns [flashLoans, flashReceipt]
   */
  flashBorrow(
    tx: Transaction,
    inputs: {
      coinSymbol: string;
      amount: string | TransactionArgument;
    },
  ): [TransactionArgument | undefined, TransactionArgument | undefined] {
    const { coinSymbol, amount } = inputs;
    const coinType = COINS_TYPE_LIST[coinSymbol as COIN];
    const isBuck = coinType === COINS_TYPE_LIST.BUCK;
    const target = isBuck ? `${CORE_PACKAGE_ID}::buck::flash_borrow_buck` : `${CORE_PACKAGE_ID}::buck::flash_borrow`;
    const typeArguments = isBuck ? [COINS_TYPE_LIST.SUI] : [coinType];
    const [flashLoans, flashReceipt] = tx.moveCall({
      target,
      typeArguments,
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), typeof amount === 'string' ? tx.pure.u64(amount) : amount],
    });
    return [flashLoans, flashReceipt];
  }

  /**
   * @description Get flash repay transaction
   * @param tx base transaction
   * @param inputs coin with receipt & repay amount
   */
  flashRepay(
    tx: Transaction,
    inputs: {
      coinSymbol: string;
      repayment: TransactionArgument;
      flashReceipt: TransactionArgument;
    },
  ) {
    const { coinSymbol, repayment, flashReceipt } = inputs;
    const coinType = COINS_TYPE_LIST[coinSymbol as COIN];
    const isBuck = coinType === COINS_TYPE_LIST.BUCK;
    const target = isBuck ? `${CORE_PACKAGE_ID}::buck::flash_repay_buck` : `${CORE_PACKAGE_ID}::buck::flash_repay`;
    const typeArguments = isBuck ? [COINS_TYPE_LIST.SUI] : [coinType];
    tx.moveCall({
      target,
      typeArguments,
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), repayment, flashReceipt],
    });
  }

  /******************************************************
   * Fountain                                           *
   ******************************************************/

  /**
   * @description Get all fountains from KRIYA, CETUS, AFTERMATH, sBUCK
   * @returns Promise<FountainList>
   */
  async getAllFountains(): Promise<FountainList> {
    const objectIds = [
      KRIYA_SUI_BUCK_LP_REGISTRY_ID,
      KRIYA_USDC_BUCK_LP_REGISTRY_ID,
      AF_SUI_BUCK_LP_REGISTRY_ID,
      AF_USDC_BUCK_LP_REGISTRY_ID,
      CETUS_SUI_BUCK_LP_REGISTRY_ID,
      CETUS_USDC_BUCK_LP_REGISTRY_ID,
      SBUCK_BUCK_LP_REGISTRY_ID,
    ];

    const fountainResults = await this.client.multiGetObjects({
      ids: objectIds,
      options: {
        showContent: true,
      },
    });

    const fountains: FountainList = {};
    fountainResults.map((res) => {
      const fountain = objectToFountain(res);
      fountains[fountain.id] = fountain;
    });

    return fountains;
  }

  /**
   * @description Get fountain information from id
   * @param lpRegistryId Fountain lp registry id
   * @returns Promise<FountainInfo>
   */
  async getFountain(lpRegistryId: string): Promise<FountainInfo> {
    const res = await this.client.getObject({
      id: lpRegistryId,
      options: {
        showContent: true,
      },
    });

    return objectToFountain(res);
  }

  /**
   * @description Get all stake proof list from afSUI, haSUI, vSUI fountains
   * @returns Promise<StrapFountainList>
   */
  async getAllStrapFountains(): Promise<StrapFountainList> {
    const fountainIds = Object.keys(STRAP_FOUNTAIN_IDS);
    const objectIdList = Object.values(STRAP_FOUNTAIN_IDS).map((t) => t.objectId);
    const response: SuiObjectResponse[] = await this.client.multiGetObjects({
      ids: objectIdList,
      options: {
        showContent: true,
        showType: true, //Check could we get type from response later
      },
    });

    const fountains: StrapFountainList = {};
    for (let idx = 0; idx < response.length; idx++) {
      const fountain = objectToStrapFountain(response[idx] as SuiObjectResponse);
      const coin = fountainIds[idx];
      fountains[coin as COIN] = fountain;
    }

    return fountains;
  }

  /**
   * @description Get fountain information from id
   * @param lpRegistryId Fountain lp registry id
   * @returns Promise<StrapFountainInfo>
   */
  async getStakeProofFountain(fountainId: string): Promise<StrapFountainInfo> {
    const res = await this.client.getObject({
      id: fountainId,
      options: {
        showContent: true,
      },
    });
    return objectToStrapFountain(res);
  }

  /**
   * @description Get all LP proofs from KRIYA, CETUS, AFTERMATH, SBUCK fountain
   * @param owner User address
   * @returns Promise<UserLpList>
   */
  async getUserLpProofs(owner: string): Promise<UserLpList> {
    const lpRegistryIds = [
      AF_USDC_BUCK_LP_REGISTRY_ID,
      AF_SUI_BUCK_LP_REGISTRY_ID,
      CETUS_USDC_BUCK_LP_REGISTRY_ID,
      CETUS_SUI_BUCK_LP_REGISTRY_ID,
      KRIYA_USDC_BUCK_LP_REGISTRY_ID,
      KRIYA_SUI_BUCK_LP_REGISTRY_ID,
      SBUCK_BUCK_LP_REGISTRY_ID,
    ];

    const res = await this.client.getOwnedObjects({
      owner,
      filter: {
        MatchAny: [
          {
            Package: FOUNTAIN_PACKAGE_ID,
          },
          {
            Package: KRIYA_FOUNTAIN_PACKAGE_ID,
          },
          {
            Package: SBUCK_FOUNTAIN_PACKAGE_ID,
          },
        ],
      },
      options: {
        showContent: true,
        showType: true,
      },
    });
    const proofs: UserLpProof[] = res.data.map((object) => {
      const fields = getObjectFields(object);
      return {
        objectId: object.data?.objectId ?? '',
        version: object.data?.version ?? '',
        digest: object.data?.digest ?? '',
        typeName: object.data?.type ?? '',
        fountainId: fields?.fountain_id ?? '',
        startUnit: Number(fields?.start_uint ?? 0),
        stakeAmount: Number(fields?.stake_amount ?? 0),
        stakeWeight: Number(fields?.stake_weight ?? 0),
        lockUntil: Number(fields?.lock_until ?? 0),
        isLocked: false,
      };
    });

    const userLpList: UserLpList = {};
    for (const lpRegistryId of lpRegistryIds) {
      userLpList[lpRegistryId] = proofs.filter((proof) => lpRegistryId === proof.fountainId);
    }

    // Get locked positions
    {
      const res = await this.client.getDynamicFieldObject({
        parentId: '0xbb4c253eec08636e0416cb8e820b4386c1042747fbdc5a5df6c025c9c6a06fef',
        name: {
          type: 'address',
          value: owner,
        },
      });
      const fields = getObjectFields(res);
      if (fields) {
        const proofInfos = fields.value as ObjectContentFields[];
        const lockedSBUCKs = proofInfos.map((info) => {
          return {
            objectId: '',
            version: '',
            digest: '',
            typeName: info.type,
            fountainId: info.fields.fountain_id,
            startUnit: Number(info.fields.start_uint),
            stakeAmount: Number(info.fields.stake_amount),
            stakeWeight: Number(info.fields.stake_weight),
            lockUntil: Number(info.fields.lock_until),
            isLocked: true,
          };
        });

        userLpList[SBUCK_BUCK_LP_REGISTRY_ID] = [...(userLpList[SBUCK_BUCK_LP_REGISTRY_ID] ?? []), ...lockedSBUCKs];
      }
    }

    return userLpList;
  }

  /**
   * @description stake to well
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param well well object
   * @param bktInput Amount to stake
   * @param lockTime Locked time for staking
   * @returns TransactionResult
   */
  stake(tx: Transaction, assetType: string, well: string, bktInput: string, lockTime: string): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::stake`,
      typeArguments: [assetType],
      arguments: [tx.object(well), tx.object(bktInput), tx.pure.u64(lockTime), tx.sharedObjectRef(CLOCK_OBJECT)],
    });
  }

  /**
   * @description unstake from well
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param well well object
   * @param stakedBkt Amount to stake
   * @returns TransactionResult
   */
  unstake(tx: Transaction, assetType: string, well: string, stakedBkt: string): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::unstake`,
      typeArguments: [assetType],
      arguments: [tx.object(well), tx.object(stakedBkt), tx.sharedObjectRef(CLOCK_OBJECT)],
    });
  }

  /**
   * @description forced unstake from well
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param well well object
   * @param stakedBkt Amount to stake
   * @returns TransactionResult
   */
  forceUnstake(
    tx: Transaction,
    assetType: string,
    well: string,
    bktTreasury: string,
    stakedBkt: string,
  ): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::force_unstake`,
      typeArguments: [assetType],
      arguments: [tx.object(well), tx.object(bktTreasury), tx.object(stakedBkt), tx.sharedObjectRef(CLOCK_OBJECT)],
    });
  }

  /**
   * @description claim from well
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param well well object
   * @param stakedBkt Staked BKT
   * @returns TransactionResult
   */
  claimFromWell(tx: Transaction, assetType: string, well: string, stakedBkt: string): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::well::claim`,
      typeArguments: [assetType],
      arguments: [tx.object(well), tx.object(stakedBkt)],
    });
  }

  /**
   * @description Get transaction for stake token to pool
   * @param isAf Boolean value for Aftermath or not
   * @param stakeAmount
   * @param walletAddress
   * @returns Promise<boolean>
   */
  async getStakeUsdcTx(tx: Transaction, isAf: boolean, stakeAmount: string, walletAddress: string): Promise<boolean> {
    const [stakeCoinInput] = await getInputCoins(tx, this.client, walletAddress, COINS_TYPE_LIST.wUSDC, stakeAmount);
    if (!stakeCoinInput) return false;

    if (isAf) {
      tx.moveCall({
        target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::aftermath_fountain::stake`,
        typeArguments: [COINS_TYPE_LIST.AF_LP_USDC_BUCK, COINS_TYPE_LIST.wUSDC],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.object(AF_OBJS.pool),
          tx.object(AF_OBJS.poolRegistry),
          tx.object(AF_OBJS.protocolFeeVault),
          tx.object(AF_OBJS.treasury),
          tx.object(AF_OBJS.insuranceFund),
          tx.object(AF_OBJS.referralVault),
          tx.sharedObjectRef(AF_USDC_BUCK_LP_REGISTRY),
          tx.sharedObjectRef(CLOCK_OBJECT),
          stakeCoinInput,
          tx.pure.address(walletAddress),
        ],
      });
    } else {
      tx.moveCall({
        target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::stake`,
        typeArguments: [COINS_TYPE_LIST.wUSDC],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(CETUS_USDC_BUCK_LP_REGISTRY),
          tx.sharedObjectRef(BUCKETUS_TREASURY),
          tx.sharedObjectRef(BUCKETUS_LP_VAULT_05),
          tx.object(CETUS_OBJS.globalConfig),
          tx.object(CETUS_OBJS.buckUsdcPool),
          tx.sharedObjectRef(CLOCK_OBJECT),
          stakeCoinInput,
          tx.pure.address(walletAddress),
        ],
      });
    }

    return true;
  }

  /**
   * @description Get transaction for unstake token from AF pool
   * @param fountainId
   * @param lpProof UserLpProof object
   * @param recipient Recipient address
   */
  getAfUnstakeTx(tx: Transaction, fountainId: string, lpProof: UserLpProof, recipient: string) {
    const [stakeType, rewardType] = proofTypeToCoinType(lpProof.typeName);
    if (!stakeType || !rewardType) {
      throw new Error('Lp proof not valid');
    }

    const [afLpBalance, rewardBalance] = tx.moveCall({
      target: '0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake',
      typeArguments: [stakeType, rewardType],
      arguments: [tx.sharedObjectRef(CLOCK_OBJECT), tx.object(fountainId), tx.objectRef(lpProofToObject(lpProof))],
    });
    if (!afLpBalance || !rewardBalance) {
      throw new Error('Unstake not available');
    }

    const afLpCoin = coinFromBalance(tx, COINS_TYPE_LIST.AF_LP_USDC_BUCK, afLpBalance);
    const rewardCoin = coinFromBalance(tx, COINS_TYPE_LIST.SUI, rewardBalance);
    const [buckCoin, usdcCoin] = tx.moveCall({
      target: '0xefe170ec0be4d762196bedecd7a065816576198a6527c99282a2551aaa7da38c::withdraw::all_coin_withdraw_2_coins',
      typeArguments: [COINS_TYPE_LIST.AF_LP_USDC_BUCK, COINS_TYPE_LIST.BUCK, COINS_TYPE_LIST.wUSDC],
      arguments: [
        tx.object(AF_OBJS.pool),
        tx.object(AF_OBJS.poolRegistry),
        tx.object(AF_OBJS.protocolFeeVault),
        tx.object(AF_OBJS.treasury),
        tx.object(AF_OBJS.insuranceFund),
        tx.object(AF_OBJS.referralVault),
        afLpCoin,
      ],
    });

    if (!buckCoin || !usdcCoin) {
      throw new Error('Withdraw not available');
    }
    tx.transferObjects([buckCoin, usdcCoin, rewardCoin], tx.pure.address(recipient));
  }

  /**
   * @description Get transaction for unstake token from Kriya pool
   * @param fountainId
   * @param lpProof UserLpProof object
   */
  getKriyaUnstakeTx(tx: Transaction, fountainId: string, lpProof: UserLpProof) {
    tx.moveCall({
      target: '0x4379259b0f0f547b84ec1c81d704f24861edd8afd8fa6bb9c082e44fbf97a27a::fountain_periphery::force_unstake',
      typeArguments: proofTypeToCoinType(lpProof.typeName),
      arguments: [tx.sharedObjectRef(CLOCK_OBJECT), tx.object(fountainId), tx.objectRef(lpProofToObject(lpProof))],
    });
  }

  /**
   * @description Get transaction for unstake token from Cetus pool
   * @param fountainId
   * @param lpProof UserLpProof object
   * @param walletAddress
   */
  getCetusUnstakeTx(tx: Transaction, fountainId: string, lpProof: UserLpProof, walletAddress: string) {
    const [bucketusOut, suiReward] = tx.moveCall({
      target: '0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake',
      typeArguments: [COINS_TYPE_LIST.BUCKETUS, COINS_TYPE_LIST.SUI],
      arguments: [tx.sharedObjectRef(CLOCK_OBJECT), tx.object(fountainId), tx.objectRef(lpProofToObject(lpProof))],
    });
    if (!bucketusOut || !suiReward) {
      throw new Error('Unstake not available');
    }

    const suiCoin = coinFromBalance(tx, COINS_TYPE_LIST.SUI, suiReward);
    const bucketusCoin = coinFromBalance(tx, COINS_TYPE_LIST.BUCKETUS, bucketusOut);

    const [buckCoin, usdcCoin] = tx.moveCall({
      target: '0x8da48ef1e49dcb81631ce468df5c273d2f8eb5770af4d27ec2f1049bc8a61f75::bucketus::withdraw',
      typeArguments: [COINS_TYPE_LIST.BUCK, COINS_TYPE_LIST.wUSDC],
      arguments: [
        tx.sharedObjectRef(BUCKETUS_TREASURY),
        tx.sharedObjectRef(BUCKETUS_LP_VAULT_05),
        tx.object(CETUS_OBJS.globalConfig),
        tx.object(CETUS_OBJS.buckUsdcPool),
        tx.sharedObjectRef(CLOCK_OBJECT),
        bucketusCoin,
      ],
    });
    if (!buckCoin || !usdcCoin) {
      throw new Error('Withdraw not available');
    }

    tx.transferObjects([buckCoin, usdcCoin, suiCoin], tx.pure.address(walletAddress));
  }

  /**
   * @description Get transaction for claim token from AF pool
   * @param lpProof UserLpProof object
   */
  getAfClaimTx(tx: Transaction, lpProof: UserLpProof) {
    const [stakeType, rewardType] = proofTypeToCoinType(lpProof.typeName);
    if (!stakeType || !rewardType) {
      throw new Error('No coin available for proof');
    }

    tx.moveCall({
      target: `${FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
      typeArguments: [stakeType, rewardType],
      arguments: [
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object(lpProof.fountainId),
        tx.objectRef(lpProofToObject(lpProof)),
      ],
    });
  }

  /**
   * @description Get transaction for claim token from Cetus pool
   * @param lpProof UserLpProof object
   * @param walletAddress Claimable wallet address
   */
  getCetusClaimTx(tx: Transaction, lpProof: UserLpProof, walletAddress: string) {
    tx.moveCall({
      target: `${FOUNTAIN_PERIHERY_PACKAGE_ID}::cetus_fountain::claim`,
      arguments: [
        tx.object(lpProof.fountainId),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.objectRef(lpProofToObject(lpProof)),
        tx.pure.address(walletAddress),
      ],
    });
  }

  /**
   * @description Get transaction for claim token from Kriya pool
   * @param lpProof UserLpProof object
   */
  getKriyaClaimTx(tx: Transaction, lpProof: UserLpProof) {
    tx.moveCall({
      target: `${KRIYA_FOUNTAIN_PACKAGE_ID}::fountain_periphery::claim`,
      typeArguments: proofTypeToCoinType(lpProof.typeName),
      arguments: [
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.object(lpProof.fountainId),
        tx.objectRef(lpProofToObject(lpProof)),
      ],
    });
  }

  /**
   * @description Get transaction for claim token from lp objects
   * @param lpProofs UserLpProof object array
   * @param walletAddress Claimable wallet address
   */
  getFountainsClaimTx(tx: Transaction, lpProofs: UserLpProof[], walletAddress: string) {
    for (const lpProof of lpProofs) {
      if (lpProof.fountainId === AF_USDC_BUCK_LP_REGISTRY_ID) {
        this.getAfClaimTx(tx, lpProof);
      } else if (lpProof.fountainId === KRIYA_USDC_BUCK_LP_REGISTRY_ID) {
        this.getKriyaClaimTx(tx, lpProof);
      } else if (lpProof.fountainId === CETUS_USDC_BUCK_LP_REGISTRY_ID) {
        this.getCetusClaimTx(tx, lpProof, walletAddress);
      }
    }
  }

  /**
   * @description Get transaction for stake token to strap fountain
   * @param collateralType
   * @param strapId
   * @param address
   */
  stakeStrapFountain(
    tx: Transaction,
    collateralType: string,
    strapId: string | TransactionArgument,
    address?: string | undefined,
  ): TransactionArgument | undefined {
    const coin = getCoinSymbol(collateralType);
    if (!coin || !STRAP_FOUNTAIN_IDS[coin]) {
      throw new Error('Collateral type not supported');
    }
    const strapFountain = STRAP_FOUNTAIN_IDS[coin];

    const proof = tx.moveCall({
      target: `${STRAP_FOUNTAIN_PACKAGE_ID}::fountain::stake`,
      typeArguments: [collateralType, strapFountain.rewardType],
      arguments: [
        tx.sharedObjectRef(strapFountain),
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        typeof strapId === 'string' ? tx.object(strapId) : strapId,
      ],
    });

    if (address) {
      tx.transferObjects([proof], tx.pure.address(address));
      return;
    } else {
      return proof;
    }
  }

  /**
   * @description Get transaction for unstake token from strap fountain
   * @param collateralType
   * @param strapId
   * @param address
   * @returns boolean
   */
  unstakeStrapFountain(
    tx: Transaction,
    collateralType: string,
    strapId: string | TransactionArgument,
    address?: string,
  ): TransactionResult | undefined {
    const coin = getCoinSymbol(collateralType);
    if (!coin || !STRAP_FOUNTAIN_IDS[coin]) {
      throw new Error('Collateral type not supported');
    }

    const strapFountain = STRAP_FOUNTAIN_IDS[coin];

    const res = tx.moveCall({
      target: `${STRAP_FOUNTAIN_PACKAGE_ID}::fountain::unstake`,
      typeArguments: [collateralType, strapFountain.rewardType],
      arguments: [
        tx.sharedObjectRef(strapFountain),
        tx.sharedObjectRef(CLOCK_OBJECT),
        typeof strapId === 'string' ? tx.object(strapId) : strapId,
      ],
    });

    if (address) {
      tx.transferObjects([res], tx.pure.address(address));
      return;
    } else {
      return res;
    }
  }

  /**
   * @description Get transaction for claim token from strap fountain
   * @param collateralType
   * @param strapId
   * @param address
   */
  claimStrapFountain(
    tx: Transaction,
    collateralType: string,
    strapId: string | TransactionArgument,
    address?: string,
  ): TransactionArgument | undefined {
    const coin = getCoinSymbol(collateralType);
    if (!coin || !STRAP_FOUNTAIN_IDS[coin]) {
      throw new Error('Collateral type not supported');
    }

    const strapFountain = STRAP_FOUNTAIN_IDS[coin];

    const reward = tx.moveCall({
      target: `${STRAP_FOUNTAIN_PACKAGE_ID}::fountain::claim`,
      typeArguments: [collateralType, strapFountain.rewardType],
      arguments: [
        tx.sharedObjectRef(strapFountain),
        tx.sharedObjectRef(CLOCK_OBJECT),
        typeof strapId === 'string' ? tx.object(strapId) : strapId,
      ],
    });

    if (address) {
      tx.transferObjects([reward], tx.pure.address(address));
      return;
    } else {
      return reward;
    }
  }

  /**
   * @description Get transaction for destroy position
   * @param collateralType
   * @param strapId
   */
  destroyStrapFountain(tx: Transaction, collateralType: string, strapId: string | TransactionArgument) {
    const coin = getCoinSymbol(collateralType);
    if (!coin) {
      throw new Error('Collateral type not supported');
    }

    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::destroy_empty_strap`,
      typeArguments: [collateralType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), typeof strapId === 'string' ? tx.object(strapId) : strapId],
    });
  }

  /******************************************************
   * SBUCK                                              *
   ******************************************************/
  withdrawSBUCK(tx: Transaction, sBuckCoin: TransactionArgument): TransactionArgument | undefined {
    const [buckBalance] = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::sbuck_to_buck`,
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(SBUCK_FLASK_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        coinIntoBalance(tx, COINS_TYPE_LIST.sBUCK, sBuckCoin),
      ],
    });
    return buckBalance;
  }

  depositSBUCK(tx: Transaction, buckCoin: TransactionArgument): TransactionArgument | undefined {
    const [sbuckBalance] = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::buck_to_sbuck`,
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(SBUCK_FLASK_OBJECT),
        tx.sharedObjectRef(CLOCK_OBJECT),
        coinIntoBalance(tx, COINS_TYPE_LIST.BUCK, buckCoin),
      ],
    });
    return sbuckBalance;
  }

  stakeSBUCK(tx: Transaction, sBuckCoin: TransactionArgument): TransactionArgument {
    const sBUCKBalance = coinIntoBalance(tx, COINS_TYPE_LIST.sBUCK, sBuckCoin);
    return tx.moveCall({
      target: `${SBUCK_FOUNTAIN_PACKAGE_ID}::fountain_core::stake`,
      typeArguments: [COINS_TYPE_LIST.sBUCK, COINS_TYPE_LIST.SUI],
      arguments: [
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.sharedObjectRef(SBUCK_BUCK_LP_REGISTRY),
        sBUCKBalance,
        tx.pure.u64(MAX_LOCK_TIME),
      ],
    });
  }

  unstakeSBUCK(tx: Transaction, proof: string | TransactionArgument): [TransactionArgument, TransactionArgument] {
    const proofObj = typeof proof === 'string' ? tx.object(proof) : proof;
    const [stakeBalance, rewardBalance] = tx.moveCall({
      target: `${SBUCK_FOUNTAIN_PACKAGE_ID}::fountain_core::force_unstake`,
      typeArguments: [COINS_TYPE_LIST.sBUCK, COINS_TYPE_LIST.SUI],
      arguments: [tx.sharedObjectRef(CLOCK_OBJECT), tx.sharedObjectRef(SBUCK_BUCK_LP_REGISTRY), proofObj],
    });

    return [stakeBalance as TransactionArgument, rewardBalance as TransactionArgument];
  }

  claimSBUCK(tx: Transaction, proofId: string): TransactionArgument {
    return tx.moveCall({
      target: `${SBUCK_FOUNTAIN_PACKAGE_ID}::fountain_core::claim`,
      typeArguments: [COINS_TYPE_LIST.sBUCK, COINS_TYPE_LIST.SUI],
      arguments: [tx.sharedObjectRef(CLOCK_OBJECT), tx.sharedObjectRef(SBUCK_BUCK_LP_REGISTRY), tx.object(proofId)],
    });
  }

  /******************************************************
   * Lock proofs                                        *
   ******************************************************/

  lockProofs(tx: Transaction, proofs: ProofObject[]) {
    const protocolObj = tx.sharedObjectRef(PROTOCOL_OBJECT);
    const clockObj = tx.sharedObjectRef(CLOCK_OBJECT);

    for (const item of proofs) {
      const proofObj = typeof item.proof === 'string' ? tx.object(item.proof) : item.proof;

      if (item.token === 'afSUI') {
        tx.moveCall({
          target: `${BUCKET_POINT_PACKAGE_ID}::lst_proof_rule::lock`,
          typeArguments: [COINS_TYPE_LIST.afSUI],
          arguments: [
            tx.sharedObjectRef(BUCKET_POINT_CONFIG_OBJ),
            tx.sharedObjectRef(LOCKER_MAP.afSUI),
            protocolObj,
            clockObj,
            proofObj,
          ],
        });
      } else if (item.token === 'haSUI') {
        tx.moveCall({
          target: `${BUCKET_POINT_PACKAGE_ID}::lst_proof_rule::lock`,
          typeArguments: [COINS_TYPE_LIST.haSUI],
          arguments: [
            tx.sharedObjectRef(BUCKET_POINT_CONFIG_OBJ),
            tx.sharedObjectRef(LOCKER_MAP.haSUI),
            protocolObj,
            clockObj,
            proofObj,
          ],
        });
      } else if (item.token === 'vSUI') {
        tx.moveCall({
          target: `${BUCKET_POINT_PACKAGE_ID}::lst_proof_rule::lock`,
          typeArguments: [COINS_TYPE_LIST.vSUI],
          arguments: [
            tx.sharedObjectRef(BUCKET_POINT_CONFIG_OBJ),
            tx.sharedObjectRef(LOCKER_MAP.vSUI),
            protocolObj,
            clockObj,
            proofObj,
          ],
        });
      } else if (item.token === 'sBUCK') {
        tx.moveCall({
          target: `${BUCKET_POINT_PACKAGE_ID}::proof_rule::lock`,
          typeArguments: [COINS_TYPE_LIST.sBUCK],
          arguments: [
            tx.sharedObjectRef(BUCKET_POINT_CONFIG_OBJ),
            tx.sharedObjectRef(LOCKER_MAP.sBUCK),
            clockObj,
            proofObj,
          ],
        });
      }
    }
  }

  unlockLstProof(tx: Transaction, coin: string, account?: string): TransactionArgument | undefined {
    let lstType, lstLocker;

    if (coin === 'afSUI') {
      lstType = COINS_TYPE_LIST.afSUI;
      lstLocker = LOCKER_MAP.afSUI;
    } else if (coin === 'haSUI') {
      lstType = COINS_TYPE_LIST.haSUI;
      lstLocker = LOCKER_MAP.haSUI;
    } else if (coin === 'vSUI') {
      lstType = COINS_TYPE_LIST.vSUI;
      lstLocker = LOCKER_MAP.vSUI;
    } else {
      throw new Error('Not LST token');
    }

    const fountainObj = STRAP_FOUNTAIN_IDS[coin];
    if (!fountainObj) {
      throw new Error('No fountain exists');
    }

    const [proof] = tx.moveCall({
      target: `${BUCKET_POINT_PACKAGE_ID}::lst_proof_rule::unlock`,
      typeArguments: [lstType],
      arguments: [
        tx.sharedObjectRef(BUCKET_POINT_CONFIG_OBJ),
        tx.sharedObjectRef(lstLocker),
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(fountainObj),
        tx.sharedObjectRef(CLOCK_OBJECT),
        tx.pure.u64(0),
      ],
    });
    if (!proof) {
      throw Error('Unlock proof failed');
    }

    if (account) {
      tx.transferObjects([proof], account);
      return;
    } else {
      return proof;
    }
  }

  unlockSBuckProofs(tx: Transaction, proofCount: number, account?: string): TransactionArgument[] | undefined {
    const proofs = [];

    for (let i = 0; i < proofCount; i++) {
      const [proof] = tx.moveCall({
        target: `${BUCKET_POINT_PACKAGE_ID}::proof_rule::unlock`,
        typeArguments: [COINS_TYPE_LIST.sBUCK],
        arguments: [
          tx.sharedObjectRef(BUCKET_POINT_CONFIG_OBJ),
          tx.sharedObjectRef(LOCKER_MAP.sBUCK),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.pure.u64(0),
        ],
      });

      if (proof) {
        proofs.push(proof);
      }
    }

    if (account) {
      tx.transferObjects(proofs, account);
      return;
    } else {
      return proofs;
    }
  }

  claimLockedRewards(
    tx: Transaction,
    token: string,
    sbuckProofs?: number,
    account?: string,
  ): TransactionResult | undefined {
    if (token !== 'afSUI' && token !== 'haSUI' && token !== 'vSUI' && token !== 'sBUCK') {
      throw new Error('Not supported token');
    }

    if (token === 'sBUCK') {
      if (!sbuckProofs) return undefined;
      const totalReward = tx.moveCall({
        target: '0x2::coin::zero',
        typeArguments: [COINS_TYPE_LIST.SUI],
      });
      for (let i = 0; i < sbuckProofs; ++i) {
        const [reward] = tx.moveCall({
          target: `${BUCKET_POINT_PACKAGE_ID}::proof_rule::claim`,
          typeArguments: [COINS_TYPE_LIST.sBUCK],
          arguments: [
            tx.sharedObjectRef(LOCKER_MAP.sBUCK),
            tx.sharedObjectRef(SBUCK_BUCK_LP_REGISTRY),
            tx.sharedObjectRef(CLOCK_OBJECT),
            tx.pure.u64(i),
          ],
        });
        if (reward) {
          tx.mergeCoins(totalReward, [reward]);
        }
      }

      if (account) {
        tx.transferObjects([totalReward], account);
        return;
      } else {
        return totalReward;
      }
    } else {
      const fountainObj = STRAP_FOUNTAIN_IDS[token];
      if (!fountainObj) return undefined;
      const reward = tx.moveCall({
        target: `${BUCKET_POINT_PACKAGE_ID}::lst_proof_rule::claim`,
        typeArguments: [COINS_TYPE_LIST[token]],
        arguments: [
          tx.sharedObjectRef(LOCKER_MAP[token]),
          tx.sharedObjectRef(fountainObj),
          tx.sharedObjectRef(CLOCK_OBJECT),
          tx.pure.u64(0),
        ],
      });

      if (account) {
        tx.transferObjects([reward], account);
        return;
      } else {
        return reward;
      }
    }
  }

  /******************************************************
   * Tank                                               *
   ******************************************************/

  /**
   * @description Get all tanks objects
   */
  async getAllTanks(): Promise<TankList> {
    const tankInfoList: TankList = {};

    try {
      let tankList: DynamicFieldInfo[] = [];
      let cursor: string | null = null;
      while (true) {
        const protocolFields = await this.client.getDynamicFields({
          parentId: PROTOCOL_ID,
          cursor,
        });

        tankList = tankList.concat(protocolFields.data.filter((item) => item.objectType.includes('Tank')));

        if (!protocolFields.hasNextPage) {
          break;
        }
        cursor = protocolFields.nextCursor;
      }

      const objectIdList = tankList.map((item) => item.objectId);

      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: objectIdList,
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });

      response.forEach((res) => {
        const fields = getObjectFields(res) as TankInfoResponse;

        let token = '';
        const objectType = res.data?.type;
        if (objectType) {
          const coinType = getCoinTypeFromTank(objectType);
          token = getCoinSymbol(coinType ?? '') ?? '';
        }

        const tankInfo: TankInfo = {
          buckReserve: fields?.reserve || '0',
          collateralPool: fields?.collateral_pool || '0',
          currentS: fields?.current_s || '0',
          currentP: fields?.current_p || '1',
        };

        tankInfoList[token as COIN] = tankInfo;
      });
    } catch {}

    return tankInfoList;
  }

  /**
   * @description Get tanks array for input address
   * @address User address that belong to bottle
   * @returns Promise<TankInfo>
   */
  async getUserTanks(address: string): Promise<UserTankList> {
    if (!address) return {};

    const userTanks: UserTankList = {};

    try {
      let tankList: DynamicFieldInfo[] = [];
      let cursor: string | null = null;
      while (true) {
        const protocolFields = await this.client.getDynamicFields({
          parentId: PROTOCOL_ID,
          cursor,
        });

        tankList = tankList.concat(protocolFields.data.filter((item) => item.objectType.includes('Tank')));

        if (!protocolFields.hasNextPage) {
          break;
        }
        cursor = protocolFields.nextCursor;
      }

      // Split coin type from result
      const tankTypes = tankList.map((tank) => {
        const coinType = getCoinTypeFromTank(tank.objectType);
        return coinType;
      });

      // Build contributor token filter
      const filters = tankTypes.map((tankType) => {
        return {
          StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`,
        };
      });

      // Get contributor token accounts for user address
      const { data: contributorTokens } = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          MatchAny: filters,
        },
        options: {
          showContent: true,
        },
      });

      for (const tankType of tankTypes) {
        if (!tankType) {
          continue;
        }

        const token = getCoinSymbol(tankType);
        if (!token) {
          continue;
        }

        // Filter contributor tokens by selected tank
        const tokens = contributorTokens.filter((x) => {
          if (x.data?.content?.dataType === 'moveObject') {
            const typeId = x.data.content.type;
            return typeId.endsWith(tankType + '>');
          }

          return false;
        });

        const totalBUCK = await this.getUserTankBUCK(tankType, tokens);
        const totalEarned = await this.getUserTankEarn(tankType, tokens);
        userTanks[token] = {
          totalBUCK,
          totalEarned,
        };
      }
    } catch {}

    return userTanks;
  }

  async getUserTankBUCK(tankType: string, tokens: SuiObjectResponse[]) {
    if (tokens.length === 0) {
      return 0;
    }

    const tx = new Transaction();

    const tank = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow_tank` as `${string}::${string}::${string}`,
      typeArguments: [tankType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
    });

    const target = `${CORE_PACKAGE_ID}::tank::get_token_weight` as `${string}::${string}::${string}`;
    for (const token of tokens) {
      if (!token.data) {
        continue;
      }

      tx.moveCall({
        target: target,
        typeArguments: [COINS_TYPE_LIST.BUCK, tankType],
        arguments: [
          tank,
          tx.objectRef({
            objectId: token.data.objectId,
            digest: token.data.digest,
            version: token.data.version,
          }),
        ],
      });
    }

    const res = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: PROTOCOL_ID,
    });

    const resultArray = res?.results?.slice(1);

    if (resultArray?.length === 0) return 0;

    const bytesArray = resultArray?.map((result) => {
      if (result?.returnValues === undefined) return [0];
      if (result?.returnValues[0] === undefined) return [0];
      return result?.returnValues[0][0];
    });

    if (!bytesArray) return 0;

    let total = 0;
    bytesArray.forEach((bytes) => {
      const u64 = U64FromBytes(bytes);
      total += Number(formatUnits(u64, 9)); //BUCK decimals
    });

    return total;
  }

  async getUserTankEarn(tankType: string, tokens: SuiObjectResponse[]) {
    if (tokens.length === 0) {
      return 0;
    }

    const token = getCoinSymbol(tankType);
    if (!token) {
      return 0;
    }

    const tx = new Transaction();

    const tank = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::borrow_tank` as `${string}::${string}::${string}`,
      typeArguments: [tankType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT)],
    });

    const target = `${CORE_PACKAGE_ID}::tank::get_collateral_reward_amount` as `${string}::${string}::${string}`;
    for (const token of tokens) {
      if (!token.data) {
        continue;
      }

      tx.moveCall({
        target: target,
        typeArguments: [COINS_TYPE_LIST.BUCK, tankType],
        arguments: [
          tank,
          tx.objectRef({
            objectId: token.data.objectId,
            digest: token.data.digest,
            version: token.data.version,
          }),
        ],
      });
    }

    const res = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: PROTOCOL_ID,
    });

    const resultArray = res?.results?.slice(1);

    if (resultArray?.length === 0) return 0;

    const bytesArray = resultArray?.map((result) => {
      if (result?.returnValues === undefined) return [0];
      if (result?.returnValues[0] === undefined) return [0];
      return result?.returnValues[0][0];
    });

    if (!bytesArray) return 0;

    let total = 0;
    bytesArray.forEach((bytes) => {
      const u64 = U64FromBytes(bytes);
      total += Number(formatUnits(u64, COIN_DECIMALS[token as COIN] ?? 9));
    });

    return total;
  }

  /**
   * @description Deposit BUCK into tank
   * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param tankId The tank object id to deposit to , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
   * @param depositAmount BUCK amount to deposit into tank
   * @returns TransactionResult
   */
  depositToTank(
    tx: Transaction,
    assetBuck: string,
    assetType: string,
    tankId: string,
    depositAmount: string,
  ): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::deposit`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.pure.u64(depositAmount)],
    });
  }

  /**
   * @description Withdraw BUCK and collateral gain from the Tank
   * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
   * @param contributorToken The contributor token
   * @returns TransactionResult
   */
  withdrawFromTank(
    tx: Transaction,
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::withdraw`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.object(contributorToken)],
    });
  }

  /**
   * @description Claim collateral gain and BKT reward from the Tank
   * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
   * @param contributorToken The contributor token
   * @returns TransactionResult
   */
  claimFromTank(
    tx: Transaction,
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::claim`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.object(contributorToken)],
    });
  }

  /**
   * @description Claim BKT reward earned by a deposit since its last snapshots were taken
   * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
   * @param assetType Asset , e.g "0x2::sui::SUI"
   * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
   * @param contributorToken The contributor token
   * @returns TransactionResult
   */
  claimBkt(
    tx: Transaction,
    assetBuck: string,
    assetType: string,
    tankId: string,
    contributorToken: string,
  ): TransactionResult {
    return tx.moveCall({
      target: `${CORE_PACKAGE_ID}::tank::claim_bkt`,
      typeArguments: [assetBuck, assetType],
      arguments: [tx.object(tankId), tx.object(contributorToken)],
    });
  }

  /******************************************************
   * PSM                                                *
   ******************************************************/

  /**
   * @description Get all PSM's information
   */
  async getAllPsms(): Promise<PsmList> {
    const psmList: PsmList = {};

    try {
      const psmPoolIds = Object.values(PSM_POOL_IDS);
      const psmBalanceIds = Object.values(PSM_BALANCE_IDS);
      const response: SuiObjectResponse[] = await this.client.multiGetObjects({
        ids: [...psmPoolIds, ...psmBalanceIds],
        options: {
          showContent: true,
          showType: true, //Check could we get type from response later
        },
      });

      for (const res of response) {
        const objectId = res.data?.objectId ?? '';
        if (psmPoolIds.includes(objectId)) {
          const psm = objectToPsm(res);
          const coin = Object.keys(PSM_POOL_IDS).find((symbol) => PSM_POOL_IDS[symbol as COIN] === psm.id);
          if (coin) {
            psmList[coin] = psm;
          }
        }

        if (psmBalanceIds.includes(objectId)) {
          const balanceObj = getObjectFields(res) as PsmBalanceResponse;

          const coin = Object.keys(PSM_BALANCE_IDS).find((symbol) => PSM_BALANCE_IDS[symbol as COIN] === objectId);
          if (coin && psmList[coin]) {
            const balance = Number(formatUnits(BigInt(balanceObj.coin_balance), COIN_DECIMALS[coin as COIN] ?? 9));

            (psmList[coin] as PsmInfo).balance = balance;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return psmList;
  }

  /**
   * @description Get psm information from id
   * @param poolId PSM pool id
   * @returns Promise<PsmInfo>
   */
  async getPsm(coin: COIN): Promise<PsmInfo> {
    const poolId = PSM_POOL_IDS[coin];
    if (!poolId) {
      throw Error('Not PSM supported token');
    }

    const response: SuiObjectResponse = await this.client.getObject({
      id: poolId,
      options: {
        showContent: true,
        showType: true, //Check could we get type from response later
      },
    });

    return objectToPsm(response);
  }

  /**
   * @description Get transaction for PSM
   * @param coinType input coinType e.g USDC coin type
   * @param coinInput Coin<T>
   * @param referrer referrer get 50% rebate
   * @param rate 5 => 0.05%
   * @returns Coin<BUCK>
   */
  psmSwapIn(
    tx: Transaction,
    coinType: string,
    coinInput: TransactionArgument,
    referrer?: string,
    rate?: number,
  ): TransactionResult {
    const balanceInput = coinIntoBalance(tx, coinType, coinInput);
    const balanceOut = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::charge_reservoir`,
      typeArguments: [coinType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), balanceInput],
    });
    const coinOut = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, balanceOut);
    const coinOutValue = tx.moveCall({
      target: '0x2::coin::value',
      typeArguments: [COINS_TYPE_LIST.BUCK],
      arguments: [coinOut],
    });
    if (referrer) {
      const referralRebateAmount = tx.moveCall({
        target: '0x00db9a10bb9536ab367b7d1ffa404c1d6c55f009076df1139dc108dd86608bbe::math::mul_factor',
        arguments: [coinOutValue, tx.pure.u64(rate ?? 5), tx.pure.u64(10_000)],
      });
      const referralRebate = tx.splitCoins(coinOut, [referralRebateAmount]);
      tx.transferObjects([referralRebate], tx.pure.address(referrer));
    }
    return coinOut;
  }

  /**
   * @description Get transaction for PSM
   * @param outCoinType output coinType e.g STAPEARL, USDC, USDT
   * @param buckCoinInput Coin<BUCK>
   * @param usdType, USDC or USDT
   */
  psmSwapOut(tx: Transaction, outCoinType: string, buckCoinInput: TransactionArgument): TransactionResult {
    const clockObj = tx.sharedObjectRef(CLOCK_OBJECT);
    const inputCoinBalance = coinIntoBalance(tx, COINS_TYPE_LIST.BUCK, buckCoinInput);
    const outCoinSymbol = getCoinSymbol(outCoinType);
    if (outCoinSymbol && outCoinSymbol in SCABLE_VAULTS) {
      const outBalance = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::discharge_reservoir`,
        typeArguments: [COINS_TYPE_LIST.SCABLE],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), inputCoinBalance],
      });
      const outCoin = coinFromBalance(tx, COINS_TYPE_LIST.SCABLE, outBalance);
      const vaultObj = SCABLE_VAULTS[outCoinSymbol as ScableCoin];
      if (!vaultObj) throw new Error('Unspported PSM type');
      const treasuryObj = tx.sharedObjectRef({
        objectId: '0x3b9e577e96fcc0bc7a06a39f82f166417f675813a294d64833d4adb2229f6321',
        initialSharedVersion: 272980431,
        mutable: true,
      });
      const scaVersionObj = tx.sharedObjectRef({
        objectId: '0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7',
        initialSharedVersion: 7765848,
        mutable: false,
      });
      const scaMarketObj = tx.sharedObjectRef({
        objectId: '0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9',
        initialSharedVersion: 7765848,
        mutable: true,
      });
      return tx.moveCall({
        target: '0x1b4b5dd782453586f2a39dbc154f9ef4ca7780ae9a31154c1c6080985a5d295e::scable::withdraw_coin_from_spool',
        typeArguments: [outCoinType],
        arguments: [
          tx.sharedObjectRef(vaultObj),
          treasuryObj,
          scaVersionObj,
          scaMarketObj,
          clockObj,
          outCoin,
          tx.object('0x4ace6648ddc64e646ba47a957c562c32c9599b3bba8f5ac1aadb2ae23a2f8ca0'),
        ],
      });
    } else {
      const outBalance = tx.moveCall({
        target: `${CORE_PACKAGE_ID}::buck::discharge_reservoir`,
        typeArguments: [outCoinType],
        arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), inputCoinBalance],
      });
      return coinFromBalance(tx, outCoinType, outBalance);
    }
  }

  /******************************************************
   * deBUT                                              *
   ******************************************************/

  /**
   * @description Get deBUT token information
   * @returns Promise<DeTokenInfo>
   */
  async getDeTokenInfo(): Promise<DeTokenInfo> {
    const res = await this.client.getObject({
      id: DETOKEN_CONFIG.objects.shared.butDeCenter.objectId,
      options: { showContent: true },
    });

    const deCenter = getObjectFields(res) as DeCenterResponse;

    const totalStakedButAmount = Number(deCenter.locked_total) / 10 ** COIN_DECIMALS.BUT;
    const totalDeButAmount = getDeButAmount(deCenter, Date.now());

    return {
      totalStakedButAmount,
      totalDeButAmount,
    };
  }

  /**
   * @description Get deBUT information for input address
   * @address User address that belong to deToken type
   * @returns Promise<UserDeButInfo | null>
   */
  async getUserDeButInfo(address: string): Promise<UserDeButInfo | null> {
    let deWrapperId;
    let dropsAmount = 0;
    let positions: DeTokenPosition[] = [];

    try {
      const wrapperObj = await this.getUserDeWrapper(address);
      if (wrapperObj) {
        deWrapperId = wrapperObj.id;
        positions = wrapperObj.positions;
        dropsAmount = await this.getUserDropsAmount(address, deWrapperId);
      } else {
        positions = await this.getUserDeTokens(address);
      }

      return {
        deWrapperId,
        positions,
        dropsAmount,
      };
    } catch {
      return null;
    }
  }

  /**
   * @description Get deWrapper array for input address
   * @address User address that belong to deWrapper type
   * @returns Promise<DeWrapperInfo>
   */
  async getUserDeWrapper(address: string): Promise<DeWrapperInfo | null> {
    if (!address) return null;

    let id = '';
    const positions: DeTokenPosition[] = [];

    try {
      const { data: deWrappers } = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: `0x959a7135a3e96868aac57bb2ae493db76714815797349384671a62d256b1f6d::de_wrapper::DeWrapper`,
        },
        options: {
          showContent: true,
        },
      });

      deWrappers.map((deWrapperObj) => {
        const wrapperObj = getObjectFields(deWrapperObj) as DeWrapperResponse;
        id = wrapperObj.id.id;

        for (const { fields: obj } of wrapperObj.tokens) {
          positions.push({
            id: obj.id.id,
            stakedButAmount: Number(obj.balance) / 10 ** COIN_DECIMALS.BUT,
            stakedPeriod: Number(obj.end) - Number(obj.point.fields.timestamp),
            startDate: Number(obj.point.fields.timestamp),
            unlockDate: Number(obj.end),
            deButAmount: Math.min(getDeButAmount(obj, Date.now()), Number(obj.balance) / 10 ** COIN_DECIMALS.BUT),
            earlyUnstakable: obj.early_unlock,
          });
        }
      });
    } catch {}

    return {
      id,
      positions,
    };
  }

  /**
   * @description Get deTokens array for input address
   * @address User address that belong to deToken type
   * @returns Promise<DeTokenPosition>
   */
  async getUserDeTokens(address: string): Promise<DeTokenPosition[]> {
    if (!address) return [];

    const positions: DeTokenPosition[] = [];

    try {
      const { data: deTokens } = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: `0x6104e610f707fe5f1b3f34aa274c113a6b0523e63d5fb2069710e1c2d1f1fd1c::de_token::DeToken`,
        },
        options: {
          showContent: true,
        },
      });

      deTokens.map((deTokenObj) => {
        const obj = getObjectFields(deTokenObj) as DeTokenResponse;

        positions.push({
          id: obj.id.id,
          stakedButAmount: Number(obj.balance) / 10 ** COIN_DECIMALS.BUT,
          stakedPeriod: Number(obj.end) - Number(obj.point.fields.timestamp),
          startDate: Number(obj.point.fields.timestamp),
          unlockDate: Number(obj.end),
          deButAmount: Math.min(getDeButAmount(obj, Date.now()), Number(obj.balance) / 10 ** COIN_DECIMALS.BUT),
          earlyUnstakable: obj.early_unlock,
        });
      });
    } catch {}

    return positions;
  }

  /**
   * @description Get deWrapper array for input address
   * @address User address that belong to deWrapper type
   * @address deWrapperId
   * @returns Promise<number>
   */
  async getUserDropsAmount(address: string, deWrapperId: string): Promise<number> {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${DETOKEN_CENTER}::reward_center::get_pending_rewards`,
        typeArguments: [COINS_TYPE_LIST.BUT, BUCKET_PROTOCOL_TYPE, DROPS_COIN_TYPE],
        arguments: [
          tx.sharedObjectRef(DETOKEN_CONFIG.objects.shared.rewardCenter),
          tx.pure.address(deWrapperId),
          tx.sharedObjectRef(CLOCK_OBJECT),
        ],
      });
      const res = await this.client.devInspectTransactionBlock({
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
      return +pendingRewards / 10 ** DROPS_COIN_DECIMALS;
    } catch (error) {
      console.error(error);

      return 0;
    }
  }
}
