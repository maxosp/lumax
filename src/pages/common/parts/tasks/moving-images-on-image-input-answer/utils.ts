export const createCounter = () => {
  let counter = 0
  return {
    next: () => ++counter,
    set: (newCounter: number) => (counter = newCounter),
    reset: () => (counter = 0),
  }
}

export const getMax = (numbers: number[]) => Math.max.apply(null, numbers)
export const getMaxByProp = <T>(arr: T[], prop: keyof T) => getMax(arr.map((item) => +item[prop]))
