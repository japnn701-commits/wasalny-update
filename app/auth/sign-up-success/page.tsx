import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Mail, Wrench } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">وصلني عامل</span>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">تم إنشاء الحساب بنجاح!</CardTitle>
              <CardDescription>تحقق من بريدك الإلكتروني لتفعيل حسابك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">تحقق من بريدك الإلكتروني</p>
                  <p className="text-blue-700">
                    أرسلنا لك رسالة تأكيد على بريدك الإلكتروني. يرجى النقر على الرابط الموجود في الرسالة لتفعيل حسابك
                    والبدء في استخدام المنصة.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full bg-primary hover:bg-primary-dark">
                  <Link href="/auth/login">الذهاب لتسجيل الدخول</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/">العودة للصفحة الرئيسية</Link>
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
