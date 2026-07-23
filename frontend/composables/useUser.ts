import { computed } from "vue"
import { useAuth } from "./useAuth"

export const useUser = () => {
  const { user } = useAuth()

  const role = computed(() => {
    return user.value?.role || "guest"
  })

  return {
    user,
    role
  }
}