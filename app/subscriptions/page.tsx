import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wrench, ArrowRight, Check, Crown, Zap, Star } from "lucide-react"
import { redirect } from "next/navigation"

export default async function SubscriptionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/subscriptions")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get worker profile if user is a worker
  let workerProfile = null
  if (profile?.user_type === "worker") {
    const { data } = await supabase.from("workers").select("*").eq("id", user.id).single()
    workerProfile = data
  }

  const plans = [
    {
      name: "Basic",
      price: 0,
      period: "مجاناً",
      icon: Star,
      color: "bg-gray-500",
      features: [
        "استقبال الطلبات الأساسية",
        "ملف شخصي بسيط",
        "تقييمات العملاء",
        "دعم فني عادي",
        "عمولة 15% على كل خدمة",
      ],
      limitations: ["ظهور عادي في نتائج البحث", "بدون شارة مميزة"],
    },
    {
      name: "Pro",
      price: 199,
      period: "شهرياً",
      icon: Zap,
      color: "bg-blue-500",
      popular: true,
      features: [
        "أولوية في نتائج البحث",
        "شارة Pro مميزة",
        "إشعارات فورية للطلبات",
        "ملف شخصي موسع",
        "عمولة 10% فقط",
        "إحصائيات متقدمة",
        "دعم فني أسرع",
      ],
      limitations: [],
    },
    {
      name: "Premium",
      price: 399,
      period: "شهرياً",
      icon: Crown,
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      features: [
        "أولوية قصوى في البحث",
        "شارة Premium ذهبية",
        "إشعارات فورية VIP",
        "ملف شخصي مميز بالكامل",
        "عمولة 5% فقط",
        "إحصائيات وتقارير شاملة",
        "دعم فني 24/7 مخصص",
        "ظهور في الصفحة الرئيسية",
        "إعلانات مجانية",
      ],
      limitations: [],
    },
  ]

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
              لوحة التحكم
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">باقات الاشتراك للعمال</h1>
            <p className="text-lg text-muted-foreground">اختر الباقة المناسبة لك وزد من فرص عملك</p>
          </div>

          {profile?.user_type !== "worker" && (
            <Card className="mb-8 bg-yellow-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  هذه الصفحة مخصصة للعمال فقط. إذا كنت ترغب في أن تصبح عاملاً، يرجى{" "}
                  <Link href="/auth/sign-up" className="text-primary font-semibold underline">
                    إنشاء حساب عامل
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <Card key={index} className={`relative ${plan.popular ? "border-primary border-2 shadow-xl" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1">الأكثر شعبية</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price > 0 && <span className="text-muted-foreground"> ج.م</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.period}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start gap-2 opacity-50">
                          <span className="text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-primary hover:bg-primary-dark"
                          : plan.price === 0
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-accent hover:bg-accent-dark"
                      }`}
                      disabled={profile?.user_type !== "worker"}
                    >
                      {plan.price === 0 ? "الباقة الحالية" : "اشترك الآن"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">كيف يتم الدفع؟</h4>
                <p className="text-sm text-muted-foreground">
                  يمكنك الدفع عبر بطاقة الائتمان أو المحافظ الإلكترونية. الاشتراك يتجدد تلقائياً كل شهر.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">هل يمكنني إلغاء الاشتراك؟</h4>
                <p className="text-sm text-muted-foreground">
                  نعم، يمكنك إلغاء الاشتراك في أي وقت من لوحة التحكم. سيستمر الاشتراك حتى نهاية الفترة المدفوعة.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ما هي العمولة؟</h4>
                <p className="text-sm text-muted-foreground">
                  العمولة هي نسبة من قيمة كل خدمة تقدمها. كلما كانت الباقة أعلى، كانت العمولة أقل.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
