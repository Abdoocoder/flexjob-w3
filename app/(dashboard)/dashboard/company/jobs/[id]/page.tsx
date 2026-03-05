import { createClient, getUserProfile } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { CompanyJobDetailClient } from "./client-page"

export default async function CompanyJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, profile } = await getUserProfile()

  if (!user) redirect("/auth/login")
  const role = profile?.role || user.user_metadata?.role || "worker"
  if (role !== "company") redirect("/dashboard/worker")

  const supabase = await createClient()

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("profile_id", user.id)
    .single()

  if (!company) redirect("/dashboard/company")

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("company_id", company.id)
    .single()

  if (!job) notFound()

  const { data: applications } = await supabase
    .from("applications")
    .select("*, profiles:worker_id(id, full_name, phone, city, rating, ratings_count)")
    .eq("job_id", id)
    .order("created_at", { ascending: false })

  return <CompanyJobDetailClient job={job} applications={applications || []} />
}

