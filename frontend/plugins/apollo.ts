import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core"

export default defineNuxtPlugin(() => {

  const apolloClient = new ApolloClient({

    link: new HttpLink({

      uri:
      "https://inviting-moray-87.hasura.app/v1/graphql",

      headers: {

        "x-hasura-admin-secret":
        "AeO8W5bJIyor6FDW3XdJ3clH2YlBtJPAX2MVKPnGraA5r42B7Du34uSQPHtiKeN3"

      }

    }),


    cache: new InMemoryCache()

  })


  return {

    provide: {

      apollo: apolloClient

    }

  }

})