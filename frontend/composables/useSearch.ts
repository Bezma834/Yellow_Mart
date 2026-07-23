export const useSearch = () => {
  const suggestions = ref<string[]>([])

  const getSuggestions = (query: string, list: any[]) => {
    if (!query) return []

    return list
      .filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(b => b.name)
      .slice(0, 5)
  }

  return { suggestions, getSuggestions }
}