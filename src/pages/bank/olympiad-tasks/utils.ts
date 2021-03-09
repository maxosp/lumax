import { formatTotalAmount } from '@/pages/dictionary/themes/list/utils'

export function formatTasksTitle(total: number) {
  let title = 'заданий'
  const lastDigit = `${total}`.slice(-1)
  const lastTwoDigit = `${total}`.slice(-2)
  if (lastDigit === '1' && lastTwoDigit !== '11') title = 'задание'
  else if (['2', '3', '4'].includes(lastDigit)) title = 'задания'
  return `${formatTotalAmount(total)} ${title}`
}
