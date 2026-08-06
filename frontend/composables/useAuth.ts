import { useState } from "#app"

interface User {
  id: string
  username: string
  fullname: string
  email: string
  avatar?: string | null
  role?: string
  phone?: string | null
  bio?: string | null
}

export const useAuth = () => {
  const user = useState<User | null>("auth_user", () => null)
  const token = useState<string | null>("auth_token", () => null)
  const loading = useState<boolean>("auth_loading", () => false)

  // In-flight guard: prevents the login request from being fired twice
  // (e.g. double-click on the submit button before the disabled state applies).
  let loginInFlight = false

  // Load saved login data
  const checkAuth = () => {
    if (!import.meta.client) return

    try {
      const savedToken = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")

      if (savedToken) {
        token.value = savedToken
      }

      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    } catch {
      // Corrupt stored data - treat as logged out rather than crashing
      localStorage.removeItem("user")
      user.value = null
    }
  }

  // Login function
  const login = async (identifier: string, password: string) => {
    if (loginInFlight) {
      return
    }

    loginInFlight = true
    loading.value = true

    try {
      const res = await $fetch<{
        token: string
        user: User
      }>(
        "https://yellow-mart-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          body: {
            email: identifier,
            password
          },
          timeout: 30000
        }
      )

      applyAuth(res.token, res.user)

      return res
    } catch (err: any) {
      throw new Error(
        err.data?.message ||
        "Login failed"
      )
    } finally {
      loading.value = false
      loginInFlight = false
    }
  }

  const applyAuth = (authToken: string, authUser: User) => {
    if (import.meta.client) {
      localStorage.setItem("token", authToken)
      localStorage.setItem("user", JSON.stringify(authUser))
    }

    token.value = authToken
    user.value = authUser
  }

  // Update user information
  const updateUser = (updatedUser: User) => {
    user.value = updatedUser

    if (import.meta.client) {
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  // Logout
  const logout = () => {
    if (import.meta.client) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }

    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
    applyAuth,
    updateUser
  }
}
