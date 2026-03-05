"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Briefcase, LogOut, LayoutDashboard, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NotificationBell } from "./notification-bell"
import { ROLE_LABELS } from "@/lib/constants"

export function Navbar({
  role,
  fullName,
  userId,
}: {
  role: string
  fullName: string | null
  userId: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const dashboardPath =
    role === "company"
      ? "/dashboard/company"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/worker"

  const navLinks = [
    { href: dashboardPath, label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/jobs", label: "الوظائف", icon: Briefcase },
    { href: "/profile", label: "الملف الشخصي", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={dashboardPath} className="flex items-center gap-2">
            <Image
              src="/flexjob-logo.png"
              alt="Flexjob Logo"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="text-lg font-bold text-foreground">فلكس جوب</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <NotificationBell userId={userId} role={role as any} />
          <span className="text-sm font-medium text-foreground">
            {fullName || "عضو"}{" "}
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              {ROLE_LABELS[role] || role}
            </span>
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </Button>
        </div>

        {/* أزرار الإشعارات والقائمة للجوال */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationBell userId={userId} role={role as any} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" /> تسجيل الخروج
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
