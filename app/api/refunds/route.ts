import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { checkRateLimit } from "@/lib/rate-limit"

/**
 * POST /api/refunds - إنشاء طلب استرجاع
 */
export async function POST(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = await checkRateLimit(req, { limit: 5, window: 60 })
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)) } }
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { request_id, reason, amount } = body

    if (!request_id || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // التحقق من أن الطلب موجود وينتمي للمستخدم
    const { data: request, error: requestError } = await supabase
      .from("service_requests")
      .select("*")
      .eq("id", request_id)
      .eq("customer_id", user.id)
      .single()

    if (requestError || !request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // التحقق من أن الطلب مدفوع
    if (request.payment_status !== "paid") {
      return NextResponse.json({ error: "Request is not paid" }, { status: 400 })
    }

    // التحقق من أن الطلب لم يتم استرجاعه من قبل
    const { data: existingRefund } = await supabase
      .from("refunds")
      .select("*")
      .eq("request_id", request_id)
      .eq("status", "pending")
      .single()

    if (existingRefund) {
      return NextResponse.json({ error: "Refund request already exists" }, { status: 400 })
    }

    // إنشاء طلب استرجاع في قاعدة البيانات
    const refundAmount = amount || request.final_price || 0

    const { data: refund, error: refundError } = await supabase
      .from("refunds")
      .insert({
        request_id: request_id,
        customer_id: user.id,
        amount: refundAmount,
        reason,
        status: "pending",
      })
      .select()
      .single()

    if (refundError) {
      console.error("Error creating refund:", refundError)
      return NextResponse.json({ error: "Failed to create refund request" }, { status: 500 })
    }

    // إذا كان هناك payment_intent_id، يمكن إنشاء استرجاع في Stripe
    // هذا يتطلب إضافة payment_intent_id في جدول service_requests

    return NextResponse.json({ success: true, refund }, { status: 201 })
  } catch (error) {
    console.error("Refund error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/refunds - جلب طلبات الاسترجاع
 */
export async function GET(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req)
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    let query = supabase.from("refunds").select("*, service_requests(*)")

    if (profile?.user_type === "customer") {
      query = query.eq("customer_id", user.id)
    } else if (profile?.user_type === "admin") {
      // Admins can see all refunds
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: refunds, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch refunds" }, { status: 500 })
    }

    return NextResponse.json({ refunds })
  } catch (error) {
    console.error("Error fetching refunds:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

