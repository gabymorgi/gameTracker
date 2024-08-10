export function getBatches<T>(
  values: Array<T>,
  batch_size = 500,
): Array<Array<T>> {
  const batches: Array<Array<T>> = [];
  for (let i = 0; i < values.length; i += batch_size) {
    batches.push(values.slice(i, i + batch_size));
  }
  // if last batch is lessthan 10% of batch_size, merge it with the previous batch
  if (batches.length > 1) {
    const lastBatch = batches[batches.length - 1];
    const lastBatchSize = lastBatch.length;
    const previousBatch = batches[batches.length - 2];
    if (lastBatchSize < batch_size * 0.1) {
      previousBatch.push(...lastBatch);
      batches.pop();
    }
  }
  return batches;
}
