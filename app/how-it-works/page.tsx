
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Wrench, Users, Timer } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-6">ازاي "وصلني عامل" بيشتغل؟</h1>
      <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
        خطوات بسيطة وسريعة توصّلك بأقرب عامل محترف للحاجة اللي محتاجها.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="rounded-2xl shadow-sm p-4 text-center">
          <CardHeader>
            <CheckCircle className="w-12 h-12 mx-auto" />
            <CardTitle className="mt-4 text-xl">1. اطلب الخدمة</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            اختار نوع الخدمة اللي محتاجها… سباكة، كهرباء، نجارة أو أي صيانة.
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm p-4 text-center">
          <CardHeader>
            <Users className="w-12 h-12 mx-auto" />
            <CardTitle className="mt-4 text-xl">2. بنوصلك بأقرب عامل</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            السيرفر بيبحث عن أقرب فني متاح حوالين موقعك ويرسل له الطلب.
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm p-4 text-center">
          <CardHeader>
            <Wrench className="w-12 h-12 mx-auto" />
            <CardTitle className="mt-4 text-xl">3. العامل يوصلك</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            الفني بيتواصل معاك فورًا وبييجي ينفذ الخدمة بأعلى جودة.
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-md p-6 mt-10">
        <CardHeader className="text-center">
          <Timer className="w-10 h-10 mx-auto" />
          <CardTitle className="text-2xl mt-3">السرعة أهم حاجة!</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground text-lg">
          هدفنا إن الخدمة توصلك في أقل وقت وبطريقة آمنة وسهلة… من غير أي لف ولا دوران.
        </CardContent>
      </Card>
    </div>
  );
}
