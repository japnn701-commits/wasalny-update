import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Wrench, MessageSquare, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function ChatsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get all chats for this user
  const { data: chats } = await supabase
    .from("chats")
    .select(`
      *,
      customer:profiles!chats_customer_id_fkey(id, full_name, avatar_url),
      worker:workers!inner(id, profiles!inner(id, full_name, avatar_url)),
      service_requests!inner(id, title, status),
      messages(id, content, created_at, is_read)
    `)
    .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
    .order("updated_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">وصلني عامل</span>
          </Link>

          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowRight className="ml-2 w-4 h-4" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <MessageSquare className="w-10 h-10 text-primary" />
              المحادثات
            </h1>
            <p className="text-lg text-muted-foreground">تواصل مع العملاء والعمال</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder="ابحث في المحادثات..." className="pr-10" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {chats && chats.length > 0 ? (
              chats.map((chat) => {
                const otherUser = profile?.user_type === "customer" ? chat.worker?.profiles : chat.customer

                const lastMessage = chat.messages?.[0]
                const unreadCount = chat.messages?.filter((m) => !m.is_read).length || 0

                return (
                  <Link key={chat.id} href={`/chats/${chat.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-primary">
                              {otherUser?.full_name?.charAt(0) || "؟"}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {otherUser?.full_name || "مستخدم"}
                              </h3>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(lastMessage.created_at).toLocaleDateString("ar-EG")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-1">
                              {chat.service_requests?.title}
                            </p>
                            {lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">{lastMessage.content}</p>
                            )}
                          </div>

                          {unreadCount > 0 && (
                            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">{unreadCount}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد محادثات بعد</h3>
                  <p className="text-muted-foreground mb-6">ابدأ بطلب خدمة للتواصل مع العمال</p>
                  <Button asChild>
                    <Link href="/requests/new">طلب خدمة جديد</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
