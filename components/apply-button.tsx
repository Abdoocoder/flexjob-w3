"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ApplyButton({
  jobId,
  workerId,
  hasApplied,
}: {
  jobId: string
  workerId: string
  hasApplied: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)
  const router = useRouter()

  async function handleApply() {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      worker_id: workerId,
    })

    if (error) {
      if (error.code === "23505") {
        toast.error("You have already applied to this job")
      } else {
        toast.error(error.message)
      }
      setLoading(false)
      return
    }

    setApplied(true)
    toast.success("Application submitted successfully!")
    setLoading(false)
    router.refresh()
  }

  if (applied) {
    return (
      <Button disabled className="w-full gap-2" variant="secondary">
        <CheckCircle2 className="h-4 w-4" /> Already Applied
      </Button>
    )
  }

  return (
    <Button onClick={handleApply} disabled={loading} className="w-full">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Apply Now
    </Button>
  )
}
