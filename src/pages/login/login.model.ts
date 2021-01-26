import { navigateReplace } from '@/features/navigation'
import { createEffectorField } from '@/lib/effector/field-generator'
import { isEmailValid } from '@/lib/validators/email'
import { combine, createEvent, forward } from 'effector'
import { every } from 'patronum'

// const sendLoginFormFx = attach({
//   effect: loginFx,
//   mapParams: (params: LoginFxParams) => params,
// })

const resetField = createEvent()
export const submitForm = createEvent()

export const [$email, emailChanged, $emailError, $isEmailCorrect] = createEffectorField({
  defaultValue: '',
  validator: (value: string) => (isEmailValid(value) ? null : 'Неверный формат email'),
  reset: resetField,
})

export const [$password, passwordChanged, $passwordError, $isPasswordCorrect] = createEffectorField(
  {
    defaultValue: '',
    validator: (value: string) => (value.length > 0 ? null : 'Это поле не может быть пустым'),
    reset: resetField,
  }
)

export const $form = combine({
  email: $email,
  password: $password,
})
export const $errors = combine({
  email: $emailError,
  password: $passwordError,
})

export const $isFormValid = every({
  predicate: true,
  stores: [$isEmailCorrect, $isPasswordCorrect],
})

// const { noInternetConnection } = split(sendLoginFormFx.failData, {
//   noInternetConnection: ({ status }) => status === undefined,
// })

// const { userNotFound } = split(sendLoginFormFx.failData, {
//   userNotFound: ({ status }) => status === 400,
// })

forward({
  from: submitForm,
  to: [navigateReplace.prepend(() => ({ name: 'home' })), resetField],
})

// forward({
//   from: noInternetConnection,
//   to: addToast.prepend(() => ({ type: 'error', message: 'Отсутствует подключение' })),
// })

// forward({
//   from: userNotFound,
//   to: addToast.prepend(() => ({
//     type: 'error',
//     message: 'Не удается войти. Неправильно указан е-mail или пароль.',
//   })),
// })
