# 🔧 حل مشاكل رفع GitHub

## المشكلة: Permission denied (403)

هذا يعني أن حساب Git الحالي ليس لديه صلاحية للـ repository.

### الحل 1: استخدام Personal Access Token

1. **إنشاء Token:**
   - اذهب إلى GitHub.com
   - Settings > Developer settings > Personal access tokens > Tokens (classic)
   - اضغط "Generate new token (classic)"
   - اختر الصلاحيات: `repo` (كل الصلاحيات)
   - انسخ الـ Token (مثل: `ghp_xxxxxxxxxxxxx`)

2. **استخدام Token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/zoz211/wasalny-update.git
   ```
   
   أو استخدم اسم المستخدم والـ Token:
   ```bash
   git remote set-url origin https://zoz211:YOUR_TOKEN@github.com/zoz211/wasalny-update.git
   ```

3. **الآن جرب push:**
   ```bash
   git push
   ```

### الحل 2: استخدام SSH (أفضل)

1. **إنشاء SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   اضغط Enter للقيم الافتراضية

2. **نسخ المفتاح:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   انسخ الناتج

3. **إضافة المفتاح في GitHub:**
   - اذهب إلى GitHub > Settings > SSH and GPG keys
   - اضغط "New SSH key"
   - الصق المفتاح

4. **تغيير Remote إلى SSH:**
   ```bash
   git remote set-url origin git@github.com:zoz211/wasalny-update.git
   ```

5. **الآن جرب push:**
   ```bash
   git push
   ```

---

## خطوات سريعة (بعد حل مشكلة الصلاحيات)

```bash
# 1. إضافة الملفات (بدون المجلدات المشكلة)
git add .gitignore
git add .eslintrc.json .prettierrc .prettierignore .vercelignore
git add env.example
git add *.md
git add app/ components/ lib/ scripts/
git add package.json next.config.mjs vercel.json
git add sentry.*.ts check-setup.js

# 2. Commit
git commit -m "Add all improvements and fixes"

# 3. Push
git push
```

---

## إذا استمرت المشكلة

### إنشاء repository جديد:
1. اذهب إلى GitHub
2. أنشئ repository جديد باسم مختلف
3. غيّر Remote:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
   git push -u origin main
   ```

---

**جرب الحل 1 أولاً (Personal Access Token) - الأسهل! 🚀**

