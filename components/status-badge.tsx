import { Badge } from "@/components/ui/badge"
import { APPLICATION_STATUS_LABELS, JOB_STATUS_LABELS } from "@/lib/constants"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function StatusBadge({
    status,
    type = "application"
}: {
    status: string
    type?: "application" | "job"
}) {
    const applicationVariants: Record<string, BadgeVariant> = {
        pending: "outline",
        accepted: "default",
        rejected: "destructive",
    }

    const jobVariants: Record<string, BadgeVariant> = {
        open: "default",
        closed: "secondary",
        completed: "secondary",
    }

    const variant = type === "application"
        ? applicationVariants[status]
        : jobVariants[status]

    const label = type === "application"
        ? APPLICATION_STATUS_LABELS[status]
        : JOB_STATUS_LABELS[status]

    return (
        <Badge variant={variant || "secondary"}>
            {label || status}
        </Badge>
    )
}
