export const useGeo = () => {
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
        err => reject(err)
      )
    })
  }

  return { getUserLocation }
}