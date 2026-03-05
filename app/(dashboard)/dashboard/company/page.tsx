import { createClient, getUserProfile } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Clock, Plus, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { StatCard } from "@/components/stat-card"
import { JOB_STATUS_LABELS, ROLE_LABELS } from "@/lib/constants"
import { StatusBadge } from "@/components/status-badge"

export default async function CompanyDashboard() {
  const { user, profile } = await getUserProfile()

  if (!user) redirect("/auth/login")
  const role = profile?.role || user.user_metadata?.role || "worker"
  if (role !== "company") redirect("/dashboard/worker")

  const supabase = await createClient()

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("profile_id", user.id)
    .single()

  if (!company) redirect("/auth/login")

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, applications(id, status, worker_id)")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })

  const totalJobs = jobs?.length || 0
  const openJobs = jobs?.filter((j) => j.status === "open").length || 0
  const totalApplications = jobs?.reduce((sum, j) => sum + (j.applications?.length || 0), 0) || 0
  const pendingApplications = jobs?.reduce(
    (sum, j) => sum + (j.applications?.filter((a: { status: string }) => a.status === "pending").length || 0),
    0
  ) || 0

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة تحكم الشركة</h1>
          <p className="mt-1 text-muted-foreground">{company.company_name}</p>
        </div>
        <Link href="/dashboard/company/post-job">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> انشر وظيفة
          </Button>
        </Link>
      </div>

      {/* الإحصائيات */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الوظائف"
          value={totalJobs}
          icon={<Briefcase className="h-5 w-5 text-primary" />}
        />
        <StatCard
          label="وظائف مفتوحة"
          value={openJobs}
          icon={<Clock className="h-5 w-5 text-accent-foreground" />}
        />
        <StatCard
          label="إجمالي الطلبات"
          value={totalApplications}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard
          label="بانتظار المراجعة"
          value={pendingApplications}
          icon={<Star className="h-5 w-5 text-accent-foreground" />}
        />
      </div>

      {/* الوظائف */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>وظائفك</CardTitle>
        </CardHeader>
        <CardContent>
          {!jobs || jobs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">لم يتم نشر وظائف بعد</p>
              <Link href="/dashboard/company/post-job" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                انشر وظيفتك الأولى
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {jobs.map((job) => {
                const appCount = job.applications?.length || 0
                const pendingCount = job.applications?.filter(
                  (a: { status: string }) => a.status === "pending"
                ).length || 0

                return (
                  <Link
                    key={job.id}
                    href={`/dashboard/company/jobs/${job.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{job.title}</p>
                        <StatusBadge status={job.status} type="job" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job.city && `${job.city} - `}
                        {job.salary && `${job.salary} ريال - `}
                        {format(new Date(job.created_at), "d MMM yyyy")}
                      </p>
                    </div>
                    <div className="text-sm text-start">
                      <p className="font-medium text-foreground">{appCount} طلب</p>
                      {pendingCount > 0 && (
                        <p className="text-xs text-primary">{pendingCount} قيد الانتظار</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

