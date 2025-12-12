import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, Star, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserNotifications, markAllAsRead } from "@/lib/notifications"
import { NotificationsActions } from "@/components/notifications-actions"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // جلب الإشعارات من قاعدة البيانات
  const notifications = await getUserNotifications(user.id)
    {
      id: 1,
      type: "message",
      icon: MessageSquare,
      title: "رسالة جديدة من أحمد محمد",
      description: "أرسل لك رسالة بخصوص طلب السباكة",
      time: "منذ 5 دقائق",
      read: false,
    },
    {
      id: 2,
      type: "review",
      icon: Star,
      title: "تقييم جديد",
      description: "قام العميل بتقييمك 5 نجوم",
      time: "منذ ساعة",
      read: false,
    },
    {
      id: 3,
      type: "success",
      icon: CheckCircle,
      title: "تم إكمال الطلب",
      description: "تم إكمال طلب الكهرباء بنجاح",
      time: "منذ 3 ساعات",
      read: true,
    },
    {
      id: 4,
      type: "alert",
      icon: AlertCircle,
      title: "طلب جديد في منطقتك",
      description: "طلب نقاشة في حي النرجس",
      time: "منذ 5 ساعات",
      read: true,
    },
    {
      id: 5,
      type: "message",
      icon: MessageSquare,
      title: "رسالة من فاطمة علي",
      description: "تسأل عن موعد الزيارة",
      time: "أمس",
      read: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">الإشعارات</h1>
            </div>
            <NotificationsActions />
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => {
              const getIcon = () => {
                switch (notification.type) {
                  case "message":
                    return MessageSquare
                  case "review":
                    return Star
                  case "request":
                  case "bid":
                    return AlertCircle
                  case "payment":
                    return CheckCircle
                  default:
                    return Bell
                }
              }

              const Icon = getIcon()
              const getTypeClass = () => {
                switch (notification.type) {
                  case "message":
                    return "bg-blue-100 text-blue-600"
                  case "review":
                    return "bg-yellow-100 text-yellow-600"
                  case "payment":
                    return "bg-green-100 text-green-600"
                  default:
                    return "bg-orange-100 text-orange-600"
                }
              }

              const formatTime = (date: string) => {
                const now = new Date()
                const notificationDate = new Date(date)
                const diff = now.getTime() - notificationDate.getTime()
                const minutes = Math.floor(diff / 60000)
                const hours = Math.floor(minutes / 60)
                const days = Math.floor(hours / 24)

                if (minutes < 1) return "الآن"
                if (minutes < 60) return `منذ ${minutes} دقيقة`
                if (hours < 24) return `منذ ${hours} ساعة`
                if (days < 7) return `منذ ${days} يوم`
                return notificationDate.toLocaleDateString("ar-EG")
              }

              return (
                <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeClass()}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground">{notification.title}</h3>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">{formatTime(notification.created_at)}</p>
                          {notification.link && (
                            <Button variant="link" size="sm" asChild>
                              <a href={notification.link}>عرض</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {notifications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد إشعارات</h3>
                <p className="text-muted-foreground">ستظهر جميع إشعاراتك هنا</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
