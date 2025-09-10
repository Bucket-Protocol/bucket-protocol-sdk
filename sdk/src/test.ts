import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
const bucketClient = new BucketClient({ suiClient });
