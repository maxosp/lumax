export const getRandomId = (): number => Number.parseInt(`${Math.random() * 1000}`, 10)

export const getInputsIds = (arr: string[]) => {
  const idsString = arr.map((input) => input.match(/id="(\d+)"/g))
  return idsString.map((input) => input![0].match(/\d/g)![0])
}

export const getArraysDiff = (a1: Array<any>, a2: Array<any>) => {
  const a = []
  const diff = []

  for (let i = 0; i < a1.length; i++) {
    a[a1[i]] = true
  }

  for (let i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]]
    } else {
      a[a2[i]] = true
    }
  }

  // eslint-disable-next-line
  for (const k in a) {
    diff.push(k)
  }

  return diff
}
