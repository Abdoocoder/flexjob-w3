import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Clock, CheckCircle2, Star } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { StatCard } from "@/components/stat-card"
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"

export default async function WorkerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role
  if (role === "company") redirect("/dashboard/company")
  if (role === "admin") redirect("/dashboard/admin")
  if (role !== "worker") redirect("/dashboard/worker") // Fallback / current

  const { data: applications } = await supabase
    .from("applications")
    .select("*, jobs(id, title, city, salary, status, start_date, companies(company_name))")
    .eq("worker_id", user.id)
    .order("created_at", { ascending: false })

  const { data: profile } = await supabase
    .from("profiles")
    .select("rating, ratings_count")
    .eq("id", user.id)
    .single()

  const total = applications?.length || 0
  const pending = applications?.filter((a) => a.status === "pending").length || 0
  const accepted = applications?.filter((a) => a.status === "accepted").length || 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">لوحة تحكم العامل</h1>
        <p className="mt-1 text-muted-foreground">
          مرحباً بعودتك، {user.user_metadata?.full_name || "عامل"}
        </p>
      </div>

      {/* الإحصائيات */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الطلبات"
          value={total}
          icon={<Briefcase className="h-5 w-5 text-primary" />}
        />
        <StatCard
          label="قيد الانتظار"
          value={pending}
          icon={<Clock className="h-5 w-5 text-orange-500" />}
        />
        <StatCard
          label="مقبولة"
          value={accepted}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          label="التقييم"
          value={profile?.rating ? Number(profile.rating).toFixed(1) : "لا يوجد"}
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          subtitle={profile?.ratings_count ? `${profile.ratings_count} تقييم` : undefined}
        />
      </div>

      {/* قائمة الطلبات */}
      <Card>
        <CardHeader>
          <CardTitle>طلباتك</CardTitle>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">لا توجد طلبات بعد</p>
              <Link href="/jobs" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                تصفّح الوظائف المتاحة
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/jobs/${app.jobs?.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{app.jobs?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.jobs?.companies?.company_name}
                      {app.jobs?.city && ` - ${app.jobs.city}`}
                      {app.jobs?.salary && ` - ${app.jobs.salary} ريال`}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      تم التقديم {format(new Date(app.created_at), "d MMM yyyy")}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    accepted: "default",
    rejected: "destructive",
  }
  return (
    <Badge variant={variants[status] || "secondary"}>
      {APPLICATION_STATUS_LABELS[status] || status}
    </Badge>
  )
}
