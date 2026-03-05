"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MapPin, DollarSign, Calendar, Users, Star } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ApplicationActions } from "@/components/application-actions"
import { StatusBadge } from "@/components/status-badge"
import { RatingDialog } from "@/components/rating-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CompanyJobDetailClient({ job, applications }: any) {
    const [ratingTarget, setRatingTarget] = useState<any>(null)

    return (
        <div className="mx-auto max-w-3xl">
            <Link href="/dashboard/company" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
            </Link>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <StatusBadge status={job.status} type="job" />
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
                            {applications.map((app: any) => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex-1">
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
                                    <div className="flex items-center gap-3">
                                        {app.status === "accepted" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 h-8"
                                                onClick={() => {
                                                    setRatingTarget({
                                                        jobId: job.id,
                                                        toUserId: app.profiles.id,
                                                        toUserName: app.profiles.full_name,
                                                    })
                                                }}
                                            >
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                تقييم العامل
                                            </Button>
                                        )}
                                        <ApplicationActions
                                            applicationId={app.id}
                                            currentStatus={app.status}
                                        />
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
