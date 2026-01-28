'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  User,
  Phone,
  MapPin,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Info,
} from 'lucide-react'
import Loader from '@/components/loader'

interface UserData {
  name: string
  mobile: string
  address: string
  pincode: string
}

interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [locale, setLocale] = useState<string>('')
  const t = useTranslations()
  const [formData, setFormData] = useState<UserData>({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  )
  const [hasData, setHasData] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  // Load params and data
  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      setLocale(resolvedParams.locale)

      const storedUser = localStorage.getItem('bakery_user_info')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setFormData(parsed)
          setHasData(true)
        } catch (e) {
          console.error('Failed to parse user data')
        }
      } else {
        setShowAlert(true)
      }
      setIsLoading(false)
    }

    loadData()
  }, [params])

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Reset status when user types
    if (saveStatus !== 'idle') setSaveStatus('idle')
  }

  // Save to LocalStorage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        localStorage.setItem('bakery_user_info', JSON.stringify(formData))
        setHasData(true)
        setSaveStatus('success')
        setShowAlert(false)

        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000)
      } catch (e) {
        setSaveStatus('error')
      } finally {
        setIsSaving(false)
      }
    }, 600)
  }

  // Clear Data
  const handleClearData = () => {
    if (
      window.confirm(
        t('profile.clearConfirm')
      )
    ) {
      localStorage.removeItem('bakery_user_info')
      setFormData({
        name: '',
        mobile: '',
        address: '',
        pincode: '',
      })
      setHasData(false)
      setSaveStatus('idle')
      setShowAlert(true)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('profile.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('profile.subtitle')}
            <br />
            <span className="text-xs opacity-70">{t('profile.stored')}</span>
          </p>
        </div>

        {/* Alert for Incomplete Profile */}
        {showAlert && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3 text-sm animate-in slide-in-from-top-4">
            <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                Complete Your Profile
              </p>
              <p className="text-yellow-600 dark:text-yellow-200">
                {t('profile.noDetails')}
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Status Bar */}
          {saveStatus === 'success' && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 flex items-center text-sm font-medium border-b border-green-500/10 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {t('profile.saved')}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-primary" />
                  {t('profile.fullName')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={t('modal.yourName')}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label
                  htmlFor="mobile"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  {t('profile.mobileNo')}
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder={t('modal.mobile10Digit')}
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label
                  htmlFor="pincode"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  {t('profile.pinCodeLabel')}
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  placeholder={t('modal.pincode6Digit')}
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-primary" />
                {t('profile.deliveryAddress')}
              </label>
              <textarea
                id="address"
                name="address"
                required
                placeholder={t('modal.fullAddress')}
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border">
              {hasData ? (
                <button
                  type="button"
                  onClick={handleClearData}
                  className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-2 px-2 py-1 rounded-md hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('profile.clearData')}
                </button>
              ) : (
                <div /> /* Spacer */
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('profile.saving')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('profile.saveChanges')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
