import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, Star, CheckCircle, AlertCircle } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Mock notifications - في التطبيق الحقيقي، سيتم جلبها من قاعدة البيانات
  const notifications = [
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
            <Button variant="outline">تعليم الكل كمقروء</Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === "message"
                          ? "bg-blue-100 text-blue-600"
                          : notification.type === "review"
                            ? "bg-yellow-100 text-yellow-600"
                            : notification.type === "success"
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <notification.icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
