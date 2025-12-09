import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Wrench, Gavel, Star, MapPin, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function BidsPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
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
    .select("*, services(name_ar, name_en)")
    .eq("id", requestId)
    .single()

  if (!request || request.customer_id !== user.id) {
    redirect("/dashboard")
  }

  // Get all bids for this request
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      *,
      worker:workers!inner(
        id,
        hourly_rate,
        experience_years,
        city,
        profiles!inner(id, full_name)
      )
    `)
    .eq("request_id", requestId)
    .order("created_at", { ascending: false })

  // Get reviews for each worker
  const workerIds = bids?.map((bid) => bid.worker_id) || []
  const { data: reviews } = await supabase.from("reviews").select("worker_id, rating").in("worker_id", workerIds)

  const workerRatings = reviews?.reduce(
    (acc, review) => {
      if (!acc[review.worker_id]) {
        acc[review.worker_id] = { total: 0, count: 0 }
      }
      acc[review.worker_id].total += review.rating
      acc[review.worker_id].count += 1
      return acc
    },
    {} as Record<string, { total: number; count: number }>,
  )

  const handleAcceptBid = async (bidId: string, amount: number) => {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Update bid status
    await supabase.from("bids").update({ status: "accepted" }).eq("id", bidId)

    // Update request with agreed price and worker
    const { data: bid } = await supabase.from("bids").select("worker_id").eq("id", bidId).single()

    await supabase
      .from("service_requests")
      .update({
        worker_id: bid?.worker_id,
        final_price: amount,
        status: "accepted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)

    redirect(`/requests/${requestId}`)
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
            <Link href={`/requests/${requestId}`}>
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
              <Gavel className="w-10 h-10 text-primary" />
              العروض المقدمة
            </h1>
            <p className="text-lg text-muted-foreground">
              {request.services?.name_ar || request.services?.name_en} - {request.title}
            </p>
          </div>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900">
                <strong>ملاحظة:</strong> راجع جميع العروض بعناية واختر الأنسب لك بناءً على السعر والتقييمات والخبرة
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {bids && bids.length > 0 ? (
              bids.map((bid) => {
                const rating = workerRatings?.[bid.worker_id]
                const avgRating = rating ? (rating.total / rating.count).toFixed(1) : null

                return (
                  <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                              {bid.worker.profiles.full_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">{bid.worker.profiles.full_name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {avgRating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold">{avgRating}</span>
                                  <span className="text-xs text-muted-foreground">({rating.count})</span>
                                </div>
                              )}
                              <Badge variant="secondary">{bid.worker.experience_years || 0} سنوات خبرة</Badge>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            bid.status === "accepted"
                              ? "default"
                              : bid.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {bid.status === "pending" && "قيد المراجعة"}
                          {bid.status === "accepted" && "مقبول"}
                          {bid.status === "rejected" && "مرفوض"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{bid.worker.city}</span>
                      </div>

                      {bid.notes && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-foreground">{bid.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">السعر المقترح</p>
                          <p className="text-3xl font-bold text-primary">{bid.proposed_price} جنيه</p>
                          {bid.estimated_duration && (
                            <p className="text-xs text-muted-foreground mt-1">
                              المدة المتوقعة: {bid.estimated_duration}
                            </p>
                          )}
                        </div>

                        {bid.status === "pending" && (
                          <form action={handleAcceptBid.bind(null, bid.id, bid.proposed_price)}>
                            <Button size="lg" className="bg-accent hover:bg-accent-dark">
                              <CheckCircle className="ml-2 w-5 h-5" />
                              قبول العرض
                            </Button>
                          </form>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                          <Link href={`/workers/${bid.worker_id}`}>عرض الملف الشخصي</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Gavel className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد عروض بعد</h3>
                  <p className="text-muted-foreground">انتظر حتى يقدم العمال عروضهم على طلبك</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
