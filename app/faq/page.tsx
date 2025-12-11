import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "كيف أطلب خدمة من وصلني عامل؟",
      answer:
        "سجل حساب جديد، اختر نوع الخدمة المطلوبة، اكتب تفاصيل المشكلة أو ارفع صورة، ثم اختر العامل المناسب من القائمة المتاحة.",
    },
    {
      question: "هل الدفع آمن؟",
      answer:
        "ايوه، نستخدم بوابات دفع آمنة ومشفرة. يمكنك الدفع بالفيزا، الماستركارد، أو المحافظ الإلكترونية. كما نوفر خيار الدفع عند الاستلام.",
    },
    {
      question: "كيف أعرف أن العامل موثوق؟",
      answer:
        "جميع العمال يخضعون للتحقق من الهوية. يمكنك الاطلاع على تقييمات العملاء السابقين، عدد الخدمات المكتملة، ومعدل التقييم قبل الاختيار.",
    },
    {
      question: "ماذا لو لم أكن راضياً عن الخدمة؟",
      answer:
        "لدينا نظام ضمان الجودة. يمكنك تقديم شكوى من خلال المنصة وسيتم مراجعتها. في حالة ثبوت المشكلة، يمكن استرجاع جزء أو كل المبلغ المدفوع.",
    },
    {
      question: "هل يمكنني جدولة موعد مسبق؟",
      answer: "نعم، يمكنك تحديد التاريخ والوقت المناسب لك عند إنشاء الطلب. العامل سيؤكد الموعد أو يقترح بديلاً.",
    },
    {
      question: "كيف يتم احتساب المسافة والتكلفة؟",
      answer:
        "نستخدم نظام GPS لتحديد المسافة بينك وبين العامل. التكلفة تعتمد على نوع الخدمة، المسافة، ومدى تعقيد المشكلة. العامل يحدد السعر النهائي بعد معاينة المشكلة.",
    },
    {
      question: "هل يمكنني التواصل مع العامل قبل الموافقة؟",
      answer: "اه، يمكنك استخدام نظام الشات الداخلي للتواصل مع العامل، طرح الأسئلة، وإرسال صور إضافية للمشكلة.",
    },
    {
      question: "ما هي نقاط الولاء وكيف أستخدمها؟",
      answer:
        "تكسب نقاط ولاء مع كل خدمة تطلبها. يمكنك تحويل هذه النقاط إلى خصومات على الخدمات المستقبلية أو الحصول على خدمات مجانية.",
    },
    {
      question: "كيف أصبح عاملاً على المنصة؟",
      answer:
        "سجل حساب جديد واختر 'عامل'، أكمل بياناتك الشخصية، حدد نوع الخدمات التي تقدمها، ارفع صور أعمالك السابقة، وانتظر الموافقة من فريقنا.",
    },
    {
      question: "ما هي باقات الاشتراك للعمال؟",
      answer:
        "نوفر ثلاث باقات: Basic (مجانية)، Pro (99 ريال/شهر)، Premium (199 ريال/شهر). الباقات المدفوعة توفر ظهور أفضل في نتائج البحث وإشعارات أسرع.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">الأسئلة الشائعة</h1>
            <p className="text-xl text-muted-foreground">إجابات على أكثر الأسئلة شيوعاً</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">لم تجد إجابة لسؤالك؟</p>
            <a href="/contact" className="text-primary hover:underline font-medium">
              اتصل بنا
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
