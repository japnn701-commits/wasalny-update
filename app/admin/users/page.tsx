import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Wrench, ArrowRight, Search, User, Mail, Phone } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/users")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  // Get all users
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (params.type && params.type !== "all") {
    query = query.eq("user_type", params.type)
  }

  if (params.search) {
    query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`)
  }

  const { data: users } = await query

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">إدارة المستخدمين</span>
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
            <h1 className="text-4xl font-bold text-foreground mb-2">إدارة المستخدمين</h1>
            <p className="text-lg text-muted-foreground">{users?.length || 0} مستخدم مسجل</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم، البريد، أو الهاتف..."
                    className="pr-10"
                    defaultValue={params.search}
                    name="search"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant={!params.type || params.type === "all" ? "default" : "outline"} asChild>
                    <Link href="/admin/users?type=all">الكل</Link>
                  </Button>
                  <Button variant={params.type === "customer" ? "default" : "outline"} asChild>
                    <Link href="/admin/users?type=customer">العملاء</Link>
                  </Button>
                  <Button variant={params.type === "worker" ? "default" : "outline"} asChild>
                    <Link href="/admin/users?type=worker">العمال</Link>
                  </Button>
                  <Button variant={params.type === "admin" ? "default" : "outline"} asChild>
                    <Link href="/admin/users?type=admin">المسؤولين</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          {users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((userItem) => (
                <Card key={userItem.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {userItem.full_name?.charAt(0) || "U"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-foreground">{userItem.full_name || "غير محدد"}</h3>
                            <Badge
                              variant={
                                userItem.user_type === "admin"
                                  ? "default"
                                  : userItem.user_type === "worker"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {userItem.user_type === "admin"
                                ? "مسؤول"
                                : userItem.user_type === "worker"
                                  ? "عامل"
                                  : "عميل"}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{userItem.email || "غير محدد"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{userItem.phone || "غير محدد"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>انضم في {new Date(userItem.created_at).toLocaleDateString("ar-EG")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {userItem.user_type === "worker" && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/workers/${userItem.id}`}>عرض الملف</Link>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                        >
                          تعطيل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">لا يوجد مستخدمين</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
