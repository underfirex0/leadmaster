import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, BarChart2, Target, LogOut, Shield } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('is_admin, full_name, email').eq('id', user.id).single()

  if (!profile?.is_admin) redirect('/dashboard')

  const navItems = [
    { href: '/admin',               label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/users',         label: 'Utilisateurs',    icon: Users },
    { href: '/admin/subscriptions', label: 'Abonnements',     icon: FileText },
    { href: '/admin/analytics',     label: 'Analytics',       icon: BarChart2 },
  ]

  return (
    <div className="min-h-screen bg-surface-1 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-[rgba(0,0,0,0.06)] flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-[rgba(0,0,0,0.05)]">
          <Link href="/dashboard" className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-brand-600 rounded-[7px] flex items-center justify-center">
              <Target className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-ink-1 text-[13px]">LeadScout</span>
          </Link>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield className="w-3 h-3 text-brand-600" />
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wide">Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[13px] font-medium text-ink-3 hover:text-ink-1 hover:bg-surface-1 transition-colors">
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-700 font-bold text-[11px]">
                {(profile?.full_name || profile?.email || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-ink-1 truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-[10px] text-ink-4 truncate">{profile?.email}</p>
            </div>
          </div>
          <Link href="/dashboard"
            className="flex items-center gap-2 text-[12px] text-ink-4 hover:text-ink-1 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> App utilisateur
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-8">
        {children}
      </main>
    </div>
  )
}
