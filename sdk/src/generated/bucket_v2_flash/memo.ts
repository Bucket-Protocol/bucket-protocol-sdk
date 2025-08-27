/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from '@mysten/sui/transactions';
export interface FlashMintOptions {
    package?: string;
    arguments?: [
    ];
}
export function flashMint(options: FlashMintOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_flash';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'flash_mint',
    });
}