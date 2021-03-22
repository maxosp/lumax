export const createCounter = (prefix = '') => {
  let id = 0
  return {
    next: () => `${prefix}${++id}`,
    reset: () => (id = 0),
  }
}
