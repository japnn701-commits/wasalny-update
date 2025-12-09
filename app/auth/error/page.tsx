import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Wrench } from "lucide-react"
import { Suspense } from "react"

function ErrorContent({ searchParams }: { searchParams: { error?: string } }) {
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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">عذراً، حدث خطأ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchParams?.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">رمز الخطأ: {searchParams.error}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.</p>
              )}

              <div className="space-y-2">
                <Button asChild className="w-full bg-primary hover:bg-primary-dark">
                  <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/">العودة للصفحة الرئيسية</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent searchParams={params} />
    </Suspense>
  )
}
