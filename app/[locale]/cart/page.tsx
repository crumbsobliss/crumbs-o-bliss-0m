'use client'

import { useEffect, useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import Loader from '@/components/loader'

function CartPageContent({ locale }: { locale: string }) {
  const t = useTranslations()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const handleCheckout = () => {
    if (items.length === 0) return

    setIsCheckingOut(true)

    // Generate WhatsApp message with cart details
    const orderDetails = items
      .map(
        (cartItem) =>
          `${locale === 'bn' ? cartItem.item.name.bn : cartItem.item.name.en} - ₹${cartItem.item.price} × ${cartItem.quantity} = ₹${cartItem.item.price * cartItem.quantity}`
      )
      .join('\n')

    const subtotal = getTotal()
    const shippingCost = subtotal > 500 ? 0 : 50
    const total = subtotal + shippingCost

    const message = `
*New Cart Order* 🛒

*Order Details:*
${orderDetails}

*Order Summary:*
Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ${shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
Total: ₹${total.toFixed(2)}

Please confirm this order!
    `.trim()

    // Open WhatsApp with the message
    const phoneNumber = '911234567890'
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    // Clear cart and redirect
    clearCart()
    window.open(whatsappLink, '_blank')
    setIsCheckingOut(false)
  }

  if (!mounted) return null

  if (isLoading) {
    return <Loader />
  }

  const subtotal = getTotal()
  const shippingCost = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0
  const total = subtotal + shippingCost

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {t('cart.title')}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground mb-6 opacity-50" />
            <p className="text-2xl text-muted-foreground mb-8">
              {t('cart.empty')}
            </p>
            <Link
              href={`/${locale}/items`}
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('cart.continue')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex gap-4 bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={cartItem.item.image || '/placeholder.svg'}
                      alt={cartItem.item.name.en}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-primary mb-1">
                      {locale === 'bn'
                        ? cartItem.item.name.bn
                        : cartItem.item.name.en}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      ₹{cartItem.item.price} × {cartItem.quantity} = ₹
                      {cartItem.item.price * cartItem.quantity}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            cartItem.item.id,
                            cartItem.quantity - 1
                          )
                        }
                        className="p-1 rounded hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={cartItem.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            cartItem.item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-12 text-center border border-border rounded px-2 py-1"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(
                            cartItem.item.id,
                            cartItem.quantity + 1
                          )
                        }
                        className="p-1 rounded hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(cartItem.item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-auto self-start"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  {t('cart.title')}
                </h2>

                <div className="space-y-3 mb-6 border-b border-border pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t('cart.subtotal')}
                    </span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t('cart.shipping')}
                    </span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 text-xl font-bold text-primary mb-6">
                  <span>{t('cart.total')}</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : t('cart.checkout')}
                </button>

                <Link
                  href={`/${locale}/items`}
                  className="mt-4 block text-center px-6 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                >
                  {t('cart.continue')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CartPageProps {
  params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params
  return <CartPageContent locale={locale} />
}
