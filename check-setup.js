#!/usr/bin/env node

/**
 * Script للتحقق من جاهزية المشروع للتشغيل
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 التحقق من جاهزية المشروع...\n');

let hasErrors = false;

// 1. التحقق من ملف .env.local
console.log('1. التحقق من ملف .env.local...');
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ ملف .env.local غير موجود');
  console.log('   💡 انسخ env.example إلى .env.local واملأ القيم');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL',
    'NEXT_PUBLIC_SITE_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const regex = new RegExp(`^${varName}=`, 'm');
    return !regex.test(envContent) || envContent.match(regex)[0].includes('your_');
  });
  
  if (missingVars.length > 0) {
    console.log('   ⚠️  متغيرات مفقودة أو غير مملوءة:');
    missingVars.forEach(v => console.log(`      - ${v}`));
    hasErrors = true;
  } else {
    console.log('   ✅ ملف .env.local موجود وجاهز');
  }
}

// 2. التحقق من node_modules
console.log('\n2. التحقق من node_modules...');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('   ❌ node_modules غير موجود');
  console.log('   💡 شغّل: pnpm install');
  hasErrors = true;
} else {
  console.log('   ✅ node_modules موجود');
}

// 3. التحقق من package.json
console.log('\n3. التحقق من package.json...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log('   ❌ package.json غير موجود');
  hasErrors = true;
} else {
  console.log('   ✅ package.json موجود');
}

// 4. التحقق من ملفات SQL
console.log('\n4. التحقق من ملفات SQL...');
const scriptsPath = path.join(process.cwd(), 'scripts');
if (!fs.existsSync(scriptsPath)) {
  console.log('   ❌ مجلد scripts غير موجود');
  hasErrors = true;
} else {
  const sqlFiles = fs.readdirSync(scriptsPath).filter(f => f.endsWith('.sql'));
  if (sqlFiles.length === 0) {
    console.log('   ⚠️  لا توجد ملفات SQL');
  } else {
    console.log(`   ✅ وجد ${sqlFiles.length} ملف SQL`);
  }
}

// النتيجة النهائية
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ المشروع غير جاهز للتشغيل');
  console.log('\n📝 خطوات الإعداد:');
  console.log('   1. انسخ env.example إلى .env.local');
  console.log('   2. املأ متغيرات البيئة في .env.local');
  console.log('   3. شغّل: pnpm install');
  console.log('   4. شغّل SQL scripts في Supabase');
  console.log('   5. شغّل: pnpm dev');
  process.exit(1);
} else {
  console.log('✅ المشروع جاهز للتشغيل!');
  console.log('\n🚀 شغّل: pnpm dev');
  process.exit(0);
}

