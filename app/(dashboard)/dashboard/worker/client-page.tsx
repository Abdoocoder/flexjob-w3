"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { RatingDialog } from "@/components/rating-dialog"
import { useState } from "react"

export function WorkerDashboardClient({ user, applications, profileStats }: any) {
    const [ratingTarget, setRatingTarget] = useState<any>(null)

    const total = applications?.length || 0
    const pending = applications?.filter((a: any) => a.status === "pending").length || 0
    const accepted = applications?.filter((a: any) => a.status === "accepted").length || 0

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">لوحة تحكم العامل</h1>
                <p className="mt-1 text-muted-foreground">
                    مرحباً بعودتك، {user.user_metadata?.full_name || "عامل"}
                </p>
            </div>

            {/* الإحصائيات */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="إجمالي الطلبات"
                    value={total}
                    icon={<Briefcase className="h-5 w-5 text-primary" />}
                />
                <StatCard
                    label="قيد الانتظار"
                    value={pending}
                    icon={<Clock className="h-5 w-5 text-orange-500" />}
                />
                <StatCard
                    label="مقبولة"
                    value={accepted}
                    icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                />
                <StatCard
                    label="التقييم"
                    value={profileStats?.rating ? Number(profileStats.rating).toFixed(1) : "لا يوجد"}
                    icon={<Star className="h-5 w-5 text-yellow-500" />}
                    subtitle={profileStats?.ratings_count ? `${profileStats.ratings_count} تقييم` : undefined}
                />
            </div>

            {/* قائمة الطلبات */}
            <Card>
                <CardHeader>
                    <CardTitle>طلباتك</CardTitle>
                </CardHeader>
                <CardContent>
                    {!applications || applications.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground">لا توجد طلبات بعد</p>
                            <Link href="/jobs" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                                تصفّح الوظائف المتاحة
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {applications.map((app: any) => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                >
                                    <Link href={`/jobs/${app.jobs?.id}`} className="flex-1">
                                        <p className="font-medium text-foreground">{app.jobs?.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {app.jobs?.companies?.company_name}
                                            {app.jobs?.city && ` - ${app.jobs.city}`}
                                            {app.jobs?.salary && ` - ${app.jobs.salary} ريال`}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            تم التقديم {format(new Date(app.created_at), "d MMM yyyy")}
                                        </p>
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        {app.status === "accepted" && app.jobs?.status === "completed" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 h-8"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setRatingTarget({
                                                        jobId: app.jobs.id,
                                                        toUserId: app.jobs.companies.profile_id,
                                                        toUserName: app.jobs.companies.company_name,
                                                    })
                                                }}
                                            >
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                تقييم الشركة
                                            </Button>
                                        )}
                                        <StatusBadge status={app.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {ratingTarget && (
                <RatingDialog
                    open={!!ratingTarget}
                    onOpenChange={(open) => !open && setRatingTarget(null)}
                    jobId={ratingTarget.jobId}
                    toUserId={ratingTarget.toUserId}
                    toUserName={ratingTarget.toUserName}
                />
            )}
        </div>
    )
}
