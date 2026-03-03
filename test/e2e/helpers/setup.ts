import { SuiGrpcClient } from '@mysten/sui/grpc';

import { BucketClient } from '../../../src/client.js';

export const MAINNET_TIMEOUT_MS = 20_000;
export const network = 'mainnet';
export const testAccount = '0x7a718956581fbe4a568d135fef5161024e74af87a073a1489e57ebef53744652';

const suiClient = new SuiGrpcClient({ network, baseUrl: 'https://fullnode.mainnet.sui.io:443' });
const bucketClient = new BucketClient({ suiClient, network });

export { suiClient, bucketClient };
export const usdbCoinType = bucketClient.getUsdbCoinType();
export const usdcCoinType = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
export const susdbLpType = '0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB';
