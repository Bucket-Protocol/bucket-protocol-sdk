# Bucket Protocol - Coin Types (Lean Reference)

Use runtime queries first. Do not rely on static tables unless the user explicitly asks for literals.

## Live Type Discovery (Preferred)

```ts
const usdbType = await client.getUsdbCoinType();
const collateralTypes = await client.getAllCollateralTypes();
const oracleTypes = await client.getAllOracleCoinTypes();
const psmTypes = Object.keys(await client.getAllPsmPoolObjects());
const savingLpTypes = Object.keys(await client.getAllSavingPoolObjects());
```

Validation rules:
- CDP `coinType`: must be in `collateralTypes`
- PSM `coinType`: must be in `psmTypes`
- Saving `lpType`: must be in `savingLpTypes`

If not present, return an explicit unsupported-type error.

## Minimal Literal Snapshot (Mainnet, May Change)

These are common values only. Treat as a convenience snapshot, not source of truth.

| Token | Type |
| --- | --- |
| SUI | `0x2::sui::SUI` |
| USDB | `0xe14726c336e81b32328e92afc37345d159f5b550b09fa92bd43640cfdd0a0cfd::usdb::USDB` |
| USDC | `0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC` |
| USDT | `0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT` |
| BUCK | `0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK` |
| sUSDB LP | `0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB` |

## When To Use Static Literals

Use static literals only when:
- user requests a documented literal string, or
- runtime access is not available.

Otherwise always resolve from live config.
