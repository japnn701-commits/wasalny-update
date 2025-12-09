# دليل البدء السريع - وصلني عامل

## 🚀 خطوات التشغيل السريع

### 1. تثبيت المتطلبات

```bash
# تأكد من تثبيت Node.js 18+ و pnpm
pnpm install
# أو
npm install
```

### 2. إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروع جديد
2. احفظ:
   - **Project URL** (مثل: `https://xxxxx.supabase.co`)
   - **Anon Key** (مفتاح عام)

3. في Supabase Dashboard، اذهب إلى **SQL Editor** وقم بتشغيل الملفات بالترتيب:
   - `scripts/001_create_profiles.sql`
   - `scripts/002_create_services.sql`
   - `scripts/003_create_workers.sql`
   - `scripts/004_create_worker_portfolio.sql`
   - `scripts/005_create_service_requests.sql`
   - `scripts/006_create_bids.sql`
   - `scripts/007_create_reviews.sql`
   - `scripts/008_create_chats.sql`
   - `scripts/009_create_messages.sql`
   - `scripts/010_create_loyalty_points.sql`
   - `scripts/011_create_worker_profiles_view.sql` (اختياري)

### 3. إعداد Storage (اختياري للآن)

إذا أردت تجربة رفع الصور:
1. في Supabase Dashboard، اذهب إلى **Storage**
2. أنشئ Buckets التالية:
   - `avatars` (Public)
   - `portfolio` (Public)
   - `problem-images` (Public)
   - `messages` (Public)

### 4. إنشاء ملف `.env.local`

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (اختياري للاختبار المحلي)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Application URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Maps (اختياري)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**ملاحظة:** استبدل القيم بقيمك الفعلية من Supabase.

### 5. تشغيل المشروع

```bash
pnpm dev
# أو
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

## ✅ اختبار الوظائف الأساسية

### 1. التسجيل
- اذهب إلى `/auth/sign-up`
- سجل حساب جديد (عميل أو عامل)
- تحقق من أن الحساب تم إنشاؤه في Supabase

### 2. إنشاء طلب (للعملاء)
- سجل دخول كعميل
- اذهب إلى `/requests/new`
- أنشئ طلب خدمة جديد

### 3. عرض العمال
- اذهب إلى `/workers`
- تصفح قائمة العمال

### 4. لوحة التحكم
- اذهب إلى `/dashboard`
- تحقق من المعلومات المعروضة

## ⚠️ ملاحظات مهمة

1. **Stripe غير مطلوب للاختبار الأساسي** - يمكنك تجربة باقي الوظائف بدون Stripe
2. **الخريطة** - حالياً تعرض placeholder فقط، يمكنك إضافة Google Maps API لاحقاً
3. **رفع الصور** - يحتاج إعداد Storage buckets في Supabase

## 🐛 حل المشاكل الشائعة

### خطأ: "Invalid API key"
- تأكد من نسخ `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` بشكل صحيح
- تأكد من عدم وجود مسافات إضافية

### خطأ: "relation does not exist"
- تأكد من تشغيل جميع SQL scripts بالترتيب
- تحقق من أن الجداول موجودة في Supabase

### الصفحة لا تعمل
- تأكد من تشغيل `pnpm dev`
- تحقق من console للأخطاء
- تأكد من أن المتصفح يدعم JavaScript

## 📞 المساعدة

إذا واجهت أي مشاكل:
1. تحقق من `DEPLOYMENT_CHECKLIST.md`
2. راجع `SETUP_GUIDE.md` للتفاصيل الكاملة
3. تحقق من console في المتصفح والمحطة الطرفية

