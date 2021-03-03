export const computeSortParam = (sortParam: string) => {
  if (!sortParam) return ''
  const [field, order] = sortParam.split('|')
  const sign = order === 'desc' ? '-' : ''
  return `${sign}${field}`
}

export const formatTotalAmount = (total: number) => {
  if (total.toString().length < 4) return total
  let res = total.toString().split('').reverse()
  res = res.map((el, index) => (index % 3 === 0 ? `${el} ` : `${el}`))
  return res.reverse().join('')
}
