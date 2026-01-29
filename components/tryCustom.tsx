'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface CustomizationCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function CustomizationCTA({ 
  title, 
  description, 
  buttonText,
  className = ""
}: CustomizationCTAProps) {
  // Use translations if available, otherwise fallback
  let t: any;
  try {
    t = useTranslations('customization');
  } catch (error) {
    t = (key: string) => null;
  }

  const params = useParams();
  const locale = params.locale as string || 'en';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`w-full py-12 ${className}`}
    >
      <div className="relative overflow-hidden bg-[var(--card)] rounded-3xl p-8 md:p-16 border border-[var(--border)] text-center max-w-4xl mx-auto shadow-sm">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[var(--primary)] opacity-5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-[var(--accent)] opacity-10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[var(--background)] rounded-full flex items-center justify-center shadow-sm mb-6 border border-[var(--border)]">
             <ChefHat className="w-8 h-8 text-[var(--primary)]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[var(--foreground)]">
            {title || t('ctaTitle') || "Want something else?"}
          </h2>
          
          <p className="text-[var(--muted-foreground)] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {description || t('ctaDescription') || "Can't find exactly what you're looking for? Request a custom order and we'll bake it just for you."}
          </p>

          <Link href={`/${locale}/customization`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full font-semibold text-lg shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>{buttonText || t('ctaButton') || "Request Custom Order"}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}