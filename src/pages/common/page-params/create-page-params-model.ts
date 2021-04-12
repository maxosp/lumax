import { combine, createEvent, createStore, restore } from 'effector-root'
import { parseToPrimitive } from '@/features/lib'
import { Dictionary } from 'vue-router/types/router'

export const createPageParamsModel = () => {
  const manageableParamsAndType = { currentPage: 'number', treeView: 'boolean' }
  const queryToParams = createEvent<Dictionary<string | (string | null)[]>>()
  const changePage = createEvent<number | string>()
  const currentPage = createStore(1).on(changePage, (state, payload): number => {
    let nextPage = state
    if (payload === 'next') nextPage = state + 1
    if (payload === 'prev') nextPage = state - 1
    if (typeof payload === 'number') nextPage = payload
    return nextPage
  })
  const toggleTreeView = createEvent<boolean>()
  const treeView = restore(toggleTreeView, false)

  const $pageParams = combine({ treeView, currentPage }).on(
    queryToParams,
    (state, params: Dictionary<string | (string | null)[]>) => {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const convertedParam = parseToPrimitive(params[key])
          if (
            convertedParam !== state[key] &&
            manageableParamsAndType[key] &&
            typeof convertedParam === manageableParamsAndType[key]
          ) {
            switch (key) {
              case 'treeView':
                toggleTreeView(<boolean>convertedParam)
                break
              case 'currentPage':
                changePage(<number>convertedParam)
                break
              default:
                break
            }
          }
        }
      }
    }
  )

  return {
    store: {
      $pageParams,
      treeView,
      currentPage,
    },
    methods: {
      queryToParams,
      toggleTreeView,
      changePage,
    },
  }
}
