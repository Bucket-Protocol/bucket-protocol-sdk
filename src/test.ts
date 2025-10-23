import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

import { BucketClient } from './client.js';

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
const bucketClient = new BucketClient({ suiClient });

const result = await bucketClient.getUserPositions({
  address: '0x26266b1381bcf03ab3acc37c1e87beffb52d49f345248bc3efb9114176990ae4',
});
console.log(result);
