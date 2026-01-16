"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { X, Loader2 } from "lucide-react"
import type { items } from "@/lib/items"

interface ItemPageClientProps {
  item: (typeof items)[0] | undefined
  locale: string
}

interface UserData {
  name: string
  mobile: string
  address: string
  pincode: string
}

export default function ItemPageClient({ item, locale }: ItemPageClientProps) {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!item) {
    notFound()
  }

  const isEnglish = locale === "en"
  const name = isEnglish ? item.name.en : item.name.bn
  const description = isEnglish ? item.description.en : item.description.bn

  // --- WhatsApp & Storage Logic ---

  const generateWhatsAppLink = (data: UserData) => {
    const phoneNumber = "919593035680"
    
    // Construct the message
    const message = `
*New Order Request* 🍞

*Item Details:*
Product: ${item.name.en}
Id : ${item.id}
Price: ₹${item.price}
Calories: ${item.calories}

*Customer Details:*
Name: ${data.name}
Mobile: ${data.mobile}
Address: ${data.address}
Pincode: ${data.pincode}
    `.trim()

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }

  const handleBuyClick = () => {
    // Check local storage for existing user info
    const storedUser = localStorage.getItem("bakery_user_info")
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserData
        // If data exists, redirect immediately
        const link = generateWhatsAppLink(parsedUser)
        window.open(link, "_blank")
      } catch (e) {
        // If JSON parse fails, show modal
        setShowModal(true)
      }
    } else {
      // No data, show modal
      setShowModal(true)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate a small delay for UX or save to backend if needed later
    setTimeout(() => {
      // 1. Save to Local Storage
      localStorage.setItem("bakery_user_info", JSON.stringify(formData))

      // 2. Generate Link and Redirect
      const link = generateWhatsAppLink(formData)
      window.open(link, "_blank")

      // 3. Reset state
      setIsSubmitting(false)
      setShowModal(false)
    }, 500)
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Image Section - Modified to use Original Ratio */}
          <div className="w-full bg-muted rounded-xl overflow-hidden shadow-sm border border-border">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={name}
              // Width/Height set to 0 with w-full h-auto allows the image to define its own aspect ratio
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary text-balance leading-tight">
              {name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
              {description}
            </p>

            <div className="space-y-6 mb-8">
              {/* Price */}
              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Price</p>
                <p className="text-3xl font-bold text-primary">₹{item.price}</p>
              </div>

              {/* Calories */}
              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Calories per serving</p>
                <p className="text-xl font-medium">{item.calories} kcal</p>
              </div>

              {/* Ingredients */}
              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Ingredients</p>
                <ul className="space-y-2">
                  {item.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-accent mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent/10 text-accent-foreground text-sm font-medium rounded-full border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleBuyClick}
              className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
            >
              Order via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* User Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">Delivery Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Please provide your details to proceed with the order on WhatsApp.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <input
                  required
                  type="tel"
                  placeholder="10 digit mobile number"
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  required
                  placeholder="Full delivery address"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pincode</label>
                <input
                  required
                  type="text"
                  placeholder="6 digit pincode"
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to WhatsApp"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}