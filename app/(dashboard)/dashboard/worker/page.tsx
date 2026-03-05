import { createClient, getUserProfile } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WorkerDashboardClient } from "./client-page"

export default async function WorkerDashboard() {
  const { user } = await getUserProfile()
  if (!user) redirect("/auth/login")

  const supabase = await createClient()

  const { data: applications } = await supabase
    .from("applications")
    .select("*, jobs(id, title, city, salary, status, start_date, companies(company_name, profile_id))")
    .eq("worker_id", user.id)
    .order("created_at", { ascending: false })

  const { data: profileStats } = await supabase
    .from("profiles")
    .select("rating, ratings_count")
    .eq("id", user.id)
    .single()

  return (
    <WorkerDashboardClient
      user={user}
      applications={applications || []}
      profileStats={profileStats}
    />
  )
}
