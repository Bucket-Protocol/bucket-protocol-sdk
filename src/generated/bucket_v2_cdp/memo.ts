/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from '@mysten/sui/transactions';
export interface ManageOptions {
    package?: string;
    arguments?: [
    ];
}
export function manage(options: ManageOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'manage',
    });
}
export interface DonateOptions {
    package?: string;
    arguments?: [
    ];
}
export function donate(options: DonateOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'donate',
    });
}
export interface LiquidateOptions {
    package?: string;
    arguments?: [
    ];
}
export function liquidate(options: LiquidateOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'liquidate',
    });
}
export interface InterestOptions {
    package?: string;
    arguments?: [
    ];
}
export function interest(options: InterestOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'memo',
        function: 'interest',
    });
}