import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Wrench, LogOut, User, Briefcase, Plus, List, Settings, Star } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get worker profile if user is a worker
  let workerProfile = null
  if (profile?.user_type === "worker") {
    const { data } = await supabase.from("workers").select("*").eq("id", user.id).single()
    workerProfile = data
  }

  // Get requests count
  let requestsQuery = supabase.from("service_requests").select("*", { count: "exact", head: true })

  if (profile?.user_type === "customer") {
    requestsQuery = requestsQuery.eq("customer_id", user.id)
  } else {
    requestsQuery = requestsQuery.eq("worker_id", user.id)
  }

  const { count: requestsCount } = await requestsQuery

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">وصلني عامل</span>
          </Link>

          <form action={handleSignOut}>
            <Button variant="outline" type="submit">
              <LogOut className="ml-2 w-4 h-4" />
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">مرحباً، {profile?.full_name || "مستخدم"}!</h1>
            <p className="text-lg text-muted-foreground">
              {profile?.user_type === "worker" ? "لوحة تحكم العامل" : "لوحة تحكم العميل"}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {profile?.user_type === "customer" ? (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/requests/new">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">طلب خدمة جديد</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/workers">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">ابحث عن عامل</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/requests">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <List className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">طلباتي</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/loyalty">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">نقاط الولاء</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/ads">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">الإعلانات</h3>
                    </CardContent>
                  </Link>
                </Card>
              </>
            ) : (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/requests">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <List className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">الطلبات المستلمة</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/worker/profile">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">إعدادات الملف</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href={`/workers/${user.id}`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">عرض ملفي</h3>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                  <Link href="/subscriptions">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">باقات الاشتراك</h3>
                    </CardContent>
                  </Link>
                </Card>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {profile?.user_type === "worker" ? (
                    <>
                      <Briefcase className="w-5 h-5 text-accent" />
                      معلومات العامل
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5 text-primary" />
                      معلومات العميل
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">الاسم:</span>
                  <p className="font-semibold">{profile?.full_name || "غير محدد"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">البريد الإلكتروني:</span>
                  <p className="font-semibold">{user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">رقم الهاتف:</span>
                  <p className="font-semibold">{profile?.phone || "غير محدد"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">نوع الحساب:</span>
                  <p className="font-semibold">{profile?.user_type === "worker" ? "عامل" : "عميل"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.user_type === "worker" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">الطلبات المستلمة</span>
                      <span className="text-2xl font-bold text-primary">{requestsCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">الطلبات المكتملة</span>
                      <span className="text-2xl font-bold text-primary">{workerProfile?.total_jobs || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">التقييم</span>
                      <span className="text-2xl font-bold text-primary">
                        {workerProfile?.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">إجمالي الطلبات</span>
                      <span className="text-2xl font-bold text-primary">{requestsCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">الطلبات النشطة</span>
                      <span className="text-2xl font-bold text-primary">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">نقاط الولاء</span>
                      <span className="text-2xl font-bold text-primary">0</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          {profile?.user_type === "worker" && !workerProfile?.bio && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>أكمل ملفك الشخصي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  أكمل معلومات ملفك الشخصي لتبدأ في استقبال الطلبات من العملاء
                </p>
                <Button className="bg-accent hover:bg-accent-dark" asChild>
                  <Link href="/worker/profile">أكمل ملفك الآن</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
