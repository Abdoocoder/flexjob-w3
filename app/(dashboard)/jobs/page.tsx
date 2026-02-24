import { createClient } from "@/lib/supabase/server"
import { JobCard } from "@/components/job-card"

export default async function JobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, companies(company_name, logo_url, profile_id)")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Available Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          Browse open positions and apply today
        </p>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
          <p className="text-lg font-medium text-foreground">No jobs available yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back soon for new opportunities
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
