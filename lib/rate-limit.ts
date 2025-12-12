"use server"

// Simple in-memory rate limiter (for development)
// For production, use Redis or Upstash

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  limit: number // عدد الطلبات المسموح بها
  window: number // النافذة الزمنية بالثواني
  identifier?: string // معرف المستخدم (اختياري)
}

export async function rateLimit(
  key: string,
  options: RateLimitOptions = { limit: 10, window: 60 }
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const now = Date.now()
  const windowMs = options.window * 1000

  // تنظيف البيانات القديمة
  Object.keys(store).forEach((k) => {
    if (store[k].resetTime < now) {
      delete store[k]
    }
  })

  const record = store[key]

  if (!record || record.resetTime < now) {
    // إنشاء سجل جديد
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return {
      allowed: true,
      remaining: options.limit - 1,
      reset: now + windowMs,
    }
  }

  if (record.count >= options.limit) {
    // تم تجاوز الحد
    return {
      allowed: false,
      remaining: 0,
      reset: record.resetTime,
    }
  }

  // زيادة العداد
  record.count++
  return {
    allowed: true,
    remaining: options.limit - record.count,
    reset: record.resetTime,
  }
}

/**
 * Rate limiter للـ API routes
 */
export async function checkRateLimit(
  request: Request,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  // الحصول على IP من الطلب
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : "unknown"

  const key = `rate_limit:${ip}:${options.identifier || "default"}`

  const result = await rateLimit(key, options)

  if (!result.allowed) {
    return {
      success: false,
      error: "Too many requests",
      reset: result.reset,
    }
  }

  return {
    success: true,
    remaining: result.remaining,
    reset: result.reset,
  }
}

