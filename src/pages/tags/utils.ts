export function formatTagTitle(total: number) {
  let title = 'тегов'
  const lastDigit = `${total}`.slice(-1)
  const lastTwoDigit = `${total}`.slice(-2)
  if (lastDigit === '1' && lastTwoDigit !== '11') title = 'тег'
  else if (['2', '3', '4'].includes(lastDigit)) title = 'тега'
  return `${total} ${title}`
}
