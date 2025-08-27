/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from '@mysten/sui/transactions';
export interface SavingPoolOptions {
    package?: string;
    arguments?: [
    ];
}
export function savingPool(options: SavingPoolOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_saving_incentive';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'saving_pool',
    });
}