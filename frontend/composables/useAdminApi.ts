import { useState } from "#app"

interface AdminStats {
  businesses: number
  pending: number
  approved: number
  rejected: number
  categories: number
  users: number
  featured: number
}

interface AdminBusiness {
  id: string
  name: string
  description: string | null
  phone: string | null
  address: string | null
  city: string | null
  image: string | null
  status: string
  featured: boolean
  views: number
  lat: number | null
  lng: number | null
  created_at: string
  category_name: string | null
  owner_name: string | null
  owner_email: string | null
}

interface AdminCategory {
  id: string
  name: string
  icon: string
  business_count: number
}

interface AdminUser {
  id: string
  username: string
  fullname: string
  email: string
  avatar: string | null
  phone: string | null
  role: string
  created_at: string
}

const adminError = (status: number, message: string): Error => {
  const err = new Error(message)
  ;(err as any).status = status
  return err
}

export const useAdminApi = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.backendUrl}/admin`
  const loading = useState<boolean>("admin-api-loading", () => false)

  const getToken = (): string => {
    if (!import.meta.client) return ""
    return localStorage.getItem("token") || ""
  }

  const request = async <T>(
    path: string,
    options: { method?: string; body?: unknown } = {}
  ): Promise<T> => {
    const token = getToken()

    if (!token) {
      throw adminError(401, "You must be logged in")
    }

    loading.value = true

    try {
      const res = await fetch(`${base}${path}`, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw adminError(res.status, data.error || data.message || "Request failed")
      }

      return data as T
    } finally {
      loading.value = false
    }
  }

  const getStats = () => request<AdminStats>("/stats")

  const getBusinesses = (status?: string) =>
    request<{ businesses: AdminBusiness[] }>(
      `/businesses${status ? `?status=${encodeURIComponent(status)}` : ""}`
    )

  const approveBusiness = (id: string) =>
    request<{ business: AdminBusiness }>(`/businesses/${id}/approve`, { method: "PATCH" })

  const rejectBusiness = (id: string) =>
    request<{ business: AdminBusiness }>(`/businesses/${id}/reject`, { method: "PATCH" })

  const deleteBusiness = (id: string) =>
    request<{ deleted: boolean }>(`/businesses/${id}`, { method: "DELETE" })

  const getCategories = () =>
    request<{ categories: AdminCategory[] }>("/categories")

  const createCategory = (name: string, icon: string) =>
    request<{ category: AdminCategory }>("/categories", {
      method: "POST",
      body: { name, icon }
    })

  const updateCategory = (id: string, name: string, icon: string) =>
    request<{ category: AdminCategory }>(`/categories/${id}`, {
      method: "PATCH",
      body: { name, icon }
    })

  const deleteCategory = (id: string) =>
    request<{ deleted: boolean }>(`/categories/${id}`, { method: "DELETE" })

  const getUsers = (search?: string) =>
    request<{ users: AdminUser[] }>(
      `/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
    )

  const updateUserRole = (id: string, role: string) =>
    request<{ user: AdminUser }>(`/users/${id}/role`, {
      method: "PATCH",
      body: { role }
    })

  const deleteUser = (id: string) =>
    request<{ deleted: boolean }>(`/users/${id}`, { method: "DELETE" })

  return {
    loading,
    getStats,
    getBusinesses,
    approveBusiness,
    rejectBusiness,
    deleteBusiness,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getUsers,
    updateUserRole,
    deleteUser
  }
}
