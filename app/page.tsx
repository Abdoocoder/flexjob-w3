import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Briefcase, Users, Star, ArrowLeft, Shield, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function LandingPage() {
  const user = await getUser()

  if (user) {
    const role = user.user_metadata?.role || "worker"
    if (role === "company") redirect("/dashboard/company")
    if (role === "admin") redirect("/dashboard/admin")
    redirect("/dashboard/worker")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">فلكس جوب</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">ابدأ الآن</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* البطل */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_50%)] opacity-[0.07]" />
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>عمل مرن، بشروطك</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              اعثر على العمل المناسب.{" "}
              <span className="text-primary">وظّف الأشخاص المناسبين.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              فلكس جوب يربط العمال بالشركات التي تبحث عن مساعدة مرنة ومؤقتة
              وبدوام جزئي. قدّم في ثوانٍ، وأدر فريقك بسهولة.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up?role=worker">
                <Button size="lg" className="gap-2 px-8">
                  ابحث عن عمل <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=company">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  وظّف عمالاً <Users className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* المميزات */}
        <section className="border-t bg-card py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold text-foreground text-balance">
              لماذا تختار فلكس جوب؟
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground text-pretty">
              سوق عمل حديث مبني لطريقة عمل الناس اليوم.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="تقديم سريع"
                description="قدّم على الوظائف في ثوانٍ. بدون نماذج طويلة أو تعقيد. فقط اعثر على عمل يناسب جدولك."
              />
              <FeatureCard
                icon={<MapPin className="h-6 w-6" />}
                title="فرص محلية"
                description="اعثر على وظائف قريبة منك. فلتر حسب المدينة والموقع لاكتشاف عمل مناسب."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="ملفات موثقة"
                description="كل عامل وشركة يمرّ بعملية توثيق لضمان سوق عمل موثوق."
              />
              <FeatureCard
                icon={<Star className="h-6 w-6" />}
                title="التقييمات والمراجعات"
                description="ابنِ سمعتك من خلال تقييمات صادقة من العمال وأصحاب العمل."
              />
              <FeatureCard
                icon={<Briefcase className="h-6 w-6" />}
                title="لوحة تحكم الشركة"
                description="انشر وظائف، راجع الطلبات، وأدر فريق عملك من مكان واحد."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="لوحة تحكم العامل"
                description="تابع طلباتك، أدر ملفك الشخصي، واعثر على فرص جديدة."
              />
            </div>
          </div>
        </section>

        {/* دعوة للعمل */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground text-balance">
              مستعد للبدء؟
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              انضم إلى فلكس جوب اليوم وابدأ التواصل مع الفرص.
            </p>
            <div className="mt-8">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2 px-10">
                  أنشئ حساباً مجانياً <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          {'فلكس جوب \u00A9'} {new Date().getFullYear()}. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
