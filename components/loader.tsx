'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function Loader() {
  const t = useTranslations()

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-300">
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 animate-bounce">
          <Image
            src="/icon.png"
            alt="Loading"
            fill
            className="object-contain animate-spin"
            priority
          />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-foreground">
            {t('loader.loading')}
          </p>
          <div className="flex gap-1">
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
          </div>
        </div>
      </div>
    </div>
  )
}
