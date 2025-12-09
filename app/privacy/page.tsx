import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-8 text-center">سياسة الخصوصية</h1>

          <Card className="mb-6">
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. المعلومات التي نجمعها</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">نقوم بجمع الأنواع التالية من المعلومات:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>معلومات التسجيل: الاسم، البريد الإلكتروني، رقم الهاتف</li>
                  <li>معلومات الموقع: لتحديد أقرب العمال المتاحين</li>
                  <li>معلومات الدفع: تفاصيل بطاقات الائتمان (مشفرة)</li>
                  <li>معلومات الاستخدام: كيفية تفاعلك مع المنصة</li>
                  <li>الصور والملفات: التي ترفعها لوصف المشكلة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. كيف نستخدم معلوماتك</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>توفير وتحسين خدماتنا</li>
                  <li>ربط العملاء بالعمال المناسبين</li>
                  <li>معالجة المدفوعات</li>
                  <li>إرسال إشعارات حول طلباتك</li>
                  <li>تحسين تجربة المستخدم</li>
                  <li>منع الاحتيال وضمان الأمان</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. مشاركة المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">نشارك معلوماتك فقط في الحالات التالية:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>مع العمال: لتنفيذ الخدمة المطلوبة</li>
                  <li>مع مزودي خدمات الدفع: لمعالجة المدفوعات</li>
                  <li>مع السلطات: عند الطلب القانوني</li>
                  <li>لن نبيع معلوماتك الشخصية لأطراف ثالثة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. أمان المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم تقنيات تشفير متقدمة لحماية بياناتك. جميع المعلومات الحساسة مشفرة أثناء النقل والتخزين. نتبع
                  أفضل الممارسات الأمنية لحماية معلوماتك من الوصول غير المصرح به.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. حقوقك</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>الوصول إلى معلوماتك الشخصية</li>
                  <li>تصحيح المعلومات غير الدقيقة</li>
                  <li>حذف حسابك ومعلوماتك</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                  <li>تصدير بياناتك</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. ملفات تعريف الارتباط (Cookies)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة، تذكر تفضيلاتك، وتحليل استخدام الموقع. يمكنك
                  التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. خصوصية الأطفال</h2>
                <p className="text-muted-foreground leading-relaxed">
                  المنصة غير مخصصة للأطفال دون 18 عاماً. لا نجمع معلومات من الأطفال عن قصد. إذا اكتشفنا أننا جمعنا
                  معلومات من طفل، سنحذفها فوراً.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. التغييرات على سياسة الخصوصية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال
                  إشعار على المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. الاتصال بنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ترغب في ممارسة حقوقك، يرجى الاتصال بنا عبر:
                  privacy@waslny3amel.com
                </p>
              </section>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">آخر تحديث: يناير 2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
