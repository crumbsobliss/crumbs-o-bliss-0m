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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { items } from "@/lib/items";
import { useCart } from "@/lib/cart-context";
import CustomizationCTA from "@/components/tryCustom";
import details from '@/config/details.json'

interface ItemPageClientProps {
  item: (typeof items)[0] | undefined;
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
    const message = `
*New Order Request* 🍞

*Item Details:*
Product: ${item.name.en}
Id: ${item.id}
Price: ₹${item.price}
Qty: ${quantity}
Total: ₹${item.price * quantity}

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
    if(item.price === 0){
      window.alert("This is a special item without a price. Contact us at whatsapp to know the price!")
      return;
    }
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* 1. Navigation Breadcrumb */}
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href={`/${locale}/items`}
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </Link>
        
        {/* Secondary Share Button for Mobile Header */}
        <button 
          onClick={handleShare}
          className="lg:hidden p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 2. Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative aspect-square md:aspect-[4/3] bg-card rounded-2xl overflow-hidden border border-border shadow-sm group"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out"
              priority
            />
          </motion.div>

          {/* 3. Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                {name}
              </h1>
              {/* Desktop Share Button */}
              <button 
                onClick={handleShare}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                <Share2 className="w-4 h-4 text-primary" />
                Share
              </button>
            </div>

            <div className="flex items-end gap-4 mb-6 border-b border-border pb-6">
              {item.price !== 0 && ( <p className="text-3xl font-bold text-foreground">
                ₹{item.price}
              </p>)}
              {item.price === 0 && ( <p className="text-3xl font-bold text-foreground">
                Please Contact Us For Price
              </p>)}
              {item.weight && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-1.5 px-3 py-1 bg-muted rounded-full">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{item.weight} grams</span>
                </div>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
                  <Leaf className="w-4 h-4 text-green-500" />
                  {t("itemDetails.ingredients")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-background border border-border text-muted-foreground"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
                  <Tag className="w-4 h-4 text-blue-500" />
                  {t("itemDetails.tags")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-accent-background border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Area */}
            <div className="mt-auto space-y-4 pt-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Quantity
                </span>
                <div className="flex items-center border border-input rounded-lg bg-card shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Share Button (Action Row) */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className={`h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all border border-border ${
                    isShared ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isShared ? (
                      <motion.div
                        key="copied"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        <span>Link Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="share-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="w-5 h-5 text-primary" />
                        <span>Share</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`${item.price===0?"hidden":""} h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                    cartAdded
                      ? "bg-green-600 text-white"
                      : "bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {cartAdded ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>{t("itemDetails.cartAdded")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>{t("itemDetails.addToCart")}</span>
                    </div>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyClick}
                  className="h-14 bg-primary text-primary-foreground font-bold text-base rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t("itemDetails.orderWhatsApp")}
                </motion.button>
              </div>
            </div>
          </motion.div>
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