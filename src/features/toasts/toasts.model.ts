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
