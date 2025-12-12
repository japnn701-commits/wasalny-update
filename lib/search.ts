"use server"

import { createClient } from "@/lib/supabase/server"

export interface SearchOptions {
  search?: string
  service?: string
  location?: string
  minRating?: number
  maxPrice?: number
  sortBy?: "rating" | "price" | "newest" | "oldest"
  limit?: number
  offset?: number
}

/**
 * بحث متقدم عن العمال
 */
export async function searchWorkers(options: SearchOptions = {}) {
  const supabase = await createClient()

  let query = supabase
    .from("workers")
    .select(
      `
      *,
      profiles!inner(full_name, phone, avatar_url),
      services(id, name_ar, name_en)
    `
    )

  // البحث في النص
  if (options.search) {
    // Full-text search في PostgreSQL
    query = query.or(
      `profiles.full_name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    )
  }

  // فلترة بالخدمة
  if (options.service && options.service !== "all") {
    query = query.contains("service_ids", [options.service])
  }

  // فلترة بالموقع (city)
  if (options.location) {
    query = query.ilike("city", `%${options.location}%`)
  }

  // فلترة بالتقيم الأدنى
  if (options.minRating) {
    query = query.gte("rating", options.minRating)
  }

  // ترتيب النتائج
  if (options.sortBy === "rating") {
    query = query.order("rating", { ascending: false })
  } else if (options.sortBy === "price") {
    query = query.order("hourly_rate", { ascending: true })
  } else if (options.sortBy === "newest") {
    query = query.order("created_at", { ascending: false })
  } else if (options.sortBy === "oldest") {
    query = query.order("created_at", { ascending: true })
  } else {
    query = query.order("rating", { ascending: false })
  }

  // Pagination
  const limit = options.limit || 20
  const offset = options.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error("Search error:", error)
    return []
  }

  return data || []
}

/**
 * بحث عن الطلبات
 */
export async function searchRequests(options: SearchOptions = {}) {
  const supabase = await createClient()

  let query = supabase
    .from("service_requests")
    .select(
      `
      *,
      services(name_ar, name_en),
      customer:profiles!service_requests_customer_id_fkey(full_name),
      worker:profiles!service_requests_worker_id_fkey(full_name)
    `
    )

  // البحث في النص
  if (options.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  // فلترة بالخدمة
  if (options.service && options.service !== "all") {
    query = query.eq("service_id", options.service)
  }

  // فلترة بالموقع
  if (options.location) {
    query = query.ilike("city", `%${options.location}%`)
  }

  // فلترة بالسعر الأقصى
  if (options.maxPrice) {
    query = query.lte("final_price", options.maxPrice)
  }

  // ترتيب
  if (options.sortBy === "newest") {
    query = query.order("created_at", { ascending: false })
  } else if (options.sortBy === "oldest") {
    query = query.order("created_at", { ascending: true })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const limit = options.limit || 20
  const offset = options.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error("Search error:", error)
    return []
  }

  return data || []
}

