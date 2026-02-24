import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            We sent you a confirmation link. Please check your inbox and click the link to activate your account.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
