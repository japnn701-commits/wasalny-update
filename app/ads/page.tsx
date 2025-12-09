import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench, ArrowRight, ExternalLink, MapPin, Phone } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/ads")
  }

  // Mock ads data - في التطبيق الحقيقي، سيتم جلبها من قاعدة البيانات
  const ads = [
    {
      id: 1,
      title: "محل الأمين للأدوات الصحية",
      description: "جميع أنواع الأدوات الصحية والسباكة بأفضل الأسعار",
      image: "/plumbing-store.jpg",
      location: "القاهرة - مدينة نصر",
      phone: "01234567890",
      category: "أدوات صحية",
    },
    {
      id: 2,
      title: "معرض النور للكهرباء",
      description: "كل ما تحتاجه من أدوات كهربائية وإضاءة حديثة",
      image: "/electrical-store.jpg",
      location: "الجيزة - المهندسين",
      phone: "01098765432",
      category: "كهرباء",
    },
    {
      id: 3,
      title: "مركز الدهانات الحديثة",
      description: "أفضل أنواع الدهانات والديكورات العصرية",
      image: "/paint-store.jpg",
      location: "الإسكندرية - سموحة",
      phone: "01555444333",
      category: "دهانات",
    },
    {
      id: 4,
      title: "شركة البناء المتطور",
      description: "مواد بناء وتشطيب بجودة عالية وأسعار منافسة",
      image: "/construction-materials-variety.png",
      location: "القاهرة - التجمع الخامس",
      phone: "01222333444",
      category: "مواد بناء",
    },
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">الإعلانات والعروض</h1>
            <p className="text-lg text-muted-foreground">اكتشف أفضل محلات الأدوات والمواد في منطقتك</p>
          </div>

          {/* Featured Ad */}
          <Card className="mb-8 bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">عروض خاصة للعمال!</h2>
                  <p className="text-blue-100 mb-4">خصومات تصل إلى 30% على جميع الأدوات والمواد</p>
                  <Button className="bg-white text-primary hover:bg-blue-50">اعرف المزيد</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ads Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {ads.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                <img
                  src={ad.image || "/placeholder.svg"}
                  alt={ad.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{ad.title}</CardTitle>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{ad.category}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{ad.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{ad.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{ad.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary-dark" asChild>
                      <Link href={`tel:${ad.phone}`}>
                        <Phone className="ml-2 w-4 h-4" />
                        اتصل الآن
                      </Link>
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA for Advertisers */}
          <Card className="mt-8 bg-accent/10 border-accent">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">هل تريد الإعلان معنا؟</h3>
              <p className="text-muted-foreground mb-4">اعرض منتجاتك وخدماتك لآلاف العمال والعملاء في منطقتك</p>
              <Button className="bg-accent hover:bg-accent-dark">تواصل معنا</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
