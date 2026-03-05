'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

// ترجمة حالات الطلب
const STATUS_MESSAGES: Record<string, { title: string; description: string; variant: 'default' | 'destructive' }> = {
  accepted: {
    title: '🎉 تهانينا! تم قبول طلبك',
    description: 'تم قبول طلبك على الوظيفة. يمكنك الاطلاع على التفاصيل من لوحة التحكم.',
    variant: 'default',
  },
  rejected: {
    title: '❌ تم رفض طلبك',
    description: 'للأسف تم رفض طلبك على هذه الوظيفة. لا تستسلم، هناك فرص أخرى!',
    variant: 'destructive',
  },
  pending: {
    title: '⏳ طلبك قيد المراجعة',
    description: 'تم استلام طلبك وهو قيد المراجعة من قِبل الشركة.',
    variant: 'default',
  },
}

// ترجمة حالات الوظائف
const JOB_MESSAGES: Record<string, { title: string; description: string }> = {
  open: {
    title: '✨ وظيفة جديدة متاحة',
    description: 'تم نشر وظيفة جديدة قد تناسبك. تفقّد سوق الوظائف الآن!',
  },
  cancelled: {
    title: '⚠️ تم إلغاء وظيفة',
    description: 'تم إلغاء إحدى الوظائف التي تقدمت إليها.',
  },
}

interface UseRealtimeNotificationsProps {
  userId: string
  role: 'worker' | 'company' | 'admin'
}

export function useRealtimeNotifications({ userId, role }: UseRealtimeNotificationsProps) {
  const supabase = createClient()
  // نستخدم ref لمنع التكرار عند re-render
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const setupWorkerListeners = useCallback(() => {
    if (!userId) return

    // قناة إشعارات العامل
    const channel = supabase
      .channel(`worker-notifications-${userId}`)

      // مراقبة تغييرات حالة طلبات هذا العامل
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `worker_id=eq.${userId}`,
        },
        (payload) => {
          const newStatus = payload.new?.status as string
          const oldStatus = payload.old?.status as string

          // أظهر الإشعار فقط إذا تغيرت الحالة فعلاً
          if (newStatus && newStatus !== oldStatus) {
            const message = STATUS_MESSAGES[newStatus]
            if (message) {
              toast({
                title: message.title,
                description: message.description,
                variant: message.variant,
                duration: 6000,
              })
            }
          }
        },
      )

      // مراقبة وظائف جديدة (اختياري للعمال)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs',
        },
        () => {
          const message = JOB_MESSAGES['open']
          toast({
            title: message.title,
            description: message.description,
            duration: 5000,
          })
        },
      )

      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Worker realtime notifications connected')
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Worker realtime channel error')
        }
      })

    channelRef.current = channel
  }, [userId, supabase])

  const setupCompanyListeners = useCallback(() => {
    if (!userId) return

    // أولاً نحتاج company_id الخاص بهذا المستخدم
    supabase
      .from('companies')
      .select('id')
      .eq('profile_id', userId)
      .single()
      .then(({ data: company }) => {
        if (!company?.id) return

        const channel = supabase
          .channel(`company-notifications-${userId}`)

          // مراقبة الطلبات الجديدة على وظائف هذه الشركة
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'applications',
            },
            async (payload) => {
              // تحقق أن الطلب على وظيفة تخص هذه الشركة
              const { data: job } = await supabase
                .from('jobs')
                .select('company_id, title')
                .eq('id', payload.new?.job_id)
                .single()

              if (job && job.company_id === company.id) {
                toast({
                  title: '📩 طلب توظيف جديد!',
                  description: `تلقيت طلباً جديداً على وظيفة "${job.title}"`,
                  duration: 6000,
                })
              }
            },
          )

          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('✅ Company realtime notifications connected')
            }
          })

        channelRef.current = channel
      })
  }, [userId, supabase])

  useEffect(() => {
    if (!userId) return

    // إعداد القنوات حسب الدور
    if (role === 'worker') {
      setupWorkerListeners()
    } else if (role === 'company') {
      setupCompanyListeners()
    }

    // تنظيف القناة عند إغلاق المكوّن
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [userId, role, setupWorkerListeners, setupCompanyListeners, supabase])
}
