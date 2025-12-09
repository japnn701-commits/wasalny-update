import Link from "next/link"
import { Wrench } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">وصلني عامل</span>
            </div>
            <p className="text-sm">خدمتك لحد باب بيتك</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">الخدمات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/workers?service=plumbing" className="hover:text-white transition-colors">
                  سباكة
                </Link>
              </li>
              <li>
                <Link href="/workers?service=electrical" className="hover:text-white transition-colors">
                  كهرباء
                </Link>
              </li>
              <li>
                <Link href="/workers?service=painting" className="hover:text-white transition-colors">
                  نقاشة
                </Link>
              </li>
              <li>
                <Link href="/workers?service=maintenance" className="hover:text-white transition-colors">
                  صيانة عامة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link href="/ads" className="hover:text-white transition-colors">
                  الإعلانات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  مركز المساعدة
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© 2026 وصلني عامل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
