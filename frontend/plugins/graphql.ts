import { print } from "graphql"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const endpoint = `${config.public.backendUrl}/graphql`

  const getToken = () => {
    if (!import.meta.client) return null
    return localStorage.getItem("token")
  }

  // Minimal $apollo-compatible client backed by the backend GraphQL proxy.
  // Sends only the user's JWT (never the Hasura admin secret).
  const request = async (document: any, variables: any) => {
    const token = getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    }
    if (token) headers.Authorization = `Bearer ${token}`

    let res: any
    try {
      res = await $fetch(endpoint, {
        method: "POST",
        headers,
        body: {
          query: print(document),
          variables: variables || {}
        }
      })
    } catch (err: any) {
      const errBody = err?.data
      const gqlMessage = errBody?.errors?.[0]?.message
      const error: any = new Error(gqlMessage || err?.message || "Network error")
      if (errBody?.errors) error.graphQLErrors = errBody.errors
      error.networkError = { message: error.message, result: errBody }
      throw error
    }

    if (res?.errors?.length) {
      const error: any = new Error(res.errors[0]?.message || "GraphQL error")
      error.graphQLErrors = res.errors
      error.networkError = { result: res }
      throw error
    }

    return { data: res?.data }
  }

  return {
    provide: {
      apollo: {
        query: (opts: any) => request(opts.query, opts.variables),
        mutate: (opts: any) => request(opts.mutation, opts.variables)
      }
    }
  }
})
