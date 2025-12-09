import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench, Users, Briefcase, FileText, Settings, TrendingUp, LogOut } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  // Get statistics
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalWorkers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_type", "worker")

  const { count: totalCustomers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_type", "customer")

  const { count: totalRequests } = await supabase.from("service_requests").select("*", { count: "exact", head: true })

  const { count: pendingRequests } = await supabase
    .from("service_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: completedRequests } = await supabase
    .from("service_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const { count: totalServices } = await supabase.from("services").select("*", { count: "exact", head: true })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">لوحة الإدارة</span>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">مرحباً، {profile?.full_name || "المسؤول"}!</h1>
            <p className="text-lg text-muted-foreground">لوحة التحكم الإدارية</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-100">إجمالي المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalUsers || 0}</div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  {totalWorkers || 0} عامل • {totalCustomers || 0} عميل
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-100">إجمالي الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalRequests || 0}</div>
                  <FileText className="w-8 h-8 text-green-200" />
                </div>
                <p className="text-xs text-green-100 mt-2">{completedRequests || 0} مكتمل</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-100">الطلبات المعلقة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{pendingRequests || 0}</div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
                <p className="text-xs text-orange-100 mt-2">تحتاج إلى متابعة</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-100">الخدمات المتاحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalServices || 0}</div>
                  <Briefcase className="w-8 h-8 text-purple-200" />
                </div>
                <p className="text-xs text-purple-100 mt-2">خدمة نشطة</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link href="/admin/users">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">إدارة المستخدمين</h3>
                  <p className="text-sm text-muted-foreground">عرض وإدارة جميع المستخدمين</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link href="/admin/requests">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">إدارة الطلبات</h3>
                  <p className="text-sm text-muted-foreground">متابعة جميع الطلبات</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link href="/admin/services">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">إدارة الخدمات</h3>
                  <p className="text-sm text-muted-foreground">إضافة وتعديل الخدمات</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link href="/admin/workers">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">إدارة العمال</h3>
                  <p className="text-sm text-muted-foreground">مراجعة وتفعيل العمال</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link href="/admin/reports">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">التقارير</h3>
                  <p className="text-sm text-muted-foreground">إحصائيات وتقارير مفصلة</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
              <Link href="/admin/settings">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">الإعدادات</h3>
                  <p className="text-sm text-muted-foreground">إعدادات النظام العامة</p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">مستخدم جديد</p>
                    <p className="text-sm text-muted-foreground">انضم مستخدم جديد للمنصة</p>
                  </div>
                  <span className="text-xs text-muted-foreground">منذ ساعة</span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">طلب جديد</p>
                    <p className="text-sm text-muted-foreground">تم إنشاء طلب خدمة جديد</p>
                  </div>
                  <span className="text-xs text-muted-foreground">منذ ساعتين</span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">عامل جديد</p>
                    <p className="text-sm text-muted-foreground">تم تسجيل عامل جديد</p>
                  </div>
                  <span className="text-xs text-muted-foreground">منذ 3 ساعات</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
