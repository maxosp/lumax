export const computeSortParam = (sortParam: string) => {
  if (!sortParam) return ''
  const [field, order] = sortParam.split('|')
  const sign = order === 'desc' ? '-' : ''
  return `${sign}${field}`
}
