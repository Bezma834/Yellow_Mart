export default defineNuxtRouteMiddleware((to) => {

  if (!import.meta.client) return


  const user = localStorage.getItem("user")


  if (!user) {

    return navigateTo("/login")

  }


  const parsedUser = JSON.parse(user)


  if (parsedUser.role?.trim() !== "admin") {

    return navigateTo("/")

  }

})