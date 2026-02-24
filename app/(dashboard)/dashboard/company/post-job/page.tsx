"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function PostJobPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [workersNeeded, setWorkersNeeded] = useState("1")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be logged in")
      setLoading(false)
      return
    }

    // Get company
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!company) {
      toast.error("Company profile not found")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("jobs").insert({
      company_id: company.id,
      title,
      description: description || null,
      city: city || null,
      location: location || null,
      salary: salary ? parseFloat(salary) : null,
      workers_needed: parseInt(workersNeeded) || 1,
      start_date: startDate || null,
      end_date: endDate || null,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Job posted successfully!")
    router.push("/dashboard/company")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard/company" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
          <CardDescription>Fill in the details for your new job listing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Warehouse Assistant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the job responsibilities and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Riyadh"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location Detail</Label>
                <Input
                  id="location"
                  placeholder="Specific location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="salary">Salary (SAR)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="500"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  min="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="workersNeeded">Workers Needed</Label>
                <Input
                  id="workersNeeded"
                  type="number"
                  value={workersNeeded}
                  onChange={(e) => setWorkersNeeded(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
