export const useTheme = () => {


  const darkMode = useState(
    "darkMode",
    () => false
  )



  const loadTheme = () => {


    if(!import.meta.client)
      return



    const saved =
      localStorage.getItem("darkMode")



    if(saved === "true"){

      darkMode.value = true

      document.documentElement.classList.add(
        "dark"
      )

    }

  }





  const toggleTheme = () => {


    darkMode.value =
      !darkMode.value



    if(import.meta.client){


      localStorage.setItem(
        "darkMode",
        String(darkMode.value)
      )



      document.documentElement.classList.toggle(
        "dark",
        darkMode.value
      )


    }


  }





  return {

    darkMode,

    toggleTheme,

    loadTheme

  }


}