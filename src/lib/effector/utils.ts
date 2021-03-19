import { Effect } from 'effector'
import { some } from 'patronum'
import { createEvent, Store } from 'effector-root'

export const somePending = (stores: Effect<any, any, any>[]) =>
  some({
    predicate: (pending) => !!pending,
    stores: stores.map((store) => store.pending),
  })

export const createReplaceEventForArrayStore = <T>(
  $store: Store<T[]>,
  replaceKey: keyof Required<T>
) => {
  const event = createEvent<T>()
  $store.on(event, (array, newItem) => {
    const index = array.findIndex((item) => item[replaceKey] === newItem[replaceKey])
    if (index !== -1) {
      const newArray = [...array]
      newArray.splice(index, 1, newItem)
      return newArray
    }
    return array
  })
  return event
}

export const createRemoveEventForArrayStore = <T>(
  $store: Store<T[]>,
  replaceKey: keyof Required<T>
) => {
  const event = createEvent<T>()
  $store.on(event, (array, removedItem) => {
    const index = array.findIndex((item) => item[replaceKey] === removedItem[replaceKey])
    if (index !== -1) {
      const newArray = [...array]
      newArray.splice(index, 1)
      return newArray
    }
    return array
  })
  return event
}

type CreateAddInArrayEventFactory<T> = () => T

export const createAddEventForArrayStore = <T>(
  $store: Store<T[]>,
  factory: CreateAddInArrayEventFactory<T>
) => {
  const event = createEvent<T>()
  $store.on(event, (items) => [...items, factory()])
  return event
}
