import { Skeleton } from "@/components/ui/skeleton"

export function JobCardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-9 w-24 rounded-md" />
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-6">
                <div className="border rounded-xl p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}
