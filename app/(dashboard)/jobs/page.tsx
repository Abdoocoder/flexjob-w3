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
        <h1 className="text-2xl font-bold text-foreground">الوظائف المتاحة</h1>
        <p className="mt-1 text-muted-foreground">
          تصفّح الوظائف المفتوحة وقدّم اليوم
        </p>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
          <p className="text-lg font-medium text-foreground">لا توجد وظائف متاحة حالياً</p>
          <p className="mt-1 text-sm text-muted-foreground">
            تحقق لاحقاً للاطلاع على فرص جديدة
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
