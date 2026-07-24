export const useApi = () => {
 const baseURL = "https://yellow-mart-backend.onrender.com/api"

  // GET request
  const get = async (url: string) => {
    try {
      return await $fetch(baseURL + url)
    } catch (err) {
      console.error("GET error:", err)
      throw err
    }
  }

  // POST request
  const post = async (url: string, body: any) => {
    try {
      return await $fetch(baseURL + url, {
        method: "POST",
        body
      })
    } catch (err) {
      console.error("POST error:", err)
      throw err
    }
  }

  // PATCH request
  const patch = async (url: string, body: any) => {
    try {
      return await $fetch(baseURL + url, {
        method: "PATCH",
        body
      })
    } catch (err) {
      console.error("PATCH error:", err)
      throw err
    }
  }

  // DELETE request
  const del = async (url: string) => {
    try {
      return await $fetch(baseURL + url, {
        method: "DELETE"
      })
    } catch (err) {
      console.error("DELETE error:", err)
      throw err
    }
  }

  return {
    get,
    post,
    patch,
    del
  }
}