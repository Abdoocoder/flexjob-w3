# FlexJob - سوق العمل المرن 🚀

![FlexJob Banner](./public/banner.png)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blueviolet?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

**فلكس جوب (FlexJob)** هو سوق عمل رقمي متكامل مصمم لتمكين القوى العاملة والشركات في منطقة الشرق الأوسط. يوفر المنصة بيئة آمنة وفعالة لربط العمال المهرة بالفرص الوظيفية المرنة، مع التركيز على الشفافية وتجربة المستخدم السلسة بدعم كامل للغة العربية (RTL).

---

## 🌟 الميزات الجوهرية (Key Features)

### 👤 تجربة المستخدم (UX)
*   **لوحة تحكم ذكية**: واجهات مخصصة لكل من (العامل، الشركة، والمدير) توفر رؤية شاملة للمهام والطلبات.
*   **نظام التقييم (Rating Hub)**: نظام تقييم متبادل بالنجوم (1-5) يضمن الجودة والاحترافية، مع تحديثات تلقائية لمتوسط التقييم عبر SQL Triggers.
*   **محرك بحث متطور**: فلاتر تصفية ذكية حسب (المدينة، الراتب، المسمى الوظيفي) لتسهيل العثور على الفرصة المثالية.
*   **تنبيهات فورية**: نظام إشعارات مركزي للبقاء على اطلاع دائم بتحديثات الطلبات والرسائل.

### 🔒 الأمن والموثوقية (Security)
*   **حماية الجلسات (Middleware)**: إدارة آلية لجلسات المستخدمين لمنع تسجيل الخروج العشوائي وضمان استقرار الاتصال.
*   **سياسات RLS صارمة**: حماية كاملة للبيانات على مستوى قاعدة البيانات (Row Level Security) تضمن عدم وصول أي مستخدم لبيانات الآخرين.
*   **تحقق مزدوج (Zod)**: التحقق من صحة جميع المدخلات في النماذج (Forms) باستخدام Zod لمنع حقن السكربتات والأخطاء التقنية.

---

## 🛠️ البنية التقنية (Tech Stack)

| التقنية | الدور |
|---|---|
| **Next.js 16.1 (Turbopack)** | إطار عمل الـ Frontend و Backend (Server Components). |
| **Supabase** | قاعدة البيانات، المصادقة (Auth)، وتخزين الملفات. |
| **TypeScript** | لضمان سلامة الكود (Type-safety) واكتشاف الأخطاء مبكراً. |
| **Zod** | للتحقق من صحة البيانات (Schemas Validation). |
| **Tailwind CSS 4.0** | لتصميم واجهات عصرية ومتجاوبة تدعم RTL بشكل طبيعي. |
| **Lucide React** | مكتبة الأيقونات المتجاوبة. |

---

## 📅 سجل التغييرات الأخير (Changelog - v1.2.0)

تم تنفيذ **17 تحسيناً** كبيراً في التحديث الأخير لرفع جودة المشروع إلى المعايير العالمية:

- [x] **تحديث Middleware**: الانتقال إلى نظام `proxy.ts` الجديد في Next.js 16 لإدارة الجلسات.
- [x] **تكامل Zod**: إضافة Schemas لجميع النماذج لضمان أمان المدخلات.
- [x] **نظام التقييم**: بناء واجهة RatingDialog مع Triggers آلية في قاعدة البيانات.
- [x] **إصلاح الأذونات**: ربط صلاحيات المستخدمين بجدول `profiles` حصراً للأمان.
- [x] **تحسين الأداء**: تفعيل تصفية الصور (Image Optimization) والترقيم (Pagination).
- [x] **تجربة المستخدم**: إضافة صفحات "نسيت كلمة المرور" وواجهات "Loading Skeletons".

---

## 🚀 التشغيل والإعداد (Installation)

1.  **استنساخ المستودع**:
    ```bash
    git clone https://github.com/Abdoocoder/flexjob-w3.git
    cd flexjob-w3
    ```

2.  **تثبيت التبعيات**:
    ```bash
    npm install
    ```

3.  **إعداد المتغيرات**:
    أنشئ ملف `.env.local` وأضف بيانات Supabase الخاصة بك.

4.  **التشغيل**:
    ```bash
    npm run dev
    ```

---

## 🤝 المساهمة (Contributing)

نحن نرحب بمساهمات المطورين! إذا كنت ترغب في تحسين **FlexJob**، يرجى اتباع الخطوات التالية:
1. قم بـ **Fork** للمشروع.
2. أنشئ فرعاً جديداً (`feature/NewFeature`).
3. تأكد من أن الكود يجتاز اختبارات الـ Lint والـ Typecheck: `npm run typecheck`.
4. ارفع الـ **Pull Request** مع شرح مفصل.

---

## 📄 الترخيص (License)

هذا المشروع مستضاف تحت رخصة **MIT**. يمكنك استخدامه، تعديله، وتوزيعه بحرية تامة مع ذكر المصدر.

---

### 📬 تواصل معنا
للبلاغات عن الأخطاء أو الاقتراحات، يرجى زيارة قسم الـ [Issues](https://github.com/Abdoocoder/flexjob-w3/issues) أو مراسلة المطور عبر GitHub.
