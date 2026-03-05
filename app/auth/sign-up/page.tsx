"use client"

export const dynamic = 'force-dynamic'

import { Suspense, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Briefcase, Loader2, User, Building2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpInput } from "@/lib/validations"

function SignUpForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "worker"

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: (defaultRole as "worker" | "company") || "worker",
    },
  })

  const role = watch("role")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(data: SignUpInput) {
    setLoading(true)

    const supabase = createClient()

    const metadata: Record<string, any> = {
      role: data.role,
      full_name: data.fullName,
      phone: data.phone || null,
      city: data.city || null,
    }

    if (data.role === "company") {
      metadata.company_name = data.companyName
      metadata.cr_number = data.crNumber || null
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/auth/callback`,
        data: metadata,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.push("/auth/sign-up-success")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">فلكس جوب</span>
          </Link>
          <CardTitle className="text-2xl">أنشئ حسابك</CardTitle>
          <CardDescription>اختر نوع الحساب واملأ بياناتك</CardDescription>
        </CardHeader>
        <CardContent>
          {/* اختيار نوع الحساب */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "worker")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${role === "worker"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
                }`}
            >
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">عامل</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "company")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${role === "company"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
                }`}
            >
              <Building2 className="h-6 w-6" />
              <span className="text-sm font-medium">شركة</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                placeholder="اسمك الكامل"
                {...register("fullName")}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="6 أحرف على الأقل"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input
                  id="phone"
                  placeholder="05XXXXXXXX"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  placeholder="الرياض"
                  {...register("city")}
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>

            {role === "company" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="companyName">اسم الشركة</Label>
                  <Input
                    id="companyName"
                    placeholder="اسم شركتك"
                    {...register("companyName")}
                    className={errors.companyName ? "border-destructive" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive">{errors.companyName.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="crNumber">رقم السجل التجاري (اختياري)</Label>
                  <Input
                    id="crNumber"
                    placeholder="رقم السجل التجاري"
                    {...register("crNumber")}
                    className={errors.crNumber ? "border-destructive" : ""}
                  />
                  {errors.crNumber && (
                    <p className="text-xs text-destructive">{errors.crNumber.message}</p>
                  )}
                </div>
              </>
            )}

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              إنشاء الحساب
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              سجّل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
