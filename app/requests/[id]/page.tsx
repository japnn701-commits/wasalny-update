import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wrench, ArrowRight, MapPin, Clock, AlertCircle, CheckCircle, XCircle, User, Phone } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { MapView } from "@/components/map-view"

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/requests/${id}`)
  }

  // Get request details
  const { data: request } = await supabase
    .from("service_requests")
    .select(
      `
      *,
      services(name_ar, name_en),
      customer:profiles!service_requests_customer_id_fkey(full_name, phone),
      worker:profiles!service_requests_worker_id_fkey(full_name, phone)
    `,
    )
    .eq("id", id)
    .single()

  if (!request) {
    notFound()
  }

  // Check if user has access to this request
  if (request.customer_id !== user.id && request.worker_id !== user.id) {
    redirect("/dashboard")
  }

  const isCustomer = request.customer_id === user.id

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3 ml-1" />
            قيد الانتظار
          </Badge>
        )
      case "accepted":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <CheckCircle className="w-3 h-3 ml-1" />
            مقبول
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            <AlertCircle className="w-3 h-3 ml-1" />
            جاري التنفيذ
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 ml-1" />
            مكتمل
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3 h-3 ml-1" />
            ملغي
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUrgencyBadge = () => {
    if (request.is_emergency) {
      return <Badge className="bg-red-600 text-white">طوارئ</Badge>
    }
    return null
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

          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowRight className="ml-2 w-4 h-4" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{request.title}</h1>
              <p className="text-muted-foreground">طلب رقم: {request.id.slice(0, 8)}</p>
            </div>
            {getStatusBadge(request.status)}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">نوع الخدمة</h4>
                    <p className="text-muted-foreground">{request.services?.name_ar || request.services?.name_en}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">الوصف</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{request.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      الموقع
                    </h4>
                    <p className="text-muted-foreground">{request.address}</p>
                  </div>

                  {request.scheduled_date && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        الموعد المفضل
                      </h4>
                      <p className="text-muted-foreground">
                        {new Date(request.scheduled_date).toLocaleString("ar-EG", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  )}

                  {request.is_emergency && (
                    <div>
                      <h4 className="font-semibold mb-2">مستوى الأولوية</h4>
                      {getUrgencyBadge()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Map View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    موقع الخدمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MapView 
                    height="300px" 
                    latitude={request.location_lat || undefined}
                    longitude={request.location_lng || undefined}
                  />
                  <p className="text-sm text-muted-foreground mt-3">{request.address}</p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>سجل الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="w-0.5 h-full bg-border mt-2" />
                      </div>
                      <div className="pb-8">
                        <p className="font-semibold">تم إنشاء الطلب</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.created_at).toLocaleString("ar-EG")}
                        </p>
                      </div>
                    </div>

                    {request.status !== "pending" && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          {request.status !== "accepted" && <div className="w-0.5 h-full bg-border mt-2" />}
                        </div>
                        <div className="pb-8">
                          <p className="font-semibold">تم قبول الطلب</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.updated_at).toLocaleString("ar-EG")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer/Worker Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {isCustomer ? "معلومات العامل" : "معلومات العميل"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isCustomer ? (
                    request.worker ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">الاسم</p>
                          <p className="font-semibold">{request.worker?.full_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الهاتف</p>
                          <p className="font-semibold">{request.worker?.phone}</p>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
                          <Link href={`tel:${request.worker?.phone}`}>
                            <Phone className="ml-2 w-4 h-4" />
                            اتصل الآن
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">لم يتم تعيين عامل بعد</p>
                    )
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">الاسم</p>
                        <p className="font-semibold">{request.customer?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الهاتف</p>
                        <p className="font-semibold">{request.customer?.phone}</p>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
                        <Link href={`tel:${request.customer?.phone}`}>
                          <Phone className="ml-2 w-4 h-4" />
                          اتصل الآن
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>الإجراءات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {request.status === "completed" && isCustomer && (
                    <Button className="w-full bg-accent hover:bg-accent-dark" asChild>
                      <Link href={`/requests/${request.id}/review`}>تقييم الخدمة</Link>
                    </Button>
                  )}

                  {request.status === "accepted" && isCustomer && request.final_price && (
                    <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
                      <Link href={`/requests/${request.id}/payment`}>الدفع الآن</Link>
                    </Button>
                  )}

                  {request.status === "pending" && !isCustomer && (
                    <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
                      <Link href={`/bids/${request.id}`}>تقديم عرض</Link>
                    </Button>
                  )}

                  {request.status === "pending" && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                    >
                      إلغاء الطلب
                    </Button>
                  )}

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard">العودة للوحة التحكم</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>في حالة وجود أي مشكلة، يمكنك التواصل مع الدعم الفني على مدار الساعة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
