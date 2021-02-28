import { attach, createEvent, forward, merge, restore, split } from 'effector-root'
import { getThemesTreeFx } from '@/features/api/subject/get-themes-tree'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'

const getTasksTree = attach({
  effect: getThemesTreeFx, // TO DO
})

// export const deleteTask = attach({ // TO DO
//   effect: deleteTaskFx,
// })

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const setTasksTree = createEvent<TreeData | null>()
export const $tasksTree = restore<TreeData | null>(setTasksTree, null)
export const setTasksTreeTotal = createEvent<number>()
export const $tasksTreeTotal = restore<number>(setTasksTreeTotal, 0)

forward({
  from: loadTree,
  to: getTasksTree,
})

forward({
  from: getTasksTree.doneData,
  to: [
    setTasksTree.prepend((res) => res.body.data),
    setTasksTreeTotal.prepend((res) => res.body.total),
  ],
})

// forward({
//   from: deleteTask.doneData,
//   to: [
//     loadTree.prepend(() => ({})),
//     addToast.prepend(() => ({ type: 'success', message: 'Задание была успешно удалено!' })),
//   ],
// })

const { noInternet } = split(merge([getTasksTree.failData]), {
  noInternet: ({ status }) => status === undefined,
})

forward({
  from: noInternet,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})
