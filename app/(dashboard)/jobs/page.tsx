import { createClient } from "@/lib/supabase/server"
import { JobCard } from "@/components/job-card"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; city?: string }>
}) {
  const { query, city } = await searchParams
  const supabase = await createClient()

  let dbQuery = supabase
    .from("jobs")
    .select("*, companies(company_name, logo_url, profile_id)")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  if (query) {
    dbQuery = dbQuery.ilike("title", `%${query}%`)
  }

  if (city && city !== "all") {
    dbQuery = dbQuery.eq("city", city)
  }

  const { data: jobs } = await dbQuery

  // Get unique cities for filter
  const { data: citiesData } = await supabase
    .from("jobs")
    .select("city")
    .eq("status", "open")

  const cities = Array.from(new Set(citiesData?.map(j => j.city).filter(Boolean)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">الاستكشاف</h1>
        <p className="text-muted-foreground">ابحث عن أفضل الفرص المتاحة</p>
      </div>

      {/* شريط البحث والفلترة */}
      <form action="/jobs" className="grid gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="query"
            placeholder="ابحث عن وظيفة..."
            defaultValue={query}
            className="pr-10"
          />
        </div>
        <div className="relative sm:col-span-4">
          <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            name="city"
            defaultValue={city || "all"}
            className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">كل المدن</option>
            {cities.map((c) => (
              <option key={String(c)} value={String(c)}>{String(c)}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {(!jobs || jobs.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
            <p className="text-lg font-medium text-foreground">لا توجد وظائف تطابق بحثك حالياً</p>
            <p className="mt-1 text-sm text-muted-foreground">جرب كلمات بحث أخرى أو تغيير المدينة</p>
          </div>
        )}
      </div>
    </div>
  )
}
