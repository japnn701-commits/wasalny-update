import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Wrench, ArrowRight, Save } from "lucide-react"
import { redirect } from "next/navigation"

export default async function WorkerProfileEditPage() {
  const supabase = await createClient()

  // Check if user is logged in and is a worker
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/worker/profile")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "worker") {
    redirect("/dashboard")
  }

  // Get worker profile
  const { data: workerProfile } = await supabase.from("workers").select("*").eq("id", user.id).single()

  // Get all services
  const { data: services } = await supabase.from("services").select("*").order("name_ar")

  const selectedServiceIds = workerProfile?.service_ids || []

  const handleSave = async (formData: FormData) => {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const bio = formData.get("bio") as string
    const city = formData.get("city") as string
    const address = formData.get("address") as string
    const hourlyRate = formData.get("hourly_rate") as string
    const yearsExperience = formData.get("years_experience") as string
    const isAvailable = formData.get("is_available") === "on"

    // Get selected services
    const selectedServices = formData.getAll("services") as string[]

    // Update or insert worker profile
    await supabase.from("workers").upsert({
      id: user.id,
      bio,
      city,
      address,
      hourly_rate: Number.parseFloat(hourlyRate),
      experience_years: Number.parseInt(yearsExperience),
      service_ids: selectedServices,
      is_available: isAvailable,
      updated_at: new Date().toISOString(),
    })

    redirect("/dashboard")
  }

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
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">إعدادات الملف الشخصي</h1>
            <p className="text-lg text-muted-foreground">أكمل معلوماتك لتبدأ في استقبال الطلبات</p>
          </div>

          <form action={handleSave}>
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bio">نبذة عنك</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="اكتب نبذة مختصرة عن خبرتك ومهاراتك..."
                      rows={4}
                      defaultValue={workerProfile?.bio || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      اكتب نبذة جذابة تعرض خبرتك ومهاراتك للعملاء المحتملين
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="القاهرة"
                        required
                        defaultValue={workerProfile?.city || ""}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="years_experience">سنوات الخبرة</Label>
                      <Input
                        id="years_experience"
                        name="years_experience"
                        type="number"
                        min="0"
                        placeholder="5"
                        required
                        defaultValue={workerProfile?.experience_years || ""}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="hourly_rate">السعر بالساعة (ج.م)</Label>
                    <Input
                      id="hourly_rate"
                      name="hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="100"
                      required
                      defaultValue={workerProfile?.hourly_rate || ""}
                    />
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="is_available"
                      name="is_available"
                      defaultChecked={workerProfile?.is_available ?? true}
                    />
                    <Label htmlFor="is_available" className="cursor-pointer">
                      متاح لاستقبال طلبات جديدة
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>الخدمات التي تقدمها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services?.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`service-${service.id}`}
                          name="services"
                          value={service.id}
                          defaultChecked={selectedServiceIds.includes(service.id)}
                        />
                        <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                          {service.name_ar || service.name_en}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary-dark">
                  <Save className="ml-2 w-5 h-5" />
                  حفظ التغييرات
                </Button>
                <Button type="button" size="lg" variant="outline" asChild>
                  <Link href="/dashboard">إلغاء</Link>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
