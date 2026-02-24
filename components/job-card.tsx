import Link from "next/link"
import { MapPin, Calendar, DollarSign, Users, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { format } from "date-fns"

interface Job {
  id: string
  title: string
  description: string | null
  city: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  salary: number | null
  workers_needed: number
  status: string
  created_at: string
  companies: {
    company_name: string
    logo_url: string | null
    profile_id: string
  } | null
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                {job.title}
              </h3>
              {job.companies && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {job.companies.company_name}
                </div>
              )}
            </div>
            <Badge
              variant={job.status === "open" ? "default" : "secondary"}
              className="shrink-0 capitalize"
            >
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-0">
          {job.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {job.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.city}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> {job.salary} SAR
              </span>
            )}
            {job.workers_needed > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {job.workers_needed} needed
              </span>
            )}
            {job.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {format(new Date(job.start_date), "MMM d")}
                {job.end_date && ` - ${format(new Date(job.end_date), "MMM d")}`}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
