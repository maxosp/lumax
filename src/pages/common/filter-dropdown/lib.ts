export function findItem(id: string, arr: any) {
  if (+id === 0) return
  let res: any = arr.find((el: any) => {
    return el.id === +id
  })
  for (let i = 0; i < arr.length && res === undefined; i++) {
    if (arr[i].leaves && arr[i].leaves.length) res = findItem(id, arr[i].leaves)
  }
  return res
}
