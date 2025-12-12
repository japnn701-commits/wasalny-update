# التحقق من إعداد المشروع

استخدم هذا الملف للتحقق من أن كل شيء جاهز لتشغيل المشروع.

## ✅ خطوات التحقق

### 1. تثبيت المتطلبات
```bash
# تأكد من تثبيت Node.js 18+ 
node --version

# تثبيت المكتبات
pnpm install
# أو
npm install
```

### 2. ملف متغيرات البيئة
- [ ] نسخ `env.example` إلى `.env.local`
- [ ] ملء جميع القيم المطلوبة:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] `STRIPE_SECRET_KEY` (اختياري للاختبار)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (اختياري للاختبار)
  - [ ] `STRIPE_WEBHOOK_SECRET` (اختياري للاختبار)

### 3. قاعدة البيانات
- [ ] إنشاء مشروع Supabase جديد
- [ ] تشغيل جميع SQL scripts بالترتيب:
  - [ ] `scripts/001_create_profiles.sql`
  - [ ] `scripts/002_create_services.sql`
  - [ ] `scripts/003_create_workers.sql`
  - [ ] `scripts/004_create_worker_portfolio.sql`
  - [ ] `scripts/005_create_service_requests.sql`
  - [ ] `scripts/006_create_bids.sql`
  - [ ] `scripts/007_create_reviews.sql`
  - [ ] `scripts/008_create_chats.sql`
  - [ ] `scripts/009_create_messages.sql`
  - [ ] `scripts/010_create_loyalty_points.sql`
  - [ ] `scripts/011_create_worker_profiles_view.sql` (اختياري)

### 4. Supabase Storage (اختياري)
- [ ] إنشاء Bucket: `avatars` (Public)
- [ ] إنشاء Bucket: `portfolio` (Public)
- [ ] إنشاء Bucket: `problem-images` (Public)
- [ ] إنشاء Bucket: `messages` (Public)

### 5. التحقق من الكود
```bash
# التحقق من TypeScript
pnpm type-check

# التحقق من ESLint
pnpm lint

# تنسيق الكود
pnpm format:check
```

### 6. تشغيل المشروع
```bash
# تشغيل في وضع التطوير
pnpm dev

# التحقق من أن الموقع يعمل على http://localhost:3000
```

### 7. اختبار الوظائف الأساسية
- [ ] فتح الصفحة الرئيسية
- [ ] التسجيل كعميل جديد
- [ ] التسجيل كعامل جديد
- [ ] تسجيل الدخول
- [ ] إنشاء طلب خدمة جديد
- [ ] عرض قائمة العمال
- [ ] الوصول للوحة التحكم

## 🐛 حل المشاكل الشائعة

### خطأ: "Invalid API key"
- تأكد من نسخ `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` بشكل صحيح
- تأكد من عدم وجود مسافات إضافية في `.env.local`
- تأكد من أن الملف `.env.local` موجود في جذر المشروع

### خطأ: "relation does not exist"
- تأكد من تشغيل جميع SQL scripts بالترتيب
- تحقق من أن الجداول موجودة في Supabase Dashboard > Table Editor

### خطأ: "Module not found"
- احذف `node_modules` و `.next`
- شغل `pnpm install` مرة أخرى
- شغل `pnpm dev` مرة أخرى

### الصفحة لا تعمل
- تأكد من تشغيل `pnpm dev`
- تحقق من console للأخطاء
- تأكد من أن المتصفح يدعم JavaScript
- تحقق من أن المنفذ 3000 غير مستخدم

## 📝 ملاحظات

- Stripe غير مطلوب للاختبار الأساسي
- الخريطة تعرض placeholder حالياً (يمكن إضافة Google Maps لاحقاً)
- رفع الصور يحتاج إعداد Storage buckets في Supabase


