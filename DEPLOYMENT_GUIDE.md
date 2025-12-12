# دليل النشر - وصلني عامل

## 🚀 النشر على Vercel

### الخطوة 1: إعداد Vercel

1. **إنشاء حساب Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجّل الدخول بحساب GitHub/GitLab/Bitbucket

2. **ربط المشروع**
   - اضغط "Add New Project"
   - اختر المستودع (Repository) الخاص بك
   - Vercel سيكتشف تلقائياً أنه Next.js

3. **إعدادات البناء**
   - Framework Preset: **Next.js**
   - Build Command: `pnpm build` (أو `npm run build`)
   - Output Directory: `.next` (افتراضي)
   - Install Command: `pnpm install` (أو `npm install`)

---

## 🔐 الخطوة 2: إعداد متغيرات البيئة

في Vercel Dashboard > Project Settings > Environment Variables، أضف:

### متغيرات Supabase (مطلوبة)
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### متغيرات Stripe (مطلوبة للدفع)
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

### متغيرات التطبيق (مطلوبة)
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.vercel.app/dashboard
```

### متغيرات Mapbox (اختياري)
```
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key
```

### متغيرات Sentry (اختياري)
```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

### متغيرات Analytics (اختياري)
```
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

**ملاحظة:** أضف نفس المتغيرات لـ:
- **Production**
- **Preview** (اختياري)
- **Development** (اختياري)

---

## 🗄️ الخطوة 3: إعداد Supabase للإنتاج

### 1. إنشاء مشروع Supabase للإنتاج
- اذهب إلى [supabase.com](https://supabase.com)
- أنشئ مشروع جديد (أو استخدم الموجود)
- احفظ **Project URL** و **Anon Key**

### 2. تشغيل SQL Scripts
في Supabase Dashboard > SQL Editor، شغّل بالترتيب:
1. `scripts/001_create_profiles.sql`
2. `scripts/002_create_services.sql`
3. `scripts/003_create_workers.sql`
4. `scripts/004_create_worker_portfolio.sql`
5. `scripts/005_create_service_requests.sql`
6. `scripts/006_create_bids.sql`
7. `scripts/007_create_reviews.sql`
8. `scripts/008_create_chats.sql`
9. `scripts/009_create_messages.sql`
10. `scripts/010_create_loyalty_points.sql`
11. `scripts/011_create_worker_profiles_view.sql` (اختياري)
12. `scripts/012_create_notifications.sql` ⭐ جديد
13. `scripts/013_create_refunds.sql` ⭐ جديد

### 3. إعداد Storage Buckets
في Supabase Dashboard > Storage:
- أنشئ Buckets:
  - `avatars` (Public)
  - `portfolio` (Public)
  - `problem-images` (Public)
  - `messages` (Public)

### 4. تفعيل Realtime
في Supabase Dashboard > Database > Replication:
- فعّل Realtime لجدول `notifications`

### 5. إعداد RLS Policies
- تأكد من أن جميع RLS Policies مفعّلة
- اختبر الصلاحيات

---

## 💳 الخطوة 4: إعداد Stripe للإنتاج

### 1. الانتقال إلى Production Mode
- اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com)
- اضغط على "Activate account" للانتقال إلى Production

### 2. الحصول على API Keys
- اذهب إلى Developers > API keys
- انسخ:
  - **Secret Key** (يبدأ بـ `sk_live_`)
  - **Publishable Key** (يبدأ بـ `pk_live_`)

### 3. إعداد Webhook
- اذهب إلى Developers > Webhooks
- اضغط "Add endpoint"
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events to listen:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- انسخ **Signing secret** (يبدأ بـ `whsec_`)

---

## 🗺️ الخطوة 5: إعداد Mapbox (اختياري)

1. اذهب إلى [mapbox.com](https://www.mapbox.com)
2. سجّل الدخول
3. اذهب إلى Account > Access tokens
4. انسخ **Default public token**
5. أضفه في Vercel Environment Variables

---

## 📊 الخطوة 6: إعداد Sentry (اختياري)

1. اذهب إلى [sentry.io](https://sentry.io)
2. أنشئ مشروع جديد (Next.js)
3. اتبع التعليمات للحصول على:
   - DSN
   - Org slug
   - Project slug
   - Auth token
4. أضفها في Vercel Environment Variables

---

## 🚀 الخطوة 7: النشر

### في Vercel Dashboard:
1. اضغط "Deploy"
2. انتظر حتى يكتمل البناء
3. تحقق من أن البناء نجح بدون أخطاء

### بعد النشر:
1. افتح الرابط الذي أعطاك إياه Vercel
2. اختبر الصفحة الرئيسية
3. اختبر التسجيل
4. اختبر إنشاء طلب
5. اختبر الدفع (استخدم بطاقة اختبار Stripe)

---

## ✅ قائمة التحقق بعد النشر

### اختبار الوظائف الأساسية:
- [ ] الصفحة الرئيسية تفتح
- [ ] التسجيل يعمل
- [ ] تسجيل الدخول يعمل
- [ ] إنشاء طلب يعمل
- [ ] عرض العمال يعمل
- [ ] الخريطة تظهر (إذا أضفت Mapbox API key)
- [ ] الدفع يعمل (إذا أضفت Stripe keys)
- [ ] الإشعارات تعمل (إذا فعّلت Realtime)

### اختبار الأمان:
- [ ] لا يمكن الوصول لصفحات محمية بدون تسجيل دخول
- [ ] العملاء لا يمكنهم الوصول لصفحات العمال
- [ ] العمال لا يمكنهم الوصول لصفحات العملاء
- [ ] المديرون فقط يمكنهم الوصول للوحة الإدارة

### اختبار الأداء:
- [ ] الصفحات تتحمّل بسرعة
- [ ] الصور تظهر بشكل صحيح
- [ ] لا توجد أخطاء في Console
- [ ] لا توجد أخطاء في Network tab

---

## 🔧 حل المشاكل الشائعة

### خطأ: "Invalid API key"
- تحقق من أن متغيرات البيئة في Vercel صحيحة
- تأكد من نسخ القيم بدون مسافات إضافية
- تأكد من استخدام Production keys (ليس Test keys)

### خطأ: "relation does not exist"
- تأكد من تشغيل جميع SQL scripts في Supabase
- تحقق من أن الجداول موجودة في Supabase Dashboard

### الخريطة لا تظهر
- تحقق من `NEXT_PUBLIC_MAPBOX_API_KEY` في Vercel
- تأكد من أن API key صحيح ومفعّل

### الإشعارات لا تعمل
- تأكد من تفعيل Realtime في Supabase
- تحقق من أن جدول `notifications` موجود
- تأكد من RLS Policies

### الدفع لا يعمل
- تحقق من Stripe keys في Vercel
- تأكد من استخدام Production keys
- تحقق من Webhook URL في Stripe Dashboard

---

## 📝 ملاحظات مهمة

1. **استخدم Production Keys فقط** في Vercel
2. **لا تشارك** API keys أو Secrets
3. **فعّل RLS** في Supabase للأمان
4. **اختبر كل شيء** بعد النشر
5. **راقب الأخطاء** في Vercel Dashboard

---

## 🎉 بعد النشر

- ✅ المشروع الآن متاح على الإنترنت!
- ✅ يمكنك مشاركة الرابط مع المستخدمين
- ✅ راقب الأداء في Vercel Dashboard
- ✅ راقب الأخطاء في Sentry (إذا أضفته)

**مبروك! المشروع منشور الآن! 🚀**

