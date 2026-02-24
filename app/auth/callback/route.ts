import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role || "worker"

      if (role === "company") return NextResponse.redirect(`${origin}/dashboard/company`)
      if (role === "admin") return NextResponse.redirect(`${origin}/dashboard/admin`)
      return NextResponse.redirect(`${origin}/dashboard/worker`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
