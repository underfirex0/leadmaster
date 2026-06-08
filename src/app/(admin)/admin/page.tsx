'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Users, CreditCard, Clock, ArrowRight, Crown } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'

const PLAN_COLORS: Record<string, string> = {
  decouverte: 'bg-surface-2 text-ink-3',
  solo:       'bg-brand-50 text-brand-700',
  equipe:     'bg-violet-50 text-violet-700',
  business:   'bg-gold-50 text-gold-700',
  entreprise: 'bg-emerald-50 text-emerald-700',
}

const PLAN_LABELS: Record<string, string> = {
  decouverte: 'Découverte', solo: 'Solo', equipe: 'Équipe', business: 'Business', entreprise: 'Entreprise',
}

const PLAN_PRICES: Record<string, number> = { decouverte: 0, solo: 149, equipe: 390, business: 990 }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-[18px] border border-[rgba(0,0,0,0.07)]" />)}
    </div>
  )

  if (!stats) return <div className="text-red-500">Erreur de chargement.</div>

  const planDist = (stats.plan_distribution as Record<string, number>) ?? {}
  const recentUsers = (stats.recent_users as Record<string, unknown>[]) ?? []

  const kpis = [
    { label: 'MRR',           value: `${formatNumber(stats.mrr as number)} MAD`,          sub: 'Revenus mensuels récurrents', icon: TrendingUp, color: 'text-brand-600 bg-brand-50' },
    { label: 'ARR estimé',    value: `${formatNumber(stats.arr as number)} MAD`,           sub: '12 × MRR actuel',             icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
    { label: 'Utilisateurs',  value: formatNumber(stats.total_users as number),            sub: `${stats.active_subs} abonnés actifs`, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Revenus totaux',value: `${formatNumber(stats.total_revenue as number)} MAD`, sub: `dont ${formatNumber(stats.topup_revenue as number)} top-ups`, icon: CreditCard, color: 'text-gold-600 bg-gold-50' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-ink-1" style={{ fontSize: '28px', letterSpacing: '-1px' }}>Tableau de bord admin</h1>
          <p className="text-[14px] text-ink-3 mt-1">Vue globale de la plateforme</p>
        </div>
        {(stats.pending_count as number) > 0 && (
          <Link href="/admin/users?filter=pending"
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold hover:bg-amber-100 transition-colors">
            <Clock className="w-4 h-4" />
            {stats.pending_count as number} activation(s) en attente
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[18px] p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-medium text-ink-3">{label}</p>
              <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-bold text-ink-1 tabular-nums mb-1" style={{ fontSize: '24px', letterSpacing: '-1px', lineHeight: 1 }}>
              {value}
            </p>
            <p className="text-[11px] text-ink-4">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan distribution */}
        <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[18px] shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)]">
            <p className="font-bold text-[14px] text-ink-1">Répartition des plans</p>
          </div>
          <div className="p-5 space-y-3">
            {['decouverte','solo','equipe','business','entreprise'].map(planId => {
              const count = planDist[planId] ?? 0
              const total = stats.total_users as number || 1
              const pct = Math.round((count / total) * 100)
              const price = PLAN_PRICES[planId] ?? 0
              return (
                <div key={planId}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`badge border text-[10px] ${PLAN_COLORS[planId]}`}>{PLAN_LABELS[planId]}</span>
                      <span className="font-semibold text-ink-1">{count} user{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-ink-3">{pct}%</span>
                      {price > 0 && <span className="text-[11px] text-ink-4 ml-2">{formatNumber(count * price)} MAD/mois</span>}
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${planId === 'solo' ? 'bg-brand-500' : planId === 'equipe' ? 'bg-violet-500' : planId === 'business' ? 'bg-gold-500' : planId === 'entreprise' ? 'bg-emerald-500' : 'bg-ink-5'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[18px] shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)]">
            <p className="font-bold text-[14px] text-ink-1">Revenus</p>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Abonnements payés',   val: stats.sub_revenue as number,     color: 'bg-brand-500' },
              { label: 'Top-ups payés',       val: stats.topup_revenue as number,   color: 'bg-gold-500' },
              { label: 'En attente',          val: stats.pending_amount as number,  color: 'bg-amber-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-[13px] text-ink-2">{label}</span>
                </div>
                <span className="font-bold text-[14px] text-ink-1 tabular-nums">{formatNumber(val)} MAD</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] font-bold text-ink-1">Total perçu</span>
              <span className="font-bold text-[16px] text-brand-700 tabular-nums">{formatNumber(stats.total_revenue as number)} MAD</span>
            </div>
          </div>
        </div>

        {/* Recent signups */}
        <div className="bg-white border border-[rgba(0,0,0,0.07)] rounded-[18px] shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
            <p className="font-bold text-[14px] text-ink-1">Inscriptions récentes</p>
            <Link href="/admin/users" className="text-[12px] text-brand-600 font-medium hover:underline">Tous →</Link>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.04)]">
            {recentUsers.slice(0, 8).map(u => (
              <Link key={u.id as string} href={`/admin/users/${u.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-surface-1/60 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-700 font-bold text-[11px]">
                      {((u.full_name as string || u.email as string || 'U')[0]).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-ink-1 truncate max-w-[120px]">
                      {(u.full_name as string) || (u.email as string)}
                    </p>
                    <p className="text-[10px] text-ink-4">{formatDate(u.created_at as string)}</p>
                  </div>
                </div>
                <span className={`badge border text-[10px] ${PLAN_COLORS[(u.plan_id as string) ?? 'decouverte']}`}>
                  {PLAN_LABELS[(u.plan_id as string) ?? 'decouverte']}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
