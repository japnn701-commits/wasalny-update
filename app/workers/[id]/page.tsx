import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wrench, Star, MapPin, Phone, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { notFound, redirect } from "next/navigation"

export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/workers/${id}`)
  }

  // Get worker profile
  const { data: worker } = await supabase
    .from("workers")
    .select(
      `
      *,
      profiles!inner(full_name, phone, email)
    `,
    )
    .eq("id", id)
    .single()

  // Get worker services
  const { data: workerServices } = await supabase
    .from("services")
    .select("*")
    .in("id", worker?.service_ids || [])

  if (!worker) {
    notFound()
  }

  // Get worker reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles!reviews_customer_id_fkey(full_name)
    `,
    )
    .eq("worker_id", id)
    .order("created_at", { ascending: false })
    .limit(5)

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
              <Link href="/workers">
                <ArrowRight className="ml-2 w-4 h-4" />
                العودة للبحث
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Worker Header */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0 mx-auto md:mx-0">
                  {worker.profiles?.full_name?.charAt(0) || "ع"}
                </div>

                <div className="flex-1 text-center md:text-right">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{worker.profiles?.full_name}</h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{worker.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-muted-foreground">({worker.total_reviews || 0} تقييم)</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span>{worker.city}</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>موثق</span>
                    </div>
                  </div>

                  {worker.bio && <p className="text-muted-foreground mb-4">{worker.bio}</p>}

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {workerServices?.map((service: any) => (
                      <Badge key={service.id} variant="secondary" className="text-sm">
                        {service.name_ar || service.name_en}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground mb-1">السعر</p>
                  <p className="text-3xl font-bold text-primary mb-4">{worker.hourly_rate} ج.م</p>
                  <p className="text-xs text-muted-foreground">للساعة</p>

                  <Button size="lg" className="mt-4 w-full bg-accent hover:bg-accent-dark" asChild>
                    <Link href={`/requests/new?worker=${worker.id}`}>اطلب الخدمة</Link>
                  </Button>

                  <Button size="lg" variant="outline" className="mt-2 w-full bg-transparent" asChild>
                    <Link href={`tel:${worker.profiles?.phone}`}>
                      <Phone className="ml-2 w-4 h-4" />
                      اتصل الآن
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>عن العامل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">الخبرة</h4>
                      <p className="text-muted-foreground">{worker.years_experience || 0} سنوات من الخبرة</p>
                    </div>

                    {worker.bio && (
                      <div>
                        <h4 className="font-semibold mb-2">نبذة</h4>
                        <p className="text-muted-foreground">{worker.bio}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">الخدمات المقدمة</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {workerServices?.map((service: any) => (
                          <div key={service.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{service.name_ar || service.name_en}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>التقييمات ({worker.total_reviews || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                                {review.profiles?.full_name?.charAt(0) || "ع"}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{review.profiles?.full_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString("ar-EG")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{review.rating}</span>
                            </div>
                          </div>
                          {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">لا توجد تقييمات بعد</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    التوفر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {worker.is_available ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">متاح الآن</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">غير متاح حالياً</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>الإحصائيات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الطلبات المكتملة</span>
                    <span className="text-2xl font-bold text-primary">{worker.total_jobs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">سنوات الخبرة</span>
                    <span className="text-2xl font-bold text-primary">{worker.experience_years || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">معدل الاستجابة</span>
                    <span className="text-2xl font-bold text-primary">95%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الاتصال</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{worker.profiles?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{worker.city}</span>
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
