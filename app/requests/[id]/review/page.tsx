import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Wrench, ArrowRight, Star, Send } from "lucide-react"
import { redirect, notFound } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default async function ReviewPage({
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
    redirect(`/auth/login?redirect=/requests/${id}/review`)
  }

  // Get request details
  const { data: request } = await supabase
    .from("service_requests")
    .select(
      `
      *,
      services(name_ar, name_en),
      workers!inner(id, profiles!inner(full_name))
    `,
    )
    .eq("id", id)
    .single()

  if (!request) {
    notFound()
  }

  // Check if user is the customer and request is completed
  if (request.customer_id !== user.id) {
    redirect("/dashboard")
  }

  if (request.status !== "completed") {
    redirect(`/requests/${id}`)
  }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("*")
    .eq("request_id", id)
    .eq("customer_id", user.id)
    .single()

  const handleSubmit = async (formData: FormData) => {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const rating = Number.parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string

    // Create review
    const { error: reviewError } = await supabase.from("reviews").insert({
      request_id: id,
      worker_id: request.worker_id,
      customer_id: user.id,
      rating,
      comment: comment || null,
    })

    if (reviewError) {
      console.error("Error creating review:", reviewError)
      return
    }

    // Update worker rating
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("worker_id", request.worker_id)

    if (reviews && reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

      await supabase
        .from("workers")
        .update({
          rating: avgRating,
          total_jobs: (request.workers?.total_jobs || 0) + 1,
        })
        .eq("id", request.worker_id)
    }

    redirect(`/requests/${id}`)
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">تقييم الخدمة</h1>
            <p className="text-lg text-muted-foreground">
              ساعدنا في تحسين الخدمة من خلال تقييمك
            </p>
          </div>

          {existingReview ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  شكراً لك! لقد قمت بتقييم هذه الخدمة
                </h3>
                <p className="text-muted-foreground mb-4">
                  تقييمك: {existingReview.rating} من 5
                </p>
                <Button asChild>
                  <Link href={`/requests/${id}`}>العودة للطلب</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>كيف كانت تجربتك مع {request.workers?.profiles?.full_name}؟</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <Label>التقييم *</Label>
                      <RadioGroup name="rating" required>
                        <div className="flex gap-4 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                              <Label
                                htmlFor={`rating-${rating}`}
                                className="cursor-pointer flex items-center gap-1"
                              >
                                <Star className="w-6 h-6 text-yellow-400" />
                                <span className="text-lg font-semibold">{rating}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="comment">تعليق (اختياري)</Label>
                      <Textarea
                        id="comment"
                        name="comment"
                        placeholder="شاركنا بتجربتك..."
                        rows={5}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        اكتب تعليقاً مفيداً يساعد الآخرين في اتخاذ قرارهم
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary-dark">
                        <Send className="ml-2 w-5 h-5" />
                        إرسال التقييم
                      </Button>
                      <Button type="button" size="lg" variant="outline" asChild>
                        <Link href={`/requests/${id}`}>إلغاء</Link>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

