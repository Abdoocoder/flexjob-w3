import { createClient, getUserProfile } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUserProfile()

  if (!user) {
    redirect("/auth/login")
  }

  const role = profile?.role || user.user_metadata?.role || "worker"
  const fullName = profile?.full_name || user.user_metadata?.full_name || null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar role={role} fullName={fullName} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
