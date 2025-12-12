"use server"

import { createClient } from "@/lib/supabase/server"
import { markAllAsRead as markAllAsReadLib } from "@/lib/notifications"

export async function markAllAsRead() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const success = await markAllAsReadLib(user.id)
  return { success }
}

