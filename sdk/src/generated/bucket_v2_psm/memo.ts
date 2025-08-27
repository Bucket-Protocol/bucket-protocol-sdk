/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from '@mysten/sui/transactions';
export interface SwapInOptions {
    package?: string;
    arguments?: [
    ];
}
export function swapIn(options: SwapInOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'swap_in',
    });
}
export interface SwapOutOptions {
    package?: string;
    arguments?: [
    ];
}
export function swapOut(options: SwapOutOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_psm';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'swap_out',
    });
}