export async function unwrapPromise<T>(value: T | Promise<T>): Promise<T> {
  return await Promise.resolve(value)
}
