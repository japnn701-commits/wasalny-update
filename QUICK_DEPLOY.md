# ⚡ نشر سريع - وصلني عامل

## خطوات سريعة للنشر على Vercel

### 1️⃣ ارفع الكود على GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2️⃣ أنشئ مشروع في Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "Add New Project"
3. اختر المستودع
4. اضغط "Deploy"

### 3️⃣ أضف متغيرات البيئة في Vercel
في Project Settings > Environment Variables:

**الحد الأدنى المطلوب:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**للدفع:**
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**للخريطة:**
```
NEXT_PUBLIC_MAPBOX_API_KEY=...
```

### 4️⃣ شغّل SQL Scripts في Supabase
- اذهب إلى Supabase Dashboard
- شغّل جميع scripts من `scripts/` بالترتيب

### 5️⃣ أعد النشر
- في Vercel Dashboard، اضغط "Redeploy"

---

## ✅ جاهز!

افتح الرابط من Vercel واختبر المشروع.

**للمزيد من التفاصيل:** راجع `DEPLOYMENT_GUIDE.md`

