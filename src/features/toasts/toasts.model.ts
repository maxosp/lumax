import { createApi, createEffect, createStore, forward } from 'effector-root'

export type Toast = {
  type: 'error' | 'success' | 'loading' | 'no-internet'
  message: string
  duration?: number
}

const wait = (ms: number) => new Promise((rs) => setTimeout(rs, ms))

const toastTimeoutRemoveFx = createEffect({
  handler: async (toast: Toast) => {
    await wait(toast.duration || 3000)
    return toast
  },
})

export const $toasts = createStore<Toast[]>([])

export const { addToast, removeToast } = createApi($toasts, {
  addToast: (toasts, toast: Toast) => [toast, ...toasts],
  removeToast: (toasts, toast: Toast) => toasts.filter((item) => item !== toast),
})

forward({
  from: addToast,
  to: toastTimeoutRemoveFx,
})

forward({
  from: toastTimeoutRemoveFx.doneData,
  to: removeToast,
})

export const errorToastEvent = (message: string) =>
  addToast.prepend(() => ({
    type: 'error',
    message,
  }))

export const successToastEvent = (message: string) =>
  addToast.prepend(() => ({
    type: 'success',
    message,
  }))

export const loadingToastEvent = (message: string) =>
  addToast.prepend(() => ({
    type: 'loading',
    message,
  }))

export const noInternetToastEvent = () =>
  addToast.prepend(() => ({
    type: 'no-internet',
    message: 'Отсутствует подключение',
  }))
