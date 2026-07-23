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


  const user = useState<User | null>(

    "auth_user",

    () => null

  )



  const token = useState<string | null>(

    "auth_token",

    () => null

  )



  const loading = useState<boolean>(

    "auth_loading",

    () => false

  )




  // Load saved login data

  const checkAuth = () => {


    if (!import.meta.client) return



    const savedToken = localStorage.getItem("token")

    const savedUser = localStorage.getItem("user")




    if (savedToken) {

      token.value = savedToken

    }




    if (savedUser) {

      user.value = JSON.parse(savedUser)

    }


  }





  // Login function

  const login = async (

    identifier: string,

    password: string

  ) => {


    loading.value = true



    try {



      const res = await $fetch<{

        token: string

        user: User


      }>(


        "http://localhost:5000/api/auth/login",


        {


          method: "POST",


          body: {


            email: identifier,

            password


          }


        }


      )




      localStorage.setItem(

        "token",

        res.token

      )




      localStorage.setItem(

        "user",

        JSON.stringify(res.user)

      )




      token.value = res.token


      user.value = res.user




      return res



    }



    catch (err: any) {


      throw new Error(

        err.data?.message ||

        "Login failed"

      )


    }



    finally {


      loading.value = false


    }


  }







  // Update user information

  const updateUser = (

    updatedUser: User

  ) => {



    user.value = updatedUser




    if (import.meta.client) {


      localStorage.setItem(

        "user",

        JSON.stringify(updatedUser)

      )


    }


  }







  // Logout

  const logout = () => {



    if (import.meta.client) {


      localStorage.removeItem(

        "token"

      )


      localStorage.removeItem(

        "user"

      )


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


    updateUser


  }



}