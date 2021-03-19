export const computeSortParam = (sortParam: string) => {
  if (!sortParam) return ''
  const [field, order] = sortParam.split('|')
  const sign = order === 'desc' ? '-' : ''
  return `${sign}${field}`
}

export const removeHtmlTags = (str: string) => {
  return str.replace(new RegExp('<[^>]*>', 'g'), '').replace(new RegExp('&[a-z]*;', 'g'), ' ')
}
