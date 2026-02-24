import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Briefcase, Users, Star, ArrowRight, Shield, Clock, MapPin } from "lucide-react"
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
            <span className="text-xl font-bold text-foreground">Flex Job</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_50%)] opacity-[0.07]" />
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Flexible work, on your terms</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the right work.{" "}
              <span className="text-primary">Hire the right people.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Flex Job connects workers with businesses looking for flexible,
              temporary, and part-time help. Apply in seconds, manage your team
              with ease.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up?role=worker">
                <Button size="lg" className="gap-2 px-8">
                  Find Work <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=company">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  Hire Workers <Users className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-card py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold text-foreground text-balance">
              Why choose Flex Job?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground text-pretty">
              A modern marketplace built for the way people actually work today.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="Quick Applications"
                description="Apply to jobs in seconds. No long forms, no hassle. Just find work that fits your schedule."
              />
              <FeatureCard
                icon={<MapPin className="h-6 w-6" />}
                title="Local Opportunities"
                description="Find jobs near you. Filter by city and location to discover work that is convenient."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Verified Profiles"
                description="Every worker and company goes through verification for a trustworthy marketplace."
              />
              <FeatureCard
                icon={<Star className="h-6 w-6" />}
                title="Ratings & Reviews"
                description="Build your reputation with honest ratings from both workers and employers."
              />
              <FeatureCard
                icon={<Briefcase className="h-6 w-6" />}
                title="Company Dashboard"
                description="Post jobs, review applications, and manage your workforce all in one place."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Worker Dashboard"
                description="Track your applications, manage your profile, and find new opportunities."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground text-balance">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Join Flex Job today and start connecting with opportunities.
            </p>
            <div className="mt-8">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2 px-10">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          Flex Job &copy; {new Date().getFullYear()}. All rights reserved.
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
