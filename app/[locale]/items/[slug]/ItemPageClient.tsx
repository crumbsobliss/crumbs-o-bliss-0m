"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  X,
  Loader2,
  ShoppingCart,
  Check,
  ArrowLeft,
  Flame,
  Leaf,
  Tag,
  MessageCircle,
  ChevronRight,
  Share2,
  Copy,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BakeryItem } from "@/lib/items";
import { useCart } from "@/lib/cart-context";
import CustomizationCTA from "@/components/tryCustom";
import details from '@/config/details.json'

interface ItemPageClientProps {
  item: BakeryItem | undefined;
  locale: string;
}

interface UserData {
  name: string;
  mobile: string;
  address: string;
  pincode: string;
}

export default function ItemPageClient({ item, locale }: ItemPageClientProps) {
  const t = useTranslations();
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Load user data on mount to pre-fill form if available
  useEffect(() => {
    const storedUser = localStorage.getItem("bakery_user_info");
    if (storedUser) {
      try {
        setFormData(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  if (!item) {
    notFound();
  }

  const isEnglish = locale === "en";
  const name = isEnglish ? item.name.en : item.name.bn;
  const description = isEnglish ? item.description.en : item.description.bn;
  const isSpecialItem = item.price === 0 || (item as any).discounted_price === 0;

  // --- Share Logic ---
  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Check out this delicious ${name} from our bakery!`,
      url: window.location.href,
    };

    // Check if Native Share is available (Mobile & Modern Desktop Browsers)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: Copy Link for PC/Other browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setIsShared(true);
        setTimeout(() => setIsShared(false), 3000);
      } catch (err) {
        console.error("Could not copy text: ", err);
      }
    }
  };

  // --- WhatsApp & Storage Logic ---
  const generateWhatsAppLink = (data: UserData) => {
    const phoneNumber = details.contact.primaryPhone;
    const currentPrice = item.discounted_price && item.discounted_price > 0 && item.discounted_price < item.price ? item.discounted_price : item.price;
    const message = `
*New Order Request* 🍞

*Item Details:*
Product: ${item.name.en}
Id: ${item.id}
Price: ₹${currentPrice}
Qty: ${quantity}
Total: ₹${currentPrice * quantity}

*Customer Details:*
Name: ${data.name}
Mobile: ${data.mobile}
Address: ${data.address}
Pincode: ${data.pincode}
    `.trim();

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleBuyClick = () => {
    setShowModal(true);
  };

  const handleAddToCart = () => {
    addItem(item, quantity);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      localStorage.setItem("bakery_user_info", JSON.stringify(formData));
      const link = generateWhatsAppLink(formData);
      window.open(link, "_blank");
      setIsSubmitting(false);
      setShowModal(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 relative">
      {/* Layered Curvy Background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 500"
          className="w-full h-[60vh]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 C400,350 900,50 1440,200 L1440,0 L0,0 Z"
            fill={item.color || "var(--primary)"}
            opacity="0.9"
          />
          <path
            d="M0,260 C400,420 900,120 1440,260 L1440,0 L0,0 Z"
            fill={item.color || "var(--primary)"}
            opacity="0.6"
          />
          <path
            d="M0,320 C400,500 900,200 1440,320 L1440,0 L0,0 Z"
            fill={item.color || "var(--primary)"}
            opacity="0.35"
          />
        </svg>
      </div>

      {/* 1. Navigation Breadcrumb */}
      <div className="container mx-auto px-4 py-6 flex items-center justify-between relative z-20">
        <Link
          href={`/${locale}/items`}
          className="inline-flex items-center text-primary-foreground/90 hover:text-white transition-colors text-sm font-medium group bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </Link>

        {/* Secondary Share Button for Mobile Header */}
        <button
          onClick={handleShare}
          className="lg:hidden p-3 rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20 text-white transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-6 lg:pt-12">
          {/* 2. Image Section (Floating transparently over the curve) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative aspect-square lg:aspect-[4/3] flex items-center justify-center group z-10"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-contain p-2 max-w-[85%] max-h-[85%] sm:max-w-[70%] sm:max-h-[70%] md:max-w-[60%] md:max-h-[60%] lg:max-w-[85%] lg:max-h-[85%] xl:max-w-[75%] xl:max-h-[75%] m-auto group-hover:scale-110 transition-transform duration-500 ease-out z-10 relative drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              priority
            />
          </motion.div>

          {/* 3. Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col h-full bg-card rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-xl border border-border/50 relative lg:-mt-12"
          >
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-modern text-[var(--primary)] leading-tight">
                {name}
              </h1>
              {/* Desktop Share Button */}
              <button
                onClick={handleShare}
                className="hidden lg:flex items-center justify-center p-3 rounded-full bg-muted text-muted-foreground hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed font-clean">
              {description}
            </p>

            {/* Cinematic Info Presentation: Calories, Time, Veg */}
            <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-8 mt-2">
              {/* Calories */}
              <div className="flex items-center gap-3 bg-[var(--background)] px-5 py-2.5 rounded-full border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold">Energy</span>
                  <span className="text-sm font-bold text-[var(--foreground)] font-modern">{item.calories || "180"} kcal</span>
                </div>
              </div>

              {/* Prep Time */}
              <div className="flex items-center gap-3 bg-[var(--background)] px-5 py-2.5 rounded-full border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold">Prep Time</span>
                  <span className="text-sm font-bold text-[var(--foreground)] font-modern">{item.prep_time || "40-50 Min"}</span>
                </div>
              </div>

              {/* Veg/Non-Veg */}
              <div className="flex items-center gap-3 bg-[var(--background)] px-5 py-2.5 rounded-full border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-full ${item.is_veg !== false ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {item.is_veg !== false ? <Leaf className="w-5 h-5 text-green-600" /> : <Flame className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold">Type</span>
                  <span className={`text-sm font-bold font-modern ${item.is_veg !== false ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {item.is_veg !== false ? "100% Veg" : "Non-Veg"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Warning */}
            {item.stock !== undefined && item.stock < 10 && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-6 animate-pulse bg-red-50 dark:bg-red-900/20 w-fit px-4 py-2 rounded-full border border-red-200 dark:border-red-800">
                <Flame className="w-4 h-4" />
                Hurry up! Only {item.stock} left in stock.
              </div>
            )}


            {/* Actions Area */}
            {/* Actions Area (Quantity only in the card) */}
            <div className="mt-auto pt-6 border-t border-border">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-foreground font-modern uppercase tracking-wider mb-2">
                  Select Variant / Quantity
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border-[3px] border-[var(--primary)] rounded-full bg-card overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-10 flex items-center justify-center text-foreground hover:bg-[var(--primary)]/10 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-lg bg-[var(--primary)] text-white h-full flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-10 flex items-center justify-center text-foreground hover:bg-[var(--primary)]/10 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {item.weight && (
                    <div className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] font-bold rounded-full text-sm">
                      {item.weight}g
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 pointer-events-none pb-safe">
        <div className="max-w-[28rem] mx-auto bg-[var(--highlight)] text-[#4b3000] p-3 rounded-[2rem] shadow-[0_10px_40px_rgba(251,189,22,0.4)] flex items-center justify-between pointer-events-auto transition-colors">
          <div className="pl-4 flex flex-col justify-center">
            {isSpecialItem ? (
              <span className="text-lg font-black font-modern leading-tight">
                Contact Us
              </span>
            ) : (
              <div className="flex items-baseline gap-2">
                {item.discounted_price && item.discounted_price > 0 && item.discounted_price < item.price ? (
                  <>
                    <span className="text-sm font-bold opacity-60 line-through decoration-2 decoration-red-500/50 pr-1">₹{item.price * quantity}</span>
                    <span className="text-2xl font-black font-modern leading-tight pr-1 text-yellow-900 drop-shadow-sm">₹{item.discounted_price * quantity}</span>
                  </>
                ) : (
                  <span className="text-2xl font-black font-modern leading-tight pr-1">₹{item.price * quantity}</span>
                )}
                <span className="text-[10px] font-bold opacity-75 uppercase tracking-widest pl-2 border-l border-[#4b3000]/20 hidden sm:block">Total</span>
              </div>
            )}
          </div>

          {isSpecialItem ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[var(--card)] text-[var(--foreground)] font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-transform border border-[var(--border)]"
            >
              Order via WhatsApp <MessageCircle className="w-5 h-5 text-green-600" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-[var(--card)] text-[var(--foreground)] font-bold px-8 py-3 rounded-full flex items-center gap-2 shadow-sm hover:scale-105 hover:shadow-md transition-all whitespace-nowrap border border-[var(--border)]"
            >
              Add to cart! <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-card">
                <div>
                  <h2 className="text-xl font-serif font-bold text-primary">
                    {t("modal.deliveryDetails")}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("modal.name")}
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-input rounded-xl bg-background"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("modal.mobileNumber")}
                    </label>
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border border-input rounded-xl bg-background"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("modal.address")}
                    </label>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-4 py-3 border border-input rounded-xl bg-background resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("modal.pincode")}
                    </label>
                    <input
                      required
                      type="text"
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 border border-input rounded-xl bg-background"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{t("modal.proceedWhatsApp")}</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomizationCTA
        title="Need something else"
        description="Design your own product"
        buttonText="Order Custom Product"
      />
    </div>
  );
}