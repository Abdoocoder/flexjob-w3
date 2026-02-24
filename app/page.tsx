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
              <Button variant="outline" size="sm">تسجيل الدخول</Button>
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
              منصة <span className="text-primary">FLEX JOBS</span> للعمل المرن
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              نسد الفجوة في سوق الوظائف الجزئية واليومية في المملكة العربية السعودية، تماشياً مع رؤية 2030. نربط الباحثين عن دخل مرن بالمنشآت التي تحتاج لموظفين مؤقتين في بيئة منظمة وشفافة.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up?role=worker">
                <Button size="lg" className="gap-2 px-8">
                  ابحث عن عمل مرن <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=company">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  وظّف بنظام الساعات <Users className="h-4 w-4" />
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
              نحل مشكلة الحاجة للكوادر المؤقتة في قطاعات التجزئة، الفعاليات، والخدمات اللوجستية.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="كفاءة عالية"
                description="تقليل زمن التوظيف وتلبية الاحتياجات التشغيلية الطارئة للمنشآت الصغيرة والمتوسطة."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="بيئة منظمة"
                description="بيئة عمل شفافة تضمن حقوق جميع الأطراف من خلال آليات تقييم واضحة."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="تمكين الشباب"
                description="دعم الاستقلال المالي للشباب السعودي وبناء خبراتهم العملية عبر فرص عمل مرنة."
              />
              <FeatureCard
                icon={<Star className="h-6 w-6" />}
                title="عدالة وشفافية"
                description="تكافؤ الفرص للجميع مع وضوح الأجور وآليات التوثيق للمنشآت والعمال."
              />
            </div>
          </div>
        </section>

        {/* دعوة للعمل */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground text-balance">
              مستعد للمشاركة في التحول الرقمي لسوق العمل؟
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              انضم إلى منصة فلكس جوب وساهم في تعزيز نمط التوظيف المرن في المملكة.
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

      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-right">
            <h3 className="font-bold text-lg mb-4">فلكس جوب</h3>
            <p className="text-sm text-muted-foreground">
              مرجعك الأول للوظائف المرنة في المملكة العربية السعودية.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-right">روابط سريعة</h3>
            <ul className="space-y-2 text-right text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">عن المنصة</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary transition-colors">تسجيل الدخول</Link></li>
              <li><Link href="/auth/sign-up" className="hover:text-primary transition-colors">ابدأ الآن</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
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
