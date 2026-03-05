'use client'

import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'

interface NotificationsProviderProps {
  userId: string
  role: 'worker' | 'company' | 'admin'
}

/**
 * ضع هذا المكوّن في layout لوحة التحكم
 * يعمل في الخلفية ولا يظهر أي شيء في الواجهة
 * الإشعارات تظهر تلقائياً عبر Toast
 */
export function NotificationsProvider({ userId, role }: NotificationsProviderProps) {
  useRealtimeNotifications({ userId, role })
  return null
}
