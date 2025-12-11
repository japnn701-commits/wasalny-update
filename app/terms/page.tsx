import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-8 text-center">الشروط والأحكام</h1>

          <Card className="mb-6">
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. القبول بالشروط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  باستخدامك لمنصة "وصلني عامل"، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من
                  هذه الشروط، يرجى عدم استخدام المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. التسجيل والحساب</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>يجب أن تكون فوق 18 عاماً للتسجيل في المنصة</li>
                  <li>يجب تقديم معلومات صحيحة ودقيقة عند التسجيل</li>
                  <li>أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك</li>
                  <li>يحق لنا تعليق أو إلغاء حسابك في حالة انتهاك الشروط</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. استخدام المنصة</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  المنصة مخصصة لربط العملاء بالعمال الحرفيين. يجب استخدامها بطريقة قانونية ومسؤولة:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>عدم استخدام المنصة لأغراض غير قانونية</li>
                  <li>عدم نشر محتوى مسيء أو مضلل</li>
                  <li>احترام جميع المستخدمين الآخرين</li>
                  <li>عدم محاولة اختراق أو تعطيل المنصة</li>
                  <li>يعني اي scan حتي يبقا متزعلش</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. الدفع والرسوم</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>جميع الأسعار معروضة بالجنيه المصري</li>
                  <li>نحصل على عمولة من العامل على كل خدمة مكتملة</li>
                  <li>الدفع يتم من خلال بوابات دفع آمنة متقلقش</li>
                  <li>سياسة الاسترجاع تخضع لنظام ضمان الجودة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. مسؤوليات العملاء</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>تقديم وصف دقيق للمشكلة أو الخدمة المطلوبة</li>
                  <li>التواجد في الموعد المحدد</li>
                  <li>الدفع في الوقت المحدد</li>
                  <li>تقييم العامل بشكل عادل بعد إتمام الخدمة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. مسؤوليات العمال</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mr-4">
                  <li>تقديم خدمات عالية الجودة</li>
                  <li>الالتزام بالمواعيد المحددة</li>
                  <li>التعامل بمهنية واحترام مع العملاء</li>
                  <li>تحديث معلومات الملف الشخصي بانتظام</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. إخلاء المسؤولية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  المنصة تعمل كوسيط بين العملاء والعمال. نحن لسنا مسؤولين عن جودة الخدمات المقدمة، لكننا نوفر نظام ضمان
                  الجودة للتدخل في حالة وجود مشاكل.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. التعديلات على الشروط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من
                  خلال المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. القانون الحاكم</h2>
                <p className="text-muted-foreground leading-relaxed">
                 تخضع هذه الشروط للقوانين الخاصه بنا. أي نزاع ينشأ عن استخدام المنصة سيتم حله وفقاً
                  للقوانين  خاصتنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. الاتصال بنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا عبر: zox3614@gmail.com
                </p>
              </section>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">آخر تحديث: يناير 2026</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
