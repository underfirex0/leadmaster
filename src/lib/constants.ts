// ── FIELD COSTS (Tarification Maroc 2026) ───────────────────
// Tier 0: Free | Tier 1: 1cr | Tier 2: 2cr | Tier 3: 5cr

export const FIELD_COSTS: Record<string, number> = {
  // Tier 0 — always free
  name:            0,
  sector:          0,
  city:            0,
  region:          0,
  forme_juridique: 0,
  status:          0,

  // Tier 1 — 1 credit per field
  phone:   1,
  email:   1,
  website: 1,
  address: 1,

  // Tier 2 — 2 credits per field
  effectif_label:  2,
  dirigeant_name:  2,
  annee_creation:  2,

  // Tier 3 — 5 credits per field (ALL premium = 5cr now)
  dirigeant_phone: 5,
  dirigeant_email: 5,
  revenue_label:   5,
  capital_social:  5,
}

export const FREE_FIELDS    = Object.entries(FIELD_COSTS).filter(([, v]) => v === 0).map(([k]) => k)
export const TIER1_FIELDS   = Object.entries(FIELD_COSTS).filter(([, v]) => v === 1).map(([k]) => k)
export const TIER2_FIELDS   = Object.entries(FIELD_COSTS).filter(([, v]) => v === 2).map(([k]) => k)
export const TIER3_FIELDS   = Object.entries(FIELD_COSTS).filter(([, v]) => v === 5).map(([k]) => k)

export const FIELD_LABELS: Record<string, string> = {
  name:            'Raison sociale',
  sector:          'Secteur',
  city:            'Ville',
  region:          'Région',
  forme_juridique: 'Forme juridique',
  status:          'Statut',
  phone:           'Téléphone',
  email:           'E-mail',
  website:         'Site web',
  address:         'Adresse',
  effectif_label:  'Effectif',
  dirigeant_name:  'Nom dirigeant',
  annee_creation:  'Année création',
  dirigeant_phone: 'Tél. dirigeant',
  dirigeant_email: 'E-mail dirigeant',
  revenue_label:   'Chiffre d\'affaires',
  capital_social:  'Capital social',
}

// ── PROFILE UNLOCK PRESETS ────────────────────────────────────
export const UNLOCK_PRESETS = {
  identification: { fields: ['name','sector','city'],                                cost: 0  },
  contact_basic:  { fields: ['phone','email','address'],                             cost: 3  },
  standard:       { fields: ['effectif_label','dirigeant_name'],                     cost: 7  }, // cumulative from identification+contact_basic
  qualified:      { fields: ['dirigeant_phone'],                                     cost: 12 },
  complete:       { fields: ['dirigeant_email','revenue_label','capital_social'],    cost: 22 },
} as const

// ── PLANS ─────────────────────────────────────────────────────
export const PLANS = {
  decouverte: { id: 'decouverte', name: 'Découverte', price: 0,   annual: 0,   credits: 100,  users: 1,    csvLimit: 5,    crm: 'readonly' as const },
  solo:       { id: 'solo',       name: 'Solo',        price: 149, annual: 119, credits: 400,  users: 1,    csvLimit: 100,  crm: 'full'     as const },
  equipe:     { id: 'equipe',     name: 'Équipe',      price: 390, annual: 299, credits: 1500, users: 3,    csvLimit: null, crm: 'full'     as const },
  business:   { id: 'business',   name: 'Business',    price: 990, annual: 790, credits: 5000, users: 10,   csvLimit: null, crm: 'advanced' as const },
  entreprise: { id: 'entreprise', name: 'Entreprise',  price: 0,   annual: 0,   credits: null, users: null, csvLimit: null, crm: 'advanced' as const },
}

// ── CREDIT PACKS ──────────────────────────────────────────────
export const CREDIT_PACKS = [
  { id: 'boost',     name: 'Pack Boost',     credits: 200,   price: 59,   pricePerCr: 0.30 },
  { id: 'essential', name: 'Pack Essential', credits: 500,   price: 139,  pricePerCr: 0.28 },
  { id: 'growth',    name: 'Pack Growth',    credits: 2000,  price: 469,  pricePerCr: 0.23 },
  { id: 'pro',       name: 'Pack Pro',       credits: 5000,  price: 990,  pricePerCr: 0.20 },
  { id: 'mega',      name: 'Pack Mega',      credits: 15000, price: 2490, pricePerCr: 0.17 },
]

// ── SECTORS ───────────────────────────────────────────────────
export const SECTORS = [
  'BTP & Construction',
  'Technologies de l\'information',
  'Import / Export',
  'Industrie & Manufacturing',
  'Agroalimentaire',
  'Services Financiers',
  'Commerce & Distribution',
  'Santé & Pharma',
  'Transport & Logistique',
  'Immobilier',
]

// ── CITIES ────────────────────────────────────────────────────
export const CITIES = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech',
  'Agadir', 'Fès', 'Meknès', 'Oujda',
  'Settat', 'Khouribga', 'El Jadida', 'Béni Mellal',
  'Tétouan', 'Safi',
]

export const REGIONS = [
  'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Tanger-Tétouan-Al Hoceïma',
  'Marrakech-Safi', 'Fès-Meknès', 'Souss-Massa', 'Oriental',
  'Béni Mellal-Khénifra', 'Drâa-Tafilalet',
]

export const EFFECTIF_OPTIONS = [
  '1-9 employés', '10-19 employés', '20-49 employés',
  '50-99 employés', '100-199 employés', '200-499 employés',
  '500+ employés',
]
export const MAX_RESULTS = 100
