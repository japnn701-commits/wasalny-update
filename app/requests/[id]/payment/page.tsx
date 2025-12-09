import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Wrench, CreditCard } from "lucide-react"
import Checkout from "@/components/checkout"
import { createPaymentSession } from "@/app/actions/stripe"

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get request details
  const { data: request } = await supabase
    .from("service_requests")
    .select("*, services(name_ar, name_en), workers!inner(profiles!inner(full_name))")
    .eq("id", id)
    .single()

  if (!request || request.customer_id !== user.id) {
    redirect("/dashboard")
  }

  if (!request.final_price) {
    redirect(`/requests/${id}`)
  }

  const fetchClientSecret = async () => {
    "use server"
    return await createPaymentSession(id, request.final_price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">وصلني عامل</span>
          </Link>

          <Button variant="outline" asChild>
            <Link href={`/requests/${id}`}>
              <ArrowRight className="ml-2 w-4 h-4" />
              العودة للطلب
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <CreditCard className="w-10 h-10 text-primary" />
              الدفع الآمن
            </h1>
            <p className="text-lg text-muted-foreground">أكمل الدفع لتأكيد الخدمة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الدفع</CardTitle>
                </CardHeader>
                <CardContent>
                  <Checkout fetchClientSecret={fetchClientSecret} />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">الخدمة</p>
                    <p className="font-semibold">{request.services?.name_ar || request.services?.name_en}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العامل</p>
                    <p className="font-semibold">{request.workers?.profiles?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-semibold">{request.title}</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">المبلغ</span>
                      <span className="font-semibold">{request.final_price} جنيه</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">رسوم الخدمة</span>
                      <span className="font-semibold">{Math.round(request.final_price * 0.05)} جنيه</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>الإجمالي</span>
                      <span className="text-primary">{Math.round(request.final_price * 1.05)} جنيه</span>
                    </div>
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
