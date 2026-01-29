# SEO & Localization Configuration for Crumbs O' Bliss

## Overview

This project is configured with comprehensive SEO optimization and multi-language support (English & Bengali) using a centralized configuration system.

## File Structure

### Core Configuration
- **`/config/details.json`** - Central store of all business details, contact information, and SEO keywords
- **`/lib/store-details.ts`** - Utility functions to access and use store details throughout the app

### Localization Files
- **`/messages/en.json`** - English translations including SEO metadata
- **`/messages/bn.json`** - Bengali translations including SEO metadata

## Store Details Configuration (`/config/details.json`)

All business information is centralized in this file for easy updates:

```json
{
  "store": {
    "name": "Crumbs O' Bliss",
    "type": "Bakery",
    "slogan": "Let's bliss together",
    "domain": "www.crumbsobliss.com",
    "fullDomain": "https://www.crumbsobliss.com"
  },
  "contact": {
    "primaryPhone": "+91 7866092157",
    "secondaryPhone": "+919775628674",
    "email": "crumbsoblisscakebakery@gmail.com",
    "whatsappNumber": "7866092157"
  },
  "social": {
    "instagram": "crumbsobliss_official",
    "facebook": "crumbsobliss_official",
    "instagramUrl": "https://instagram.com/crumbsobliss_official",
    "facebookUrl": "https://facebook.com/crumbsobliss_official"
  },
  "location": {
    "address": "Sarisa, Diamond Harbour Road, Cheora",
    "city": "South 24 Parganas",
    "state": "West Bengal",
    "postalCode": "743368",
    "country": "India",
    "landmark": "Near Neotia University",
    "latitude": 22.1045,
    "longitude": 88.3707
  },
  "items": {
    "categories": ["Pizza", "Cakes"]
  },
  "seo": {
    "keywords": ["Bakery", "Pizza", "Cakes", ...]
  }
}
```

## Using Store Details in Components

### Import the utility functions
```typescript
import { 
  getStoreDetails, 
  getWhatsAppLink, 
  getPhoneLink, 
  getEmailLink,
  getLocationString 
} from '@/lib/store-details'
```

### Available Functions

1. **`getStoreDetails()`** - Returns entire details object
2. **`getStoreContact()`** - Returns contact information
3. **`getStoreLocation()`** - Returns location details
4. **`getStoreSocial()`** - Returns social media links
5. **`getStoreInfo()`** - Returns store name, type, slogan, domain
6. **`getWhatsAppLink(message?)`** - Generates WhatsApp link with optional message
7. **`getPhoneLink()`** - Generates tel: link
8. **`getEmailLink()`** - Generates mailto: link
9. **`getGoogleMapsLink()`** - Generates Google Maps link
10. **`getLocationString()`** - Returns formatted location string

## SEO Implementation

### Page Metadata

Each page includes comprehensive SEO metadata:

```typescript
export const metadata: Metadata = {
  title: "Page Title | Crumbs O' Bliss",
  description: "Page description with keywords",
  keywords: details.seo.keywords,
  // ... other metadata
}
```

### JSON-LD Structured Data

The home page includes JSON-LD schema markup for:
- **Bakery** - Business schema with location, contact, hours
- **VideoObject** - Video content schema

### Open Graph & Twitter Cards

All pages include:
- og:title, og:description, og:image
- twitter:card, twitter:title, twitter:description

## Localization (i18n)

### Adding Translations

1. Add English text to `/messages/en.json`
2. Add Bengali text to `/messages/bn.json`
3. Use `getTranslations()` in server components or `useTranslations()` in client components

### Example

**en.json:**
```json
{
  "contact": {
    "phone": "Phone",
    "email": "Email",
    "callUs": "Call Us"
  }
}
```

**bn.json:**
```json
{
  "contact": {
    "phone": "ফোন",
    "email": "ইমেইল",
    "callUs": "আমাদের কল করুন"
  }
}
```

**Usage in components:**
```typescript
import { getTranslations } from "next-intl/server"

const t = await getTranslations()
<p>{t("contact.phone")}</p>
```

## Components Using Store Details

### Footer (`/components/footer.tsx`)
- Displays contact information with icons
- Links to social media profiles
- Full address display
- Dynamic phone, email, and social links

### Contact Page (`/app/[locale]/contact/page.tsx`)
- Displays store address, phone, and email
- Location landmark information
- Links for calling, emailing, and directions

### Home Page (`/app/[locale]/page.tsx`)
- JSON-LD structured data with real store information
- Open Graph metadata
- Keywords from details.json

## How to Update Information

### To Change Store Details:
1. Edit `/config/details.json`
2. Changes automatically reflect across the entire app

### To Change Translations:
1. Edit `/messages/en.json` for English
2. Edit `/messages/bn.json` for Bengali
3. All components using `t()` will update automatically

### To Add New Contact Information:
1. Add to `/config/details.json`
2. Create utility function in `/lib/store-details.ts` if needed
3. Use in components

## SEO Best Practices Implemented

✅ Descriptive titles and meta descriptions
✅ Open Graph tags for social sharing
✅ Twitter Card metadata
✅ JSON-LD structured data
✅ Mobile-friendly responsive design
✅ Semantic HTML
✅ Fast loading with proper image optimization
✅ Multilingual content with proper lang attributes
✅ Local business schema with location and contact
✅ Keyword optimization in all pages

## Locales Supported

- **en** - English
- **bn** - Bengali

Routes automatically handle locale prefix: `/en/`, `/bn/`

## Future Improvements

- Add business hours to details.json
- Add opening hours to JSON-LD schema
- Add more locales (Hindi, etc.)
- Add SEO meta descriptions dynamically from translations
- Add sitemap generation
