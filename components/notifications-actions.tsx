"use client"

import { Button } from "@/components/ui/button"
import { markAllAsRead } from "@/app/actions/notifications"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NotificationsActions() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    await markAllAsRead()
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" onClick={handleMarkAllAsRead} disabled={loading}>
      {loading ? "جاري..." : "تعليم الكل كمقروء"}
    </Button>
  )
}

