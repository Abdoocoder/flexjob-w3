"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ApplicationActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string
  currentStatus: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  async function updateStatus(newStatus: string) {
    setLoading(newStatus)
    const supabase = createClient()

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId)

    if (error) {
      toast.error(error.message)
      setLoading(null)
      return
    }

    setStatus(newStatus)
    toast.success(`Application ${newStatus}`)
    setLoading(null)
    router.refresh()
  }

  if (status !== "pending") {
    return (
      <Badge
        variant={status === "accepted" ? "default" : "destructive"}
        className="capitalize"
      >
        {status}
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => updateStatus("accepted")}
        disabled={!!loading}
        className="gap-1 text-foreground"
      >
        {loading === "accepted" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
        Accept
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => updateStatus("rejected")}
        disabled={!!loading}
        className="gap-1 text-destructive hover:text-destructive"
      >
        {loading === "rejected" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <X className="h-3 w-3" />
        )}
        Reject
      </Button>
    </div>
  )
}
