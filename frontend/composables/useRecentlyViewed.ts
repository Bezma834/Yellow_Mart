export const useRecentlyViewed = () => {


  const recentBusinesses = useState<any[]>(
    "recentBusinesses",
    () => []
  )



  const loadRecentBusinesses = () => {


    if(!import.meta.client)
      return



    const saved =
      localStorage.getItem(
        "recentBusinesses"
      )



    if(saved){

      recentBusinesses.value =
        JSON.parse(saved)

    }


  }




  const addRecentlyViewed = (
    business:any
  ) => {



    if(!import.meta.client)
      return




    const filtered =

      recentBusinesses.value.filter(

        item =>
          item.id !== business.id

      )



    recentBusinesses.value = [

      business,

      ...filtered

    ].slice(0,6)




    localStorage.setItem(

      "recentBusinesses",

      JSON.stringify(
        recentBusinesses.value
      )

    )


  }




  return {

    recentBusinesses,

    loadRecentBusinesses,

    addRecentlyViewed

  }


}