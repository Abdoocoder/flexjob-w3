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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postJobSchema, type PostJobInput } from "@/lib/validations"

export default function PostJobPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostJobInput>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      workersNeeded: "1",
    },
  })

  async function onSubmit(data: PostJobInput) {
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
      title: data.title,
      description: data.description || null,
      city: data.city || null,
      location: data.location || null,
      salary: data.salary ? parseFloat(data.salary) : null,
      workers_needed: parseInt(data.workersNeeded) || 1,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
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
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">المسمى الوظيفي *</Label>
              <Input
                id="title"
                placeholder="مثال: مساعد مستودع"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                placeholder="اشرح مسؤوليات ومتطلبات الوظيفة..."
                {...register("description")}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  placeholder="الرياض"
                  {...register("city")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">تفاصيل الموقع</Label>
                <Input
                  id="location"
                  placeholder="الموقع المحدد"
                  {...register("location")}
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
                  {...register("salary")}
                  className={errors.salary ? "border-destructive" : ""}
                />
                {errors.salary && (
                  <p className="text-xs text-destructive">{errors.salary.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="workersNeeded">عدد العمال المطلوبين</Label>
                <Input
                  id="workersNeeded"
                  type="number"
                  {...register("workersNeeded")}
                  className={errors.workersNeeded ? "border-destructive" : ""}
                />
                {errors.workersNeeded && (
                  <p className="text-xs text-destructive">{errors.workersNeeded.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
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
