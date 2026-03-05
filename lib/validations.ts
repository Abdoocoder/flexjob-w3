import { z } from "zod"

// ======== Auth Schemas ========

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z
        .string()
        .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
})

export const signUpSchema = z
    .object({
        role: z.enum(["worker", "company"]),
        fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
        email: z
            .string()
            .min(1, "البريد الإلكتروني مطلوب")
            .email("يرجى إدخال بريد إلكتروني صحيح"),
        password: z
            .string()
            .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
        phone: z.string().optional(),
        city: z.string().optional(),
        companyName: z.string().optional(),
        crNumber: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.role === "company" && (!data.companyName || data.companyName.length < 2)) {
                return false
            }
            return true
        },
        { message: "اسم الشركة مطلوب (حرفين على الأقل)", path: ["companyName"] }
    )

export type LoginInput = z.infer<typeof loginSchema>
export type SignUpInput = z.infer<typeof signUpSchema>

// ======== Job Schemas ========

export const postJobSchema = z.object({
    title: z.string().min(3, "المسمى الوظيفي مطلوب (3 أحرف على الأقل)"),
    description: z.string().optional(),
    city: z.string().optional(),
    location: z.string().optional(),
    salary: z
        .string()
        .optional()
        .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), "يجب أن يكون رقمًا صحيحًا"),
    workersNeeded: z
        .string()
        .default("1")
        .refine((v) => !isNaN(Number(v)) && Number(v) >= 1, "يجب أن يكون عدد صحيح (1 على الأقل)"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})

export type PostJobInput = z.infer<typeof postJobSchema>

// ======== Profile Schemas ========

export const profileSchema = z.object({
    fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

// ======== Forgot Password Schema ========

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("يرجى إدخال بريد إلكتروني صحيح"),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
