"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">حدث خطأ ما!</h1>
                <p className="max-w-[500px] text-muted-foreground">
                    نعتذر عن الإزعاج. حدث خطأ غير متوقع أثناء معالجة طلبك.
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={() => reset()} className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    حاول مرة أخرى
                </Button>
                <Button variant="outline" asChild className="gap-2">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </Button>
            </div>
        </div>
    )
}
