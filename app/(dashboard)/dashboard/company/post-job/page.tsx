"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2 } from "lucide-react"
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
      toast.error("يجب تسجيل الدخول أولاً")
      setLoading(false)
      return
    }

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!company) {
      toast.error("لم يتم العثور على ملف الشركة")
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

    toast.success("تم نشر الوظيفة بنجاح!")
    router.push("/dashboard/company")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard/company" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>نشر وظيفة جديدة</CardTitle>
          <CardDescription>املأ تفاصيل الوظيفة الجديدة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">المسمى الوظيفي *</Label>
              <Input
                id="title"
                placeholder="مثال: مساعد مستودع"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                placeholder="اشرح مسؤوليات ومتطلبات الوظيفة..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  placeholder="الرياض"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">تفاصيل الموقع</Label>
                <Input
                  id="location"
                  placeholder="الموقع المحدد"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="salary">الراتب (ريال)</Label>
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
                <Label htmlFor="workersNeeded">عدد العمال المطلوبين</Label>
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
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              نشر الوظيفة
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
