export default async function resolvePendingPromises(): Promise<void> {
  await new Promise((resolve) => {
    process.nextTick(resolve);
  });
}
