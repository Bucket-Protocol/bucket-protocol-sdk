export * from './transaction.js';
export * from './bucketConfig.js';
export * from './configAdapter.js';

export function splitIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}
