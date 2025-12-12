"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  refreshNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider")
  }
  return context
}

export function NotificationsProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshNotifications = async () => {
    if (!userId) return

    const supabase = createClient()
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    }
  }

  const markAsRead = async (id: string) => {
    if (!userId) return

    const supabase = createClient()
    await supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", userId)
    await refreshNotifications()
  }

  const markAllAsRead = async () => {
    if (!userId) return

    const supabase = createClient()
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)
    await refreshNotifications()
  }

  useEffect(() => {
    if (!userId) return

    refreshNotifications()

    // Subscribe to Realtime updates
    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          refreshNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Show browser notification for new unread notifications
  useEffect(() => {
    if (notifications.length > 0 && "Notification" in window && Notification.permission === "granted") {
      const latestNotification = notifications[0]
      if (!latestNotification.read) {
        new Notification(latestNotification.title, {
          body: latestNotification.message,
          icon: "/placeholder-logo.png",
        })
      }
    }
  }, [notifications])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function NotificationsButton() {
  const { unreadCount } = useNotifications()

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/notifications">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  )
}

