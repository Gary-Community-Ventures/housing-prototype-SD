import { useState, useMemo, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home, User, ArrowRight, ArrowLeft, DollarSign, CreditCard, MapPin, CheckCircle2, Gift, TrendingUp, Building, Star, Phone, Mail, ExternalLink, Upload, FileText, X, Calendar, Clock, Video, MessageSquare } from 'lucide-react'
import { lenders } from '@/data/lenders'
import { realtors } from '@/data/realtors'

// Constants
const COUNTIES = ['Adams', 'Arapahoe', 'Boulder', 'Broomfield', 'Denver', 'Douglas', 'El Paso', 'Jefferson', 'Larimer', 'Pueblo', 'Weld']
const CREDIT_RANGES = [
  { value: '740-plus', label: '740+' },
  { value: '700-739', label: '700-739' },
  { value: '660-699', label: '660-699' },
  { value: '620-659', label: '620-659' },
  { value: '580-619', label: '580-619' },
  { value: 'below-580', label: 'Below 580' }
]
const STEPS = ['Overview', 'Profile', 'Affordability', 'Your Options', 'Realtor', 'Pre-Approval', 'Prepare and Apply']

// Application phases with colors
const PHASES = [
  { name: 'Learn', color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-700', steps: [1, 2], description: 'Discover your options' },
  { name: 'Your Options', color: 'bg-yellow-500', lightColor: 'bg-yellow-100', textColor: 'text-yellow-700', steps: [3], description: 'Explore assistance types' },
  { name: 'Connect', color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-700', steps: [4, 5], description: 'Build your team' },
  { name: 'Prepare and Apply', color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-700', steps: [6], description: 'Get ready and close' }
]

// Programs data
const PROGRAMS = [
  {
    id: 'chfa-firststep-plus',
    name: 'CHFA FirstStep Plus',
    administrator: 'CHFA',
    type: 'First Mortgage + DPA Second',
    maxDPAText: 'Up to $25,000 or 4% of loan',
    maxAssistance: 25000,
    description: '0% interest DPA paired with a CHFA FHA first mortgage. DPA deferred until sale or refinance.',
    firstTimeBuyerOnly: true,
    minCredit: 620,
    maxIncome: 174440,
    maxIncomeByCounty: {
      Adams: 161110, Arapahoe: 161110, Boulder: 173190, Broomfield: 161110,
      Denver: 161110, Douglas: 161110, 'El Paso': 143290, Jefferson: 161110,
      Larimer: 146740, Pueblo: 174440, Weld: 174440
    },
    incomeLimitText: 'Varies by county/household size',
    counties: ['all'],
    serviceAreaText: 'Statewide',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['0% interest DPA, no monthly payments', 'DPA can cover down payment, closing costs, or rate buydown', 'Gift funds allowed for $1,000 min contribution', 'Lowest CHFA interest rates'],
    drawbacks: ['DPA due on sale, refi, or move out', 'FHA only — requires mortgage insurance', 'Cannot stack with other DPA programs'],
    programLink: 'https://www.chfainfo.com/single-family-participating-lenders/chfa-firststep',
    applyLink: 'https://www.chfainfo.com/getattachment/4e0ac051-ffd8-468c-926c-2c9fb9547999/CHFA-FirstStep-and-Plus-matrix.pdf',
  },
  {
    id: 'chfa-smartstep-plus',
    name: 'CHFA SmartStep Plus',
    administrator: 'CHFA',
    type: 'First Mortgage + DPA Second',
    maxDPAText: 'Up to $25,000 or 4% of loan',
    maxAssistance: 25000,
    description: '0% interest DPA open to first-time and repeat buyers. Pairs with FHA, VA, or USDA loans.',
    firstTimeBuyerOnly: false,
    minCredit: 620,
    maxIncome: 174440,
    incomeLimitText: '$174,440 statewide',
    counties: ['all'],
    serviceAreaText: 'Statewide',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Not limited to first-time buyers', 'FHA, VA, or USDA loan options', '0% interest DPA, no monthly payments', 'Higher income limit ($174,440)'],
    drawbacks: ['DPA due on sale, refi, or move out', 'Cannot stack with other DPA programs'],
    programLink: 'https://www.chfainfo.com/single-family-participating-lenders/programs-forms-and-matrices',
    applyLink: 'https://www.chfainfo.com/getattachment/3ae13693-82ec-498d-8d22-72987ad3f3ac/CHFA-SmartStep-Plus-matrix.pdf',
  },
  {
    id: 'chfa-firstgeneration',
    name: 'CHFA FirstGeneration',
    administrator: 'CHFA',
    type: 'First Mortgage + DPA Second',
    maxDPAText: '$25,000 flat (not capped at 4%)',
    maxAssistance: 25000,
    description: '$25,000 DPA for first-generation homebuyers whose parents never owned a home. Foster care alumni eligible.',
    firstTimeBuyerOnly: true,
    requiresFirstGen: true,
    minCredit: 620,
    maxIncome: 174440,
    maxIncomeByCounty: {
      Adams: 161110, Arapahoe: 161110, Boulder: 173190, Broomfield: 161110,
      Denver: 161110, Douglas: 161110, 'El Paso': 143290, Jefferson: 161110,
      Larimer: 146740, Pueblo: 174440, Weld: 174440
    },
    incomeLimitText: 'Varies by county/household size',
    counties: ['all'],
    serviceAreaText: 'Statewide',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['$25K DPA regardless of loan size (not capped at 4%)', '0% interest, no monthly payments', 'Designed for buyers whose parents never owned', 'Foster care alumni eligible'],
    drawbacks: ['Borrower AND parents/guardians must never have owned a home', 'FHA only', 'Subject to IRS Recapture Tax'],
    programLink: 'https://www.chfainfo.com/single-family-participating-lenders/programs-forms-and-matrices',
    applyLink: 'https://www.chfainfo.com/getattachment/013bd34d-30b3-4176-ba09-8e67fe1b4b46/CHFA-FirstGeneration-matrix.pdf',
  },
  {
    id: 'chfa-homeaccess',
    name: 'CHFA HomeAccess',
    administrator: 'CHFA',
    type: 'First Mortgage + DPA (Grant or Second)',
    maxDPAText: '$25,000 flat',
    maxAssistance: 25000,
    description: '$25,000 DPA for buyers with a permanent disability or custodial parents of a child with a disability.',
    firstTimeBuyerOnly: false,
    requiresDisability: true,
    minCredit: 620,
    maxIncome: 174440,
    incomeLimitText: 'Varies by county/household size',
    counties: ['all'],
    serviceAreaText: 'Statewide',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Lower min contribution ($500)', '$25K DPA regardless of loan size', 'Not limited to first-time buyers', 'Cosigners allowed (unique among CHFA programs)'],
    drawbacks: ['Must have permanent disability OR be custodial parent of child with disability', 'Requires disability documentation (SSA, VA, or doctor)'],
    programLink: 'https://www.chfainfo.com/single-family-participating-lenders/programs-forms-and-matrices',
    applyLink: 'https://www.chfainfo.com/getattachment/4d5eaa5e-ba08-4bd2-8729-46d2d2cd1512/CHFA-HomeAccess-Program-Matrix.pdf',
  },
  {
    id: 'chac-statewide',
    name: 'CHAC Statewide DPA',
    administrator: 'CHAC',
    type: 'DPA Second Mortgage',
    maxDPAText: 'Up to 6% of price or $12,000',
    maxAssistance: 12000,
    description: 'Second mortgage DPA that pairs with any first mortgage lender. Free counseling and education included.',
    firstTimeBuyerOnly: true,
    minCredit: 620,
    maxIncome: 100000,
    incomeLimitText: '80% AMI (100% AMI in Arvada)',
    counties: ['all'],
    serviceAreaText: 'Statewide',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Pairs with ANY first mortgage lender', 'Free site-based education classes', 'Personal counseling included'],
    drawbacks: ['Gift NOT allowed for min contribution — must be own funds', 'Requires savings history documentation', 'Separate counseling session required beyond education class'],
    programLink: 'https://chaconline.org/borrowers/',
    applyLink: 'https://chaconline.org/lenders/',
  },
  {
    id: 'aurora-dpa',
    name: 'Aurora DPA (Prop 123)',
    administrator: 'City of Aurora',
    type: 'DPA Second Mortgage',
    maxDPAText: '4–10% of purchase price',
    maxAssistance: 40000,
    description: '0% interest silent second mortgage for Aurora properties. New program (Dec 2025) — funding still available.',
    firstTimeBuyerOnly: false,
    minCredit: 620,
    maxIncome: 168000,
    incomeLimitText: '120% AMI (~$168,000 for 4-person)',
    counties: ['Arapahoe', 'Adams', 'Douglas'],
    serviceAreaText: 'City of Aurora only',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Up to 10% of purchase price', 'Not limited to first-time buyers', '0% interest — no monthly payments', 'New program with funding available'],
    drawbacks: ['Must repay on sale, refi, or payoff', 'Ends Oct 31, 2026 or when $720K fund is depleted', 'Limited funding (~24 households expected)', 'Aurora properties only'],
    programLink: 'https://www.auroragov.org/residents/home_improvement/down_payment_assistance',
    applyLink: 'https://www.auroragov.org/residents/home_improvement/down_payment_assistance',
  },
  {
    id: 'el-paso-pikes-peak',
    name: 'Pikes Peak DPA',
    administrator: 'El Paso County Housing Authority',
    type: 'DPA Forgivable Second',
    maxDPAText: 'Up to 5% of purchase price',
    maxAssistance: 20000,
    description: '0% interest DPA with partial forgiveness over 5 and 30 years. Bonus 1% for first responders, military, teachers, and healthcare workers.',
    firstTimeBuyerOnly: false,
    minCredit: 620,
    maxIncome: 174440,
    incomeLimitText: '$174,440 (govt loans) / $90,720 (conventional)',
    counties: ['El Paso'],
    serviceAreaText: 'El Paso County (incl. Colorado Springs)',
    isGrant: false,
    yearsToForgiveness: 30,
    benefits: ['50% forgiven over first 5 years', 'Remaining 50% forgiven at 30 years', 'Not limited to first-time buyers', '+1% bonus for first responders, military, teachers, healthcare (first 75 loans)'],
    drawbacks: ['El Paso County only', 'Must repay balance if sell/refi before forgiveness complete', 'Conventional loans have lower income limit ($90,720)'],
    programLink: 'https://admin.elpasoco.com/economic-development/housing-programs/ppdpa/',
    applyLink: 'https://pikespeakdpa.com/',
  },
  {
    id: 'boulder-county-dpa',
    name: 'Boulder County DPA',
    administrator: 'City of Longmont',
    type: 'DPA Second Mortgage',
    maxDPAText: 'Up to 10% of price, max $40,000',
    maxAssistance: 40000,
    description: 'Up to $40,000 for Boulder County buyers (outside City of Boulder). Finance coaching included.',
    firstTimeBuyerOnly: true,
    minCredit: 620,
    maxIncome: 90000,
    incomeLimitText: '80% AMI (Boulder County)',
    counties: ['Boulder'],
    serviceAreaText: 'Boulder County (outside City of Boulder)',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Up to $40,000 in assistance', '0% interest deferred if below 60% AMI', '2–3% low-interest loan if 61–80% AMI', 'Personal finance coaching included'],
    drawbacks: ['First-time buyers only', 'Max purchase price $489,000', 'Must complete CHFA education + finance coaching', 'Excludes City of Boulder'],
    programLink: 'https://longmontcolorado.gov/housing-and-community-investment/boulder-county-down-payment-assistance/',
    applyLink: 'https://longmontcolorado.gov/housing-and-community-investment/boulder-county-down-payment-assistance/',
  },
  {
    id: 'boulder-h2o',
    name: 'City of Boulder H2O Program',
    administrator: 'City of Boulder / Impact Development Fund',
    type: 'Shared Appreciation Loan',
    maxDPAText: 'Up to $100,000',
    maxAssistance: 100000,
    description: 'Up to $100,000 — the largest DPA in Colorado — with 0% interest and no payments for 30 years.',
    firstTimeBuyerOnly: true,
    minCredit: 620,
    maxIncome: 175000,
    incomeLimitText: 'Up to 150% AMI',
    counties: ['Boulder'],
    serviceAreaText: 'City of Boulder only',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Up to $100,000 DPA — largest in Colorado', '0% interest, no payments for 30 years', 'Market rate homes (no deed restriction)', 'Can build equity'],
    drawbacks: ['Shared appreciation — must repay loan + % of home value increase', 'City of Boulder only', 'First-time buyers only', 'Limited funding — first come, first served'],
    programLink: 'https://bouldercolorado.gov/homeownership/h2o',
    applyLink: 'https://impactdf.org/',
  },
  {
    id: 'broomfield-chac',
    name: 'Broomfield/CHAC DPA',
    administrator: 'CHAC (for City of Broomfield)',
    type: 'DPA Deferred Loan',
    maxDPAText: 'Up to 10% of sales price',
    maxAssistance: 40000,
    description: '30-year deferred loan at 0% interest for Broomfield buyers. Administered by CHAC with free education classes.',
    firstTimeBuyerOnly: true,
    minCredit: 620,
    maxIncome: 100000,
    incomeLimitText: '80% AMI',
    counties: ['Broomfield'],
    serviceAreaText: 'City of Broomfield only',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Up to 10% DPA', '30-year deferred loan at 0% interest', 'No monthly payments', 'Free homebuyer education classes'],
    drawbacks: ['First-time buyers only', 'Gift NOT allowed for min contribution', 'Broomfield only', 'Due on sale, transfer, or loan expiration'],
    programLink: 'https://www.broomfield.org/1445/Housing-Programs',
    applyLink: 'https://chaconline.org/borrowers/',
  },
  {
    id: 'firstbank-dpa',
    name: 'FirstBank DPA Program',
    administrator: 'Impact Development Fund / FirstBank',
    type: 'DPA Second Mortgage',
    maxDPAText: 'Up to 20% of price, max $30,000',
    maxAssistance: 30000,
    description: 'Up to $30,000 statewide, including rural areas where other programs don\'t reach. Must use FirstBank.',
    firstTimeBuyerOnly: true,
    minCredit: 620,
    maxIncome: 100000,
    incomeLimitText: '80% AMI',
    counties: ['all'],
    serviceAreaText: 'Statewide (must use FirstBank mortgage)',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Up to $30,000 in assistance', 'Available statewide including rural areas', 'Works where other programs don\'t reach'],
    drawbacks: ['Must use FirstBank for first mortgage', 'First-time buyers only', '80% AMI income limit', 'Has monthly payments — 4% interest, 15-year term'],
    programLink: 'https://impactdf.org/',
    applyLink: 'https://impactdf.org/',
  },
  {
    id: 'dearfield-fund',
    name: 'Dearfield Fund for Black Wealth',
    administrator: 'Impact Development Fund',
    type: 'DPA Second Mortgage',
    maxDPAText: 'Up to 15% of price, max $40,000',
    maxAssistance: 40000,
    description: 'Up to $40,000 DPA for Black homebuyers in the Denver Metro area. Higher 140% AMI income limit.',
    firstTimeBuyerOnly: true,
    requiresBlack: true,
    minCredit: 620,
    maxIncome: 175000,
    incomeLimitText: '140% AMI',
    counties: ['Adams', 'Arapahoe', 'Denver', 'Douglas', 'Jefferson', 'Broomfield'],
    serviceAreaText: '6-county Denver Metro area',
    isGrant: false,
    yearsToForgiveness: null,
    benefits: ['Up to $40,000 in assistance', 'Higher income limit (140% AMI)', 'Up to 15% of purchase price', 'Addresses racial wealth gap in homeownership'],
    drawbacks: ['Must self-identify as Black', 'First-time buyers only', 'Denver Metro only (6 counties)', 'Limited funding'],
    programLink: 'https://impactdf.org/',
    applyLink: 'https://impactdf.org/',
  },
]


const AFFORDABLE_PROGRAMS = [
  {
    id: 'eclt',
    name: 'Elevation Community Land Trust (ECLT)',
    organization: 'Elevation CLT',
    modelType: 'Community Land Trust',
    serviceAreaText: 'Statewide (Denver Metro, Larimer, and others)',
    counties: ['all'],
    incomeLimitText: '80% AMI (varies by county)',
    requirements: ['Income and asset eligibility required', 'Complete ECLT online orientation', 'Work with ECLT-approved lender', '99-year renewable land lease'],
    benefits: ['Below-market home prices (land cost removed)', 'Permanently affordable for future generations', 'Builds equity through ownership', 'Conventional mortgage eligible'],
    drawbacks: ['You don\'t own the land (99-year lease)', 'Limited appreciation when you sell (shared with CLT)', 'Resale restrictions apply', 'Limited inventory — homes sell quickly'],
    website: 'https://elevationclt.org/qualify-apply/',
    contact: 'info@elevationclt.org | 720-822-0052',
  },
  {
    id: 'cclt',
    name: 'Colorado Community Land Trust (CCLT)',
    organization: 'Habitat for Humanity of Metro Denver',
    modelType: 'Community Land Trust',
    serviceAreaText: 'Denver Metro (Lowry, Speer, Cole, Swansea neighborhoods)',
    counties: ['Denver'],
    incomeLimitText: '80% AMI',
    requirements: ['Income verification', 'Complete homebuyer education', 'Mortgage pre-qualification', 'Work with Habitat-approved lenders'],
    benefits: ['Merged with Habitat for Humanity (strong support network)', 'Permanently affordable neighborhoods', 'Equity building opportunity', 'Over 215 homes in portfolio'],
    drawbacks: ['Limited to specific Denver neighborhoods', 'Land lease model — restricted appreciation', 'Limited inventory', 'Resale restrictions apply'],
    website: 'https://habitatmetrodenver.org/home-programs/cclt/',
    contact: 'stewardship@habitatmetrodenver.org | 720-496-2703',
  },
  {
    id: 'thistle-clt',
    name: 'Thistle Community Land Trust',
    organization: 'Thistle Community Housing',
    modelType: 'Community Land Trust',
    serviceAreaText: 'Boulder County',
    counties: ['Boulder'],
    incomeLimitText: '80% AMI',
    requirements: ['Complete Boulder County common application', 'Income and asset verification', 'CHFA certificate or mortgage pre-qualification', 'CLT supplement application'],
    benefits: ['Boulder County focus — serves a very high-cost area', 'Average sale price ~$119K (2022)', '99-year renewable land lease', 'Mapleton Mobile Home Park option available'],
    drawbacks: ['Boulder County only', 'Very limited inventory (~8 sales/year)', 'Applications only accepted when homes are available', 'Resale price restrictions'],
    website: 'https://www.thistlecommunityhousing.org/community-land-trust',
    contact: 'info@thistlecommunities.org | 303-443-0007',
  },
  {
    id: 'habitat-metro-denver',
    name: 'Habitat for Humanity Metro Denver',
    organization: 'Habitat for Humanity',
    modelType: 'Affordable Homeownership (Sweat Equity)',
    serviceAreaText: 'Denver Metro',
    counties: ['Denver', 'Adams', 'Arapahoe', 'Jefferson', 'Douglas', 'Broomfield'],
    incomeLimitText: 'Below 80% AMI',
    requirements: ['Income verification', 'Attend homebuyer education', 'Invest sweat equity (help build homes)', 'Affordable mortgage (~30% of income)'],
    benefits: ['Very affordable mortgage payments (~30% of income)', 'Full homeownership (not a land trust)', 'Over 1,500 families served in 40+ years', 'Build community through sweat equity'],
    drawbacks: ['Requires significant time commitment (sweat equity hours)', 'Competitive application process', 'Limited inventory', 'Income must qualify but be high enough to afford payments'],
    website: 'https://habitatmetrodenver.org/home-programs/homeownership/',
    contact: 'homeownership@habitatmetrodenver.org',
  },
  {
    id: 'crhdc',
    name: 'CRHDC Contractor Build Homes',
    organization: 'CRHDC',
    modelType: 'Affordable New Construction',
    serviceAreaText: 'Rural Colorado',
    counties: ['Larimer', 'Weld', 'Pueblo', 'El Paso'],
    incomeLimitText: '60–120% AMI',
    requirements: ['Income eligibility (60–120% AMI)', 'Mortgage qualification'],
    benefits: ['Move-in ready new construction', 'Customization options (flooring, cabinets, landscaping)', 'Multiple floorplan options', 'Quality contractor-built homes'],
    drawbacks: ['Limited to CRHDC development areas', 'Primarily rural locations', 'Inventory varies by development cycle'],
    website: 'https://crhdc.org/services/housing-development/',
    contact: 'CRHDC | 303-428-1448',
  },
]

// Realtors data

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

function formatNumberInput(value) {
  const digits = value.replace(/\D/g, '')
  return digits ? parseInt(digits, 10).toLocaleString('en-US') : ''
}

function parseFormattedNumber(value) {
  return value.replace(/,/g, '')
}

function getCreditMin(creditRange) {
  const map = { 'below-580': 500, '580-619': 580, '620-659': 620, '660-699': 660, '700-739': 700, '740-plus': 740 }
  return map[creditRange] || 0
}

function CountyMultiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md bg-white text-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={value.length ? 'text-gray-900' : 'text-gray-400'}>
          {value.length ? value.map(l => `${l} County`).join(', ') : 'Select Counties'}
        </span>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {COUNTIES.map(c => {
            const selected = value.includes(c)
            return (
              <div
                key={c}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => onChange(selected ? value.filter(l => l !== c) : [...value, c])}
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => onChange(selected ? value.filter(l => l !== c) : [...value, c])}
                  onClick={e => e.stopPropagation()}
                />
                <span className={`text-sm ${selected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{c} County</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function App() {
  const [step, setStep] = useState(0)
  const [showSchedulePopup, setShowSchedulePopup] = useState(false)
  const [showLenderPopup, setShowLenderPopup] = useState(false)
  const [stepComplete, setStepComplete] = useState({ 1: false, 2: false, 3: false })
  const [contactComplete, setContactComplete] = useState({ realtor: false, lender: false })
  const [optionsTab, setOptionsTab] = useState('dpa')
  const [selectedHousing, setSelectedHousing] = useState(null)
  const [selectionConflict, setSelectionConflict] = useState(null) // 'dpa' | 'housing' | null
  const [checkedDocs, setCheckedDocs] = useState({})
  const DOC_COUNT = 6
  const toggleStepComplete = (s) => {
    if (s === 2) {
      const newVal = !stepComplete[2]
      setStepComplete(prev => ({ ...prev, 2: newVal }))
      const allDocs = {}
      for (let i = 0; i < DOC_COUNT; i++) allDocs[i] = newVal
      setCheckedDocs(allDocs)
    } else if (s === 3) {
      const newVal = !stepComplete[3]
      setStepComplete(prev => ({ ...prev, 3: newVal }))
      setContactComplete({ realtor: newVal, lender: newVal })
    } else {
      setStepComplete(prev => ({ ...prev, [s]: !prev[s] }))
    }
  }
  const toggleDoc = (idx) => {
    setCheckedDocs(prev => {
      const updated = { ...prev, [idx]: !prev[idx] }
      const allChecked = Array.from({ length: DOC_COUNT }, (_, i) => i).every(i => updated[i])
      setStepComplete(prev2 => ({ ...prev2, 2: allChecked }))
      return updated
    })
  }
  const [formData, setFormData] = useState({
    location: [],
    income: '',
    creditScore: '',
    savings: '',
    firstTimeBuyer: false,
    firstGenBuyer: false,
    hasDisability: false,
    hispanicLatino: false,
    raceEthnicity: [],
    selectedPackage: null,
    selectedRealtor: null,
    selectedLender: null,
    documents: {
      payStubs: [],
      taxReturns: [],
      bankStatements: [],
      photoId: [],
      homeEducation: []
    }
  })

  const updateFormData = (updates) => setFormData(prev => ({ ...prev, ...updates }))

  const handleFileUpload = (docType, files) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }))
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: [...prev.documents[docType], ...newFiles]
      }
    }))
  }

  const removeFile = (docType, fileName) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: prev.documents[docType].filter(f => f.name !== fileName)
      }
    }))
  }

  // Calculate eligible programs
  const eligiblePrograms = useMemo(() => {
    if (!formData.location.length || !formData.income || !formData.creditScore) return []
    const income = parseInt(formData.income) || 0
    const creditMin = getCreditMin(formData.creditScore)

    return PROGRAMS.filter(p => {
      const countyMatch = p.counties.includes('all') || formData.location.some(loc => p.counties.includes(loc))
      if (!countyMatch) return false
      const effectiveMaxIncome = p.maxIncomeByCounty
        ? Math.max(...formData.location.map(loc => p.maxIncomeByCounty[loc] || p.maxIncome))
        : p.maxIncome
      if (income > effectiveMaxIncome) return false
      if (creditMin < p.minCredit) return false
      if (p.firstTimeBuyerOnly && !formData.firstTimeBuyer) return false
      if (p.requiresDisability && !formData.hasDisability) return false
      if (p.requiresFirstGen && !formData.firstGenBuyer) return false
      if (p.requiresBlack && !formData.raceEthnicity.includes('black-african-american')) return false
      return true
    })
  }, [formData.location, formData.income, formData.creditScore, formData.firstTimeBuyer, formData.hasDisability, formData.firstGenBuyer, formData.raceEthnicity])  // eslint-disable-line

  // Calculate packages
  const packages = useMemo(() => {
    if (eligiblePrograms.length === 0) return []
    const income = parseInt(formData.income) || 0
    const savings = parseInt(formData.savings) || 0
    const maxPrice = Math.min(income * 4.5, 600000)

    return eligiblePrograms.map(program => {
      const assistance = Math.min(program.maxAssistance, maxPrice * 0.05)
      const loanAmount = maxPrice - savings - assistance
      const monthlyPayment = Math.round((loanAmount * 0.065 / 12) + (maxPrice * 0.007 / 12) + 150)

      return {
        program,
        assistance,
        maxPrice,
        monthlyPayment,
        downPaymentNeeded: Math.max(0, maxPrice * 0.035 - assistance - savings)
      }
    }).sort((a, b) => a.program.name.localeCompare(b.program.name))
  }, [eligiblePrograms, formData.income, formData.savings])

  // Matching lenders and realtors
  const matchingLenders = lenders.slice().sort((a, b) => a.name.localeCompare(b.name))

  const matchingRealtors = realtors
    .filter(r => !formData.location.length || formData.location.some(loc => r.counties.includes(loc) || r.counties.includes('all')))
    .sort((a, b) => a.name.localeCompare(b.name))

  const matchingAffordablePrograms = AFFORDABLE_PROGRAMS
    .filter(p => !formData.location.length || p.counties.includes('all') || formData.location.some(loc => p.counties.includes(loc)))
    .sort((a, b) => a.name.localeCompare(b.name))

  const canContinue = step === 1 ? (formData.location.length && formData.income && formData.creditScore) : true
  const progressValue = ((step + 1) / STEPS.length) * 100

  const renderStep = () => {
    switch (step) {
      case 0: // Overview
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Colorado Homebuyer Navigator</h1>
              <p className="text-lg text-gray-600">Find down payment assistance programs you qualify for, see how much you can afford, and get connected with experienced professionals to guide you home.</p>
            </div>

            {/* Phase Overview */}
            <div className="space-y-4">
              {[
                {
                  phase: PHASES[0],
                  steps: ['Assess Your Finances', 'Understand Your Buying Power']
                },
                {
                  phase: PHASES[1],
                  steps: ['Explore Down Payment Assistance Programs', 'Learn About Affordable Housing Options']
                },
                {
                  phase: PHASES[2],
                  steps: ['Choose Your Realtor', 'Get Pre-Approved by a Lender']
                },
                {
                  phase: PHASES[3],
                  steps: ['Complete Homebuyer Education Course', 'Gather Necessary Documents', 'Connect with Your Realtor and Lender', 'Submit Your Application', 'Close on Your Home']
                }
              ].map((section, idx) => (
                <Card key={section.phase.name} className="border-2">
                  <CardHeader className={section.phase.lightColor}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${section.phase.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {idx + 1}
                      </div>
                      <div>
                        <CardTitle className={section.phase.textColor}>{section.phase.name} Phase</CardTitle>
                        <CardDescription>{section.phase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {section.steps.map((stepName, stepIdx) => (
                        <li key={stepIdx} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full ${section.phase.lightColor} flex items-center justify-center flex-shrink-0`}>
                            <div className={`w-2 h-2 rounded-full ${section.phase.color}`} />
                          </div>
                          <span className="text-gray-700">{stepName}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 1: // Profile
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to the Navigator</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                First, tell us a little about yourself.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle>Where Are You Hoping to Live?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CountyMultiSelect
                    value={formData.location}
                    onChange={(updated) => updateFormData({ location: updated })}
                  />
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle>Annual Income</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input type="text" inputMode="numeric" placeholder="85,000" className="pl-7" value={formData.income ? parseInt(formData.income).toLocaleString('en-US') : ''} onChange={(e) => updateFormData({ income: parseFormattedNumber(e.target.value) })} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                    <CardTitle>Credit Score</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Select value={formData.creditScore} onValueChange={(v) => updateFormData({ creditScore: v })}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {CREDIT_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle>Down Payment Saved</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input type="text" inputMode="numeric" placeholder="10,000" className="pl-7" value={formData.savings ? parseInt(formData.savings).toLocaleString('en-US') : ''} onChange={(e) => updateFormData({ savings: parseFormattedNumber(e.target.value) })} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">About You</CardTitle>
                <CardDescription>Helps match you with programs designed for specific groups. All fields are optional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="firstTime"
                    checked={formData.firstTimeBuyer}
                    onCheckedChange={(c) => updateFormData({ firstTimeBuyer: c })}
                    className="mt-0.5"
                  />
                  <div>
                    <Label htmlFor="firstTime" className="font-medium cursor-pointer">First-time homebuyer</Label>
                    <p className="text-sm text-gray-500">Haven't owned a home in the past 3 years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="firstGen"
                    checked={formData.firstGenBuyer}
                    onCheckedChange={(c) => updateFormData({ firstGenBuyer: c })}
                    className="mt-0.5"
                  />
                  <div>
                    <Label htmlFor="firstGen" className="font-medium cursor-pointer">First-generation homebuyer</Label>
                    <p className="text-sm text-gray-500">Neither you nor your parents/guardians have ever owned a home</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="disability"
                    checked={formData.hasDisability}
                    onCheckedChange={(c) => updateFormData({ hasDisability: c })}
                    className="mt-0.5"
                  />
                  <div>
                    <Label htmlFor="disability" className="font-medium cursor-pointer">I have a disability</Label>
                    <p className="text-sm text-gray-500">Permanent disability, or custodial parent of a child with a disability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Race &amp; Ethnicity</CardTitle>
                <CardDescription>Census-style. Select all that apply. Some programs are designed for specific communities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Are you of Hispanic, Latino, or Spanish origin?</p>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="hispanicLatino"
                      checked={formData.hispanicLatino}
                      onCheckedChange={(c) => updateFormData({ hispanicLatino: c })}
                    />
                    <Label htmlFor="hispanicLatino" className="cursor-pointer">Yes, Hispanic, Latino, or Spanish origin</Label>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">What is your race? <span className="font-normal text-gray-500">(Select all that apply)</span></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { value: 'white', label: 'White' },
                      { value: 'black-african-american', label: 'Black or African American' },
                      { value: 'american-indian-alaska-native', label: 'American Indian or Alaska Native' },
                      { value: 'asian', label: 'Asian' },
                      { value: 'native-hawaiian-pacific-islander', label: 'Native Hawaiian or Other Pacific Islander' },
                      { value: 'some-other-race', label: 'Some other race' },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-3">
                        <Checkbox
                          id={`race-${value}`}
                          checked={formData.raceEthnicity.includes(value)}
                          onCheckedChange={(c) => {
                            const updated = c
                              ? [...formData.raceEthnicity, value]
                              : formData.raceEthnicity.filter(r => r !== value)
                            updateFormData({ raceEthnicity: updated })
                          }}
                        />
                        <Label htmlFor={`race-${value}`} className="cursor-pointer text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2: { // Affordability
        // ── Step 1: Gross Monthly Income ──────────────────────────────
        const income = parseInt(formData.income) || 0
        const GMI = income / 12

        // ── Step 8: Interest rate by credit score ────────────────────
        // Base: 5.98% market (Feb 2026) + buffer → 6.25%; adjustments per credit tier
        const RATE_BY_CREDIT = {
          'below-580': 6.75, '580-619': 6.75,
          '620-659': 6.75,   '660-699': 6.50,
          '700-739': 6.25,   '740-plus': 6.25,
        }
        const displayRate = RATE_BY_CREDIT[formData.creditScore] || 6.25
        const annualRate = displayRate / 100
        const r = annualRate / 12

        // ── Step 3: Monthly Payment Factor (MPF) ─────────────────────
        const MPF = (r * Math.pow(1 + r, 360)) / (Math.pow(1 + r, 360) - 1)

        // ── Step 5: Down payment % ────────────────────────────────────
        // FHA (580+): 3.5% | Conventional (620+): can use 3-5%; use 3.5% for FHA scenario
        const creditMin = getCreditMin(formData.creditScore)
        const DOWN_PCT = creditMin >= 620 ? 0.035 : 0.035 // FHA 3.5% for all first-time buyer scenarios

        // ── County property tax rate lookup ───────────────────────────
        const COUNTY_TAX = {
          Adams: 0.0055, Arapahoe: 0.0055, Boulder: 0.0045,
          Broomfield: 0.0050, Denver: 0.0055, Douglas: 0.0050,
          'El Paso': 0.0045, Jefferson: 0.0050,
          Larimer: 0.0045, Pueblo: 0.0055, Weld: 0.0050,
        }
        const primaryCounty = formData.location[0]
        const taxRate = COUNTY_TAX[primaryCounty] || 0.0055
        const MIP_RATE = 0.0055  // FHA annual MIP (HUD ML 2023-05)
        const MONTHLY_INS = 125  // flat homeowner's insurance estimate

        // ── Step 4: Purchase price (algebraic solve) ──────────────────
        // P = (Max PITI − Monthly Insurance) ÷ [MPF × (1−dp) + (tax + MIP) ÷ 12]
        const denom = MPF * (1 - DOWN_PCT) + (taxRate + MIP_RATE) / 12
        const lowPITI  = GMI * 0.28  // conservative 28% front-end DTI
        const highPITI = GMI * 0.31  // FHA max 31% front-end DTI
        const lowPrice  = denom > 0 ? Math.round((lowPITI  - MONTHLY_INS) / denom / 1000) * 1000 : 0
        const highPrice = denom > 0 ? Math.round((highPITI - MONTHLY_INS) / denom / 1000) * 1000 : 0

        // ── Monthly PITI helper ───────────────────────────────────────
        const calcMonthly = (price) => {
          if (!price) return 0
          const loan = price * (1 - DOWN_PCT)
          return Math.round(MPF * loan + price * taxRate / 12 + MONTHLY_INS + loan * MIP_RATE / 12)
        }

        // ── Step 6: Down payment gap ──────────────────────────────────
        const savings = parseInt(formData.savings) || 0
        const minDown = Math.round(highPrice * DOWN_PCT)
        const closingCosts = Math.round(highPrice * 0.025)
        const totalCashNeeded = minDown + closingCosts
        const gap = Math.max(0, totalCashNeeded - savings)
        const maxDPA = eligiblePrograms.length > 0 ? Math.max(...eligiblePrograms.map(p => p.maxAssistance)) : 0
        const adjustedGap = Math.max(0, gap - maxDPA)

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Buying Power</h1>
            </div>

            {/* Price range card */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-green-700 font-bold text-center">Estimated purchase price range based on your income</p>
                <div className="flex items-center justify-center gap-4 mt-1">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(lowPrice)}</p>
                    <p className="text-xs text-green-600 mt-0.5">{formatCurrency(calcMonthly(lowPrice))}/mo PITI</p>
                    <p className="text-xs text-green-500">conservative</p>
                  </div>
                  <div className="text-green-400 font-bold text-xl">→</div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(highPrice)}</p>
                    <p className="text-xs text-green-600 mt-0.5">{formatCurrency(calcMonthly(highPrice))}/mo PITI</p>
                    <p className="text-xs text-green-500">FHA maximum</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash to close breakdown */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-5 flex flex-col items-center text-center">
                  <p className="text-sm text-blue-700 font-bold">Min. Down Payment</p>
                  <p className="text-xs text-blue-500 mt-1 mb-2">3.5% of purchase price (FHA)</p>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(minDown)}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardContent className="pt-5 flex flex-col items-center text-center">
                  <p className="text-sm text-orange-700 font-bold">Est. Closing Costs</p>
                  <p className="text-xs text-orange-500 mt-1 mb-2">~2.5% of purchase price</p>
                  <p className="text-2xl font-bold text-orange-800">{formatCurrency(closingCosts)}</p>
                </CardContent>
              </Card>
              <Card className={`border-2 ${gap === 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardContent className="pt-5 flex flex-col items-center text-center">
                  <p className={`text-sm font-bold ${gap === 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {gap === 0 ? 'Savings Cover It ✓' : 'Gap to Close'}
                  </p>
                  <p className={`text-xs mt-1 mb-2 ${gap === 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {gap === 0 ? `You have ${formatCurrency(savings)} saved` : 'DPA programs can help cover this'}
                  </p>
                  <p className={`text-2xl font-bold ${gap === 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {gap === 0 ? formatCurrency(0) : formatCurrency(gap)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Max DPA */}
            {eligiblePrograms.length > 0 && gap > 0 && (
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="pt-5 flex flex-col items-center text-center">
                  <p className="text-sm text-purple-700 font-bold">Maximum Down Payment Assistance Available</p>
                  <p className="text-xs text-purple-500 mt-1 mb-2">
                    {adjustedGap === 0
                      ? 'DPA programs can fully cover your gap'
                      : `After DPA, remaining gap: ${formatCurrency(adjustedGap)}`}
                  </p>
                  <p className="text-2xl font-bold text-purple-800">{formatCurrency(maxDPA)}</p>
                </CardContent>
              </Card>
            )}

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-center py-2 text-lg">
                  We found <span className="text-purple-700">{eligiblePrograms.length}</span> Programs You May Be Eligible For
                </CardTitle>
                <p className="text-center text-sm text-gray-500">More details on each program will be available on the next step.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {eligiblePrograms.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{p.name}</span>
                      <Badge variant={p.isGrant ? "default" : "secondary"}>
                        {p.isGrant ? 'Grant' : 'Loan'} up to {p.maxDPAText}
                      </Badge>
                    </div>
                  ))}
                  {eligiblePrograms.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No programs match your criteria. Try adjusting your profile.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rate assumption disclosure */}
            <p className="text-xs text-gray-400 text-center px-2">
              Estimates based on a {displayRate}% 30-yr fixed rate as of March 2026, {primaryCounty ? `${primaryCounty} County` : 'Colorado'} property tax rate, and FHA 3.5% down payment. Actual buying power and program eligibility will be confirmed by a lender. All figures are educational estimates only.
            </p>
          </div>
        )
      } // end case 2

      case 3: // Your Options
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Options</h1>
              <p className="text-lg text-gray-600">Explore the types of homebuying assistance available to you.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setOptionsTab('dpa')}
                className={`flex-1 py-3 text-base font-semibold border-b-2 transition-colors ${optionsTab === 'dpa' ? 'border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Down-Payment Assistance
              </button>
              <button
                onClick={() => setOptionsTab('clt')}
                className={`flex-1 py-3 text-base font-semibold border-b-2 transition-colors ${optionsTab === 'clt' ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Affordable Housing
              </button>
            </div>

            {/* DPA Tab */}
            {optionsTab === 'dpa' && (
              <div className="space-y-4">
                <Card className="border-2 border-purple-200 bg-purple-50">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-purple-800 mb-2">What is Down Payment Assistance?</h3>
                    <p className="text-sm text-purple-900 mb-4">Down Payment Assistance (DPA) programs help reduce the upfront cost of buying a home by covering part or all of your required down payment — through grants or forgivable loans.</p>
                    <div className="space-y-3">
                      {[
                        { title: 'Grants', desc: 'Free money that never needs to be repaid. Ideal for buyers who qualify.' },
                        { title: 'Forgivable Loans', desc: 'Loans that are forgiven over time — typically 5–10 years — as long as you remain in the home.' },
                        { title: 'Low-Interest Loans', desc: 'Second mortgages at reduced rates to supplement your primary loan.' },
                      ].map(item => (
                        <div key={item.title} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Select the Programs You Want to Explore</h2>
                      <p className="text-sm text-gray-600">If you would like to move forward with down-payment assistance, select the program(s) you are interested in exploring.</p>
                    </div>
                  </div>
                </div>

                {selectionConflict === 'dpa' && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-sm text-amber-800">
                    <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠</span>
                    <div>
                      <p className="font-semibold">You already have an Affordable Housing program selected.</p>
                      <p className="mt-0.5">Please deselect it on the <button className="underline font-medium" onClick={() => { setOptionsTab('clt'); setSelectionConflict(null) }}>Affordable Housing tab</button> before choosing a Down-Payment Assistance program.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {packages.length > 0 ? packages.map((pkg, idx) => (
                    <Card
                      key={pkg.program.id}
                      className={`border-2 cursor-pointer transition-all ${formData.selectedPackage?.program.id === pkg.program.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/30' : 'hover:border-gray-300'}`}
                      onClick={() => {
                        if (selectedHousing) {
                          setSelectionConflict('dpa')
                          return
                        }
                        setSelectionConflict(null)
                        updateFormData({ selectedPackage: pkg })
                      }}
                    >
                      <CardContent className="pt-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">

                              {pkg.program.isGrant && <Badge className="bg-green-600 text-white text-xs">Grant</Badge>}
                              {pkg.program.firstTimeBuyerOnly && <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">First-time buyer</Badge>}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{pkg.program.name}</h3>
                            <p className="text-xs text-gray-500">{pkg.program.administrator} · {pkg.program.serviceAreaText}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-green-600">{pkg.program.maxDPAText}</p>
                            <p className="text-xs text-gray-400 mt-0.5">max assistance</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600">{pkg.program.description}</p>

                        {/* Benefits */}
                        <div className="space-y-1">
                          {pkg.program.benefits.slice(0, 3).map((b, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                              <span className="text-gray-700">{b}</span>
                            </div>
                          ))}
                        </div>

                        {/* Drawbacks */}
                        <div className="space-y-1">
                          {pkg.program.drawbacks.slice(0, 2).map((d, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠</span>
                              <span className="text-gray-600">{d}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t gap-2">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Income limit:</span> {pkg.program.incomeLimitText}
                          </p>
                          <a
                            href={pkg.program.programLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0"
                            onClick={e => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Learn more
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <Card className="border-2">
                      <CardContent className="pt-6 text-center text-gray-500 text-sm">
                        Complete your profile to see programs you qualify for.
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Affordable Housing Tab */}
            {optionsTab === 'clt' && (
              <div className="space-y-4">
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">What is Affordable Housing?</h3>
                    <p className="text-sm text-blue-900 mb-4">Affordable housing programs help low-to-moderate income households achieve homeownership through subsidized pricing, income-based mortgages, or shared equity models — often with purchase prices well below market rate.</p>
                    <div className="space-y-3">
                      {[
                        { title: 'Community Land Trusts', desc: 'The organization retains the land while you own the home, keeping prices permanently affordable.' },
                        { title: 'Habitat for Humanity', desc: 'Affordable homes built with sweat equity and income-based mortgage payments.' },
                        { title: 'Government-Backed Programs', desc: 'State and local programs offering low-interest loans and grants tied to income limits.' },
                      ].map(item => (
                        <div key={item.title} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Select the Programs You Want to Explore</h2>
                      <p className="text-sm text-gray-600">If you would like to explore affordable housing, select the program(s) you are interested in learning about.</p>
                    </div>
                  </div>
                </div>

                {selectionConflict === 'housing' && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-sm text-amber-800">
                    <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠</span>
                    <div>
                      <p className="font-semibold">You already have a Down-Payment Assistance program selected.</p>
                      <p className="mt-0.5">Please deselect it on the <button className="underline font-medium" onClick={() => { setOptionsTab('dpa'); setSelectionConflict(null) }}>Down-Payment Assistance tab</button> before choosing an Affordable Housing program.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {matchingAffordablePrograms.length > 0 ? matchingAffordablePrograms.map(program => (
                    <Card
                      key={program.id}
                      className={`border-2 cursor-pointer transition-all ${selectedHousing === program.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/30' : 'hover:border-gray-300'}`}
                      onClick={() => {
                        if (formData.selectedPackage && selectedHousing !== program.id) {
                          setSelectionConflict('housing')
                          return
                        }
                        setSelectionConflict(null)
                        setSelectedHousing(prev => prev === program.id ? null : program.id)
                      }}
                    >
                      <CardContent className="pt-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">{program.modelType}</Badge>
                            <h3 className="text-lg font-bold text-gray-900">{program.name}</h3>
                            <p className="text-xs text-gray-500">{program.organization} · {program.serviceAreaText}</p>
                          </div>
                          {selectedHousing === program.id && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                          )}
                        </div>

                        {/* Benefits */}
                        <div className="space-y-1">
                          {program.benefits.slice(0, 3).map((b, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                              <span className="text-gray-700">{b}</span>
                            </div>
                          ))}
                        </div>

                        {/* Drawbacks */}
                        <div className="space-y-1">
                          {program.drawbacks.slice(0, 2).map((d, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠</span>
                              <span className="text-gray-600">{d}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t gap-2">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Income limit:</span> {program.incomeLimitText}
                          </p>
                          <a
                            href={program.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0"
                            onClick={e => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Learn more
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <Card className="border-2">
                      <CardContent className="pt-6 text-center text-gray-500 text-sm">
                        Complete your profile to see programs available in your area.
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 4: // Realtor
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Trusted Partners</h1>
              <p className="text-lg text-gray-600">The next step in your home-buying journey is to select and reach out to a realtor. Reach out to one you know or select one from our list of trusted partners below who have down payment assistance experience in {formData.location.length ? formData.location.join(', ') : 'your area'}</p>
            </div>

            <div className="space-y-4">
              {matchingRealtors.map(realtor => (
                <Card
                  key={realtor.id}
                  className={`border-2 cursor-pointer transition-all ${formData.selectedRealtor?.id === realtor.id ? 'border-green-500 ring-2 ring-green-200 bg-green-50' : 'hover:border-gray-300'}`}
                  onClick={() => updateFormData({ selectedRealtor: realtor })}
                >
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold">{realtor.name}</h3>
                    <p className="text-gray-600">{realtor.company}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {realtor.rating > 0 && (
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" /> {realtor.rating}
                        </span>
                      )}
                      {realtor.phone && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-4 h-4" /> {realtor.phone}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 5: // Pre-Approval
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Get Pre-Approved</h1>
              <p className="text-lg text-gray-600">Work with a Down Payment Assistance-experienced lender</p>
            </div>

            <div className="space-y-4">
              {matchingLenders.map(lender => (
                <Card
                  key={lender.id}
                  className={`border-2 cursor-pointer transition-all ${formData.selectedLender?.id === lender.id ? 'border-green-500 ring-2 ring-green-200 bg-green-50' : 'hover:border-gray-300'}`}
                  onClick={() => updateFormData({ selectedLender: lender })}
                >
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold">{lender.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" /> {lender.rating}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Phone className="w-4 h-4" /> {lender.phone}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 6: { // Prepare and Apply
        const necessaryDocuments = [
          { label: 'Pay Stubs', description: 'Last 2 pay stubs (most recent 30 days)' },
          { label: 'Tax Returns', description: 'Last 2 years of federal tax returns' },
          { label: 'Bank Statements', description: '2–3 months of all bank/asset account statements' },
          { label: 'Photo ID', description: 'Government-issued photo identification' },
          { label: 'Social Security Card', description: 'For all borrowers on the loan' },
          { label: 'Homebuyer Education Certificate', description: 'Certificate of completion from a HUD-approved course' },
        ]

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Prepare and Apply</h1>
            </div>

            {/* Step 1: Homebuyer Education */}
            <Card className={`border-2 ${stepComplete[1] ? 'border-green-400 bg-green-50/40' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${stepComplete[1] ? 'bg-green-500' : 'bg-yellow-400'}`}>
                      {stepComplete[1] ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                    </div>
                    <CardTitle className={`text-lg ${stepComplete[1] ? 'text-green-700 line-through' : 'text-gray-900'}`}>Homebuyer Education Course</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Complete</span>
                    <Checkbox checked={stepComplete[1]} onCheckedChange={() => toggleStepComplete(1)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">Complete an 8-hour HUD-approved course. Required for most Down Payment Assistance programs.</p>
                <div className="flex justify-center mt-3">
                  <Button variant="outline" size="sm" onClick={() => window.open('https://chaconline.org/home-buyer-education/', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Find a Course
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Necessary Documents */}
            <Card className={`border-2 ${stepComplete[2] ? 'border-green-400 bg-green-50/40' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${stepComplete[2] ? 'bg-green-500' : 'bg-yellow-400'}`}>
                      {stepComplete[2] ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${stepComplete[2] ? 'text-green-700 line-through' : 'text-gray-900'}`}>Gather Necessary Documents</CardTitle>
                      <CardDescription className="pt-1">Gather these documents before meeting with your lender.</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Complete</span>
                    <Checkbox checked={stepComplete[2]} onCheckedChange={() => toggleStepComplete(2)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {necessaryDocuments.map((doc, idx) => (
                    <li key={idx} className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${checkedDocs[idx] ? 'bg-green-50' : 'hover:bg-gray-50'}`} onClick={() => toggleDoc(idx)}>
                      <Checkbox checked={!!checkedDocs[idx]} onCheckedChange={() => toggleDoc(idx)} onClick={e => e.stopPropagation()} className="mt-1" />
                      <div className="flex-1">
                        <p className={`font-semibold ${checkedDocs[idx] ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{doc.label}</p>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                      </div>
                      {checkedDocs[idx] && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Step 3: Contact Realtor and Lender */}
            <Card className={`border-2 ${stepComplete[3] ? 'border-green-400 bg-green-50/40' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${stepComplete[3] ? 'bg-green-500' : 'bg-yellow-400'}`}>
                      {stepComplete[3] ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                    </div>
                    <CardTitle className={`text-lg ${stepComplete[3] ? 'text-green-700 line-through' : 'text-gray-900'}`}>Contact Your Realtor and Lender</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Complete</span>
                    <Checkbox checked={stepComplete[3]} onCheckedChange={() => toggleStepComplete(3)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Realtor Card */}
                  <div className={`border rounded-lg p-4 space-y-3 ${contactComplete.realtor ? 'border-green-400 bg-green-50/40' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Realtor</p>
                        <p className={`font-semibold ${contactComplete.realtor ? 'text-green-700 line-through' : 'text-gray-900'}`}>{formData.selectedRealtor?.name || 'Not selected'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Complete</span>
                        <Checkbox checked={contactComplete.realtor} onCheckedChange={() => {
                          const newVal = !contactComplete.realtor
                          const updated = { ...contactComplete, realtor: newVal }
                          setContactComplete(updated)
                          setStepComplete(prev => ({ ...prev, 3: updated.realtor && updated.lender }))
                        }} />
                      </div>
                    </div>
                    {formData.selectedRealtor && (
                      <>
                        <p className="text-sm text-gray-500">Choose how you'd like to connect:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <Video className="w-4 h-4 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Video Call</p>
                              <p className="text-xs text-gray-500">30 min intro</p>
                            </div>
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <Phone className="w-4 h-4 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Phone Call</p>
                              <p className="text-xs text-gray-500">Quick chat</p>
                            </div>
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">In-Person</p>
                              <p className="text-xs text-gray-500">Meet at office</p>
                            </div>
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Send Message</p>
                              <p className="text-xs text-gray-500">Email intro</p>
                            </div>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Lender Card */}
                  <div className={`border rounded-lg p-4 space-y-3 ${contactComplete.lender ? 'border-green-400 bg-green-50/40' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Lender</p>
                        <p className={`font-semibold ${contactComplete.lender ? 'text-green-700 line-through' : 'text-gray-900'}`}>{formData.selectedLender?.name || 'Not selected'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Complete</span>
                        <Checkbox checked={contactComplete.lender} onCheckedChange={() => {
                          const newVal = !contactComplete.lender
                          const updated = { ...contactComplete, lender: newVal }
                          setContactComplete(updated)
                          setStepComplete(prev => ({ ...prev, 3: updated.realtor && updated.lender }))
                        }} />
                      </div>
                    </div>
                    {formData.selectedLender && (
                      <>
                        <p className="text-sm text-gray-500">Choose how you'd like to connect:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <Video className="w-4 h-4 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Video Call</p>
                              <p className="text-xs text-gray-500">30 min consult</p>
                            </div>
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <Phone className="w-4 h-4 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Phone Call</p>
                              <p className="text-xs text-gray-500">Quick chat</p>
                            </div>
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">In-Person</p>
                              <p className="text-xs text-gray-500">Branch visit</p>
                            </div>
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 h-auto py-3">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Send Message</p>
                              <p className="text-xs text-gray-500">Email inquiry</p>
                            </div>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Selections Summary */}
            <Card className="border-2 border-blue-200 bg-blue-50/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-blue-800">Your Selections</CardTitle>
                </div>
                <CardDescription>The assistance options you selected in Your Options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* DPA Selection */}
                {formData.selectedPackage && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-purple-700 uppercase tracking-wide font-semibold">Down-Payment Assistance</p>
                  </div>
                  {formData.selectedPackage ? (
                    <Card className="border-2 border-purple-200">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{formData.selectedPackage.program.name}</h3>
                            <p className="text-sm text-gray-600">{formData.selectedPackage.program.description}</p>
                            <p className="text-sm text-green-600 font-medium">
                              {formData.selectedPackage.program.isGrant ? '✓ Grant (free money!)' : `✓ Forgiven after ${formData.selectedPackage.program.yearsToForgiveness} years`}
                            </p>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(formData.selectedPackage.assistance)}</p>
                            <p className="text-xs text-gray-500">assistance</p>
                            <p className="text-base font-semibold mt-1">{formatCurrency(formData.selectedPackage.monthlyPayment)}/mo</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
                )}

                {/* Affordable Housing Selection */}
                {selectedHousing && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold">Affordable Housing</p>
                  </div>
                  {selectedHousing ? (() => {
                    const housingProgram = AFFORDABLE_PROGRAMS.find(p => p.id === selectedHousing)
                    if (!housingProgram) return <p className="text-gray-400 italic text-sm pl-1">No program selected</p>
                    const isCLT = housingProgram.modelType === 'Community Land Trust'
                    return (
                      <div className="space-y-4">
                        <Card className="border-2 border-blue-200">
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-0.5">
                                <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">{housingProgram.modelType}</Badge>
                                <h3 className="text-lg font-bold text-gray-900">{housingProgram.name}</h3>
                                <p className="text-xs text-gray-500">{housingProgram.organization} · {housingProgram.serviceAreaText}</p>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                            </div>
                            <div className="space-y-1">
                              {housingProgram.benefits.slice(0, 3).map((b, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                                  <span className="text-gray-700">{b}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <p className="text-xs text-gray-500"><span className="font-medium">Income limit:</span> {housingProgram.incomeLimitText}</p>
                              <a href={housingProgram.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <ExternalLink className="w-3 h-3" />Learn more
                              </a>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Affordable Housing Diagram */}
                        <Card className="border-2 border-blue-100 bg-blue-50/40">
                          <CardContent className="pt-5 pb-5">
                            <h4 className="text-sm font-bold text-blue-800 text-center mb-4">
                              {isCLT ? 'How Community Land Trusts Work' : 'How Affordable Housing Works'}
                            </h4>

                            {isCLT ? (
                              <div className="space-y-4">
                                {/* Ownership split */}
                                <div className="flex items-stretch gap-2">
                                  <div className="flex-1 bg-white border-2 border-blue-300 rounded-xl p-3 text-center">
                                    <div className="text-2xl mb-1">🏠</div>
                                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">You Own</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">The Home</p>
                                    <p className="text-xs text-gray-500 mt-1">Full mortgage, build equity, make improvements</p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center gap-1 text-blue-400 text-xs font-medium px-1">
                                    <span>+</span>
                                  </div>
                                  <div className="flex-1 bg-white border-2 border-teal-300 rounded-xl p-3 text-center">
                                    <div className="text-2xl mb-1">🌱</div>
                                    <p className="text-xs font-bold text-teal-700 uppercase tracking-wide">{housingProgram.organization} Owns</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">The Land</p>
                                    <p className="text-xs text-gray-500 mt-1">99-year renewable lease keeps costs low</p>
                                  </div>
                                </div>

                                {/* Arrow down */}
                                <div className="flex justify-center text-gray-400 text-lg">↓</div>

                                {/* Result: lower price */}
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
                                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Result at Purchase</p>
                                  <p className="text-sm text-gray-700 mt-1">Home price is <span className="font-semibold text-green-700">significantly below market rate</span> because land value is removed</p>
                                </div>

                                {/* Arrow down */}
                                <div className="flex justify-center text-gray-400 text-lg">↓</div>

                                {/* When you sell */}
                                <div className="bg-white border-2 border-amber-200 rounded-xl p-3">
                                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide text-center mb-2">When You Sell</p>
                                  <div className="flex gap-2">
                                    <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
                                      <p className="text-xs font-semibold text-gray-700">You receive</p>
                                      <p className="text-xs text-gray-600 mt-0.5">Your purchase price + your share of appreciation</p>
                                    </div>
                                    <div className="flex-1 bg-teal-50 rounded-lg p-2 text-center">
                                      <p className="text-xs font-semibold text-gray-700">CLT receives</p>
                                      <p className="text-xs text-gray-600 mt-0.5">Land + CLT's share of appreciation (kept affordable)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-stretch gap-2">
                                  <div className="flex-1 bg-white border-2 border-blue-300 rounded-xl p-3 text-center">
                                    <div className="text-2xl mb-1">👤</div>
                                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">You</p>
                                    <p className="text-xs text-gray-500 mt-1">Income-qualified buyer</p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center text-blue-400 text-lg px-1">→</div>
                                  <div className="flex-1 bg-white border-2 border-teal-300 rounded-xl p-3 text-center">
                                    <div className="text-2xl mb-1">🏠</div>
                                    <p className="text-xs font-bold text-teal-700 uppercase tracking-wide">Affordable Home</p>
                                    <p className="text-xs text-gray-500 mt-1">Priced below market rate</p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center text-blue-400 text-lg px-1">→</div>
                                  <div className="flex-1 bg-white border-2 border-green-300 rounded-xl p-3 text-center">
                                    <div className="text-2xl mb-1">📈</div>
                                    <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Build Equity</p>
                                    <p className="text-xs text-gray-500 mt-1">Own & grow wealth</p>
                                  </div>
                                </div>
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
                                  <p className="text-sm text-gray-700">Affordable homeownership programs make purchase prices possible for households earning <span className="font-semibold text-green-700">{housingProgram.incomeLimitText}</span></p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })() : null}
                </div>
                )}

              </CardContent>
            </Card>
          </div>
        )
      } // end case 6

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Colorado Homebuyer Navigator</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {PHASES.map((phase) => {
              const isCurrent = phase.steps.includes(step)
              const isComplete = phase.steps.every(s => s < step)
              return (
                <div key={phase.name} className={`flex-1 rounded-lg px-3 py-2 transition-all ${isCurrent ? phase.lightColor : 'bg-gray-50'}`}>
                  <div className={`w-full h-1.5 rounded-full mb-1.5 transition-all ${isComplete ? phase.color : isCurrent ? phase.color : 'bg-gray-200'}`} />
                  <p className={`text-[11px] font-semibold ${isCurrent ? phase.textColor : isComplete ? 'text-gray-500' : 'text-gray-400'}`}>{phase.name}</p>
                  <p className={`text-[10px] leading-tight ${isCurrent ? phase.textColor : 'text-gray-400'}`}>{phase.description}</p>
                </div>
              )
            })}
          </div>
          {(() => {
            const currentPhase = PHASES.find(p => p.steps.includes(step))
            if (!currentPhase) return null
            return (
              <div className={`mt-2 px-3 py-1.5 rounded-lg border ${currentPhase.lightColor}`}>
                <p className={`text-xs ${currentPhase.textColor}`}>
                  <span className="font-semibold">You're in the {currentPhase.name} phase:</span> {currentPhase.description.charAt(0).toUpperCase() + currentPhase.description.slice(1)}.
                </p>
              </div>
            )
          })()}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {renderStep()}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          {step < STEPS.length - 1 && (
            <Button
              variant="gradient"
              onClick={() => setStep(step + 1)}
              disabled={!canContinue}
            >
              {step === 1 ? 'See What You Qualify For' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
