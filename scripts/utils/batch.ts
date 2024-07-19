export function getBatches<T>(
  values: Array<T>,
  batch_size = 500,
): Array<Array<T>> {
  const batches: Array<Array<T>> = [];
  for (let i = 0; i < values.length; i += batch_size) {
    batches.push(values.slice(i, i + batch_size));
  }
  return batches;
}
