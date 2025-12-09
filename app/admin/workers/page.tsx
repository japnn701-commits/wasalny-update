import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Wrench, ArrowRight, Star, MapPin, CheckCircle, XCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminWorkersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin/workers")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  // Get all workers
  const { data: workers } = await supabase
    .from("workers")
    .select(
      `
      *,
      profiles!inner(full_name, phone, email)
    `,
    )
    .order("created_at", { ascending: false })

  // Get services for each worker
  const workersWithServices = await Promise.all(
    (workers || []).map(async (worker) => {
      const { data: services } = await supabase
        .from("services")
        .select("name_ar, name_en")
        .in("id", worker.service_ids || [])
      return { ...worker, services: services?.[0] }
    }),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">إدارة العمال</span>
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
            <h1 className="text-4xl font-bold text-foreground mb-2">إدارة العمال</h1>
            <p className="text-lg text-muted-foreground">{workers?.length || 0} عامل مسجل</p>
          </div>

          {/* Workers List */}
          {workersWithServices && workersWithServices.length > 0 ? (
            <div className="space-y-4">
              {workersWithServices.map((worker) => (
                <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={worker.avatar_url || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                          {worker.profiles?.full_name?.charAt(0) || "W"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-foreground">{worker.profiles?.full_name}</h3>
                          {worker.services && (
                            <Badge variant="secondary">{worker.services.name_ar || worker.services.name_en}</Badge>
                          )}
                          {worker.is_verified ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle className="w-3 h-3 ml-1" />
                              موثق
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <XCircle className="w-3 h-3 ml-1" />
                              غير موثق
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{worker.bio}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{worker.rating?.toFixed(1) || "0.0"}</span>
                            <span>({worker.reviews_count || 0} تقييم)</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{worker.city}</span>
                          </div>

                          <div>
                            <span className="text-xs">الأعمال المكتملة: </span>
                            <span className="font-semibold">{worker.total_jobs || 0}</span>
                          </div>

                          <div>
                            <span className="text-xs">سنوات الخبرة: </span>
                            <span className="font-semibold">{worker.experience_years || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/workers/${worker.id}`}>عرض الملف</Link>
                        </Button>
                        {!worker.is_verified && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="ml-2 w-4 h-4" />
                            توثيق
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
                <p className="text-muted-foreground">لا يوجد عمال مسجلين</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
