"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Star } from "lucide-react"
import { toast } from "sonner"

const roleLabels: Record<string, string> = {
  worker: "عامل",
  company: "شركة",
  admin: "مدير",
}

export default function ProfilePage() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("")
  const [rating, setRating] = useState<number | null>(null)
  const [ratingsCount, setRatingsCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setFullName(user.user_metadata?.full_name || "")
        setPhone(user.user_metadata?.phone || "")
        setCity(user.user_metadata?.city || "")
        setRole(user.user_metadata?.role || "worker")

        const { data: profile } = await supabase
          .from("profiles")
          .select("rating, ratings_count, full_name, phone, city")
          .eq("id", user.id)
          .single()

        if (profile) {
          setFullName(profile.full_name || fullName)
          setPhone(profile.phone || phone)
          setCity(profile.city || city)
          setRating(profile.rating ? Number(profile.rating) : null)
          setRatingsCount(profile.ratings_count || 0)
        }
      }
      setFetching(false)
    }
    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("لم يتم تسجيل الدخول")
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, city })
      .eq("id", user.id)

    if (profileError) {
      toast.error(profileError.message)
      setLoading(false)
      return
    }

    await supabase.auth.updateUser({
      data: { full_name: fullName, phone, city },
    })

    toast.success("تم تحديث الملف الشخصي بنجاح")
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ملفك الشخصي</h1>
        <p className="mt-1 text-muted-foreground">أدر معلومات حسابك</p>
      </div>

      {/* بطاقة التقييم */}
      {rating !== null && (
        <Card className="mb-6">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{rating.toFixed(1)}/5.0</p>
              <p className="text-sm text-muted-foreground">
                بناءً على {ratingsCount} {ratingsCount === 1 ? "تقييم" : "تقييمات"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
          <CardDescription>
            نوع الحساب:{" "}
            <span className="font-medium text-primary">{roleLabels[role] || role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اسمك الكامل"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="الرياض"
                />
              </div>
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              حفظ التغييرات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
