import { DropdownItem } from '@/pages/common/types'

export function findItem(id: string, arr: any) {
  if (+id === 0) return
  let res: DropdownItem | undefined = arr.find((el: DropdownItem) => el.id === +id)
  for (let i = 0; i < arr.length && res === undefined; i++) {
    if (arr[i].leaves && arr[i].leaves.length) res = findItem(id, arr[i].leaves)
  }
  return res
}
