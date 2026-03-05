"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Briefcase, Loader2, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    async function onSubmit(data: ForgotPasswordInput) {
        setLoading(true)
        setError("")

        const supabase = createClient()
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
        })

        if (resetError) {
            setError(resetError.message)
            setLoading(false)
            return
        }

        setSubmitted(true)
        setLoading(false)
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">تحقق من بريدك الإلكتروني</CardTitle>
                        <CardDescription>
                            لقد أرسلنا رابطاً لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق منه للمتابعة.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href="/auth/login" className="mx-auto mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Briefcase className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">فلكس جوب</span>
                    </Link>
                    <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
                    <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة الوصول لحسابك</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <Button type="submit" className="mt-2 w-full" disabled={loading}>
                            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                            إرسال رابط الاستعادة
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link href="/auth/login" className="flex items-center gap-2">
                                <ArrowRight className="h-4 w-4" /> العودة لتسجيل الدخول
                            </Link>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
