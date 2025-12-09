"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createPaymentSession(requestId: string, amount: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get request details
  const { data: request } = await supabase
    .from("service_requests")
    .select("*, services(name_ar, name_en), workers!inner(profiles!inner(full_name))")
    .eq("id", requestId)
    .single()

  if (!request || request.customer_id !== user.id) {
    throw new Error("Request not found")
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `خدمة ${request.services?.name_ar || request.services?.name_en || "خدمة"}`,
            description: request.title,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      request_id: requestId,
      customer_id: user.id,
    },
  })

  return session.client_secret
}

export async function getPaymentStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    payment_status: session.payment_status,
  }
}
