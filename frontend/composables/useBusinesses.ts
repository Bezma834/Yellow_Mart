import {
  GET_ALL_BUSINESSES,
  GET_FEATURED_BUSINESSES
} from "~/graphql/queries"

import { ref } from "vue"


// Fetch businesses from Hasura
export const fetchBusinesses = async (
  featured = false
) => {

  const { $apollo } = useNuxtApp() as any

  try {

    const result = await $apollo.query({

      query: featured
        ? GET_FEATURED_BUSINESSES
        : GET_ALL_BUSINESSES,

      fetchPolicy: "network-only"

    })


    return result.data.businesses || []


  } catch (error) {

    console.error(
      "Hasura error:",
      error
    )

    return []

  }

}


// Reusable businesses composable
export const useBusinesses = () => {

  const businesses = ref<any[]>([])

  const loading = ref(false)

  const error = ref<string | null>(null)


  const loadBusinesses = async (
    featured = false
  ) => {

    loading.value = true
    error.value = null


    try {

      businesses.value = await fetchBusinesses(
        featured
      )


    } catch (err: any) {

      error.value = err.message || "Failed to load businesses"


    } finally {

      loading.value = false

    }

  }


  return {

    businesses,

    loading,

    error,

    loadBusinesses

  }

}