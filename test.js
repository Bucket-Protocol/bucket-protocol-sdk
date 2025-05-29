import { BucketClient } from './sdk/dist/index.js';

const bucketClient = new BucketClient();
const positions = await bucketClient.getUserBottles(
  '0x95b0ce9775382b88a4e698d31a0a7fd796922c91bb80de66e940bd4cae5a9916',
);
console.log(positions);
