import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Wrench, Star, MapPin, Search, Filter } from "lucide-react"
import { redirect } from "next/navigation"
import { MapView } from "@/components/map-view"

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; location?: string; search?: string; view?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/workers")
  }

  // Build query
  let query = supabase
    .from("workers")
    .select(
      `
      *,
      profiles!inner(full_name, phone),
      services!inner(id, name_ar, name_en)
    `,
    )
    .eq("is_available", true)

  // Apply filters
  if (params.service) {
    query = query.contains("service_ids", [params.service])
  }

  if (params.location) {
    query = query.ilike("city", `%${params.location}%`)
  }

  const { data: workers } = await query

  // Get all services for filter
  const { data: services } = await supabase.from("services").select("*").order("name")

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

          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">لوحة التحكم</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">ابحث عن عامل</h1>
          <p className="text-lg text-muted-foreground">اعثر على أفضل العمال في منطقتك</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    name="search"
                    placeholder="ابحث بالاسم أو الخدمة..."
                    className="pr-10"
                    defaultValue={params.search}
                  />
                </div>
              </div>

              <Select name="service" defaultValue={params.service}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الخدمات</SelectItem>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input name="location" placeholder="المدينة" className="pr-10" defaultValue={params.location} />
              </div>

              <Button type="submit" className="md:col-span-4 bg-primary hover:bg-primary-dark">
                <Filter className="ml-2 w-4 h-4" />
                بحث
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {workers?.length || 0} عامل متاح {params.service && "في هذه الخدمة"}
          </p>
          <div className="flex gap-2">
            <Button variant={params.view === "map" ? "default" : "outline"} size="sm" asChild>
              <Link href={`/workers?${new URLSearchParams({ ...params, view: "map" }).toString()}`}>عرض الخريطة</Link>
            </Button>
            <Button variant={params.view !== "map" ? "default" : "outline"} size="sm" asChild>
              <Link href={`/workers?${new URLSearchParams({ ...params, view: "list" }).toString()}`}>عرض القائمة</Link>
            </Button>
          </div>
        </div>

        {/* Map View */}
        {params.view === "map" ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <MapView
                height="500px"
                markers={
                  workers?.map((worker) => ({
                    id: worker.id,
                    lat: 30.0444 + Math.random() * 0.1,
                    lng: 31.2357 + Math.random() * 0.1,
                    title: worker.profiles?.full_name || "عامل",
                  })) || []
                }
              />
            </CardContent>
          </Card>
        ) : null}

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers?.map((worker) => (
            <Card key={worker.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {worker.profiles?.full_name?.charAt(0) || "ع"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">{worker.profiles?.full_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{worker.city}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{worker.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-sm text-muted-foreground">({worker.total_reviews || 0} تقييم)</span>
                    </div>
                  </div>
                </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">الخدمات:</p>
                    <div className="flex flex-wrap gap-2">
                      {worker.services?.slice(0, 3).map((service: any, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {service.name_ar || service.name_en}
                        </span>
                      ))}
                    </div>
                  </div>

                {worker.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{worker.bio}</p>}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">يبدأ من</p>
                    <p className="text-lg font-bold text-primary">{worker.hourly_rate} ج.م/ساعة</p>
                  </div>
                  <Button asChild className="bg-primary hover:bg-primary-dark">
                    <Link href={`/workers/${worker.id}`}>عرض الملف</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!workers || workers.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">لا توجد نتائج مطابقة لبحثك</p>
              <Button asChild variant="outline">
                <Link href="/workers">إعادة تعيين البحث</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
