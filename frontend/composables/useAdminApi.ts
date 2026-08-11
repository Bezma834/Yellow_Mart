import { useState } from "#app"
import gql from "graphql-tag"
import {
  GET_ADMIN_STATS,
  GET_ALL_CATEGORIES_ADMIN,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ADMIN_USERS,
  UPDATE_USER_ROLE,
  DELETE_USER,
  APPROVE_BUSINESS,
  REJECT_BUSINESS
} from "~/graphql/queries"
import { DELETE_BUSINESS } from "~/graphql/mutations"

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

const GET_ADMIN_BUSINESSES = (status?: string) => gql`
  query GetAdminBusinesses {
    businesses(
      ${status ? `where: { status: { _eq: "${status}" } }` : ""}
      order_by: { name: asc }
    ) {
      id
      name
      description
      phone
      address
      city
      image
      status
      featured
      views
      lat
      lng
      created_at
      category {
        name
      }
      owner {
        fullname
        email
      }
    }
  }
`

export const useAdminApi = () => {
  const loading = useState<boolean>("admin-api-loading", () => false)

  const getToken = (): string => {
    if (!import.meta.client) return ""
    return localStorage.getItem("token") || ""
  }

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    const token = getToken()

    if (!token) {
      const err: any = new Error("You must be logged in")
      err.status = 401
      throw err
    }

    loading.value = true

    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }

  const getStats = () =>
    run<AdminStats>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.query({ query: GET_ADMIN_STATS })
      return {
        businesses: data.businesses_aggregate.aggregate.count,
        pending: data.pending_businesses.aggregate.count,
        approved: data.approved_businesses.aggregate.count,
        rejected: data.rejected_businesses.aggregate.count,
        categories: data.categories_aggregate.aggregate.count,
        users: data.users_aggregate.aggregate.count,
        featured: data.featured_businesses.aggregate.count
      }
    })

  const getBusinesses = (status?: string) =>
    run<{ businesses: AdminBusiness[] }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.query({
        query: GET_ADMIN_BUSINESSES(status)
      })
      return {
        businesses: (data.businesses || []).map((b: any) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          phone: b.phone,
          address: b.address,
          city: b.city,
          image: b.image,
          status: b.status,
          featured: b.featured,
          views: b.views,
          lat: b.lat,
          lng: b.lng,
          created_at: b.created_at,
          category_name: b.category?.name ?? null,
          owner_name: b.owner?.fullname ?? null,
          owner_email: b.owner?.email ?? null
        }))
      }
    })

  const approveBusiness = (id: string) =>
    run<{ business: AdminBusiness }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: APPROVE_BUSINESS,
        variables: { id }
      })
      return { business: data.update_businesses_by_pk }
    })

  const rejectBusiness = (id: string) =>
    run<{ business: AdminBusiness }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: REJECT_BUSINESS,
        variables: { id }
      })
      return { business: data.update_businesses_by_pk }
    })

  const deleteBusiness = (id: string) =>
    run<{ deleted: boolean }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: DELETE_BUSINESS,
        variables: { id }
      })
      return { deleted: !!data.delete_businesses_by_pk }
    })

  const getCategories = () =>
    run<{ categories: AdminCategory[] }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.query({ query: GET_ALL_CATEGORIES_ADMIN })
      return {
        categories: (data.categories || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          business_count: c.businesses_aggregate?.aggregate?.count ?? 0
        }))
      }
    })

  const createCategory = (name: string, icon: string) =>
    run<{ category: AdminCategory }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: CREATE_CATEGORY,
        variables: { name, icon }
      })
      return { category: data.insert_categories_one }
    })

  const updateCategory = (id: string, name: string, icon: string) =>
    run<{ category: AdminCategory }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: UPDATE_CATEGORY,
        variables: { id, name, icon }
      })
      return { category: data.update_categories_by_pk }
    })

  const deleteCategory = (id: string) =>
    run<{ deleted: boolean }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: DELETE_CATEGORY,
        variables: { id }
      })
      return { deleted: !!data.delete_categories_by_pk }
    })

  const getUsers = (search?: string) =>
    run<{ users: AdminUser[] }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.query({
        query: GET_ADMIN_USERS,
        variables: { search: search ? `%${search}%` : "%%" }
      })
      return { users: data.users || [] }
    })

  const updateUserRole = (id: string, role: string) =>
    run<{ user: AdminUser }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: UPDATE_USER_ROLE,
        variables: { id, role }
      })
      return { user: data.update_users_by_pk }
    })

  const deleteUser = (id: string) =>
    run<{ deleted: boolean }>(async () => {
      const { $apollo } = useNuxtApp() as any
      const { data } = await $apollo.mutate({
        mutation: DELETE_USER,
        variables: { id }
      })
      return { deleted: !!data.delete_users_by_pk }
    })

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
