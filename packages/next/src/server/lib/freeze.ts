/**
 * Recursively freezes an object and all of its properties. This prevents the
 * object from being modified at runtime. When the JS runtime is running in
 * strict mode, any attempts to modify a frozen object will throw an error.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 * @param obj The object to freeze.
 */
export function freeze(obj: object): void {
  // `null` is an object, if we get this, we should just return it.
  if (obj === null) return

  // An array is an object, but we also want to freeze each element in the array
  // as well.
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (!item || typeof item !== 'object') continue
      freeze(item)
    }

    Object.freeze(obj)
    return
  }

  for (const name of Object.keys(obj)) {
    const value = obj[name as keyof typeof obj]

    if (!value || typeof value !== 'object') continue
    freeze(value)
  }

  Object.freeze(obj)
  return
}
