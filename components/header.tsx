import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Menu, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createServerClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">وصلني عامل</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/workers" className="text-muted-foreground hover:text-foreground transition-colors">
            العمال
          </Link>
          <Link href="/requests" className="text-muted-foreground hover:text-foreground transition-colors">
            الطلبات
          </Link>
          <Link href="/chats" className="text-muted-foreground hover:text-foreground transition-colors">
            المحادثات
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            من نحن
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            اتصل بنا
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications">
                  <Bell className="w-5 h-5" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">حسابي</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">لوحة التحكم</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">الإعدادات</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/loyalty">نقاط الولاء</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form action="/auth/signout" method="post">
                      <button type="submit" className="w-full text-right">
                        تسجيل الخروج
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
              <Button className="bg-accent hover:bg-accent-dark" asChild>
                <Link href="/auth/sign-up">ابدأ الآن</Link>
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/workers">العمال</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/requests">الطلبات</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/chats">المحادثات</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">من نحن</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">اتصل بنا</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
