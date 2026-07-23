import { useRuntimeConfig } from '#app'

export const useGraphql = () => {
  const config = useRuntimeConfig()

  const request = async (query: string, variables = {}) => {
    return await $fetch(config.public.hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
  }

  return { request }
}