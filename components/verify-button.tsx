"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Shield, ShieldOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function VerifyButton({
  profileId,
  isVerified,
}: {
  profileId: string
  isVerified: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(isVerified)
  const router = useRouter()

  async function toggleVerify() {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: !verified })
      .eq("id", profileId)

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setVerified(!verified)
    toast.success(verified ? "تم إلغاء التوثيق" : "تم التوثيق بنجاح")
    setLoading(false)
    router.refresh()
  }

  return (
    <Button
      size="sm"
      variant={verified ? "secondary" : "outline"}
      onClick={toggleVerify}
      disabled={loading}
      className="gap-1"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : verified ? (
        <ShieldOff className="h-3 w-3" />
      ) : (
        <Shield className="h-3 w-3" />
      )}
      {verified ? "إلغاء التوثيق" : "توثيق"}
    </Button>
  )
}
