'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'application_update' | 'new_application' | 'new_job'
  title: string
  description: string
  read: boolean
  created_at: string
  link?: string
}

interface NotificationBellProps {
  userId: string
  role: 'worker' | 'company' | 'admin'
}

export function NotificationBell({ userId, role }: NotificationBellProps) {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // تحميل الإشعارات من قاعدة البيانات
  useEffect(() => {
    if (!userId) return

    const loadNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) setNotifications(data as Notification[])
    }

    loadNotifications()

    // مراقبة الإشعارات الجديدة في الوقت الفعلي
    const channel = supabase
      .channel(`notifications-bell-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev].slice(0, 20))
        },
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [userId, supabase])

  // تمييز الكل كمقروء عند فتح القائمة
  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && unreadCount > 0) {
      // تحديث محلي فوري
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      // ثم حفظ في قاعدة البيانات
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'application_update': return '📋'
      case 'new_application': return '📩'
      case 'new_job': return '✨'
      default: return '🔔'
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen} dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>الإشعارات</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} جديد
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-30" />
            لا توجد إشعارات
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 ${!notification.read ? 'bg-primary/5' : ''
                  }`}
              >
                <div className="flex w-full items-start gap-2">
                  <span className="text-lg">{getIcon(notification.type)}</span>
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
