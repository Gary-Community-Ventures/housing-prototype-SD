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

// Constants
const COUNTIES = ['Adams', 'Arapahoe', 'Boulder', 'Denver', 'Douglas', 'El Paso', 'Jefferson', 'Larimer', 'Pueblo', 'Weld']
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
    id: 'metro-dpa',
    name: 'Metro DPA',
    description: 'Down payment assistance for Denver metro area',
    maxAssistance: 25000,
    isGrant: false,
    forgivable: true,
    yearsToForgiveness: 5,
    counties: ['Denver', 'Arapahoe', 'Jefferson', 'Adams', 'Douglas'],
    maxIncome: 150000,
    minCredit: 620,
    firstTimeBuyerOnly: true
  },
  {
    id: 'chfa-dpa',
    name: 'CHFA DPA Grant',
    description: 'Colorado Housing Finance Authority grant',
    maxAssistance: 20000,
    isGrant: true,
    forgivable: true,
    yearsToForgiveness: 0,
    counties: COUNTIES,
    maxIncome: 175000,
    minCredit: 620,
    firstTimeBuyerOnly: false
  },
  {
    id: 'boulder-dpa',
    name: 'Boulder County DPA',
    description: 'Local assistance for Boulder County buyers',
    maxAssistance: 30000,
    isGrant: false,
    forgivable: true,
    yearsToForgiveness: 10,
    counties: ['Boulder'],
    maxIncome: 125000,
    minCredit: 640,
    firstTimeBuyerOnly: true
  }
]

// Lenders data
const LENDERS = [
  { id: 3, name: 'Colorado Lending Source', rating: 4.9, programs: ['metro-dpa', 'chfa-dpa', 'boulder-dpa'], phone: '303-555-0103' },
  { id: 2, name: 'Elevations Credit Union', rating: 4.7, programs: ['chfa-dpa', 'boulder-dpa'], phone: '303-555-0102' },
  { id: 1, name: 'FirstBank Mortgage', rating: 4.8, programs: ['metro-dpa', 'chfa-dpa'], phone: '303-555-0101' }
]

// Realtors data
const REALTORS = [
  { id: 2, name: 'Mike Chen', company: 'First Home Partners', rating: 4.8, dpaDeals: 38, counties: ['Boulder', 'Jefferson'] },
  { id: 1, name: 'Sarah Johnson', company: 'DPA Experts Realty', rating: 4.9, dpaDeals: 45, counties: ['Denver', 'Arapahoe'] },
  { id: 3, name: 'Lisa Rodriguez', company: 'Colorado Dream Homes', rating: 4.7, dpaDeals: 52, counties: COUNTIES }
]

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
      if (!formData.location.some(loc => p.counties.includes(loc))) return false
      if (income > p.maxIncome) return false
      if (creditMin < p.minCredit) return false
      if (p.firstTimeBuyerOnly && !formData.firstTimeBuyer) return false
      return true
    })
  }, [formData.location, formData.income, formData.creditScore, formData.firstTimeBuyer])  // eslint-disable-line

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
    }).sort((a, b) => b.assistance - a.assistance)
  }, [eligiblePrograms, formData.income, formData.savings])

  // Matching lenders and realtors
  const matchingLenders = formData.selectedPackage
    ? LENDERS.filter(l => l.programs.includes(formData.selectedPackage.program.id))
    : LENDERS

  const matchingRealtors = formData.location.length
    ? REALTORS.filter(r => formData.location.some(loc => r.counties.includes(loc)))
    : REALTORS

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
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="firstTime"
                    checked={formData.firstTimeBuyer}
                    onCheckedChange={(c) => updateFormData({ firstTimeBuyer: c })}
                  />
                  <div>
                    <Label htmlFor="firstTime" className="font-medium cursor-pointer">First-time homebuyer</Label>
                    <p className="text-sm text-gray-500">Haven't owned a home in the past 3 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2: // Affordability
        const maxPrice = Math.min((parseInt(formData.income) || 0) * 4.5, 600000)
        const minPrice = Math.round(maxPrice * 0.65)
        const requiredDown = maxPrice * 0.035
        const calcMonthly = (price) => {
          const loan = price * 0.965
          const monthly = (loan * 0.065 / 12) + (price * 0.007 / 12) + 150
          return Math.round(monthly)
        }

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Buying Power</h1>
            </div>

            {/* Full-width green affordability card */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6 flex flex-col items-center justify-center">
                <p className="text-sm text-green-700 mb-3 text-center font-bold">Based on your income and savings, you can afford:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(minPrice)}</p>
                    <p className="text-xs text-green-600">{formatCurrency(calcMonthly(minPrice))}/mo</p>
                  </div>
                  <div className="text-green-400 font-bold text-xl">→</div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(maxPrice)}</p>
                    <p className="text-xs text-green-600">{formatCurrency(calcMonthly(maxPrice))}/mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side-by-side: Required Down + Max DPA */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-6 flex flex-col items-center justify-start h-full text-center">
                  <p className="text-sm text-blue-700 mb-1 font-bold text-center">Required Down (3.5%)</p>
                  <p className="text-xs text-blue-500 mb-3 text-center">Amount you are required to put in for the down payment based on the maximum assistance you are eligible to receive.</p>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(requiredDown)}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="pt-6 flex flex-col items-center justify-start h-full text-center">
                  <p className="text-sm text-purple-700 mb-1 font-bold text-center">Maximum Down Payment Assistance</p>
                  <p className="text-xs text-purple-500 mb-3 text-center">Maximum down payment assistance you are eligible for based on what you can afford.</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {eligiblePrograms.length > 0
                      ? formatCurrency(Math.max(...eligiblePrograms.map(p => p.maxAssistance)))
                      : '$0'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-center py-2 text-lg">Eligible Programs Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 border-2 border-purple-300 rounded-xl px-4 py-1.5">
                    <p className="text-2xl font-bold text-purple-700 text-center">{eligiblePrograms.length}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {eligiblePrograms.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{p.name}</span>
                      <Badge variant={p.isGrant ? "default" : "secondary"}>
                        {p.isGrant ? 'Grant' : 'Forgivable'} up to {formatCurrency(p.maxAssistance)}
                      </Badge>
                    </div>
                  ))}
                  {eligiblePrograms.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No programs match your criteria. Try adjusting your profile.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

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
                      <h2 className="text-lg font-bold text-gray-900">Choose Your Package</h2>
                      <p className="text-sm text-gray-600">If you would like to move forward with down-payment assistance, select the program you are interested in exploring.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {packages.length > 0 ? packages.map((pkg, idx) => (
                    <Card
                      key={pkg.program.id}
                      className={`border-2 cursor-pointer transition-all ${formData.selectedPackage?.program.id === pkg.program.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                      onClick={() => updateFormData({ selectedPackage: pkg })}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {idx === 0 && <Badge className="bg-yellow-500">Best Value</Badge>}
                              <h3 className="text-xl font-bold">{pkg.program.name}</h3>
                            </div>
                            <p className="text-gray-600">{pkg.program.description}</p>
                            <div className="flex gap-4 text-sm">
                              <span className="text-green-600 font-medium">
                                {pkg.program.isGrant ? '✓ Grant (free money!)' : `✓ Forgiven after ${pkg.program.yearsToForgiveness} years`}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-600">{formatCurrency(pkg.assistance)}</p>
                            <p className="text-sm text-gray-500">assistance</p>
                            <p className="text-lg font-semibold mt-2">{formatCurrency(pkg.monthlyPayment)}/mo</p>
                          </div>
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
                      <h2 className="text-lg font-bold text-gray-900">Choose a Program</h2>
                      <p className="text-sm text-gray-600">If you would like to explore affordable housing, select the program you are interested in learning more about.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'chfa',
                      name: 'CHFA Homeownership Programs',
                      tagline: 'Statewide low-interest loans and grants',
                      description: 'Colorado Housing and Finance Authority offers 30-year fixed-rate mortgages through approved lenders, paired with down payment assistance grants or zero-interest second loans up to $25,000.',
                      eligibility: 'Low-to-moderate income buyers statewide. Credit score of 620+ typically required. Income and purchase price limits vary by county. Homebuyer education required.',
                      url: 'https://chfainfo.com',
                      urlLabel: 'chfainfo.com',
                    },
                    {
                      id: 'eclt',
                      name: 'Elevation Community Land Trust',
                      tagline: 'Permanently affordable homeownership',
                      description: 'ECLT retains ownership of the land while you own the home, keeping purchase prices below market rate. A shared equity formula ensures long-term affordability while you build real equity.',
                      eligibility: 'Households at ~70–80% AMI. Homes in Denver, Fort Collins, and surrounding communities. Listings from $150,000–$305,000.',
                      url: 'https://elevationclt.org',
                      urlLabel: 'elevationclt.org',
                    },
                  ].map(program => (
                    <Card
                      key={program.id}
                      className={`border-2 cursor-pointer transition-all ${selectedHousing === program.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/40' : 'hover:border-gray-300'}`}
                      onClick={() => setSelectedHousing(prev => prev === program.id ? null : program.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{program.name}</h3>
                            <p className="text-sm text-blue-600 font-medium">{program.tagline}</p>
                          </div>
                          {selectedHousing === program.id && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                        <div className="flex gap-2 text-xs text-gray-500 mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span>{program.eligibility}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={e => { e.stopPropagation(); window.open(program.url, '_blank') }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          {program.urlLabel}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
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
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Realtor</h1>
              <p className="text-lg text-gray-600">Down Payment Assistance-experienced agents in {formData.location.length ? formData.location.join(', ') : 'your area'}</p>
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
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" /> {realtor.rating}
                      </span>
                      <span className="text-sm text-gray-500">{realtor.dpaDeals} Down Payment Assistance transactions</span>
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

      case 6: // Prepare and Apply
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
                  ) : (
                    <p className="text-gray-400 italic text-sm pl-1">No program selected</p>
                  )}
                </div>

                {/* Affordable Housing Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold">Affordable Housing</p>
                  </div>
                  {selectedHousing ? (() => {
                    const housingDetails = {
                      chfa: {
                        name: 'CHFA Homeownership Programs',
                        tagline: 'Statewide low-interest loans and grants',
                        description: 'Colorado Housing and Finance Authority offers 30-year fixed-rate mortgages through approved lenders, paired with down payment assistance grants or zero-interest second loans up to $25,000.',
                        eligibility: 'Low-to-moderate income buyers statewide. Credit score of 620+ typically required. Income and purchase price limits vary by county. Homebuyer education required.',
                        url: 'https://chfainfo.com',
                        urlLabel: 'chfainfo.com',
                      },
                      eclt: {
                        name: 'Elevation Community Land Trust',
                        tagline: 'Permanently affordable homeownership',
                        description: 'ECLT retains ownership of the land while you own the home, keeping purchase prices below market rate. A shared equity formula ensures long-term affordability while you build real equity.',
                        eligibility: 'Households at ~70–80% AMI. Homes in Denver, Fort Collins, and surrounding communities. Listings from $150,000–$305,000.',
                        url: 'https://elevationclt.org',
                        urlLabel: 'elevationclt.org',
                      },
                    }[selectedHousing]
                    return (
                      <Card className="border-2 border-blue-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{housingDetails.name}</h3>
                              <p className="text-sm text-blue-600 font-medium">{housingDetails.tagline}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{housingDetails.description}</p>
                          <div className="flex gap-2 text-xs text-gray-500 mb-3">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span>{housingDetails.eligibility}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={() => window.open(housingDetails.url, '_blank')}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            {housingDetails.urlLabel}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })() : (
                    <p className="text-gray-400 italic text-sm pl-1">No program selected</p>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        )

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
