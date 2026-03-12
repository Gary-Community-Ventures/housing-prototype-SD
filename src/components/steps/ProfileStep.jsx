import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COLORADO_COUNTIES, CREDIT_SCORE_RANGES, OCCUPATIONS, HOUSEHOLD_SIZES } from '@/data/constants'
import { User, MapPin, DollarSign, CreditCard, Briefcase, Shield, ArrowRight } from 'lucide-react'

export function ProfileStep({ formData, updateFormData, setStep, creditAssessment }) {
  const canContinue = formData.location && formData.income && formData.creditScore

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome to the Navigator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's find the best down payment assistance programs for you. Answer a few questions to get personalized recommendations.
        </p>
      </div>

      {/* Form Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Location Card */}
        <Card className="border-2 hover:border-blue-200 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Location</CardTitle>
                <CardDescription>Where do you want to buy?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.location}
              onValueChange={(value) => updateFormData({ location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a county" />
              </SelectTrigger>
              <SelectContent>
                {COLORADO_COUNTIES.map(county => (
                  <SelectItem key={county} value={county}>{county} County</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="border-2 hover:border-blue-200 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Household Income</CardTitle>
                <CardDescription>Annual gross income</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">What is your household's annual income?</Label>
              <p className="text-sm text-gray-500 mt-1">This includes money from jobs, alimony, investments, or gifts. Income is the money earned or received before deducting taxes.</p>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="income"
                  type="number"
                  placeholder="85,000"
                  className="pl-7"
                  value={formData.income}
                  onChange={(e) => updateFormData({ income: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Household Size</Label>
              <Select
                value={formData.householdSize}
                onValueChange={(value) => updateFormData({ householdSize: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOUSEHOLD_SIZES.map(size => (
                    <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score Card */}
        <Card className="border-2 hover:border-blue-200 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Credit Score</CardTitle>
                <CardDescription>Approximate range</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={formData.creditScore}
              onValueChange={(value) => updateFormData({ creditScore: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_SCORE_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.creditScore && creditAssessment && (
              <div className={`p-3 rounded-lg ${
                creditAssessment.color === 'red' ? 'bg-red-50 text-red-800' :
                creditAssessment.color === 'amber' ? 'bg-amber-50 text-amber-800' :
                creditAssessment.color === 'yellow' ? 'bg-yellow-50 text-yellow-800' :
                'bg-green-50 text-green-800'
              }`}>
                <p className="text-sm font-medium">{creditAssessment.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card className="border-2 hover:border-blue-200 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Savings</CardTitle>
                <CardDescription>Available for down payment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                type="number"
                placeholder="10,000"
                className="pl-7"
                value={formData.downPaymentSaved}
                onChange={(e) => updateFormData({ downPaymentSaved: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Options */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Additional Details</CardTitle>
              <CardDescription>Help us find more programs for you</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Time Buyer */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="firstTimeBuyer"
              checked={formData.firstTimeBuyer}
              onCheckedChange={(checked) => updateFormData({ firstTimeBuyer: checked })}
            />
            <div>
              <Label htmlFor="firstTimeBuyer" className="font-medium cursor-pointer">First-time homebuyer</Label>
              <p className="text-sm text-gray-500">Haven't owned a home in the past 3 years</p>
            </div>
          </div>

          {/* Veteran Status */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="veteran"
              checked={formData.veteranStatus}
              onCheckedChange={(checked) => updateFormData({ veteranStatus: checked })}
            />
            <div>
              <Label htmlFor="veteran" className="font-medium cursor-pointer">Veteran or active military</Label>
              <p className="text-sm text-gray-500">Eligible for VA home loans</p>
            </div>
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label>Special occupation (optional)</Label>
            <Select
              value={formData.occupation}
              onValueChange={(value) => updateFormData({ occupation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select if applicable" />
              </SelectTrigger>
              <SelectContent>
                {OCCUPATIONS.map(occ => (
                  <SelectItem key={occ.value} value={occ.value}>{occ.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Some programs offer extra assistance for certain professions</p>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="gradient"
          size="xl"
          onClick={() => setStep(1)}
          disabled={!canContinue}
          className="min-w-[200px]"
        >
          See What You Qualify For
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {!canContinue && (
        <p className="text-center text-sm text-gray-500">
          Please fill in location, income, and credit score to continue
        </p>
      )}
    </div>
  )
}
