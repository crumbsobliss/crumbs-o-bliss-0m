"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Footer() {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.split("/")[1]
  const currentLocale = locale === "en" || locale === "bn" ? locale : "en"

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">{t("footer.brand")}</h3>
            <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
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
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">Email: crumbsoblisscakebakery@gmail.com </p>
            <p className="text-sm text-muted-foreground">Phone: +91 9775628674 / +91 7866092157</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 {t("footer.brand")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
