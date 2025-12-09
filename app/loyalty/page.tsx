import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wrench, ArrowRight, Gift, Star, TrendingUp, Award } from "lucide-react"
import { redirect } from "next/navigation"

export default async function LoyaltyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/loyalty")
  }

  // Get user's loyalty points
  const { data: loyaltyData } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalPoints = loyaltyData?.reduce((sum, record) => sum + record.points, 0) || 0

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const rewards = [
    { points: 100, discount: "10%", title: "خصم 10% على الخدمة القادمة" },
    { points: 250, discount: "25%", title: "خصم 25% على الخدمة القادمة" },
    { points: 500, discount: "50%", title: "خصم 50% على الخدمة القادمة" },
    { points: 1000, discount: "100%", title: "خدمة مجانية كاملة" },
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">نقاط الولاء</h1>
            <p className="text-lg text-muted-foreground">اكسب نقاط مع كل خدمة واستبدلها بمكافآت رائعة</p>
          </div>

          {/* Points Summary */}
          <Card className="mb-8 bg-gradient-to-br from-primary to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-2">رصيدك الحالي</p>
                  <p className="text-5xl font-bold">{totalPoints}</p>
                  <p className="text-blue-100 mt-2">نقطة</p>
                </div>
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-12 h-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                كيف تكسب النقاط؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">اطلب خدمة</h4>
                  <p className="text-sm text-muted-foreground">احصل على 10 نقاط لكل 100 جنيه</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">قيّم الخدمة</h4>
                  <p className="text-sm text-muted-foreground">احصل على 5 نقاط إضافية</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-2">ادعُ صديق</h4>
                  <p className="text-sm text-muted-foreground">احصل على 50 نقطة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Rewards */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-accent" />
                المكافآت المتاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewards.map((reward, index) => {
                  const canRedeem = totalPoints >= reward.points
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        canRedeem ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            canRedeem ? "bg-green-500" : "bg-gray-400"
                          } text-white font-bold`}
                        >
                          {reward.discount}
                        </div>
                        <div>
                          <h4 className="font-semibold">{reward.title}</h4>
                          <p className="text-sm text-muted-foreground">{reward.points} نقطة</p>
                        </div>
                      </div>
                      <Button disabled={!canRedeem} className="bg-accent hover:bg-accent-dark">
                        {canRedeem ? "استبدل الآن" : "غير متاح"}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Points History */}
          <Card>
            <CardHeader>
              <CardTitle>سجل النقاط</CardTitle>
            </CardHeader>
            <CardContent>
              {loyaltyData && loyaltyData.length > 0 ? (
                <div className="space-y-3">
                  {loyaltyData.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{record.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                      <Badge className={record.points > 0 ? "bg-green-500" : "bg-red-500"}>
                        {record.points > 0 ? "+" : ""}
                        {record.points} نقطة
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">لا توجد نقاط بعد</p>
                  <Button asChild className="bg-primary hover:bg-primary-dark">
                    <Link href="/requests/new">اطلب خدمتك الأولى</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
