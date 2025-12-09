import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Wrench, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get chat details
  const { data: chat } = await supabase
    .from("chats")
    .select(`
      *,
      customer:profiles!chats_customer_id_fkey(id, full_name),
      worker:workers!inner(id, profiles!inner(id, full_name)),
      service_requests!inner(id, title, status)
    `)
    .eq("id", id)
    .single()

  if (!chat || (chat.customer_id !== user.id && chat.worker_id !== user.id)) {
    redirect("/chats")
  }

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(full_name)")
    .eq("chat_id", id)
    .order("created_at", { ascending: true })

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const otherUser = profile?.user_type === "customer" ? chat.worker?.profiles : chat.customer

  const handleSendMessage = async (formData: FormData) => {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const content = formData.get("content") as string
    if (!content.trim()) return

    await supabase.from("messages").insert({
      chat_id: id,
      sender_id: user.id,
      content: content.trim(),
    })

    await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", id)

    redirect(`/chats/${id}`)
  }

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
            <Link href="/chats">
              <ArrowRight className="ml-2 w-4 h-4" />
              العودة للمحادثات
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-4">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{otherUser?.full_name?.charAt(0) || "؟"}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">{otherUser?.full_name || "مستخدم"}</h2>
                    <p className="text-sm text-muted-foreground">{chat.service_requests?.title}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/requests/${chat.request_id}`}>عرض الطلب</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                {messages && messages.length > 0 ? (
                  messages.map((message) => {
                    const isOwn = message.sender_id === user.id
                    return (
                      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isOwn ? "bg-primary text-white" : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-muted-foreground"}`}>
                            {new Date(message.created_at).toLocaleTimeString("ar-EG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">لا توجد رسائل بعد. ابدأ المحادثة!</p>
                  </div>
                )}
              </div>

              <form action={handleSendMessage} className="flex gap-2">
                <Textarea name="content" placeholder="اكتب رسالتك..." rows={2} required className="flex-1" />
                <Button type="submit" size="lg" className="self-end">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
