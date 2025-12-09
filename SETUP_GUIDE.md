# دليل الإعداد والنشر - وصلني عامل

## 📋 المتطلبات الأساسية

### 1. الحسابات المطلوبة:
- [ ] حساب Supabase
- [ ] حساب Stripe
- [ ] حساب Vercel (أو منصة نشر أخرى)
- [ ] حساب Google Maps API (اختياري - للخرائط)

---

## 🗄️ إعداد قاعدة البيانات (Supabase)

### الخطوة 1: إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. احفظ:
   - Project URL
   - Anon Key
   - Service Role Key (للمهام الإدارية)

### الخطوة 2: تشغيل SQL Scripts
قم بتشغيل الملفات بالترتيب التالي في SQL Editor:

1. `scripts/001_create_profiles.sql` - إنشاء جدول الملفات الشخصية
2. `scripts/002_create_services.sql` - إنشاء جدول الخدمات
3. `scripts/003_create_workers.sql` - إنشاء جدول العمال
4. `scripts/004_create_worker_portfolio.sql` - إنشاء جدول معرض الأعمال
5. `scripts/005_create_service_requests.sql` - إنشاء جدول الطلبات
6. `scripts/006_create_bids.sql` - إنشاء جدول العطاءات
7. `scripts/007_create_reviews.sql` - إنشاء جدول التقييمات
8. `scripts/008_create_chats.sql` - إنشاء جدول المحادثات
9. `scripts/009_create_messages.sql` - إنشاء جدول الرسائل
10. `scripts/010_create_loyalty_points.sql` - إنشاء جدول نقاط الولاء
11. `scripts/011_create_worker_profiles_view.sql` - إنشاء view للتوافق مع الكود

### الخطوة 3: إعداد Storage
1. اذهب إلى Storage في Supabase
2. أنشئ Buckets التالية:
   - `avatars` - لصور المستخدمين
   - `portfolio` - لصور معرض أعمال العمال
   - `problem-images` - لصور مشاكل العملاء
   - `messages` - لصور الرسائل

3. لكل bucket، اضبط Policies:
   ```sql
   -- مثال لـ avatars bucket
   -- Policy: Allow authenticated users to upload their own avatar
   CREATE POLICY "Users can upload own avatar"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Policy: Allow public read access
   CREATE POLICY "Public can view avatars"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'avatars');
   ```

---

## 💳 إعداد Stripe

### الخطوة 1: إنشاء حساب Stripe
1. اذهب إلى [stripe.com](https://stripe.com)
2. أنشئ حساب (يمكنك استخدام Test Mode للاختبار)
3. احفظ:
   - Secret Key
   - Publishable Key

### الخطوة 2: إعداد Webhooks
1. اذهب إلى Developers > Webhooks
2. أضف endpoint جديد:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

3. احفظ Webhook Signing Secret

---

## 🔧 إعداد المشروع

### الخطوة 1: تثبيت المتطلبات
```bash
pnpm install
# أو
npm install
```

### الخطوة 2: إعداد متغيرات البيئة
أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Maps (اختياري)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### الخطوة 3: إنشاء API Route للـ Webhooks
أنشئ ملف `app/api/webhooks/stripe/route.ts`:

```typescript
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  const supabase = await createClient()

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      // Update payment status in database
      await supabase
        .from("service_requests")
        .update({
          payment_status: "paid",
          payment_method: "card",
        })
        .eq("id", session.metadata?.request_id)
      break

    case "payment_intent.succeeded":
      // Handle successful payment
      break

    case "payment_intent.payment_failed":
      // Handle failed payment
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
```

---

## 🚀 النشر على Vercel

### الخطوة 1: ربط المشروع
1. اذهب إلى [vercel.com](https://vercel.com)
2. استورد المشروع من GitHub/GitLab
3. اربط المشروع

### الخطوة 2: إضافة Environment Variables
في Vercel Dashboard > Settings > Environment Variables، أضف:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL` (URL الخاص بالموقع المنشور)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (اختياري)

### الخطوة 3: تحديث Stripe Webhook URL
بعد النشر، حدّث Stripe Webhook URL إلى:
`https://your-domain.vercel.app/api/webhooks/stripe`

---

## ✅ التحقق من الإعداد

### قائمة التحقق:

- [ ] قاعدة البيانات تم إنشاؤها وجميع الجداول موجودة
- [ ] Storage buckets تم إنشاؤها والسياسات محددة
- [ ] متغيرات البيئة محددة بشكل صحيح
- [ ] Stripe webhook يعمل
- [ ] يمكن للمستخدمين التسجيل
- [ ] يمكن للعملاء إنشاء طلبات
- [ ] يمكن للعمال عرض الطلبات
- [ ] نظام الدفع يعمل
- [ ] المحادثات تعمل
- [ ] رفع الصور يعمل

---

## 🐛 حل المشاكل الشائعة

### مشكلة: `worker_profiles` table not found
**الحل:** قم بتشغيل `scripts/011_create_worker_profiles_view.sql` أو قم بتحديث الكود لاستخدام `workers` مباشرة

### مشكلة: الصور لا ترفع
**الحل:** تأكد من:
- إنشاء Storage buckets
- تحديد Policies بشكل صحيح
- إضافة متغيرات البيئة

### مشكلة: Stripe webhook لا يعمل
**الحل:** تأكد من:
- Webhook URL صحيح
- Webhook Secret صحيح
- الـ endpoint موجود ويعمل

### مشكلة: الخريطة لا تعمل
**الحل:** 
- أضف Google Maps API Key
- أو استخدم Mapbox بدلاً منها
- أو اتركها كـ placeholder للآن

---

## 📞 الدعم

إذا واجهت أي مشاكل، راجع:
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - قائمة التحقق الكاملة
- [README.md](./README.md) - معلومات عامة عن المشروع

