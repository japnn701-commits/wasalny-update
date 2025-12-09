import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">من نحن</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            وصلني عامل هي منصة ذكية تهدف إلى تسهيل الوصول إلى الخدمات الحرفية بطريقة آمنة وموثوقة. نربط بين العملاء
            والعمال المهرة في جميع أنحاء المملكة.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">رؤيتنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                أن نكون المنصة الأولى والأكثر موثوقية في الوطن العربي لربط العملاء بالعمال الحرفيين، مع توفير تجربة سلسة
                وآمنة للجميع.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">رسالتنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                تسهيل الحصول على الخدمات الحرفية عالية الجودة من خلال منصة ذكية تضمن الشفافية والأمان والجودة لجميع
                الأطراف.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">قيمنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "الثقة",
                description: "نبني الثقة من خلال التحقق من هوية العمال ونظام التقييمات الشفاف",
              },
              {
                title: "الجودة",
                description: "نضمن جودة الخدمات من خلال نظام ضمان الجودة والمتابعة المستمرة",
              },
              {
                title: "السرعة",
                description: "نوفر الوصول السريع للعمال المتاحين في منطقتك خلال دقائق",
              },
              {
                title: "الأمان",
                description: "نحمي بياناتك ومدفوعاتك من خلال أنظمة أمان متقدمة",
              },
              {
                title: "الشفافية",
                description: "أسعار واضحة وتقييمات حقيقية بدون أي رسوم خفية",
              },
              {
                title: "الابتكار",
                description: "نستخدم أحدث التقنيات لتحسين تجربة المستخدم باستمرار",
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary text-white rounded-2xl p-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">إنجازاتنا</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">عامل موثوق</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">2000+</div>
              <div className="text-blue-100">خدمة مكتملة</div>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-blue-100">تقييم العملاء</div>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">نسبة الرضا</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
