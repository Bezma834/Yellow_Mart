import {
  GET_ALL_BUSINESSES,
  GET_FEATURED_BUSINESSES
} from "~/graphql/queries"


export const fetchBusinesses = async(
  featured = false
)=>{

  const { $apollo } =
  useNuxtApp() as any


  try {

    const result =
    await $apollo.query({

      query: featured
        ? GET_FEATURED_BUSINESSES
        : GET_ALL_BUSINESSES,

      fetchPolicy:"network-only"

    })


    return result.data.businesses || []


  } catch(error){

    console.error(
      "Hasura error:",
      error
    )

    return []

  }

}