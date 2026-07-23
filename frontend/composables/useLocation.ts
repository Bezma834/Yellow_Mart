export const useLocation = () => {
  const location = useState("location", () => "")

  const setLocation = (value: string) => {
    location.value = value
  }

  return { location, setLocation }
}