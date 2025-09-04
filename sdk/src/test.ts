import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

import { BucketClient } from './client';

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
const bucketClient = new BucketClient({ suiClient });

const reward = await bucketClient.getAllSavingPoolObjects();
console.log(reward);
