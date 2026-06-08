'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight, X, ChevronDown, Check, Star, Lock,
  Search, Users2, Download, Sparkles, Crown,
  Building2, Phone, Mail, Filter, MapPin, TrendingUp,
  CheckCircle, Menu, Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Announcement Bar ─────────────────────────── */
function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-brand-600 text-white text-sm py-2.5 px-4 flex items-center justify-center gap-3 relative">
      <div className="live-dot" />
      <span className="font-medium">MeetMaster est live — rencontrez des dirigeants marocains en 48h.</span>
      <Link href="/meetmaster" className="underline underline-offset-2 font-semibold hover:no-underline">
        Découvrir →
      </Link>
      <button onClick={onDismiss} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ─── Navigation ───────────────────────────────── */
function Nav({ hasBar }: { hasBar: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '#fonctionnalites', label: 'Fonctionnalités' },
    { href: '#tarifs', label: 'Tarifs' },
    { href: '/meetmaster', label: 'MeetMaster' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <nav className={cn(
      'fixed left-0 right-0 z-50 transition-all duration-300',
      hasBar ? 'top-[40px]' : 'top-0'
    )}>
      <div className="max-w-[1200px] mx-auto px-5 pt-3">
        <div className={cn(
          'flex items-center justify-between px-5 py-3 rounded-pill transition-all duration-300',
          scrolled
            ? 'bg-white/92 backdrop-blur-xl border border-[rgba(0,0,0,0.07)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
              <Target className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-ink-1 tracking-tight text-[15px]">LeadScout</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-[13px] text-ink-3 hover:text-ink-1 px-3.5 py-2 rounded-lg hover:bg-surface-2 transition-all duration-150 font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="text-[13px] text-ink-3 hover:text-ink-1 px-3.5 py-2 font-medium transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="btn-primary btn-sm text-[13px] h-8">
              Commencer gratuitement
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-surface-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl shadow-card-lg p-3 animate-scale-in">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="block text-sm text-ink-2 hover:text-ink-1 hover:bg-surface-1 px-4 py-3 rounded-xl transition-colors font-medium"
                onClick={() => setMobileOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="border-t border-[rgba(0,0,0,0.06)] mt-2 pt-2 space-y-2">
              <Link href="/login" className="block text-sm text-center text-ink-2 py-2.5 hover:bg-surface-1 rounded-xl font-medium">Connexion</Link>
              <Link href="/register" className="btn-primary w-full justify-center text-sm py-2.5">Commencer gratuitement</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

/* ─── Product Mockup ───────────────────────────── */
function ProductMockup() {
  const rows = [
    { name: 'BATIPRO MAROC SARL',  city: 'Casablanca', phone: '0522-45-67-89',  email: 'contact@batipro.ma',   dir: null },
    { name: 'TECHWAVE MAROC SA',   city: 'Casablanca', phone: '0522-67-89-01',  email: null,                   dir: 'Y. Tahiri' },
    { name: 'ATLAS TRADING SARL',  city: 'Casablanca', phone: null,              email: null,                   dir: null },
    { name: 'EXPORTMA SARL',       city: 'Agadir',     phone: '0528-88-99-11',  email: 'contact@exportma.ma',  dir: 'N. Ait Ahmed' },
    { name: 'CONSTRUCTA ATLAS',    city: 'Rabat',      phone: '0537-22-33-44',  email: 'info@constructa.ma',   dir: null },
  ]

  return (
    <div className="relative mx-auto max-w-4xl mt-16 animate-reveal-up delay-500">
      {/* Glow ring */}
      <div className="absolute -inset-px rounded-[20px] bg-gradient-to-b from-brand-200/40 via-transparent to-transparent" />
      <div className="absolute -inset-8 bg-gradient-to-b from-brand-100/30 to-transparent blur-3xl -z-10" />

      {/* Window */}
      <div className="relative rounded-[20px] overflow-hidden border border-[rgba(0,0,0,0.08)] shadow-[0_24px_80px_rgba(0,0,0,0.1),0_4px_20px_rgba(0,0,0,0.06)]">
        {/* Chrome */}
        <div className="bg-[#f5f5f3] border-b border-[rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-md px-3 py-1 text-xs text-[#999] font-mono">
            app.leadscout.ma/search
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#999]">
            <div className="w-4 h-4 rounded bg-[rgba(79,70,229,0.1)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            </div>
            <span>◆ 83 cr</span>
          </div>
        </div>

        {/* Search bar row */}
        <div className="bg-white px-5 py-3 border-b border-[rgba(0,0,0,0.04)] flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-surface-1 border border-[rgba(0,0,0,0.07)] rounded-[8px] px-3 py-2 text-xs text-ink-4">
            <Filter className="w-3 h-3 text-ink-5" />
            <span>Import / Export</span>
            <span className="text-ink-5">·</span>
            <span>Casablanca</span>
            <span className="text-ink-5">·</span>
            <span>20-49 employés</span>
          </div>
          <div className="bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-[8px] flex items-center gap-1.5 cursor-pointer hover:bg-brand-700 transition-colors">
            <Sparkles className="w-3 h-3" /> Lancer
          </div>
        </div>

        {/* Results table */}
        <div className="bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-1 border-b border-[rgba(0,0,0,0.04)]">
                {['Entreprise','Ville','Téléphone','E-mail','Dirigeant'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-ink-4 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-[rgba(0,0,0,0.03)] hover:bg-[rgba(79,70,229,0.02)] transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-ink-1">{row.name}</td>
                  <td className="px-4 py-2.5 text-ink-3">{row.city}</td>
                  <td className="px-4 py-2.5">
                    {row.phone
                      ? <span className="font-mono text-brand-700">{row.phone}</span>
                      : <span className="inline-flex items-center gap-1 text-gold-600 bg-gold-50 border border-gold-100 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer hover:bg-gold-100 transition-colors"><Lock className="w-2.5 h-2.5" />1 cr</span>
                    }
                  </td>
                  <td className="px-4 py-2.5">
                    {row.email
                      ? <span className="text-brand-600 truncate max-w-[140px] block">{row.email}</span>
                      : <span className="inline-flex items-center gap-1 text-gold-600 bg-gold-50 border border-gold-100 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer hover:bg-gold-100 transition-colors"><Lock className="w-2.5 h-2.5" />1 cr</span>
                    }
                  </td>
                  <td className="px-4 py-2.5">
                    {row.dir
                      ? <span className="text-ink-2">{row.dir}</span>
                      : <span className="inline-flex items-center gap-1 text-gold-600 bg-gold-50 border border-gold-100 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer hover:bg-gold-100 transition-colors"><Lock className="w-2.5 h-2.5" />2 cr</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 flex items-center justify-between bg-surface-1/50">
            <span className="text-[11px] text-ink-4">20 résultats · 40 crédits dépensés</span>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1.5 rounded-lg hover:bg-brand-100 transition-colors">
                <Users2 className="w-3 h-3" /> CRM
              </button>
              <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-3 bg-white border border-[rgba(0,0,0,0.08)] px-2.5 py-1.5 rounded-lg hover:bg-surface-1 transition-colors">
                <Download className="w-3 h-3" /> CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-5">
      <div className="hero-aurora" />

      <div className="relative max-w-[900px] mx-auto text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-[rgba(0,0,0,0.07)] rounded-pill px-4 py-2 text-[13px] text-ink-3 font-medium shadow-xs mb-8 animate-reveal-in">
          <div className="live-dot" />
          <span>10 000+ entreprises marocaines · Données vérifiées</span>
        </div>

        {/* Headline */}
        <h1 className="font-bold text-ink-1 mb-4 animate-reveal-up delay-100"
          style={{ fontSize: 'clamp(48px,7vw,80px)', lineHeight: 1.1, letterSpacing: '-3px', fontWeight: 800 }}>
          Trouvez vos clients B2B
          <br />
          <span className="bg-gradient-to-r from-brand-600 via-violet-600 to-brand-700 bg-clip-text text-transparent">
            au Maroc. En minutes.
          </span>
        </h1>

        {/* Cursive annotation (Merlin-style) */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-reveal-in delay-200">
          <span className="text-[22px] cursive-green leading-none">sans abonnement</span>
          <svg width="32" height="20" viewBox="0 0 32 20" fill="none" className="text-emerald-500 -mt-1">
            <path d="M2 10 C8 4, 16 2, 24 8 M24 8 L20 4 M24 8 L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Sub */}
        <p className="text-[18px] text-ink-3 max-w-xl mx-auto leading-relaxed mb-10 animate-reveal-in delay-300">
          Accédez aux coordonnées d&apos;entreprises marocaines.
          Filtrez par secteur, ville, effectif. Payez uniquement ce que vous débloquez.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 animate-reveal-in delay-400">
          <Link href="/register"
            className="btn-primary btn-lg group">
            Commencer — 100 crédits offerts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button className="btn-shimmer btn-lg">
            Voir comment ça marche
          </button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] text-ink-4 animate-reveal-in delay-500">
          {['Aucune carte bancaire','100 crédits offerts','Données vérifiées'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Product mockup */}
      <div className="w-full max-w-5xl mx-auto">
        <ProductMockup />
      </div>
    </section>
  )
}

/* ─── Stats ────────────────────────────────────── */
function Stats() {
  const items = [
    { n: '10 000+', label: 'Entreprises marocaines', sub: 'dans la base de données' },
    { n: '10',      label: 'Secteurs couverts',       sub: 'BTP, IT, Import/Export...' },
    { n: '14',      label: 'Villes marocaines',        sub: 'Casa, Rabat, Tanger...' },
    { n: '100%',    label: 'Données locales',           sub: 'Maroc exclusivement' },
  ]
  return (
    <section className="bg-surface-2 border-y border-[rgba(0,0,0,0.06)] py-12 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(({ n, label, sub }) => (
          <div key={label} className="text-center">
            <p className="font-bold text-ink-1 mb-1 tabular-nums"
              style={{ fontSize: '40px', lineHeight: 1.1, letterSpacing: '-2px', fontWeight: 800 }}>
              {n}
            </p>
            <p className="text-sm font-semibold text-ink-2 mb-0.5">{label}</p>
            <p className="text-xs text-ink-4">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── How it works ─────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: Filter,
      title: 'Définissez vos critères',
      body: 'Secteur, ville, région, effectif. Combinez les filtres pour cibler exactement votre marché cible et prévisualisez le coût avant de lancer.',
      color: 'bg-brand-50 text-brand-600',
    },
    {
      n: '02',
      icon: Lock,
      title: 'Choisissez vos données',
      body: 'Sélectionnez les champs dont vous avez besoin : téléphone, email, dirigeant, chiffre d\'affaires. Payez uniquement ce que vous débloquez.',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      n: '03',
      icon: Users2,
      title: 'Prospectez immédiatement',
      body: 'Exportez en CSV ou gérez vos leads dans notre CRM intégré avec suivi des appels, statuts de contact et historique complet.',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]
  return (
    <section id="fonctionnalites" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-brand-600 mb-4">
            <div className="w-5 h-px bg-brand-300" />
            Comment ça marche
            <div className="w-5 h-px bg-brand-300" />
          </div>
          <h2 className="font-bold text-ink-1 mb-4"
            style={{ fontSize: 'clamp(32px,4vw,48px)', lineHeight: 1.15, letterSpacing: '-1.5px', fontWeight: 800 }}>
            Simple. Rapide. Efficace.
          </h2>
          <p className="text-[17px] text-ink-3 max-w-lg mx-auto leading-relaxed">
            De la recherche au premier appel en moins de 5 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ n, icon: Icon, title, body, color }, i) => (
            <div key={n}
              className="card-hover p-7 group"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink-5">{n}</span>
              </div>
              <h3 className="font-bold text-ink-1 text-[18px] mb-3 leading-snug" style={{ letterSpacing: '-0.3px' }}>{title}</h3>
              <p className="text-[14px] text-ink-3 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ─────────────────────────────────── */
function Features() {
  const features = [
    { icon: Search,     title: 'Recherche avancée',  body: 'Filtrez par secteur, ville, région, effectif. Prévisualisation du coût en temps réel avant de valider.',               badge: 'Ciblage' },
    { icon: Lock,       title: 'Paiement à l\'usage', body: 'Téléphone à 1 cr, email dirigeant à 5 cr. Ne déboursez que pour ce qui vous est utile. Zéro abonnement.',              badge: 'Économique' },
    { icon: Users2,     title: 'CRM intégré',         body: 'Statuts d\'appel, historique, notes, rappels. Gérez tout votre pipeline sans quitter l\'outil.',                        badge: 'Productivité' },
    { icon: Download,   title: 'Export CSV',           body: 'Compatible Excel, HubSpot, Salesforce. Exportez en un clic et intégrez où vous voulez.',                               badge: 'Intégration' },
    { icon: CheckCircle,title: 'Données vérifiées',   body: 'Sources officielles marocaines. Structurées, actualisées, prêtes à l\'emploi. Qualité garantie.',                       badge: 'Fiabilité' },
    { icon: Sparkles,   title: '100 crédits offerts', body: 'Démarrez sans carte bancaire. 100 crédits permettent de tester sérieusement le produit sur votre marché cible.',       badge: 'Gratuit' },
  ]
  return (
    <section className="section bg-surface-1">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-bold text-ink-1 mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,40px)', lineHeight: 1.2, letterSpacing: '-1px', fontWeight: 800 }}>
            Tout ce qu&apos;il faut pour prospecter
          </h2>
          <p className="text-[16px] text-ink-3 max-w-md mx-auto">
            Plus qu&apos;une base de données — un système de prospection B2B complet.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body, badge }, i) => (
            <div key={title}
              className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.06)] p-6 hover:border-brand-100 hover:shadow-[0_4px_24px_rgba(79,70,229,0.06)] hover:-translate-y-0.5 transition-all duration-200 group cursor-default"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-[10px] bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <Icon className="w-4.5 h-4.5 text-brand-600" />
                </div>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-pill">{badge}</span>
              </div>
              <h3 className="font-bold text-ink-1 text-[15px] mb-2 leading-snug" style={{ letterSpacing: '-0.2px' }}>{title}</h3>
              <p className="text-[13px] text-ink-3 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Field Pricing ────────────────────────────── */
function FieldPricing() {
  const rows = [
    { name: 'Raison sociale, Secteur, Ville',       cost: 'Gratuit',    dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
    { name: 'Téléphone, E-mail, Site web, Adresse', cost: '1 cr / biz', dot: 'bg-brand-500',   text: 'text-brand-700',   bg: 'bg-brand-50 border-brand-100' },
    { name: 'Effectif, Nom du dirigeant',            cost: '2 cr / biz', dot: 'bg-violet-500',  text: 'text-violet-700',  bg: 'bg-violet-50 border-violet-100' },
    { name: 'Téléphone du dirigeant',               cost: '4 cr / biz', dot: 'bg-orange-500',  text: 'text-orange-700',  bg: 'bg-orange-50 border-orange-100' },
    { name: 'E-mail dirigeant, Chiffre d\'affaires',cost: '5 cr / biz', dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50 border-red-100' },
  ]
  return (
    <section className="section bg-white">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="text-[12px] font-bold uppercase tracking-widest text-ink-4 mb-3 flex items-center justify-center gap-2">
            <div className="w-4 h-px bg-ink-5" /> Tarification des données <div className="w-4 h-px bg-ink-5" />
          </div>
          <h2 className="font-bold text-ink-1 mb-3"
            style={{ fontSize: 'clamp(26px,3.5vw,36px)', lineHeight: 1.2, letterSpacing: '-1px', fontWeight: 800 }}>
            1 crédit = 1 champ, pour 1 entreprise.
          </h2>
          <p className="text-[15px] text-ink-3">Payez uniquement pour ce que vous débloquez. Rien de plus.</p>
        </div>
        <div className="space-y-2.5">
          {rows.map(r => (
            <div key={r.name} className={`flex items-center justify-between px-5 py-3.5 rounded-[12px] border ${r.bg} transition-shadow hover:shadow-xs`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${r.dot}`} />
                <span className="text-[14px] font-medium text-ink-2">{r.name}</span>
              </div>
              <span className={`text-[13px] font-bold tabular-nums ${r.text}`}>{r.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── MeetMaster CTA ────────────────────────────── */
function MeetMasterSection() {
  return (
    <section className="section" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)' }}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-100 border border-gold-200 rounded-pill px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-gold-700 mb-8">
            <Crown className="w-3.5 h-3.5" /> MeetMaster by LeadScout
          </div>
          <h2 className="font-bold text-ink-1 mb-4"
            style={{ fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1.1, letterSpacing: '-2px', fontWeight: 800 }}>
            Rencontrez les décideurs
            <span className="text-gold-600"> qui comptent.</span>
          </h2>
          <p className="text-[17px] text-ink-3 mb-10 leading-relaxed">
            30 minutes avec un DRH, DAF ou Directeur Achats qualifié.
            Benchmark de marché, insights exclusifs, réseau direct. 1 000 MAD le meeting.
          </p>

          {/* Cards row */}
          <div className="grid grid-cols-3 gap-4 mb-10 text-left">
            {[
              { icon: Search,   title: 'Choisissez', body: 'Filtrez par rôle, secteur, ville' },
              { icon: CheckCircle, title: 'Réservez', body: '3 créneaux · Réponse sous 24h' },
              { icon: Sparkles, title: 'Rencontrez', body: '30 min de valeur pure en visio' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-[14px] border border-gold-100 p-5 shadow-xs">
                <div className="w-8 h-8 rounded-[8px] bg-gold-50 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-gold-600" />
                </div>
                <p className="font-bold text-ink-1 text-[14px] mb-1">{title}</p>
                <p className="text-[12px] text-ink-3">{body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/meetmaster" className="btn-gold btn-lg">
              Explorer les Masters <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/meetmaster/apply" className="btn-ghost btn-lg">
              Devenir Master — 500 MAD/meeting
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ───────────────────────────────────── */
function Pricing() {
  const packs = [
    { name: 'Démarrage', credits: 100,   price: 'Gratuit',  note: "À l'inscription", feats: ['100 crédits offerts','~50 profils complets','Toutes les fonctionnalités','Sans carte bancaire'], hot: false, cta: 'Créer un compte' },
    { name: 'Starter',   credits: 500,   price: '149 MAD',  note: 'Paiement unique',  feats: ['500 crédits','~250 profils complets','Export CSV','CRM intégré'], hot: false, cta: 'Choisir Starter' },
    { name: 'Growth',    credits: 2000,  price: '499 MAD',  note: 'Paiement unique',  feats: ['2 000 crédits','~1 000 profils complets','Export CSV','CRM intégré','Support prioritaire'], hot: true, cta: 'Choisir Growth' },
    { name: 'Pro',       credits: 10000, price: '1 990 MAD',note: 'Paiement unique',  feats: ['10 000 crédits','~5 000 profils','Export CSV','CRM intégré','Support dédié'], hot: false, cta: 'Choisir Pro' },
    { name: 'Entreprise',credits: null,  price: 'Sur devis',note: 'Facturation mensuelle', feats: ['Crédits illimités','Multi-utilisateurs','API dédiée','SLA garanti','Onboarding'], hot: false, cta: 'Nous contacter' },
  ]
  return (
    <section id="tarifs" className="section bg-surface-1">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-bold text-ink-1 mb-3"
            style={{ fontSize: 'clamp(28px,3.5vw,42px)', lineHeight: 1.2, letterSpacing: '-1.5px', fontWeight: 800 }}>
            Commencez gratuitement.
            <br />Évoluez à votre rythme.
          </h2>
          <p className="text-[16px] text-ink-3">Pas d&apos;abonnement. Pas de surprise. Achetez quand vous en avez besoin.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {packs.map(p => (
            <div key={p.name}
              className={cn('rounded-[20px] p-5 flex flex-col border transition-all',
                p.hot
                  ? 'bg-brand-600 border-brand-500 shadow-[0_8px_40px_rgba(79,70,229,0.3)] lg:scale-[1.04]'
                  : 'bg-white border-[rgba(0,0,0,0.07)] hover:border-[rgba(0,0,0,0.12)] hover:shadow-card-md'
              )}>
              {p.hot && <div className="text-[10px] font-bold uppercase tracking-widest text-brand-200 mb-2">⭐ Populaire</div>}
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${p.hot ? 'text-brand-200' : 'text-ink-4'}`}>{p.name}</p>
              <p className={`font-bold mb-0.5 ${p.hot ? 'text-white' : 'text-ink-1'}`}
                style={{ fontSize: '22px', letterSpacing: '-0.5px', fontWeight: 800 }}>{p.price}</p>
              <p className={`text-[12px] mb-3 ${p.hot ? 'text-brand-200' : 'text-ink-4'}`}>{p.note}</p>
              {p.credits && <p className={`text-[13px] font-semibold mb-4 ${p.hot ? 'text-brand-100' : 'text-ink-2'}`}>{p.credits.toLocaleString()} crédits</p>}
              <ul className="space-y-1.5 flex-1 mb-5">
                {p.feats.map(f => (
                  <li key={f} className={`flex items-start gap-1.5 text-[12px] ${p.hot ? 'text-brand-100' : 'text-ink-3'}`}>
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${p.hot ? 'text-white' : 'text-emerald-500'}`} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className={cn('block text-center text-[13px] font-semibold py-2.5 rounded-pill transition-all',
                  p.hot
                    ? 'bg-white text-brand-700 hover:bg-brand-50'
                    : 'bg-surface-2 text-ink-2 hover:bg-surface-3 border border-[rgba(0,0,0,0.07)]'
                )}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ──────────────────────────────── */
function Testimonials() {
  const reviews = [
    { quote: 'Avant LeadScout, je passais des journées à chercher des contacts. Maintenant j\'ai une liste qualifiée en 10 minutes.', name: 'Karim B.', role: 'Directeur Commercial · IT, Casablanca' },
    { quote: 'Le système de crédits est très intelligent. Je ne paie que les coordonnées des prospects qui m\'intéressent vraiment.', name: 'Nadia A.', role: 'Fondatrice · Agence, Rabat' },
    { quote: 'Le CRM intégré est un vrai bonus. Je gère tout mon pipeline de prospection directement dans l\'outil.', name: 'Youssef E.', role: 'Business Developer · Fintech, Casablanca' },
  ]
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-bold text-ink-1"
            style={{ fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.2, letterSpacing: '-1px', fontWeight: 800 }}>
            Ils ont trouvé leurs prospects
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map(({ quote, name, role }, i) => (
            <div key={name}
              className="bg-surface-1 rounded-[20px] border border-[rgba(0,0,0,0.06)] p-7 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex gap-0.5 mb-5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-gold-400 text-gold-400" />)}
              </div>
              <p className="text-[14px] text-ink-2 leading-relaxed mb-6 italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div>
                <p className="font-bold text-ink-1 text-[14px]">{name}</p>
                <p className="text-[12px] text-ink-4 mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ───────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: "Qu'est-ce qu'un crédit LeadScout ?", a: "Un crédit vous permet de débloquer un champ de données pour une entreprise spécifique. Voir le numéro de téléphone = 1 crédit, email dirigeant = 5 crédits. Les informations de base (nom, secteur, ville) sont toujours gratuites." },
    { q: "Les données sont-elles à jour et fiables ?", a: "Nos données proviennent de sources officielles marocaines et sont régulièrement vérifiées. Nous privilégions la qualité à la quantité pour vous garantir des coordonnées exploitables." },
    { q: "Y a-t-il un abonnement mensuel ?", a: "Non. LeadScout fonctionne uniquement à l'usage. Vous achetez des crédits une fois, ils n'expirent pas. Aucun renouvellement automatique." },
    { q: "Puis-je exporter les données ?", a: "Oui. Toutes vos données débloquées sont exportables en CSV à tout moment. Compatible Excel, HubSpot, Salesforce." },
    { q: "Comment fonctionne le CRM intégré ?", a: "Après une recherche, ajoutez des leads au CRM. Gérez-y statuts, historique d'appels, notes et rappels — tout synchronisé avec vos données." },
    { q: "Suis-je débité deux fois pour un même contact ?", a: "Jamais. Si vous avez déjà débloqué le téléphone d'une entreprise, il s'affichera automatiquement sans déduire de crédits." },
  ]
  return (
    <section id="faq" className="section bg-surface-1">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="font-bold text-ink-1"
            style={{ fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.2, letterSpacing: '-1px', fontWeight: 800 }}>
            Questions fréquentes
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <div key={i}
              className={cn('bg-white rounded-[14px] border overflow-hidden transition-all',
                open === i ? 'border-brand-200 shadow-[0_2px_12px_rgba(79,70,229,0.06)]' : 'border-[rgba(0,0,0,0.07)]'
              )}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group">
                <span className={cn('font-semibold text-[14px] leading-snug', open === i ? 'text-brand-700' : 'text-ink-1')}
                  style={{ letterSpacing: '-0.1px' }}>{q}</span>
                <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform duration-200',
                  open === i ? 'rotate-180 text-brand-500' : 'text-ink-4')} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-[14px] text-ink-3 leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ─────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="section" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #faf5ff 100%)' }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white border border-[rgba(0,0,0,0.07)] rounded-pill px-4 py-2 text-[12px] font-semibold text-ink-3 mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Sans engagement · Sans carte bancaire
          </div>
          <h2 className="font-bold text-ink-1 mb-4"
            style={{ fontSize: 'clamp(32px,5vw,60px)', lineHeight: 1.1, letterSpacing: '-2px', fontWeight: 800 }}>
            Prêt à prospecter
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
              intelligemment ?
            </span>
          </h2>
          <p className="text-[17px] text-ink-3 mb-10 leading-relaxed">
            Rejoignez LeadScout et recevez 100 crédits gratuits pour démarrer maintenant.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="btn-primary btn-xl group">
              Créer mon compte gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-[13px] text-ink-4 mt-5">100 crédits offerts · Aucune carte bancaire requise</p>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-ink-1 py-14">
      <div className="container px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-[15px] tracking-tight">LeadScout</span>
            </div>
            <p className="text-[13px] text-[rgba(255,255,255,0.35)] leading-relaxed">
              La base de données B2B marocaine. Prospectez avec précision.
            </p>
          </div>
          {[
            { title: 'Produit', links: [{ l:'Fonctionnalités',h:'#fonctionnalites'},{l:'Tarifs',h:'#tarifs'},{l:'FAQ',h:'#faq'},{l:'MeetMaster',h:'/meetmaster'}] },
            { title: 'Compte',  links: [{ l:'Se connecter',h:'/login'},{l:'Créer un compte',h:'/register'},{l:'Dashboard',h:'/dashboard'}] },
            { title: 'Contact', links: [{ l:'contact@leadscout.ma',h:'mailto:contact@leadscout.ma'},{l:'support@leadscout.ma',h:'mailto:support@leadscout.ma'}] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[rgba(255,255,255,0.3)] mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map(lk => (
                  <li key={lk.l}><Link href={lk.h} className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-white transition-colors">{lk.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[rgba(255,255,255,0.2)]">© {new Date().getFullYear()} LeadScout. Tous droits réservés. · Maroc</p>
          <div className="flex items-center gap-5">
            <span className="text-[12px] text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.4)] cursor-pointer transition-colors">Confidentialité</span>
            <span className="text-[12px] text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.4)] cursor-pointer transition-colors">CGU</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ──────────────────────────────────────── */
export default function LandingPage() {
  const [showBar, setShowBar] = useState(true)

  return (
    <div className="overflow-x-hidden">
      {showBar && <AnnouncementBar onDismiss={() => setShowBar(false)} />}
      <Nav hasBar={showBar} />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <FieldPricing />
      <MeetMasterSection />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
