export type ToastType = "success" | "error" | "info"

interface Toast {
  id: number
  type: ToastType
  message: string
}

const toasts = ref<Toast[]>([])
let nextId = 0

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

const pushToast = (type: ToastType, message: string) => {
  const id = ++nextId
  toasts.value.push({ id, type, message })
  setTimeout(() => removeToast(id), 4000)
}

export const useToast = () => {
  const success = (message: string) => pushToast("success", message)
  const error = (message: string) => pushToast("error", message)
  const info = (message: string) => pushToast("info", message)

  return {
    toasts,
    success,
    error,
    info,
    removeToast
  }
}
