"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Instagram, Facebook, Mail, Phone } from "lucide-react"
import details from "@/config/details.json"

export default function Footer() {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.split("/")[1]
  const currentLocale = locale === "en" || locale === "bn" ? locale : "en"

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">{t("footer.brand")}</h3>
            <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
            <p className="text-sm text-primary mt-2 font-semibold italic">"{details.store.slogan}"</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.links")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/items`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.items")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/about`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/terms`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contact.callUs")}</h4>
            <div className="space-y-3">
              <a href={`tel:${details.contact.primaryPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                {details.contact.primaryPhone}
              </a>
              <a href={`tel:${details.contact.secondaryPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                {details.contact.secondaryPhone}
              </a>
              <a href={`mailto:${details.contact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                {details.contact.email}
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">{t("contact.followUs")}</h4>
            <div className="flex gap-3">
              <a
                href={details.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={details.social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 {t("footer.brand")}. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground mt-4 md:mt-0">
            {details.location.fullAddress}
          </p>
        </div>
      </div>
    </footer>
  )
}
