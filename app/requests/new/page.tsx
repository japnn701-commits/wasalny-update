"use client"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Wrench, ArrowRight, Send } from "lucide-react"
import { redirect } from "next/navigation"

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ worker?: string; service?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/requests/new")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "customer") {
    redirect("/dashboard")
  }

  // Get all services
  const { data: services } = await supabase.from("services").select("*").order("name")

  // Get worker info if specified
  let worker = null
  if (params.worker) {
    const { data } = await supabase
      .from("workers")
      .select("*, profiles!inner(full_name)")
      .eq("id", params.worker)
      .single()
    worker = data
  }

  const handleSubmit = async (formData: FormData) => {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const serviceId = formData.get("service_id") as string
    const workerId = formData.get("worker_id") as string | null
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const address = formData.get("location") as string
    const scheduledDate = formData.get("scheduled_date") as string
    const urgency = formData.get("urgency") as string
    const isEmergency = urgency === "emergency"

    const { data: request, error } = await supabase
      .from("service_requests")
      .insert({
        customer_id: user.id,
        worker_id: workerId || null,
        service_id: serviceId,
        title,
        description,
        address,
        scheduled_date: scheduledDate || null,
        is_emergency: isEmergency,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating request:", error)
      return
    }

    redirect(`/requests/${request.id}`)
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">طلب خدمة جديد</h1>
            <p className="text-lg text-muted-foreground">املأ التفاصيل للحصول على أفضل خدمة</p>
          </div>

          {worker && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">طلب موجه إلى:</span> {worker.profiles?.full_name}
                </p>
              </CardContent>
            </Card>
          )}

          <form action={handleSubmit}>
            <input type="hidden" name="worker_id" value={params.worker || ""} />

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="service_id">نوع الخدمة *</Label>
                    <Select name="service_id" defaultValue={params.service} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name_ar || service.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="title">عنوان الطلب *</Label>
                    <Input id="title" name="title" placeholder="مثال: إصلاح تسريب في الحمام" required maxLength={100} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">وصف المشكلة *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="اشرح المشكلة بالتفصيل..."
                      rows={5}
                      required
                    />
                    <p className="text-xs text-muted-foreground">كلما كان الوصف أكثر تفصيلاً، كان أفضل للعامل</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">العنوان *</Label>
                    <Input id="location" name="location" placeholder="العنوان بالتفصيل" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="scheduled_date">التاريخ المفضل</Label>
                      <Input id="scheduled_date" name="scheduled_date" type="datetime-local" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="urgency">مستوى الأولوية</Label>
                      <Select name="urgency" defaultValue="normal">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">عادي</SelectItem>
                          <SelectItem value="normal">متوسط</SelectItem>
                          <SelectItem value="high">عاجل</SelectItem>
                          <SelectItem value="emergency">طوارئ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary-dark">
                  <Send className="ml-2 w-5 h-5" />
                  إرسال الطلب
                </Button>
                <Button type="button" size="lg" variant="outline" asChild>
                  <Link href="/dashboard">إلغاء</Link>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
