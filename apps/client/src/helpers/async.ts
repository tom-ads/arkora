export async function wrapAsync<T extends () => void>(promise: Promise<T>) {
  try {
    const response = await promise
    return { response, error: null }
  } catch (err) {
    return { response: null, err }
  }
}
