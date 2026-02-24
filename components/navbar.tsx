"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Briefcase, LogOut, LayoutDashboard, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar({
  role,
  fullName,
}: {
  role: string
  fullName: string | null
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
    { href: dashboardPath, label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={dashboardPath} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Flex Job</span>
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
          <span className="text-sm text-muted-foreground">
            {fullName || "User"}{" "}
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary capitalize">
              {role}
            </span>
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
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
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
