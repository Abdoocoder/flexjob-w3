"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RatingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    jobId: string
    toUserId: string
    toUserName: string
    onSuccess?: () => void
}

export function RatingDialog({
    open,
    onOpenChange,
    jobId,
    toUserId,
    toUserName,
    onSuccess,
}: RatingDialogProps) {
    const [score, setScore] = useState(0)
    const [hoverScore, setHoverScore] = useState(0)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        if (score === 0) {
            toast.error("يرجى اختيار تقييم")
            return
        }

        setSubmitting(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error("يجب تسجيل الدخول أولاً")
            setSubmitting(false)
            return
        }

        const { error } = await supabase.from("ratings").insert({
            job_id: jobId,
            from_user: user.id,
            to_user: toUserId,
            score,
            comment: comment || null,
        })

        if (error) {
            if (error.code === "23505") {
                toast.error("لقد قمت بتقييم هذا المستخدم بالفعل لهذه الوظيفة")
            } else {
                toast.error(error.message)
            }
            setSubmitting(false)
            return
        }

        toast.success(`تم تقييم ${toUserName} بنجاح!`)
        setSubmitting(false)
        onOpenChange(false)
        if (onSuccess) onSuccess()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>تقييم {toUserName}</DialogTitle>
                    <DialogDescription>
                        شاركنا تجربتك مع {toUserName} في هذه الوظيفة
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110"
                                onMouseEnter={() => setHoverScore(star)}
                                onMouseLeave={() => setHoverScore(0)}
                                onClick={() => setScore(star)}
                            >
                                <Star
                                    className={`h-8 w-8 ${(hoverScore || score) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="w-full space-y-2 text-start">
                        <p className="text-sm font-medium">تعليق (اختياري)</p>
                        <Textarea
                            placeholder="اكتب انطباعك..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:justify-start">
                    <Button
                        type="button"
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : null}
                        إرسال التقييم
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                    >
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
