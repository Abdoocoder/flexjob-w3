import { createClient, getUserProfile } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Building2, FileText, Star, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { VerifyButton } from "@/components/verify-button"
import { StatCard } from "@/components/stat-card"
import { JOB_STATUS_LABELS, APPLICATION_STATUS_LABELS, ROLE_LABELS } from "@/lib/constants"

export default async function AdminDashboard() {
  const { user, profile } = await getUserProfile()

  if (!user) redirect("/auth/login")
  if (profile?.role !== "admin") redirect("/dashboard/worker")

  const supabase = await createClient()

  const [
    { data: profiles },
    { data: companies },
    { data: jobs },
    { data: applications },
  ]: any = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("*, profiles(full_name)").order("created_at", { ascending: false }),
    supabase.from("jobs").select("*, companies(company_name)").order("created_at", { ascending: false }),
    supabase.from("applications").select("*, profiles:worker_id(full_name), jobs(title)").order("created_at", { ascending: false }),
  ])

  const totalWorkers = profiles?.filter((p: any) => p.role === "worker").length || 0
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
          <h1 className="text-2xl font-bold text-foreground">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground">نظرة عامة وإدارة المنصة</p>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="العمال" value={totalWorkers} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard label="الشركات" value={totalCompanies} icon={<Building2 className="h-5 w-5 text-primary" />} />
        <StatCard label="الوظائف" value={totalJobs} icon={<Briefcase className="h-5 w-5 text-primary" />} />
        <StatCard label="الطلبات" value={totalApplications} icon={<FileText className="h-5 w-5 text-primary" />} />
      </div>

      {/* التبويبات */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
          <TabsTrigger value="companies">الشركات</TabsTrigger>
          <TabsTrigger value="jobs">الوظائف</TabsTrigger>
          <TabsTrigger value="applications">الطلبات</TabsTrigger>
        </TabsList>

        {/* تبويب المستخدمين */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>جميع المستخدمين ({profiles?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!profiles || profiles.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">لا يوجد مستخدمون بعد</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {profiles.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{p.full_name || "بدون اسم"}</p>
                          <Badge variant="outline">{ROLE_LABELS[p.role] || p.role}</Badge>
                          {p.is_verified && (
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" /> موثّق
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {p.city || "بدون مدينة"} - {p.phone || "بدون رقم جوال"}
                          {p.rating ? ` - ${Number(p.rating).toFixed(1)}` : ""}
                          {p.rating ? <Star className="mr-0.5 inline h-3 w-3" /> : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <VerifyButton profileId={p.id} isVerified={p.is_verified} />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(p.created_at), "d MMM")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الشركات */}
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>جميع الشركات ({companies?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!companies || companies.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">لا توجد شركات بعد</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {companies.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-foreground">{c.company_name}</p>
                        <p className="text-sm text-muted-foreground">
                          المالك: {c.profiles?.full_name || "غير معروف"}
                          {c.cr_number && ` - سجل تجاري: ${c.cr_number}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(c.created_at), "d MMM yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الوظائف */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>جميع الوظائف ({jobs?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!jobs || jobs.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">لا توجد وظائف بعد</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {jobs.map((j: any) => (
                    <div key={j.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{j.title}</p>
                          <Badge variant={j.status === "open" ? "default" : "secondary"}>
                            {JOB_STATUS_LABELS[j.status] || j.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {j.companies?.company_name}
                          {j.city && ` - ${j.city}`}
                          {j.salary && ` - ${j.salary} ريال`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(j.created_at), "d MMM yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الطلبات */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>جميع الطلبات ({applications?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!applications || applications.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">لا توجد طلبات بعد</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {applications.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {a.profiles?.full_name || "غير معروف"} تقدّم على{" "}
                          <span className="text-primary">{a.jobs?.title || "وظيفة غير معروفة"}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(a.created_at), "d MMM yyyy")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          a.status === "accepted" ? "default" : a.status === "rejected" ? "destructive" : "outline"
                        }
                      >
                        {APPLICATION_STATUS_LABELS[a.status] || a.status}
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

