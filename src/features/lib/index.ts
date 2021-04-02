import { TreeData } from '@/features/api/types'

const wordDeclination = (total: number, words: string[]) => {
  /*
   Порядок слов для массива words:
     1. Слово под нулевым индексом для чисел заканчивающихся на один, но не на 11.
     2. Слово под индексом один для чисел заканчивающихся на числа от 2-4, но где последние 2 цифры не
      находятся в диапазоне от 10 до 20 включительно.
     3. Слово под индексом два для всех оставшихся чисел.
  */
  if (total % 10 === 1 && total % 100 !== 11) {
    return words[0]
  }
  if (total % 10 >= 2 && total % 10 <= 4 && (total % 100 < 10 || total % 100 >= 20)) {
    return words[1]
  }
  return words[2]
}

const formatTotalAmount = (total: number) => {
  if (total.toString().length < 4) return total
  let res = total.toString().split('').reverse()
  res = res.map((el, index) => (index % 3 === 0 ? `${el} ` : `${el}`))
  return res.reverse().join('')
}

const formatTitleDecorator = (words: string[]) => {
  return function (total: number) {
    return `${formatTotalAmount(total)} ${wordDeclination(total, words)}`
  }
}

export { formatTotalAmount }
/* Важен порядок передаваемых слов, подробнее об этом в функции wordDeclination */
export const formatThemesTitle = formatTitleDecorator(['тема', 'темы', 'тем'])
export const formatTasksTitle = formatTitleDecorator(['задание', 'задания', 'заданий'])
export const formatTagsTitle = formatTitleDecorator(['тег', 'тега', 'тегов'])

export const sortTreeLeaves = (leaves: TreeData[]) => {
  return leaves.sort((a: TreeData, b: TreeData) => a.ordering_number - b.ordering_number)
}

export const mergeTreeData = (oldData: TreeData[], newData: TreeData[]) => {
  const res = oldData.map((el, index) => {
    const i = newData.every((d) => d.element_type === 'study_year' || d.element_type === 'subject')
      ? 0
      : index
    const nData = newData[i]
    if (nData === undefined) return el
    if (el[el.element_type].id === nData[nData.element_type].id) {
      if (el.leaves.length) mergeTreeData(el.leaves, nData.leaves)
      else el.leaves = nData.leaves
    }
    return el
  })
  return res
}
