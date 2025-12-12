# 🚀 رفع المشروع على GitHub - دليل خطوة بخطوة

## الخطوة 1: إنشاء مستودع جديد على GitHub

1. اذهب إلى [github.com](https://github.com)
2. سجّل الدخول (أو أنشئ حساب)
3. اضغط على **"+"** في الأعلى > **"New repository"**
4. املأ البيانات:
   - **Repository name:** `wasalny-amel` (أو أي اسم تريده)
   - **Description:** "منصة ذكية تربط بين العملاء والعمال الحرفيين"
   - **Visibility:** اختر **Private** (خاص) أو **Public** (عام)
   - **لا** تضع علامة على "Initialize with README"
5. اضغط **"Create repository"**

---

## الخطوة 2: إعداد Git في المشروع

افتح Terminal/PowerShell في مجلد المشروع واكتب:

### 1. تهيئة Git (إذا لم تكن مهيأ)
```bash
git init
```

### 2. إضافة جميع الملفات
```bash
git add .
```

### 3. عمل Commit أولي
```bash
git commit -m "Initial commit - Wasalny Amel project"
```

### 4. إضافة Remote (استبدل YOUR_USERNAME و REPO_NAME)
```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**مثال:**
```bash
git remote add origin https://github.com/ahmed/wasalny-amel.git
```

### 5. رفع الكود
```bash
git branch -M main
git push -u origin main
```

---

## ⚠️ إذا واجهت مشاكل

### المشكلة 1: "fatal: not a git repository"
**الحل:**
```bash
git init
```

### المشكلة 2: "remote origin already exists"
**الحل:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### المشكلة 3: "Authentication failed"
**الحل:** استخدم Personal Access Token:
1. اذهب إلى GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. اضغط "Generate new token"
3. اختر الصلاحيات: `repo` (كل الصلاحيات)
4. انسخ الـ Token
5. استخدمه ككلمة مرور عند `git push`

### المشكلة 4: "Large files" أو "File too large"
**الحل:** تأكد من أن `.gitignore` يحتوي على:
```
node_modules/
.next/
.env*
```

---

## 📋 قائمة سريعة (انسخ والصق)

```bash
# 1. تهيئة Git
git init

# 2. إضافة الملفات
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. إضافة Remote (استبدل بالرابط الصحيح)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. رفع الكود
git branch -M main
git push -u origin main
```

---

## ✅ التحقق من النجاح

بعد `git push`، اذهب إلى GitHub:
- يجب أن ترى جميع الملفات
- يجب أن ترى `package.json`, `app/`, `components/`, إلخ

---

## 🔄 تحديثات لاحقة

عندما تعدل ملفات وتريد رفعها:

```bash
git add .
git commit -m "وصف التغييرات"
git push
```

---

## 💡 نصائح

1. **لا ترفع `.env.local`** - يجب أن يكون في `.gitignore`
2. **لا ترفع `node_modules`** - يجب أن يكون في `.gitignore`
3. **استخدم commits واضحة** - مثل "إضافة نظام الإشعارات"
4. **ارفع بانتظام** - لا تنتظر حتى نهاية المشروع

---

**جاهز؟ ابدأ بالخطوة 1! 🚀**

