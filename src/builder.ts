import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { BUCKET_OPERATIONS_PACKAGE_ID, BucketClient, CLOCK_OBJECT, coinFromBalance, coinIntoBalance, COINS_TYPE_LIST, CONTRIBUTOR_TOKEN_ID, CORE_PACKAGE_ID, getCoinSymbol, getInputCoins, getMainCoin, LOCKER_MAP, ORACLE_OBJECT, PROTOCOL_OBJECT, STRAP_FOUNTAIN_IDS, TREASURY_OBJECT, UserLpProof } from ".";


/* ----- Borrow/Repay Builders ----- */
export async function buildBorrowTx(
  client: BucketClient,
  tx: Transaction,
  collateralType: string,
  collateralAmount: string,
  borrowAmount: string,
  recipient: string,
  insertionPlace?: string,
  strapId?: string,
) {
  /**
   * @description Borrow
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param collateralAmount
   * @param borrowAmount
   * @param recipient
   * @param insertionPlace  Optional
   * @param strapId         Optional
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(collateralType);
  if (!coin) {
    throw new Error("Collateral not supported");
  }

  const isLST = coin in STRAP_FOUNTAIN_IDS;
  const isCountingPoint = coin in LOCKER_MAP;

  if (!strapId || !isLST) {
    const collInputCoin = await getInputCoins(
      tx,
      suiClient,
      recipient,
      collateralType,
      collateralAmount,
    );
    client.updateSupraOracle(tx, getCoinSymbol(collateralType) ?? "");

    if (borrowAmount != "0") {
      const buckBalance = client.borrow(
        tx,
        collateralType,
        coinIntoBalance(tx, collateralType, collInputCoin),
        tx.pure.u64(borrowAmount),
        insertionPlace,
        strapId,
      );
      if (!buckBalance) return;

      tx.transferObjects(
        [coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance)],
        tx.pure.address(recipient),
      );
    } else {
      client.topUp(
        tx,
        collateralType,
        coinIntoBalance(tx, collateralType, collInputCoin),
        recipient,
        insertionPlace,
      );
    }
  } else {
    const lstInputCoin = await getInputCoins(
      tx,
      suiClient,
      recipient,
      collateralType,
      collateralAmount,
    );

    client.updateSupraOracle(tx, getCoinSymbol(collateralType) ?? "");
    if (strapId === "new") {
      const ret = client.borrow(
        tx,
        collateralType,
        coinIntoBalance(tx, collateralType, lstInputCoin),
        tx.pure.u64(borrowAmount),
        insertionPlace,
        "new",
      );
      if (!ret) return;

      const [strap, buckBalance] = ret;
      if (!strap || !buckBalance) return;

      tx.transferObjects(
        [coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance)],
        tx.pure.address(recipient),
      );

      const proof = client.stakeStrapFountain(tx, collateralType, strap);
      if (!proof) return;
      if (isCountingPoint) {
        client.lockProofs(tx, [{ token: coin, proof }]);
      } else {
        tx.transferObjects([proof], recipient);
      }
    } else {
      let strapObj =
        strapId === "locked"
          ? client.unlockLstProof(tx, coin)
          : tx.object(strapId);
      if (!strapObj) return;
      const unstakeRes = client.unstakeStrapFountain(
        tx,
        collateralType,
        strapObj,
      );
      if (!unstakeRes) return;
      const [strap, reward] = unstakeRes;
      if (!strap || !reward) return;

      const buckBalance = client.borrow(
        tx,
        collateralType,
        coinIntoBalance(tx, collateralType, lstInputCoin),
        tx.pure.u64(borrowAmount),
        insertionPlace,
        strap,
      );
      if (!buckBalance) return;

      const proof = client.stakeStrapFountain(tx, collateralType, strap);
      if (!proof) return;

      if (isCountingPoint) {
        client.lockProofs(tx, [{ token: coin, proof }]);
      } else {
        tx.transferObjects([proof], recipient);
      }
      tx.transferObjects(
        [
          reward,
          coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance),
          // proof,
        ],
        recipient,
      );
    }
  }
}

export async function buildRepayTx(
  client: BucketClient,
  tx: Transaction,
  collateralType: string,
  repayAmount: string,
  withdrawAmount: string,
  recipient: string,
  isSurplus: boolean,
  insertionPlace?: string,
  strapId?: string,
) {
  /**
   * @description Repay
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param repayAmount
   * @param withdrawAmount
   * @param recipient
   * @param isSurplus
   * @param insertionPlace  Optional
   * @param strapId         Optional
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(collateralType);
  if (!coin) {
    throw new Error("Collateral not supported");
  }

  const isClose = withdrawAmount == "0" && repayAmount == "0";
  const isLST = coin in STRAP_FOUNTAIN_IDS;
  const isCountingPoint = coin in LOCKER_MAP;

  if (!strapId || !isLST) {
    if (isSurplus) {
      const surplusCoin = client.withdrawSurplus(tx, collateralType);
      tx.transferObjects([surplusCoin], recipient);
    } else {
      await client.getRepayTx(
        tx,
        collateralType,
        repayAmount,
        withdrawAmount,
        recipient,
        insertionPlace,
        strapId,
      );
    }
  } else {
    let strapObj =
      strapId === "locked"
        ? client.unlockLstProof(tx, coin)
        : tx.object(strapId);
    if (!strapObj) return;
    const unstakeRes = client.unstakeStrapFountain(
      tx,
      collateralType,
      strapObj,
    );
    if (!unstakeRes) return;
    const [strap, reward] = unstakeRes;
    if (!strap || !reward) return;

    if (isClose) {
      const buckCoin = await getMainCoin(
        tx,
        suiClient,
        recipient,
        COINS_TYPE_LIST.BUCK,
      );
      if (!buckCoin) return;
      if (isSurplus) {
        const surplusCoin = client.withdrawSurplus(tx, collateralType, strap);
        tx.transferObjects([reward, surplusCoin], recipient);
      } else {
        tx.moveCall({
          target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::fully_repay_with_strap`,
          typeArguments: [collateralType],
          arguments: [
            tx.sharedObjectRef(PROTOCOL_OBJECT),
            strap,
            buckCoin,
            tx.sharedObjectRef(CLOCK_OBJECT),
          ],
        });

        tx.transferObjects([reward], tx.pure.address(recipient));
      }
    } else {
      const buckCoin = await getInputCoins(
        tx,
        suiClient,
        recipient,
        COINS_TYPE_LIST.BUCK,
        repayAmount,
      );
      client.updateSupraOracle(tx, getCoinSymbol(collateralType) ?? "");

      tx.moveCall({
        target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::repay_and_withdraw_with_strap`,
        typeArguments: [collateralType],
        arguments: [
          tx.sharedObjectRef(PROTOCOL_OBJECT),
          tx.sharedObjectRef(ORACLE_OBJECT),
          strap,
          tx.sharedObjectRef(CLOCK_OBJECT),
          buckCoin,
          tx.pure.u64(withdrawAmount),
          tx.pure(
            bcs
              .vector(bcs.Address)
              .serialize(insertionPlace ? [insertionPlace] : []),
          ),
        ],
      });

      const proof = client.stakeStrapFountain(tx, collateralType, strap);
      if (!proof) return;

      if (isCountingPoint) {
        client.lockProofs(tx, [{ token: coin, proof }]);
      } else {
        tx.transferObjects([proof], recipient);
      }
      tx.transferObjects([reward], recipient);
    }
  }
}

export async function buildWithdrawTx(
  client: BucketClient,
  tx: Transaction,
  collateralType: string,
  withdrawAmount: string,
  recipient: string,
  insertionPlace?: string,
  strapId?: string,
) {
  /**
   * @description Withdraw
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param withdrawAmount
   * @param recipient
   * @param insertionPlace  Optional
   * @param strapId         Optional
   */

  const coin = getCoinSymbol(collateralType);
  if (!coin) {
    throw new Error("Collateral not supported");
  }

  client.updateSupraOracle(tx, getCoinSymbol(collateralType) ?? "");

  const isLST = coin in STRAP_FOUNTAIN_IDS;
  const isCountingPoint = coin in LOCKER_MAP;

  if (!strapId || !isLST) {
    const collOut = client.withdraw(
      tx,
      collateralType,
      `${withdrawAmount}`,
      insertionPlace,
      strapId,
    );
    tx.transferObjects(
      [coinFromBalance(tx, collateralType, collOut)],
      tx.pure.address(recipient),
    );
  } else {
    let strapObj =
      strapId === "locked"
        ? client.unlockLstProof(tx, coin)
        : tx.object(strapId);
    if (!strapObj) return;
    const unstakeRes = client.unstakeStrapFountain(
      tx,
      collateralType,
      strapObj,
    );
    if (!unstakeRes) return;
    const [strap, reward] = unstakeRes;
    if (!strap || !reward) return;

    const collOut = client.withdraw(
      tx,
      collateralType,
      `${withdrawAmount}`,
      insertionPlace,
      strap,
    );
    const proof = client.stakeStrapFountain(tx, collateralType, strap);
    if (!proof) return;

    if (isCountingPoint) {
      client.lockProofs(tx, [{ token: coin, proof }]);
    } else {
      tx.transferObjects([proof], recipient);
    }
    tx.transferObjects(
      [reward, coinFromBalance(tx, collateralType, collOut)],
      tx.pure.address(recipient),
    );
  }
}

export async function buildCloseTx(
  client: BucketClient,
  tx: Transaction,
  collateralType: string,
  recipient: string,
  strapId: string,
) {
  /**
   * @description Close position
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param recipient
   * @param strapId         Optional
   */

  const coin = getCoinSymbol(collateralType);
  if (!coin) {
    throw new Error("Collateral not supported");
  }

  const strap =
    strapId === "locked" ? client.unlockLstProof(tx, coin) : tx.object(strapId);
  if (!strap) return;

  const isLST = coin in STRAP_FOUNTAIN_IDS;
  if (!isLST) {
    client.destroyStrapFountain(tx, collateralType, strap);
  } else {
    const unstakeRes = client.unstakeStrapFountain(tx, collateralType, strap);
    if (!unstakeRes) return;

    const [strapOut, reward] = unstakeRes;
    if (!strapOut || !reward) return;

    client.destroyStrapFountain(tx, collateralType, strapOut);
    tx.transferObjects([reward], tx.pure.address(recipient));
  }
}

/* ----- PSM Builders ----- */
export async function buildPsmTx(
  client: BucketClient,
  tx: Transaction,
  psmCoin: string,
  psmAmount: string,
  psmSwitch: boolean,
  recipient: string,
  referrer?: string,
) {
  /**
   * @description Get transaction for PSM
   * @param psmCoin Asset , e.g "0x2::sui::SUI"
   * @param psmAmount
   * @param psmSwitch BUCK -> stablecoin or not
   * @param walletAddress
   */
  const suiClient = client.getSuiClient();

  const inputCoinType = psmSwitch ? COINS_TYPE_LIST.BUCK : psmCoin;
  const [inputCoin] = await getInputCoins(
    tx,
    suiClient,
    recipient,
    inputCoinType,
    psmAmount,
  );
  if (!inputCoin) {
    throw new Error("Input not valid");
  }

  const outCoinType = psmSwitch ? psmCoin : COINS_TYPE_LIST.BUCK;

  if (psmSwitch) {
    if (psmCoin === COINS_TYPE_LIST.STAPEARL) {
      const [usdA, usdB] = client.psmSwapOut(tx, outCoinType, inputCoin);
      if (!usdA || !usdB) {
        throw new Error("Swap failed");
      }

      tx.transferObjects([usdA, usdB], tx.pure.address(recipient));
    } else {
      const [usd] = client.psmSwapOut(tx, outCoinType, inputCoin);
      if (!usd) {
        throw new Error("Swap failed");
      }

      tx.transferObjects([usd], tx.pure.address(recipient));
    }
  } else {
    const coinOut = client.psmSwapIn(tx, inputCoinType, inputCoin, referrer);
    tx.transferObjects([coinOut], tx.pure.address(recipient));
  }
}

export async function buildRedeemTx(
  client: BucketClient,
  tx: Transaction,
  collateralType: string,
  redeemAmount: string,
  recipient: string,
  insertionPlace?: string,
) {
  /**
   * @description Get transaction for Redeem
   * @param collateralType Asset , e.g "0x2::sui::SUI"
   * @param redeemAmount
   * @param recipient
   * @param insertionPlace  Optional
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(collateralType);
  if (!coin) {
    throw new Error("Coin type not supported");
  }

  const [buckCoinInput] = await getInputCoins(
    tx,
    suiClient,
    recipient,
    COINS_TYPE_LIST.BUCK,
    redeemAmount,
  );
  if (!buckCoinInput) throw new Error("No BUCK input");

  client.updateSupraOracle(tx, coin);

  tx.moveCall({
    target: `${BUCKET_OPERATIONS_PACKAGE_ID}::bucket_operations::redeem`,
    typeArguments: [collateralType],
    arguments: [
      tx.sharedObjectRef(PROTOCOL_OBJECT),
      tx.sharedObjectRef(ORACLE_OBJECT),
      tx.sharedObjectRef(CLOCK_OBJECT),
      buckCoinInput,
      tx.pure(
        bcs
          .vector(bcs.Address)
          .serialize(insertionPlace ? [insertionPlace] : []),
      ),
    ],
  });
}

/* ----- Tank Builders ----- */
export async function buildTankDepositTx(
  client: BucketClient,
  tx: Transaction,
  tankType: string,
  depositAmount: string,
  recipient: string,
): Promise<void> {
  /**
   * @description Get transaction for deposit token to tank
   * @param tankType Asset , e.g "0x2::sui::SUI"
   * @param depositAmount
   * @param recipient
   * @returns Promise<void>
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(tankType);
  if (!coin) {
    throw new Error("Coin type not supported");
  }

  const [buckCoinInput] = await getInputCoins(
    tx,
    suiClient,
    recipient,
    COINS_TYPE_LIST.BUCK,
    depositAmount,
  );
  if (!buckCoinInput) return;

  tx.moveCall({
    target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::deposit`,
    typeArguments: [tankType],
    arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), buckCoinInput],
  });
}

export async function buildTankWithdrawTx(
  client: BucketClient,
  tx: Transaction,
  tankType: string,
  withdrawAmount: string,
  recipient: string,
): Promise<void> {
  /**
   * @description Get transaction for withdraw token from tank
   * @param tankType Asset , e.g "0x2::sui::SUI"
   * @param withdrawAmount
   * @param recipient
   * @returns Promise<void>
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(tankType);
  if (!coin) {
    throw new Error("Coin type not supported");
  }

  const { data: contributorTokens } = await suiClient.getOwnedObjects({
    owner: recipient,
    filter: {
      StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`,
    },
    options: {
      showContent: true,
    },
  });
  const tokens = contributorTokens.map((token) =>
    tx.objectRef({
      objectId: token.data?.objectId ?? "",
      digest: token.data?.digest ?? "",
      version: token.data?.version ?? "",
    }),
  );
  const tokenObjs = tx.makeMoveVec({
    elements: tokens,
  });

  client.updateSupraOracle(tx, coin);

  tx.moveCall({
    target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::withdraw`,
    typeArguments: [tankType],
    arguments: [
      tx.sharedObjectRef(PROTOCOL_OBJECT),
      tx.sharedObjectRef(ORACLE_OBJECT),
      tx.sharedObjectRef(CLOCK_OBJECT),
      tx.sharedObjectRef(TREASURY_OBJECT),
      tokenObjs,
      tx.pure.u64(withdrawAmount),
    ],
  });
}

export async function buildTankClaimTx(
  client: BucketClient,
  tx: Transaction,
  tankType: string,
  recipient: string,
): Promise<void> {
  /**
   * @description Get transaction for claim token from tank
   * @param tankType Asset , e.g "0x2::sui::SUI"
   * @param recipient
   * @returns Promise<void>
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(tankType);
  if (!coin) {
    throw new Error("Coin type not supported");
  }

  const { data: contributorTokens } = await suiClient.getOwnedObjects({
    owner: recipient,
    filter: {
      StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`,
    },
    options: {
      showContent: true,
    },
  });
  const tokens = contributorTokens.map((token) =>
    tx.objectRef({
      objectId: token.data?.objectId ?? "",
      digest: token.data?.digest ?? "",
      version: token.data?.version ?? "",
    }),
  );
  if (!tokens || tokens.length === 0) return;

  for (const token of tokens) {
    tx.moveCall({
      target: `${BUCKET_OPERATIONS_PACKAGE_ID}::tank_operations::claim`,
      typeArguments: [tankType],
      arguments: [
        tx.sharedObjectRef(PROTOCOL_OBJECT),
        tx.sharedObjectRef(TREASURY_OBJECT),
        token,
      ],
    });
  }
}

/* ----- SBUCK Builders ----- */
export async function buildSBUCKDepositTx(
  client: BucketClient,
  tx: Transaction,
  depositType: string,
  depositAmount: string,
  recipient: string,
  isStaked: boolean,
) {
  /**
   * @description Deposit sBUCK to earn
   * @param depositType Asset , e.g "0x2::sui::SUI"
   * @param depositAmount
   * @param recipient
   * @param isStaked
   */
  const suiClient = client.getSuiClient();

  const coin = getCoinSymbol(depositType);
  if (!coin) {
    throw new Error("Coin type not supported");
  }

  const inputCoin = await getInputCoins(
    tx,
    suiClient,
    recipient,
    depositType,
    depositAmount,
  );

  let buckCoin;
  if (depositType === "BUCK") {
    buckCoin = inputCoin;
  } else {
    // PSM to BUCK
    const inputBalance = coinIntoBalance(
      tx,
      depositType,
      inputCoin,
    );
    const buckBalance = tx.moveCall({
      target: `${CORE_PACKAGE_ID}::buck::charge_reservoir`,
      typeArguments: [depositType],
      arguments: [tx.sharedObjectRef(PROTOCOL_OBJECT), inputBalance],
    });

    buckCoin = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance);
  }

  const sBUCKBalance = client.depositSBUCK(tx, buckCoin);
  if (!sBUCKBalance) throw new Error("No sBUCK input");

  const sBUCKCoin = coinFromBalance(
    tx,
    COINS_TYPE_LIST.sBUCK,
    sBUCKBalance,
  );

  if (isStaked) {
    const proof = client.stakeSBUCK(tx, sBUCKCoin);
    client.lockProofs(tx, [{ token: "sBUCK", proof }]);
  } else {
    tx.transferObjects([sBUCKCoin], tx.pure.address(recipient));
  }
}

export async function buildSBUCKUnstakeTx(
  client: BucketClient,
  tx: Transaction,
  stakeProofs: UserLpProof[],
  amount: string,
  recipient: string,
  isStake: boolean,
  toBuck?: boolean,
) {
  /**
   * @description Unstake sBUCK from proofObjects
   * @param stakeProofs
   * @param amount
   * @param recipient
   * @param isStake
   * @param toBuck      Optional
   */

  const mainSuiRewardBalance = tx.moveCall({
    target: "0x2::balance::zero",
    typeArguments: [COINS_TYPE_LIST.SUI],
  });
  const mainSBuckBalance = tx.moveCall({
    target: "0x2::balance::zero",
    typeArguments: [COINS_TYPE_LIST.sBUCK],
  });

  let proofs = [];
  // if locked, then unlock first
  const lockedProofs = stakeProofs.filter((t) => t.digest == "");
  if (lockedProofs.length > 0) {
    proofs = client.unlockSBuckProofs(
      tx,
      lockedProofs.length,
    ) as TransactionArgument[];
  } else {
    proofs = stakeProofs
      .filter((t) => t.objectId != "")
      .map((t) => t.objectId);
  }

  for (const proof of proofs) {
    const [sBuckBalance, suiRewardBalance] = client.unstakeSBUCK(
      tx,
      proof,
    );
    tx.moveCall({
      target: "0x2::balance::join",
      typeArguments: [COINS_TYPE_LIST.SUI],
      arguments: [mainSuiRewardBalance, suiRewardBalance],
    });
    tx.moveCall({
      target: "0x2::balance::join",
      typeArguments: [COINS_TYPE_LIST.sBUCK],
      arguments: [mainSBuckBalance, sBuckBalance],
    });
  }

  const suiCoin = coinFromBalance(
    tx,
    COINS_TYPE_LIST.SUI,
    mainSuiRewardBalance,
  );
  const sBuckCoin = coinFromBalance(
    tx,
    COINS_TYPE_LIST.sBUCK,
    mainSBuckBalance,
  );

  if (!isStake) {
    if (toBuck) {
      const buckBalance = client.withdrawSBUCK(tx, sBuckCoin);
      if (!buckBalance) return;
      const buckCoin = coinFromBalance(
        tx,
        COINS_TYPE_LIST.BUCK,
        buckBalance,
      );
      tx.transferObjects([suiCoin, buckCoin], tx.pure.address(recipient));
    } else {
      tx.transferObjects([suiCoin, sBuckCoin], tx.pure.address(recipient));
    }
  } else {
    const returnedSBuckCoin = tx.splitCoins(sBuckCoin, [amount]);
    if (toBuck) {
      const buckBalance = client.withdrawSBUCK(tx, returnedSBuckCoin);
      if (!buckBalance) return;
      const buckCoin = coinFromBalance(
        tx,
        COINS_TYPE_LIST.BUCK,
        buckBalance,
      );
      tx.transferObjects([suiCoin, buckCoin], tx.pure.address(recipient));
    } else {
      tx.transferObjects(
        [suiCoin, returnedSBuckCoin],
        tx.pure.address(recipient),
      );
    }

    // stake remaining sBUCK back to Savings Pool
    const proof = client.stakeSBUCK(tx, sBuckCoin);
    client.lockProofs(tx, [{ token: "sBUCK", proof }]);
    // tx.transferObjects([proof], tx.pure.address(address));
  }
}

export async function buildSBUCKWithdrawTx(
  client: BucketClient,
  tx: Transaction,
  withdrawAmount: string,
  recipient: string,
) {
  /**
   * @description Withdraw sBUCK
   * @param withdrawAmount
   * @param recipient
   */
  const suiClient = client.getSuiClient();

  const sBuckCoin = await getInputCoins(
    tx,
    suiClient,
    recipient,
    COINS_TYPE_LIST.sBUCK,
    withdrawAmount,
  );
  const buckBalance = client.withdrawSBUCK(tx, sBuckCoin);
  if (!buckBalance) throw new Error("Withdraw sBUCK failed");

  const buckCoin = coinFromBalance(tx, COINS_TYPE_LIST.BUCK, buckBalance);
  tx.transferObjects([buckCoin], tx.pure.address(recipient));
}

export async function buildSBUCKClaimTx(
  client: BucketClient,
  tx: Transaction,
  stakeProofs: UserLpProof[],
  recipient: string,
) {
  /**
   * @description Claim sBUCK
   * @param stakeProofs
   * @param recipient
   */

  const nonLockProofs = stakeProofs.filter((t) => t.digest != "");
  const lockedProofs = stakeProofs.filter((t) => t.digest == "");

  if (nonLockProofs.length > 0) {
    const mainSuiRewardBalance = tx.moveCall({
      target: "0x2::balance::zero",
      typeArguments: [COINS_TYPE_LIST.SUI],
    });

    for (const proof of nonLockProofs) {
      const reward = client.claimSBUCK(tx, proof.objectId);
      tx.moveCall({
        target: "0x2::balance::join",
        typeArguments: [COINS_TYPE_LIST.SUI],
        arguments: [mainSuiRewardBalance, reward],
      });
    }

    const suiCoin = coinFromBalance(
      tx,
      COINS_TYPE_LIST.SUI,
      mainSuiRewardBalance,
    );
    tx.transferObjects([suiCoin], tx.pure.address(recipient));
  } else if (lockedProofs.length > 0) {
    client.claimLockedRewards(
      tx,
      "sBUCK",
      lockedProofs.length,
      recipient
    );
  }
}