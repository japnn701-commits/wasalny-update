import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wrench, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/requests")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  // Get all requests
  let query = supabase.from("service_requests").select(
    `
      *,
      services(name_ar, name_en),
      customer:profiles!service_requests_customer_id_fkey(full_name),
      worker:profiles!service_requests_worker_id_fkey(full_name)
    `,
  )

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">إدارة الطلبات</span>
          </Link>

          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowRight className="ml-2 w-4 h-4" />
              العودة للوحة الإدارة
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">إدارة الطلبات</h1>
            <p className="text-lg text-muted-foreground">{requests?.length || 0} طلب</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button variant={!params.status || params.status === "all" ? "default" : "outline"} asChild>
                  <Link href="/admin/requests?status=all">الكل</Link>
                </Button>
                <Button variant={params.status === "pending" ? "default" : "outline"} asChild>
                  <Link href="/admin/requests?status=pending">قيد الانتظار</Link>
                </Button>
                <Button variant={params.status === "accepted" ? "default" : "outline"} asChild>
                  <Link href="/admin/requests?status=accepted">مقبول</Link>
                </Button>
                <Button variant={params.status === "in_progress" ? "default" : "outline"} asChild>
                  <Link href="/admin/requests?status=in_progress">جاري التنفيذ</Link>
                </Button>
                <Button variant={params.status === "completed" ? "default" : "outline"} asChild>
                  <Link href="/admin/requests?status=completed">مكتمل</Link>
                </Button>
                <Button variant={params.status === "cancelled" ? "default" : "outline"} asChild>
                  <Link href="/admin/requests?status=cancelled">ملغي</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
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
                            {request.services?.name}
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

                          <div>
                            <span className="text-xs">العميل: </span>
                            <span className="font-semibold">{request.customer?.full_name}</span>
                          </div>

                          {request.worker && (
                            <div>
                              <span className="text-xs">العامل: </span>
                              <span className="font-semibold">{request.worker?.full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button asChild className="bg-purple-600 hover:bg-purple-700 flex-shrink-0">
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
                <p className="text-muted-foreground">لا يوجد طلبات</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
