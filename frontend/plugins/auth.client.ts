export default defineNuxtPlugin(() => {


  const { checkAuth } = useAuth()


  checkAuth()


})