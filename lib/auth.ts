"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return { user, supabase }
}

export async function requireCustomer() {
  const { user, supabase } = await requireAuth()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "customer") {
    redirect("/dashboard")
  }

  return { user, profile, supabase }
}

export async function requireWorker() {
  const { user, supabase } = await requireAuth()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "worker") {
    redirect("/dashboard")
  }

  return { user, profile, supabase }
}

export async function requireAdmin() {
  const { user, supabase } = await requireAuth()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  return { user, profile, supabase }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return { user, profile }
}

