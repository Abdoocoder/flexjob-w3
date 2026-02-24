import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, DollarSign, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ApplicationActions } from "@/components/application-actions"
import { JOB_STATUS_LABELS, APPLICATION_STATUS_LABELS } from "@/lib/constants"

export default async function CompanyJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "company") redirect("/dashboard/worker")

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("profile_id", user.id)
    .single()

  if (!company) redirect("/dashboard/company")

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("company_id", company.id)
    .single()

  if (!job) notFound()

  const { data: applications } = await supabase
    .from("applications")
    .select("*, profiles:worker_id(id, full_name, phone, city, rating, ratings_count)")
    .eq("job_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/company" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <Badge variant={job.status === "open" ? "default" : "secondary"}>
              {JOB_STATUS_LABELS[job.status] || job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {job.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.city}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> {job.salary} ريال
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {job.workers_needed} مطلوب
            </span>
            {job.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(job.start_date), "d MMM yyyy")}
                {job.end_date && ` - ${format(new Date(job.end_date), "d MMM yyyy")}`}
              </span>
            )}
          </div>
          {job.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* الطلبات */}
      <Card>
        <CardHeader>
          <CardTitle>
            الطلبات ({applications?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">لا توجد طلبات بعد</p>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {app.profiles?.full_name || "عامل غير معروف"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.profiles?.city && `${app.profiles.city} - `}
                      {app.profiles?.phone || "بدون رقم جوال"}
                      {app.profiles?.rating ? ` - التقييم: ${Number(app.profiles.rating).toFixed(1)}/5` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      تقدّم بتاريخ {format(new Date(app.created_at), "d MMM yyyy")}
                    </p>
                  </div>
                  <ApplicationActions
                    applicationId={app.id}
                    currentStatus={app.status}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
