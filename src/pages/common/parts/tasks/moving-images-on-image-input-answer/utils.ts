export const createCounter = () => {
  let counter = 0
  return {
    next: () => ++counter,
    set: (newCounter: number) => (counter = newCounter),
    reset: () => (counter = 0),
    prev: () => --counter,
  }
}

export const getMax = (numbers: number[]) =>
  numbers.length > 0 ? Math.max.apply(null, numbers) : 0
export const getMaxByProp = <T>(arr: T[], prop: keyof T) => getMax(arr.map((item) => +item[prop]))
