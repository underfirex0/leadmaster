'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Phone, PhoneOff, PhoneMissed, PhoneCall,
  CheckCircle, XCircle, Clock, Star, Archive,
  ChevronDown, ChevronUp, Search, StickyNote,
  Loader2, Trash2, RefreshCw, UserRound, Mail,
  Globe, MapPin, Users, TrendingUp, Building2,
  CalendarClock, AlertTriangle, RotateCcw, Lock
} from 'lucide-react'
import { cn, formatDate, formatDateShort } from '@/lib/utils'
import { useToast } from '@/components/Toast'
import { FIELD_COSTS } from '@/lib/constants'
import type { CRMLead, CRMStatus, CallOutcome } from '@/types'

// ── Config ────────────────────────────────────────────────────
const STATUS_CONFIG: Record<CRMStatus, {
  label: string
  color: string
  bg: string
  border: string
  icon: React.ElementType
}> = {
  to_call:        { label: 'À appeler',      color: 'text-blue-700',  bg: 'bg-blue-50',    border: 'border-blue-200',   icon: Phone },
  in_progress:    { label: 'En cours',        color: 'text-purple-700',bg: 'bg-purple-50',  border: 'border-purple-200', icon: PhoneCall },
  callback:       { label: 'À rappeler',      color: 'text-orange-700',bg: 'bg-orange-50',  border: 'border-orange-200', icon: CalendarClock },
  interested:     { label: 'Intéressé',       color: 'text-green-700', bg: 'bg-green-50',   border: 'border-green-200',  icon: CheckCircle },
  not_interested: { label: 'Pas intéressé',   color: 'text-red-700',   bg: 'bg-red-50',     border: 'border-red-200',    icon: XCircle },
  converted:      { label: 'Converti',        color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: Star },
  archived:       { label: 'Archivé',         color: 'text-slate-500', bg: 'bg-slate-100',  border: 'border-slate-200',  icon: Archive },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as CRMStatus[]

const CALL_OUTCOMES: { value: CallOutcome; label: string; icon: React.ElementType; color: string; nextStatus: CRMStatus }[] = [
  { value: 'no_answer',       label: 'Pas de réponse', icon: PhoneOff,    color: 'text-slate-600 bg-slate-100 hover:bg-slate-200', nextStatus: 'to_call' },
  { value: 'voicemail',       label: 'Messagerie',     icon: PhoneMissed, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100', nextStatus: 'to_call' },
  { value: 'callback',        label: 'À rappeler',     icon: CalendarClock,color: 'text-orange-600 bg-orange-50 hover:bg-orange-100', nextStatus: 'callback' },
  { value: 'interested',      label: 'Intéressé',      icon: CheckCircle, color: 'text-green-600 bg-green-50 hover:bg-green-100', nextStatus: 'interested' },
  { value: 'not_interested',  label: 'Pas intéressé',  icon: XCircle,     color: 'text-red-600 bg-red-50 hover:bg-red-100', nextStatus: 'not_interested' },
]

function StatusBadge({ status, onClick }: { status: CRMStatus; onClick?: (e?: React.MouseEvent) => void }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <button
      onClick={onClick ? (e) => onClick(e) : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
        cfg.bg, cfg.color, cfg.border,
        onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
      )}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </button>
  )
}

type CallModalState = { leadId: string; bizName: string; phone: string | null } | null

export default function CRMPage() {
  const toast = useToast()
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<CRMStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [callModal, setCallModal] = useState<CallModalState>(null)
  const [callNote, setCallNote] = useState('')
  const [savingCall, setSavingCall] = useState(false)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [savingNote, setSavingNote] = useState<string | null>(null)
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  // key = `${bizId}:${field}` → value | 'loading'
  const [unlocking, setUnlocking] = useState<Record<string, string>>({})

  async function unlockField(bizId: string, field: string) {
    const key = `${bizId}:${field}`
    setUnlocking(u => ({ ...u, [key]: 'loading' }))
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: bizId, field }),
      })
      const d = await res.json()
      if (!res.ok) {
        toast.error(d.error || 'Erreur')
        setUnlocking(u => { const n = { ...u }; delete n[key]; return n })
        return
      }
      // Store the value and update lead in-place
      setUnlocking(u => ({ ...u, [key]: d.value ?? '' }))
      setLeads(prev => prev.map(lead => {
        if (!lead.business || (lead.business as Record<string, unknown>).id !== bizId) return lead
        const biz = lead.business as Record<string, unknown>
        const updated = { ...biz, [field]: d.value, unlocked: { ...(biz.unlocked as Record<string,unknown> ?? {}), [field]: d.value } }
        return { ...lead, business: updated as typeof lead.business }
      }))
      if (!d.alreadyUnlocked) toast.success(`${field} débloqué · −${d.creditsSpent} cr`)
    } catch {
      toast.error('Erreur réseau')
      setUnlocking(u => { const n = { ...u }; delete n[key]; return n })
    }
  }

  useEffect(() => {
    if (!statusDropdown) return
    const close = () => setStatusDropdown(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [statusDropdown])

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const url = activeTab === 'all' ? '/api/crm/leads' : `/api/crm/leads?status=${activeTab}`
      const res = await fetch(url)
      const data = await res.json()
      setLeads(data.leads ?? [])
      setCounts(data.counts ?? {})
    } catch {
      console.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const totalLeads = Object.values(counts).reduce((sum, n) => sum + n, 0)

  const filtered = leads.filter(lead => {
    if (!search) return true
    const biz = lead.business
    const q = search.toLowerCase()
    return (
      biz?.name?.toLowerCase().includes(q) ||
      biz?.city?.toLowerCase().includes(q) ||
      biz?.sector?.toLowerCase().includes(q) ||
      biz?.phone?.toLowerCase().includes(q) ||
      biz?.email?.toLowerCase().includes(q)
    )
  })

  async function updateStatus(leadId: string, status: CRMStatus) {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
    setStatusDropdown(null)
    await fetch(`/api/crm/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchLeads()
  }

  async function logCall(leadId: string, outcome: CallOutcome) {
    setSavingCall(true)
    try {
      await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_outcome: outcome,
          call_notes: callNote || undefined,
          last_contacted_at: new Date().toISOString(),
        }),
      })
      setCallModal(null)
      setCallNote('')
      fetchLeads()
    } finally {
      setSavingCall(false)
    }
  }

  async function saveNote(leadId: string) {
    const note = editingNotes[leadId]
    if (note === undefined) return
    setSavingNote(leadId)
    await fetch(`/api/crm/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: note }),
    })
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: note } : l))
    setSavingNote(null)
    setEditingNotes(prev => { const n = { ...prev }; delete n[leadId]; return n })
  }

  async function deleteLead(leadId: string) {
    if (!confirm('Supprimer ce lead du CRM ?')) return
    await fetch(`/api/crm/leads/${leadId}`, { method: 'DELETE' })
    setLeads(prev => prev.filter(l => l.id !== leadId))
    fetchLeads()
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM — Suivi des leads</h1>
          <p className="text-slate-500 mt-1">{totalLeads} lead{totalLeads > 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={fetchLeads} className="btn-secondary flex items-center gap-2 self-start">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['to_call','callback','interested','converted'] as CRMStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s]
          const Icon = cfg.icon
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={cn(
                'card p-4 text-left transition-all hover:shadow-md',
                activeTab === s && 'ring-2 ring-brand-500'
              )}
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', cfg.bg)}>
                <Icon className={cn('w-4 h-4', cfg.color)} />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">{counts[s] ?? 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{cfg.label}</p>
            </button>
          )
        })}
      </div>

      {/* Tabs + Search */}
      <div className="card p-1 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'all' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          Tous ({totalLeads})
        </button>
        {ALL_STATUSES.map(s => {
          const count = counts[s] ?? 0
          if (count === 0 && activeTab !== s) return null
          const cfg = STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                activeTab === s ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {cfg.label} {count > 0 && `(${count})`}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un lead par nom, ville, secteur…"
          className="input pl-9"
        />
      </div>

      {/* Leads table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-2">Aucun lead{activeTab !== 'all' ? ` avec ce statut` : ''}.</p>
          <p className="text-sm text-slate-400">
            Lancez une recherche et cliquez sur &quot;Envoyer au CRM&quot; pour ajouter des leads.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Activité</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => {
                const biz = lead.business
                const isExpanded = expandedId === lead.id
                const callCount = lead.call_logs?.length ?? 0
                const isEditingNote = lead.id in editingNotes

                return (
                  <>
                    <tr
                      key={lead.id}
                      className={cn(
                        'border-b border-slate-100 transition-colors cursor-pointer',
                        isExpanded ? 'bg-brand-50/30' : 'hover:bg-slate-50/60'
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    >
                      {/* Company */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-1.5 h-8 rounded-full shrink-0',
                            STATUS_CONFIG[lead.status].bg.replace('bg-', 'bg-').replace('50', '400')
                          )} />
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{biz?.name ?? '—'}</p>
                            <p className="text-xs text-slate-400">{biz?.sector} · {biz?.city}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="space-y-0.5">
                          {biz?.phone ? (
                            <p className="font-mono text-xs text-slate-700">{biz.phone}</p>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Téléphone non débloqué</p>
                          )}
                          {biz?.email && (
                            <p className="text-xs text-slate-500 truncate max-w-[180px]">{biz.email}</p>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                          <StatusBadge
                            status={lead.status}
                            onClick={(e?: React.MouseEvent) => {
                              if (statusDropdown === lead.id) {
                                setStatusDropdown(null)
                              } else {
                                const btn = (e?.currentTarget as HTMLElement)
                                if (btn) {
                                  const rect = btn.getBoundingClientRect()
                                  setDropdownPos({ top: rect.bottom + 4, left: rect.left })
                                }
                                setStatusDropdown(lead.id)
                              }
                            }}
                          />
                          {statusDropdown === lead.id && (
                            <div
                              style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
                              className="bg-white shadow-xl border border-slate-200 rounded-xl py-1 w-48 animate-scale-in">
                              {ALL_STATUSES.map(s => {
                                const cfg = STATUS_CONFIG[s]
                                const Icon = cfg.icon
                                return (
                                  <button
                                    key={s}
                                    onClick={() => updateStatus(lead.id, s)}
                                    className={cn(
                                      'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors',
                                      lead.status === s ? cn(cfg.bg, cfg.color) : 'text-slate-700 hover:bg-slate-50'
                                    )}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                    {cfg.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-xs text-slate-500">
                          {callCount > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {callCount} appel{callCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {lead.last_contacted_at && (
                            <p className="text-slate-400 mt-0.5">{formatDateShort(lead.last_contacted_at)}</p>
                          )}
                          {lead.next_action_at && (
                            <p className="text-orange-600 mt-0.5 flex items-center gap-1">
                              <CalendarClock className="w-3 h-3" />
                              {formatDateShort(lead.next_action_at)}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          {/* Call button */}
                          {biz?.phone ? (
                            <a
                              href={`tel:${biz.phone.replace(/[^0-9+]/g, '')}`}
                              onClick={() => setCallModal({ leadId: lead.id, bizName: biz.name, phone: biz.phone })}
                              className="inline-flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                              title="Appeler"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Appeler</span>
                            </a>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-not-allowed"
                              title="Téléphone non disponible"
                              disabled
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Expand */}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <tr key={`${lead.id}-expanded`} className="bg-brand-50/20 border-b border-slate-100">
                        <td colSpan={5} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                            {/* Contact section */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" /> Contact
                              </h4>
                              <div className="space-y-2.5">
                                {([
                                  { icon: Phone,  label: 'Téléphone', field: 'phone',   val: biz?.phone },
                                  { icon: Mail,   label: 'E-mail',    field: 'email',   val: biz?.email },
                                  { icon: Globe,  label: 'Site web',  field: 'website', val: biz?.website },
                                  { icon: MapPin, label: 'Adresse',   field: 'address', val: biz?.address },
                                ] as { icon: React.ElementType; label: string; field: string; val: string | null | undefined }[]).map(({ icon: Icon, label, field, val }) => (
                                  <div key={label} className="flex items-start gap-2">
                                    <Icon className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                                      {val
                                        ? <p className="text-[13px] text-slate-800 font-mono break-all">{val}</p>
                                        : <button onClick={() => unlockField((biz as Record<string,unknown>)?.id as string, field)}
                                            disabled={unlocking[`${(biz as Record<string,unknown>)?.id}:${field}`] === 'loading'}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-[6px] hover:bg-amber-100 transition-colors disabled:opacity-50">
                                            {unlocking[`${(biz as Record<string,unknown>)?.id}:${field}`] === 'loading'
                                              ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                              : <Lock className="w-2.5 h-2.5" />}
                                            Débloquer · {FIELD_COSTS[field] ?? 1} cr
                                          </button>
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Dirigeant section */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <UserRound className="w-3.5 h-3.5" /> Dirigeant
                              </h4>
                              <div className="space-y-2.5">
                                {([
                                  { icon: UserRound, label: 'Nom',            field: 'dirigeant_name',  val: biz?.dirigeant_name },
                                  { icon: Phone,     label: 'Tél. direct',    field: 'dirigeant_phone', val: biz?.dirigeant_phone },
                                  { icon: Mail,      label: 'E-mail direct',  field: 'dirigeant_email', val: biz?.dirigeant_email },
                                ] as { icon: React.ElementType; label: string; field: string; val: string | null | undefined }[]).map(({ icon: Icon, label, field, val }) => (
                                  <div key={label} className="flex items-start gap-2">
                                    <Icon className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                                      {val
                                        ? <p className="text-[13px] text-slate-800 break-all">{val}</p>
                                        : <button onClick={() => unlockField((biz as Record<string,unknown>)?.id as string, field)}
                                            disabled={unlocking[`${(biz as Record<string,unknown>)?.id}:${field}`] === 'loading'}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-[6px] hover:bg-amber-100 transition-colors disabled:opacity-50">
                                            {unlocking[`${(biz as Record<string,unknown>)?.id}:${field}`] === 'loading'
                                              ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                              : <Lock className="w-2.5 h-2.5" />}
                                            Débloquer · {FIELD_COSTS[field] ?? 2} cr
                                          </button>
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Direction contacts if any */}
                              {([
                                { prefix: 'dir_daf',        emoji: '💰', label: 'DAF' },
                                { prefix: 'dir_rh',         emoji: '👥', label: 'DRH' },
                                { prefix: 'dir_achat',      emoji: '🛒', label: 'Dir. Achats' },
                                { prefix: 'dir_marketing',  emoji: '📣', label: 'Marketing' },
                                { prefix: 'dir_commercial', emoji: '📈', label: 'Commercial' },
                              ] as { prefix: string; emoji: string; label: string }[]).map(({ prefix, emoji, label }) => {
                                const nomField   = `${prefix}_nom`
                                const emailField = `${prefix}_email`
                                const nom   = (biz as Record<string,unknown>)?.[nomField]   as string | null
                                const email = (biz as Record<string,unknown>)?.[emailField] as string | null
                                if (!nom && !email) return null
                                return (
                                  <div key={prefix} className="mt-3 p-2.5 bg-white border border-[rgba(0,0,0,0.07)] rounded-[10px]">
                                    <p className="text-[10px] font-bold text-slate-500 mb-1.5">{emoji} {label}</p>
                                    {nom
                                      ? <p className="text-[12px] font-semibold text-slate-800">{nom}</p>
                                      : <button onClick={() => unlockField((biz as Record<string,unknown>)?.id as string, nomField)}
                                          disabled={unlocking[`${(biz as Record<string,unknown>)?.id}:${nomField}`] === 'loading'}
                                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-[5px] hover:bg-amber-100 transition-colors">
                                          <Lock className="w-2 h-2" /> Nom · 2 cr
                                        </button>
                                    }
                                    {email
                                      ? <p className="text-[11px] text-brand-600 mt-0.5 break-all">{email}</p>
                                      : <button onClick={() => unlockField((biz as Record<string,unknown>)?.id as string, emailField)}
                                          disabled={unlocking[`${(biz as Record<string,unknown>)?.id}:${emailField}`] === 'loading'}
                                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-[5px] hover:bg-amber-100 transition-colors mt-0.5">
                                          <Lock className="w-2 h-2" /> E-mail · 5 cr
                                        </button>
                                    }
                                  </div>
                                )
                              })}
                            </div>

                            {/* Entreprise + Notes */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" /> Entreprise
                              </h4>
                              <div className="space-y-2.5 mb-4">
                                {([
                                  { icon: Users,      label: 'Effectif',          field: 'effectif_label', val: biz?.effectif_label },
                                  { icon: TrendingUp, label: "Chiffre d'affaires", field: 'revenue_label',  val: biz?.revenue_label },
                                ] as { icon: React.ElementType; label: string; field: string; val: string | null | undefined }[]).map(({ icon: Icon, label, field, val }) => (
                                  <div key={label} className="flex items-start gap-2">
                                    <Icon className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                                      {val
                                        ? <p className="text-[13px] text-slate-800">{val}</p>
                                        : <button onClick={() => unlockField((biz as Record<string,unknown>)?.id as string, field)}
                                            disabled={unlocking[`${(biz as Record<string,unknown>)?.id}:${field}`] === 'loading'}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-[6px] hover:bg-amber-100 transition-colors disabled:opacity-50">
                                            {unlocking[`${(biz as Record<string,unknown>)?.id}:${field}`] === 'loading'
                                              ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                              : <Lock className="w-2.5 h-2.5" />}
                                            Débloquer · {FIELD_COSTS[field] ?? 2} cr
                                          </button>
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Notes */}
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                                  <StickyNote className="w-3.5 h-3.5" /> Notes
                                </p>
                                <textarea
                                  value={isEditingNote ? editingNotes[lead.id] : (lead.notes ?? '')}
                                  onChange={e => setEditingNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                  placeholder="Ajouter une note…"
                                  rows={3}
                                  className="input text-xs resize-none"
                                />
                                {isEditingNote && (
                                  <button
                                    onClick={() => saveNote(lead.id)}
                                    disabled={savingNote === lead.id}
                                    className="mt-1.5 text-xs btn-primary py-1 px-3 flex items-center gap-1"
                                  >
                                    {savingNote === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                    Sauvegarder
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Call history */}
                          {lead.call_logs && lead.call_logs.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                Historique des appels
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {lead.call_logs.slice(0, 5).map(log => {
                                  const outcome = CALL_OUTCOMES.find(o => o.value === log.outcome)
                                  const Icon = outcome?.icon ?? Phone
                                  return (
                                    <div key={log.id} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600">
                                      <Icon className="w-3 h-3" />
                                      {outcome?.label} · {formatDate(log.called_at)}
                                      {log.notes && <span className="text-slate-400">· {log.notes}</span>}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Call outcome modal */}
      {callModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCallModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Résultat de l&apos;appel</h3>
                <p className="text-sm text-slate-500">{callModal.bizName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4">
              {CALL_OUTCOMES.map(outcome => {
                const Icon = outcome.icon
                return (
                  <button
                    key={outcome.value}
                    onClick={() => !savingCall && logCall(callModal.leadId, outcome.value)}
                    disabled={savingCall}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                      outcome.color,
                      savingCall && 'opacity-50 cursor-wait'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {outcome.label}
                  </button>
                )
              })}
            </div>

            <div>
              <input
                type="text"
                value={callNote}
                onChange={e => setCallNote(e.target.value)}
                placeholder="Note optionnelle…"
                className="input text-sm"
                onKeyDown={e => e.key === 'Enter' && callNote && logCall(callModal.leadId, 'no_answer')}
              />
            </div>

            <button
              onClick={() => setCallModal(null)}
              className="mt-3 w-full btn-secondary text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
