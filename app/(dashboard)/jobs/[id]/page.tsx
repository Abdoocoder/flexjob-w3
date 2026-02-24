import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, Calendar, DollarSign, Users, Building2, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ApplyButton } from "@/components/apply-button"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from("jobs")
    .select("*, companies(company_name, logo_url, profile_id)")
    .eq("id", id)
    .single()

  if (!job) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role || "worker"
  const isWorker = role === "worker"

  let hasApplied = false
  if (user && isWorker) {
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("worker_id", user.id)
      .maybeSingle()
    hasApplied = !!existingApp
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/jobs" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              {job.companies && (
                <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {job.companies.company_name}
                </div>
              )}
            </div>
            <Badge
              variant={job.status === "open" ? "default" : "secondary"}
              className="shrink-0 text-sm capitalize"
            >
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-4">
            {job.city && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Location
                </span>
                <span className="text-sm font-medium text-foreground">
                  {job.city}{job.location ? `, ${job.location}` : ""}
                </span>
              </div>
            )}
            {job.salary && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3" /> Salary
                </span>
                <span className="text-sm font-medium text-foreground">{job.salary} SAR</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> Workers Needed
              </span>
              <span className="text-sm font-medium text-foreground">{job.workers_needed}</span>
            </div>
            {job.start_date && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Duration
                </span>
                <span className="text-sm font-medium text-foreground">
                  {format(new Date(job.start_date), "MMM d, yyyy")}
                  {job.end_date && ` - ${format(new Date(job.end_date), "MMM d, yyyy")}`}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Description</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {job.description}
              </p>
            </div>
          )}

          {/* Apply Button */}
          {isWorker && user && job.status === "open" && (
            <div className="border-t pt-4">
              <ApplyButton
                jobId={job.id}
                workerId={user.id}
                hasApplied={hasApplied}
              />
            </div>
          )}

          {!user && (
            <div className="border-t pt-4">
              <Link href="/auth/login">
                <Button className="w-full">Sign in to Apply</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
