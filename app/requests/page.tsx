import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wrench, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function RequestsPage() {
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/requests")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get requests based on user type
  let query = supabase.from("service_requests").select(
    `
      *,
      services(name_ar, name_en),
      customer:profiles!service_requests_customer_id_fkey(full_name),
      worker:profiles!service_requests_worker_id_fkey(full_name)
    `,
  )

  if (profile?.user_type === "customer") {
    query = query.eq("customer_id", user.id)
  } else {
    query = query.eq("worker_id", user.id)
  }

  const { data: requests } = await query.order("created_at", { ascending: false })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "accepted":
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "accepted":
        return "مقبول"
      case "in_progress":
        return "جاري التنفيذ"
      case "completed":
        return "مكتمل"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">وصلني عامل</span>
          </Link>

          <div className="flex items-center gap-3">
            {profile?.user_type === "customer" && (
              <Button className="bg-primary hover:bg-primary-dark" asChild>
                <Link href="/requests/new">
                  <Plus className="ml-2 w-4 h-4" />
                  طلب جديد
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard">لوحة التحكم</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {profile?.user_type === "customer" ? "طلباتي" : "الطلبات المستلمة"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {requests?.length || 0} طلب {profile?.user_type === "customer" ? "قمت بإنشائه" : "تم استلامه"}
            </p>
          </div>

          {requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-foreground">{request.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {request.services?.name_ar || request.services?.name_en}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{request.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            <span>{getStatusText(request.status)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(request.created_at).toLocaleDateString("ar-EG")}</span>
                          </div>

                          {profile?.user_type === "customer" && request.worker && (
                            <div>
                              <span className="text-xs">العامل: </span>
                              <span className="font-semibold">{request.worker?.full_name}</span>
                            </div>
                          )}

                          {profile?.user_type === "worker" && (
                            <div>
                              <span className="text-xs">العميل: </span>
                              <span className="font-semibold">{request.customer?.full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button asChild className="bg-primary hover:bg-primary-dark flex-shrink-0">
                        <Link href={`/requests/${request.id}`}>عرض التفاصيل</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {profile?.user_type === "customer" ? "لم تقم بإنشاء أي طلبات بعد" : "لم تستلم أي طلبات بعد"}
                </p>
                {profile?.user_type === "customer" && (
                  <Button asChild className="bg-primary hover:bg-primary-dark">
                    <Link href="/requests/new">
                      <Plus className="ml-2 w-4 h-4" />
                      إنشاء طلب جديد
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
