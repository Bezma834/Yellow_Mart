import { useState } from "#app"
import gql from "graphql-tag"

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

const LOGIN_MUTATION = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      username
      fullname
      email
      avatar
      phone
      bio
      role
    }
  }
}
`

const GOOGLE_LOGIN_MUTATION = gql`
mutation GoogleLogin($token: String!) {
  google_login(token: $token) {
    token
    user {
      id
      username
      fullname
      email
      avatar
      phone
      bio
      role
    }
  }
}
`

const extractError = (err: any) => {
  const combinedErrors = err?.errors
  if (Array.isArray(combinedErrors) && combinedErrors[0]?.message) {
    return combinedErrors[0].message
  }
  const gqlMessage = err?.graphQLErrors?.[0]?.message
  if (gqlMessage) return gqlMessage
  if (err?.networkError?.result?.errors?.[0]?.message) {
    return err.networkError.result.errors[0].message
  }
  if (err?.networkError?.message) {
    return "Network error. Please try again."
  }
  if (err?.message && err.message !== "Login failed") {
    return err.message
  }
  return "Login failed"
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

  // Login function (calls the Hasura login action)
  const login = async (identifier: string, password: string) => {
    if (loginInFlight) {
      return
    }

    loginInFlight = true
    loading.value = true

    try {
      const { $apollo } = useNuxtApp() as any

      const res = await $apollo.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          email: identifier,
          password
        }
      })

      const data = res.data.login

      applyAuth(data.token, data.user)

      return data
    } catch (err: any) {
      throw new Error(extractError(err))
    } finally {
      loading.value = false
      loginInFlight = false
    }
  }

  // Google login function (calls the Hasura google_login action)
  const googleLogin = async (googleToken: string) => {
    if (loginInFlight) {
      return
    }

    loginInFlight = true
    loading.value = true

    try {
      const { $apollo } = useNuxtApp() as any

      const res = await $apollo.mutate({
        mutation: GOOGLE_LOGIN_MUTATION,
        variables: {
          token: googleToken
        }
      })

      const data = res.data.google_login

      applyAuth(data.token, data.user)

      return data
    } catch (err: any) {
      throw new Error(extractError(err))
    } finally {
      loading.value = false
      loginInFlight = false
    }
  }

  const applyAuth = (authToken: string, authUser: User) => {
    const { __typename, ...cleanUser } = (authUser || {}) as any
    const storedUser = cleanUser as User

    if (import.meta.client) {
      localStorage.setItem("token", authToken)
      localStorage.setItem("user", JSON.stringify(storedUser))
    }

    token.value = authToken
    user.value = storedUser
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
    googleLogin,
    logout,
    checkAuth,
    applyAuth,
    updateUser
  }
}
