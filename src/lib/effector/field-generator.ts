/* selint-disable */
import { combine, createEvent, createStore, Event, restore, Store } from 'effector-root'
import { delay } from 'patronum/delay'

type Options<T, R, E = string | null> = {
  defaultValue: T
  validator?: (value: R) => E
  validatorEnhancer?: (store: Store<T>) => Store<R>
  eventMapper?: (event: Event<T>) => Event<T>
  reset?: Event<any>
}

/**
 * @param options
 * @example Создание простого поля
 * const [$email, emailChanged, $emailError, $isEmailCorrect] = createEffectorField({
 *   defaultValue: ''
 * })
 */
export const createEffectorField = <T, R = T, E = string | null>(
  options: Options<T, R, E>
): [Store<T>, Event<T>, Store<E | null>, Store<boolean>] => {
  // set default options
  const eventMapper = options.eventMapper || ((e) => e)
  const validatorEnhancer =
    options.validatorEnhancer || ((store: Store<T>): Store<R> => store as unknown as Store<R>)
  const validator = options.validator || (() => null)

  const changeEvent = createEvent<T>()
  const $store = restore(eventMapper(changeEvent), options.defaultValue)

  const $isDirty = createStore(false).on($store, () => true)
  const $error = validatorEnhancer($store).map(validator)
  const $isCorrect = $error.map((value) => {
    if (Array.isArray(value)) return value.length === 0

    return !value
  })

  // show error message when field is dirty
  const $errorMessage = combine(
    $error,
    $isDirty,
    $store,
    (error, isDirty) => (isDirty && error) || null
  )

  if (options.reset) {
    $store.reset(options.reset)
    $isDirty.reset(delay({ source: options.reset, timeout: 1 }))
    $errorMessage.reset(options.reset)
  }

  return [$store, changeEvent, $errorMessage, $isCorrect]
}
