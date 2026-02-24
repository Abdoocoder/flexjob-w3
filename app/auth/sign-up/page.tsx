"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Briefcase, Loader2, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "worker"

  const [role, setRole] = useState<"worker" | "company">(defaultRole as "worker" | "company")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [crNumber, setCrNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const metadata: Record<string, string> = {
      role,
      full_name: fullName,
      phone,
      city,
    }

    if (role === "company") {
      metadata.company_name = companyName
      metadata.cr_number = crNumber
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
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
            <span className="text-xl font-bold text-foreground">Flex Job</span>
          </Link>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Choose your account type and fill in your details</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                role === "worker"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">Worker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("company")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                role === "company"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <Building2 className="h-6 w-6" />
              <span className="text-sm font-medium">Company</span>
            </button>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Riyadh"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            {role === "company" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="crNumber">CR Number (optional)</Label>
                  <Input
                    id="crNumber"
                    placeholder="Commercial registration number"
                    value={crNumber}
                    onChange={(e) => setCrNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
