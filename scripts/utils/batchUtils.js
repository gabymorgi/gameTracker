export function getBatches(values, batch_size = 500) {
  const batches = [];
  for (let i = 0; i < values.length; i += batch_size) {
    batches.push(values.slice(i, i + batch_size));
  }
  return batches;
}
