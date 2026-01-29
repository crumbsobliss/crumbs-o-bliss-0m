# Quick Reference - Store Details & SEO

## 🎯 Quick Links

- **Contact Phone**: +91 7866092157
- **Email**: crumbsoblisscakebakery@gmail.com
- **WhatsApp**: +91 7866092157
- **Instagram**: @crumbsobliss_official
- **Facebook**: crumbsobliss_official

## 📍 Location
**Sarisa, Diamond Harbour Road, Cheora**
South 24 Parganas, West Bengal 743368
📍 Near Neotia University

## 🔧 Common Tasks

### Change Phone Number
1. Open `/config/details.json`
2. Update `contact.primaryPhone` or `contact.secondaryPhone`
3. Also update `contact.whatsappNumber` if it's the WhatsApp number

### Change Email
1. Open `/config/details.json`
2. Update `contact.email`

### Change Location
1. Open `/config/details.json`
2. Update `location` object with new address, city, state, etc.

### Change Social Media Links
1. Open `/config/details.json`
2. Update `social.instagramUrl` and `social.facebookUrl`

### Change SEO Keywords
1. Open `/config/details.json`
2. Update `seo.keywords` array

### Add Translation
1. Add English text to `/messages/en.json`
2. Add Bengali text to `/messages/bn.json`
3. Use `t('path.to.text')` in components

## 📊 Current Configuration

### Store
```
Name: Crumbs O' Bliss
Type: Bakery
Slogan: Let's bliss together
Domain: www.crumbsobliss.com
Items: Pizza, Cakes
```

### Contact
```
Primary Phone: +91 7866092157
Secondary Phone: +919775628674
Email: crumbsoblisscakebakery@gmail.com
WhatsApp: 7866092157
```

### Location
```
Address: Sarisa, Diamond Harbour Road, Cheora
City: South 24 Parganas
State: West Bengal
Postal Code: 743368
Country: India
Landmark: Near Neotia University
Latitude: 22.1045
Longitude: 88.3707
```

### Social Media
```
Instagram: crumbsobliss_official
Facebook: crumbsobliss_official
```

## 🔗 Useful Functions

```typescript
import { 
  getStoreDetails,
  getWhatsAppLink,
  getPhoneLink,
  getEmailLink,
  getGoogleMapsLink,
  getLocationString
} from '@/lib/store-details'

// Generate WhatsApp link
const link = getWhatsAppLink('I want to order!')
// Result: https://wa.me/7866092157?text=I%20want%20to%20order!

// Generate phone link
const phoneLink = getPhoneLink()
// Result: tel:+917866092157

// Generate email link
const emailLink = getEmailLink()
// Result: mailto:crumbsoblisscakebakery@gmail.com

// Generate Google Maps link
const mapsLink = getGoogleMapsLink()

// Get formatted location
const location = getLocationString()
// Result: Sarisa, Diamond Harbour Road, Cheora, South 24 Parganas, West Bengal 743368 (Near Neotia University)
```

## 📄 Files to Update

### For Store Information Changes
- `/config/details.json` ← Main configuration file

### For SEO/Metadata Changes
- `/app/[locale]/layout.tsx` ← Global SEO
- `/app/[locale]/page.tsx` ← Home page SEO
- `/app/[locale]/about/page.tsx` ← About page SEO
- `/app/[locale]/items/page.tsx` ← Items page SEO
- `/app/[locale]/contact/page.tsx` ← Contact page SEO
- `/app/[locale]/terms/page.tsx` ← Terms page SEO

### For Translation Changes
- `/messages/en.json` ← English
- `/messages/bn.json` ← Bengali

### For Component Updates
- `/components/footer.tsx` ← Footer with contact info
- `/components/navbar.tsx` ← Navigation

## 🌐 Supported Locales

- `/en/` - English
- `/bn/` - Bengali

## 📱 WhatsApp Integration

To add WhatsApp link in components:
```typescript
import { getWhatsAppLink } from '@/lib/store-details'

const whatsappLink = getWhatsAppLink('I want to order a cake!')
<a href={whatsappLink} target="_blank" rel="noopener noreferrer">
  Order via WhatsApp
</a>
```

## 📞 Phone Integration

To add phone link in components:
```typescript
import { getPhoneLink } from '@/lib/store-details'

const phoneLink = getPhoneLink()
<a href={phoneLink}>Call Us</a>
```

## 📧 Email Integration

To add email link in components:
```typescript
import { getEmailLink } from '@/lib/store-details'

const emailLink = getEmailLink()
<a href={emailLink}>Email Us</a>
```

## 🗺️ Maps Integration

To add Google Maps link in components:
```typescript
import { getGoogleMapsLink } from '@/lib/store-details'

const mapsLink = getGoogleMapsLink()
<a href={mapsLink} target="_blank" rel="noopener noreferrer">
  View on Google Maps
</a>
```

## 🔍 SEO Checklist

- ✅ Meta titles and descriptions
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ JSON-LD structured data
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Mobile-friendly
- ✅ Fast loading
- ✅ Semantic HTML
- ✅ Multilingual support

## 📞 Support

For issues or questions about the store configuration, check:
1. `/config/details.json` - Is the data correct?
2. `/lib/store-details.ts` - Are utilities working?
3. `/SEO_AND_LOCALIZATION.md` - Detailed documentation
4. `/UPDATE_SUMMARY.md` - Overview of all changes

---

**Last Updated**: January 29, 2026
