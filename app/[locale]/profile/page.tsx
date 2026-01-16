"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  User, 
  Phone, 
  MapPin, 
  Save, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react"

interface UserData {
  name: string
  mobile: string
  address: string
  pincode: string
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [hasData, setHasData] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("bakery_user_info")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setFormData(parsed)
        setHasData(true)
      } catch (e) {
        console.error("Failed to parse user data")
      }
    }
    setIsLoading(false)
  }, [])

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Reset status when user types
    if (saveStatus !== "idle") setSaveStatus("idle")
  }

  // Save to LocalStorage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        localStorage.setItem("bakery_user_info", JSON.stringify(formData))
        setHasData(true)
        setSaveStatus("success")
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000)
      } catch (e) {
        setSaveStatus("error")
      } finally {
        setIsSaving(false)
      }
    }, 600)
  }

  // Clear Data
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear your saved details? This cannot be undone.")) {
      localStorage.removeItem("bakery_user_info")
      setFormData({
        name: "",
        mobile: "",
        address: "",
        pincode: "",
      })
      setHasData(false)
      setSaveStatus("idle")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your shipping details for faster checkout on WhatsApp.
            <br />
            <span className="text-xs opacity-70">These details are stored locally on your device.</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          
          {/* Status Bar */}
          {saveStatus === "success" && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 flex items-center text-sm font-medium border-b border-green-500/10 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Settings saved successfully!
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  placeholder="700001"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                placeholder="Flat No, Street Name, Landmark..."
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
                  Clear saved data
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        {!hasData && (
          <div className="bg-accent/20 border border-accent/30 rounded-lg p-4 flex items-start gap-3 text-sm text-muted-foreground">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p>
              You haven't saved any details yet. Fill out the form above so you don't have to enter your address every time you order!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}