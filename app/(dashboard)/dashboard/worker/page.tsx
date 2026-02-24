import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Clock, CheckCircle2, XCircle, Star } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function WorkerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "worker") redirect("/dashboard/company")

  // Fetch worker's applications with job details
  const { data: applications } = await supabase
    .from("applications")
    .select("*, jobs(id, title, city, salary, status, start_date, companies(company_name))")
    .eq("worker_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch worker's profile for rating
  const { data: profile } = await supabase
    .from("profiles")
    .select("rating, ratings_count")
    .eq("id", user.id)
    .single()

  const total = applications?.length || 0
  const pending = applications?.filter((a) => a.status === "pending").length || 0
  const accepted = applications?.filter((a) => a.status === "accepted").length || 0
  const rejected = applications?.filter((a) => a.status === "rejected").length || 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Worker Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {user.user_metadata?.full_name || "Worker"}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={total}
          icon={<Briefcase className="h-5 w-5 text-primary" />}
        />
        <StatCard
          label="Pending"
          value={pending}
          icon={<Clock className="h-5 w-5 text-accent-foreground" />}
        />
        <StatCard
          label="Accepted"
          value={accepted}
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
        />
        <StatCard
          label="Rating"
          value={profile?.rating ? Number(profile.rating).toFixed(1) : "N/A"}
          icon={<Star className="h-5 w-5 text-accent-foreground" />}
          subtitle={profile?.ratings_count ? `${profile.ratings_count} reviews` : undefined}
        />
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No applications yet</p>
              <Link href="/jobs" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                Browse available jobs
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
                      {app.jobs?.salary && ` - ${app.jobs.salary} SAR`}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied {format(new Date(app.created_at), "MMM d, yyyy")}
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

function StatCard({
  label,
  value,
  icon,
  subtitle,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  subtitle?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    accepted: "default",
    rejected: "destructive",
  }
  return (
    <Badge variant={variants[status] || "secondary"} className="capitalize">
      {status}
    </Badge>
  )
}
