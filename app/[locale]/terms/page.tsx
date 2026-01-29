import type { Metadata } from "next"
import details from "@/config/details.json"

export const metadata: Metadata = {
  title: `Terms & Conditions | ${details.store.name}`,
  description: `Terms and conditions for ${details.store.name}. Artisan bakery in ${details.location.city}, ${details.location.state}.`,
}

async function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: January 9, 2026</p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Use License</h2>
            <p className="text-foreground text-balance mb-4 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on Crumbs O' Bliss website for
              personal, non-commercial transitory viewing only. This grants a limited, non-exclusive, non-transferable
              license to access and use the website in accordance with these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Disclaimer</h2>
            <p className="text-foreground text-balance mb-4 leading-relaxed">
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or
              implied, and hereby disclaim and negate all other warranties including merchantability and fitness for a
              particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Limitations</h2>
            <p className="text-foreground text-balance leading-relaxed">
              In no event shall Crumbs O' Bliss or its suppliers be liable for any damages arising out of the use or
              inability to use the materials on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Revisions and Errata</h2>
            <p className="text-foreground text-balance leading-relaxed">
              The materials on our website could include technical or typographical errors. We do not warrant that any
              materials are accurate or current. We may make changes without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Governing Law</h2>
            <p className="text-foreground text-balance leading-relaxed">
              These terms and conditions are governed by the laws of India, and you irrevocably submit to the exclusive
              jurisdiction of the courts located in India.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
