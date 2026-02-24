import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Building2, FileText, Star, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { VerifyButton } from "@/components/verify-button"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "admin") redirect("/")

  // Fetch all data
  const [
    { data: profiles },
    { data: companies },
    { data: jobs },
    { data: applications },
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("*, profiles(full_name)").order("created_at", { ascending: false }),
    supabase.from("jobs").select("*, companies(company_name)").order("created_at", { ascending: false }),
    supabase.from("applications").select("*, profiles:worker_id(full_name), jobs(title)").order("created_at", { ascending: false }),
  ])

  const totalWorkers = profiles?.filter((p) => p.role === "worker").length || 0
  const totalCompanies = companies?.length || 0
  const totalJobs = jobs?.length || 0
  const totalApplications = applications?.length || 0

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Platform overview and management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Workers" value={totalWorkers} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard label="Companies" value={totalCompanies} icon={<Building2 className="h-5 w-5 text-primary" />} />
        <StatCard label="Jobs" value={totalJobs} icon={<Briefcase className="h-5 w-5 text-primary" />} />
        <StatCard label="Applications" value={totalApplications} icon={<FileText className="h-5 w-5 text-primary" />} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users ({profiles?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!profiles || profiles.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">No users yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{p.full_name || "Unnamed"}</p>
                          <Badge variant="outline" className="capitalize">{p.role}</Badge>
                          {p.is_verified && (
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {p.city || "No city"} - {p.phone || "No phone"}
                          {p.rating ? ` - ${Number(p.rating).toFixed(1)}` : ""}
                          {p.rating ? <Star className="ml-0.5 inline h-3 w-3" /> : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <VerifyButton profileId={p.id} isVerified={p.is_verified} />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(p.created_at), "MMM d")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>All Companies ({companies?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!companies || companies.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">No companies yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {companies.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-foreground">{c.company_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Owner: {c.profiles?.full_name || "Unknown"}
                          {c.cr_number && ` - CR: ${c.cr_number}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(c.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>All Jobs ({jobs?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!jobs || jobs.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">No jobs yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {jobs.map((j) => (
                    <div key={j.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{j.title}</p>
                          <Badge variant={j.status === "open" ? "default" : "secondary"} className="capitalize">
                            {j.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {j.companies?.company_name}
                          {j.city && ` - ${j.city}`}
                          {j.salary && ` - ${j.salary} SAR`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(j.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>All Applications ({applications?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!applications || applications.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">No applications yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {applications.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {a.profiles?.full_name || "Unknown"} applied for{" "}
                          <span className="text-primary">{a.jobs?.title || "Unknown job"}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(a.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          a.status === "accepted" ? "default" : a.status === "rejected" ? "destructive" : "outline"
                        }
                        className="capitalize"
                      >
                        {a.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
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
        </div>
      </CardContent>
    </Card>
  )
}
