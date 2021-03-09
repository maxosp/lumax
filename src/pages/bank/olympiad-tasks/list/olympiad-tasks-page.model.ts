import { getOlympiadTasksListFx } from '@/features/api/assignment/get-olympiad-tasks-list'
import { attach, createEvent, forward, restore } from 'effector-root'

const getOlympiadsTasksList = attach({
  effect: getOlympiadTasksListFx,
})
// export const deleteTag = attach({
//   effect: deleteTagFx,
//   mapParams: (params: number) => params,
// })

// export const deleteTags = attach({
//   effect: deleteTagsFx,
//   mapParams: (params: DeleteTagsType) => params,
// })

export const canrefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canrefreshTableAfterDeletionChanged,
  false
)

export const loadList = createEvent<any>()

forward({
  from: loadList,
  to: getOlympiadsTasksList,
})

// forward({
//   from: deleteTag.doneData,
//   to: [
//     loadTree.prepend(() => ({})),
//     addToast.prepend(() => ({ type: 'success', message: 'Тег был успешно удален!' })),
//     canrefreshTableAfterDeletionChanged.prepend(() => true),
//   ],
// })

// forward({
//   from: deleteTags.doneData,
//   to: [
//     loadTree.prepend(() => ({})),
//     addToast.prepend(() => ({ type: 'success', message: 'Теги были успешно удалены!' })),
//     canrefreshTableAfterDeletionChanged.prepend(() => true),
//   ],
// })

// const { noInternet } = split(
//   merge([deleteTagFx.failData, deleteTagsFx.failData, getOlympiadsTasksList.failData]),
//   { noInternet: ({ status }) => status === undefined }
// )

// forward({
//   from: noInternet,
//   to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
// })
