import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"

export default defineNuxtPlugin(() => {

  const config = useRuntimeConfig()

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-hasura-admin-secret": config.public.hasuraSecret || ""
      }
    }
  })

  const apolloClient = new ApolloClient({

    link: authLink.concat(new HttpLink({
      uri: config.public.hasuraUrl
    })),

    cache: new InMemoryCache()

  })

  return {
    provide: {
      apollo: apolloClient
    }
  }

})