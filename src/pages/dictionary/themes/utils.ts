export function formatThemeTitle(total: number) {
  let title = 'тем'
  const lastDigit = `${total}`.slice(-1)
  if (lastDigit === '1') {
    title = 'тема'
  } else if (['2', '3', '4'].includes(lastDigit)) {
    title = 'темы'
  }
  return `${total} ${title}`
}
