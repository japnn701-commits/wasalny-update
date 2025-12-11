import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Home,
  PenTool as Tool,
  Wind,
  Box,
  MapPin,
  Star,
  Shield,
  Clock,
  CheckCircle,
  Users,
  Search,
  MessageSquare,
  Dumbbell,
  Gamepad,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">وصلني عامل</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
              الخدمات
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              كيف يعمل
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              المميزات
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/auth/login">تسجيل الدخول</Link>
            </Button>
            <Button className="bg-accent hover:bg-accent-dark" asChild>
              <Link href="/auth/sign-up">ابدأ الآن</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">خدمتك لحد باب بيتك</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              منصة ذكية تربط بين العملاء والعمال الحرفيين بطريقة سهلة وآمنة. احصل على أفضل الخدمات من أقرب عامل موثوق وفي
              دقائق
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-lg px-8" asChild>
                <Link href="/auth/sign-up?type=customer">
                  <Search className="ml-2 w-5 h-5" />
                  ابحث عن عامل
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 bg-transparent" asChild>
                <Link href="/auth/sign-up?type=worker">
                  <Users className="ml-2 w-5 h-5" />
                  انضم كعامل
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">عامل موثوق</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2000+</div>
                <div className="text-sm text-muted-foreground">خدمة مكتملة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.8</div>
                <div className="text-sm text-muted-foreground">تقييم العملاء</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">الخدمات المتاحة</h2>
            <p className="text-lg text-muted-foreground">جميع الخدمات التي تحتاجها في مكان واحد</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Wrench, name: "سباكة", color: "bg-blue-100 text-blue-600" },
              { icon: Zap, name: "كهرباء", color: "bg-yellow-100 text-yellow-600" },
              { icon: Paintbrush, name: "نقاشة", color: "bg-purple-100 text-purple-600" },
              { icon: Hammer, name: "محارة", color: "bg-orange-100 text-orange-600" },
              { icon: Home, name: "تشطيب", color: "bg-green-100 text-green-600" },
              { icon: Tool, name: "صيانة عامة", color: "bg-red-100 text-red-600" },
              { icon: Wind, name: "تكييف", color: "bg-cyan-100 text-cyan-600" },
              { icon: Box, name: "نجارة", color: "bg-amber-100 text-amber-600" },
             { icon: Dumbbell, name: "ورجوله ونزاهه واي حاجه تتمناها", color: "bg-red-100 text-red-600", center:true },
            ].map((service, index) => (
             
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">كيف يعمل الموقع</h2>
            <p className="text-lg text-muted-foreground">3 خطوات ثغننه بث</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">اختر الخدمة</h3>
                <p className="text-xl leading-relaxed">حدد نوع الخدمة التي عايزها واكتب تفاصيل المشكلة أو ارفع صورة يريت</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">اختر العامل</h3>
                <p className="text-xl leading-relaxed">شوف أقرب العمال المتاحين  وتقييماتهم وأسعارهم طبعا وكل واحد ينام علي الجنب اللي يريحه</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">احصل على الخدمة</h3>
                <p className="text-xl leading-relaxed">تواصل مع العامل، حدد الوفت، واحصل على خدمة مضمونة وموثوقة</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">ليه وصلني عامل؟</h2>
            <h3 className="text-lg text-muted-foreground">حاجات تخلينا الخيار والبطاطس الأفضل </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "أقرب عامل لك",
                description: "نظام GPS يحدد أقرب العمال المتاحين في منطقتك",
              },
              {
                icon: Star,
                title: "تقييمات موثوقة",
                description: "تقييمات حقيقية من عملاء سابقين لضمان الجودة",
              },
              {
                icon: Shield,
                title: "دفع آمن",
                description: "خيارات دفع متعددة وآمنة وضمان استرجاع الأموال",
              },
              {
                icon: Clock,
                title: "خدمة طوارئ 24/7",
                description: "خدمة طوارئ متاحة على مدار الساعة للحالات المستعجله",
              },
              {
                icon: MessageSquare,
                title: "تواصل مباشر",
                description: "شات داخلي للتواصل الفوري مع العامل",
              },
              {
                icon: CheckCircle,
                title: "ضمان الجودة",
                description: "نظام ضمان يحميك في حالة عدم رضاك عن الخدمة",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xl leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">جاهز تبدء ولا؟</h2>
          <p className="text-xl mb-8 text-blue-100">انضم لآلاف العملاء والعمال اللي واثقين في وصلني عامل</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8" asChild>
              <Link href="/auth/sign-up?type=customer">سجل كعميل</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 bg-transparent"
              asChild
            >
              <Link href="/auth/sign-up?type=worker">سجل كعامل</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
