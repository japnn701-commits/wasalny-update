import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">اتصل بنا</h1>
            <p className="text-xl text-muted-foreground">نحن هنا للإجابة على جميع استفساراتك</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground">zox3614@gmail.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">الهاتف</h3>
                    <p className="text-muted-foreground">+2011594090897</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">العنوان</h3>
                    <p className="text-muted-foreground">القاهره ,المنيا</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">ساعات العمل</h3>
                    <p className="text-muted-foreground">السبت - الخميس: 9 صباحاً - 6 مساءً</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الاسم</label>
                    <Input placeholder="أدخل اسمك" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                    <Input type="email" placeholder="example@email.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الموضوع</label>
                    <Input placeholder="موضوع الرسالة" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الرسالة</label>
                    <Textarea placeholder="اكتب رسالتك هنا..." rows={5} />
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary-dark">إرسال الرسالة</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
