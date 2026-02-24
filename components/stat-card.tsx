import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
    label: string
    value: number | string
    icon: React.ReactNode
    subtitle?: string
}

export function StatCard({ label, value, icon, subtitle }: StatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
            </CardContent>
        </Card>
    )
}
