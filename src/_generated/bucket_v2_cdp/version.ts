/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from '@mysten/sui/transactions';
export interface PackageVersionOptions {
    package?: string;
    arguments?: [
    ];
}
/** Public Funs */
export function packageVersion(options: PackageVersionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/bucket_v2_cdp';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'version',
        function: 'package_version',
    });
}