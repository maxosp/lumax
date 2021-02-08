import { setTokenForRefresh, setTokenForRequest } from '@/features/api/common/request'
import { loginFx } from '@/features/api/user/login'
import { LoginFxParams, LoginFxResponse } from '@/features/api/user/types'
import { navigateReplace } from '@/features/navigation'
import { loadSessionFx } from '@/features/session'
import { addToast } from '@/features/toasts/toasts.model'
import { createEffectorField } from '@/lib/effector/field-generator'
import { Response } from '@/lib/request'
import { isEmailValid } from '@/lib/validators/email'
import { attach, combine, createEvent, forward, guard, sample, split } from 'effector'
import { every } from 'patronum'

const loadCurrentSessionFx = attach({
  effect: loadSessionFx,
  mapParams: (params) => params,
})

const sendLoginFormFx = attach({
  effect: loginFx,
  mapParams: (params: LoginFxParams) => params,
})

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

export const $canSubmit = combine(
  $isFormValid,
  sendLoginFormFx.pending,
  loadCurrentSessionFx.pending,
  (formValid, loginPending, sessionPending) => formValid && !loginPending && !sessionPending
)

sample({
  clock: guard({ source: submitForm, filter: $canSubmit }),
  source: $form,
  target: sendLoginFormFx,
})

const { noInternetConnection } = split(sendLoginFormFx.failData, {
  noInternetConnection: ({ status }) => status === undefined,
})

const { userNotFound } = split(sendLoginFormFx.failData, {
  userNotFound: ({ status }) => status === 404 || status === 401,
})

export const $isLoading = combine(
  sendLoginFormFx.pending,
  loadCurrentSessionFx.pending,
  (loginPending, sessionPending) => loginPending || sessionPending
)

forward({
  from: sendLoginFormFx.doneData,
  to: [
    setTokenForRequest.prepend(({ body }: Response<LoginFxResponse>) => body.access),
    setTokenForRefresh.prepend(({ body }: Response<LoginFxResponse>) => body.refresh),
    loadCurrentSessionFx,
  ],
})
forward({
  from: loadCurrentSessionFx.doneData,
  to: [navigateReplace.prepend(() => ({ name: 'home' })), resetField],
})

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'error', message: 'Отсутствует подключение' })),
})

forward({
  from: userNotFound,
  to: addToast.prepend(() => ({
    type: 'error',
    message: 'Не удается войти. Неправильно указан е-mail или пароль.',
  })),
})
