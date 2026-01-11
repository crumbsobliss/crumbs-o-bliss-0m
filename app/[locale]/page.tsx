import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { items } from "@/lib/items";
import {
  ArrowRight,
  Star,
  Leaf,
  Clock,
  Heart,
  Sparkles,
  Award,
  Users,
  MapPin,
  Instagram,
  ChefHat,
  Coffee
} from "lucide-react";
import CircularGallery from "@/components/CircularGallery";
import {
  Inter,
  Playfair_Display,
  Dancing_Script,
  Cinzel,
  Montserrat,
  Lora,
  Oswald,
} from "next/font/google";

// --- Font Configurations (7 Fonts) ---
const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
const dancing = Dancing_Script({ subsets: ["latin"] });
const cinzel = Cinzel({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crumbs O' Bliss | Artisan Bakery",
  description:
    "Fresh, honest, small-batch baked goods made with time-tested techniques.",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const featuredItems = items.filter((item) =>
    ["sourdough-bread", "macaron-assortment", "chocolate-croissant"].includes(
      item.slug
    )
  );

  // Bakery-themed items for the CircularGallery (10 Images)
  const bakeryGalleryItems = [
    {
      image: 'https://images.unsplash.com/photo-1585478479636-1999ff953e63?w=800&q=80',
      text: 'Classic Sourdough'
    },
    {
      image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80',
      text: 'Chocolate Croissant'
    },
    {
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&q=80',
      text: 'Blueberry Muffin'
    },
    {
      image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80',
      text: 'Cinnamon Roll'
    },
    {
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80',
      text: 'Almond Croissant'
    },
    {
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80',
      text: 'Macaron Assortment'
    },
    {
      image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?w=800&q=80',
      text: 'French Baguette'
    },
    {
      image: 'https://images.unsplash.com/photo-1614707267537-b85aaf80fd44?w=800&q=80',
      text: 'Red Velvet Cupcake'
    },
    {
      image: 'https://images.unsplash.com/photo-1573145402507-42bf25c3459c?w=800&q=80',
      text: 'Rosemary Focaccia'
    },
    {
      image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cf446?w=800&q=80',
      text: 'Choco Chip Cookie'
    }
  ];

  return (
    <div className={`w-full overflow-x-hidden bg-background ${inter.className}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[var(--hero-bg-start)] via-[var(--hero-bg-via)] to-[var(--hero-bg-end)] transition-colors duration-500">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--blob-1)] rounded-full blur-3xl animate-pulse opacity-40" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--blob-2)] rounded-full blur-3xl animate-pulse delay-700 opacity-40" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[var(--blob-3)] rounded-full blur-3xl animate-pulse delay-1000 opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--badge-bg)] backdrop-blur-md border border-[var(--badge-border)] text-[var(--badge-text)] font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-lg hover:shadow-xl transition-all ${montserrat.className}`}>
            <Star className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)] animate-spin-slow" />
            <span className="tracking-wide uppercase text-xs">{t("hero.cta")}</span>
            <Sparkles className="w-4 h-4 text-[var(--badge-icon)]" />
          </div>

          {/* Main Heading (Font: Cinzel) */}
          <h1
            className={`text-6xl md:text-9xl font-black mb-6 text-balance bg-gradient-to-br from-[var(--text-heading-grad-from)] via-[var(--text-heading-grad-via)] to-[var(--text-heading-grad-to)] bg-clip-text text-transparent tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ${cinzel.className}`}
          >
            {t("hero.title")}
          </h1>

          {/* Decorative underline */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-in fade-in duration-1000 delay-400">
            <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-[var(--divider-color)]" />
            <Leaf className="w-6 h-6 text-[var(--divider-color)]" />
            <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-[var(--divider-color)]" />
          </div>

          <p
            className={`text-2xl md:text-4xl text-[var(--text-body-color)] mb-14 text-balance max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 ${dancing.className}`}
          >
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons (Font: Oswald) */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 ${oswald.className}`}>
            <Link
              href={`/${locale}/items`}
              className="group relative flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full hover:brightness-110 transition-all hover:scale-105 shadow-2xl shadow-[var(--btn-shadow)] overflow-hidden uppercase tracking-widest"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-lg">
                Shop Collection
              </span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/about`}
              className="px-12 py-5 bg-[var(--badge-bg)] backdrop-blur-sm border-2 border-[var(--badge-border)] text-[var(--badge-text)] font-bold rounded-full hover:bg-[var(--badge-bg)] hover:brightness-105 transition-all hover:scale-105 shadow-lg text-lg tracking-widest uppercase"
            >
              Our Story
            </Link>
          </div>

          {/* Floating Images Gallery (Hero Images 1-3) */}
          <div className="mt-20 relative h-64 md:h-80 animate-in fade-in duration-1000 delay-1000 pointer-events-none md:pointer-events-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-stone-800 z-10">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                alt="Artisan bread"
                fill
                priority
                sizes="(max-width: 768px) 200px, 300px"
                className="object-cover"
              />
            </div>
            <div className="absolute left-[5%] md:left-[20%] top-8 w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-xl -rotate-12 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-stone-800 opacity-90 hover:opacity-100 hover:z-20">
              <Image
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"
                alt="Croissants"
                fill
                priority
                sizes="(max-width: 768px) 150px, 200px"
                className="object-cover"
              />
            </div>
            <div className="absolute right-[5%] md:right-[20%] top-12 w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-xl rotate-12 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-stone-800 opacity-90 hover:opacity-100 hover:z-20">
              <Image
                src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80"
                alt="Pastries"
                fill
                priority
                sizes="(max-width: 768px) 150px, 200px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg
            className="relative block w-full h-24 md:h-32"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white dark:fill-background"
            ></path>
          </svg>
        </div>
      </section>

      {/* --- PHILOSOPHY STATS --- */}
      <section className="py-16 bg-white dark:bg-background border-y border-[var(--lp-card-border)]/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: Leaf,
              label: "100% Organic",
              color: "text-green-600 dark:text-green-400",
              bgColor: "bg-green-50 dark:bg-green-950/30",
            },
            {
              icon: Clock,
              label: "24h Fermented",
              color: "text-[var(--badge-icon)]",
              bgColor: "bg-[var(--blob-1)]/30",
            },
            {
              icon: ChefHat,
              label: "Small Batch",
              color: "text-rose-600 dark:text-rose-400",
              bgColor: "bg-rose-50 dark:bg-rose-950/30",
            },
            {
              icon: Award,
              label: "Master Bakers",
              color: "text-orange-600 dark:text-orange-400",
              bgColor: "bg-orange-50 dark:bg-orange-950/30",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-4 group cursor-pointer"
            >
              <div
                className={`w-20 h-20 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}
              >
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              {/* Font: Oswald for strong labels */}
              <span className={`text-base font-bold uppercase tracking-widest text-[var(--text-body-color)] ${oswald.className}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Circular Gallery Section (Images 4-13) */}
      <div style={{ height: "600px", position: "relative" }} className="bg-gradient-to-b from-white to-[var(--feat-bg-start)] dark:from-background dark:to-[var(--feat-bg-start)]">
        <CircularGallery bend={3} items={bakeryGalleryItems} />
      </div>

      {/* --- FEATURED COLLECTIONS (Images 14-16) --- */}
      <section className="py-28 md:py-36 px-4 bg-gradient-to-b from-[var(--feat-bg-start)] to-[var(--feat-bg-end)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">
              <div className={`inline-block mb-4 px-4 py-1 bg-[var(--blob-1)]/50 text-[var(--badge-text)] text-xs font-bold uppercase tracking-widest rounded-full ${montserrat.className}`}>
                Featured Collection
              </div>
              {/* Font: Playfair Display */}
              <h2
                className={`text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[var(--text-heading-grad-from)] to-[var(--text-heading-grad-via)] bg-clip-text text-transparent leading-tight ${playfair.className}`}
              >
                {t("items.title")}
              </h2>
              {/* Font: Lora for reading text */}
              <p
                className={`text-xl md:text-2xl text-[var(--text-body-color)] leading-relaxed italic ${lora.className}`}
              >
                {t("items.description")}
              </p>
            </div>
            <Link
              href={`/${locale}/items`}
              className={`group text-[var(--badge-text)] font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg ${montserrat.className}`}
            >
              View All Items
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <Link
                key={item.slug}
                href={`/${locale}/items/${item.slug}`}
                className="group relative bg-[var(--lp-card-bg)] rounded-3xl overflow-hidden border-2 border-[var(--lp-card-border)] hover:border-[var(--lp-card-border-hover)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name.en}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Floating Price Tag (Font: Montserrat) */}
                  <div className={`absolute top-6 right-6 bg-[var(--lp-card-bg)]/95 backdrop-blur-md text-[var(--badge-text)] font-black px-5 py-3 rounded-2xl shadow-xl border border-[var(--lp-card-border)] group-hover:scale-110 transition-transform ${montserrat.className}`}>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                      From
                    </span>
                    <span className="text-xl">₹{item.price}</span>
                  </div>

                  {/* Badge */}
                  <div className={`absolute top-6 left-6 bg-[var(--badge-icon)] text-white font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider shadow-lg ${oswald.className}`}>
                    Bestseller
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[var(--blob-1)]/30 text-[var(--badge-text)] border border-[var(--lp-card-border)] ${inter.className}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Font: Cinzel */}
                  <h3
                    className={`text-2xl font-bold mb-4 text-[var(--text-heading-grad-from)] group-hover:text-[var(--text-heading-grad-via)] transition-colors leading-tight ${cinzel.className}`}
                  >
                    {locale === "en" ? item.name.en : item.name.bn}
                  </h3>
                  {/* Font: Lora */}
                  <p
                    className={`text-[var(--text-body-color)] line-clamp-3 text-base leading-relaxed mb-6 flex-1 ${lora.className}`}
                  >
                    {locale === "en"
                      ? item.description.en
                      : item.description.bn}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--lp-card-border)] mt-auto">
                    <span className={`text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 ${inter.className}`}>
                      <span className="w-2 h-2 rounded-full bg-[var(--badge-icon)]" />
                      {item.calories} Cal
                    </span>
                    <div className="w-12 h-12 rounded-full bg-[var(--blob-1)]/50 flex items-center justify-center group-hover:bg-[var(--btn-primary-start)] group-hover:text-white transition-all duration-300 shadow-md">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION (Images 17-19) --- */}
      <section className="py-24 px-4 bg-white dark:bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className={`inline-block mb-4 px-4 py-1 bg-rose-100 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 text-xs font-bold uppercase tracking-widest rounded-full ${montserrat.className}`}>
            Customer Love
          </div>
          {/* Font: Playfair Display */}
          <h2
            className={`text-4xl md:text-6xl font-black mb-4 text-foreground ${playfair.className}`}
          >
            What Our Family Says
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            {
              name: "Priya Sharma",
              role: "Food Blogger",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
              quote:
                "The sourdough here is absolutely divine. You can taste the passion in every bite!",
              rating: 5,
            },
            {
              name: "Rahul Mehta",
              role: "Local Chef",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
              quote:
                "Finally, an authentic bakery that respects traditional methods. Their croissants are perfection.",
              rating: 5,
            },
            {
              name: "Anita Desai",
              role: "Regular Customer",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
              quote:
                "I drive 30 minutes just for their macarons. Worth every second of the journey!",
              rating: 5,
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-[var(--hero-bg-start)] to-[var(--hero-bg-via)] p-8 rounded-3xl border-2 border-[var(--lp-card-border)] hover:border-[var(--badge-icon)] transition-colors hover:shadow-2xl relative"
            >
              <div className="absolute top-8 right-8 text-[var(--blob-1)]/20">
                 <Heart className="w-12 h-12 fill-current" />
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-[var(--badge-icon)] text-[var(--badge-icon)]"
                  />
                ))}
              </div>
              {/* Font: Lora Italic */}
              <p
                className={`text-[var(--text-body-color)] text-lg mb-8 leading-relaxed italic ${lora.className}`}
              >
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--badge-icon)]">
                    <Image 
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="60px"
                        className="object-cover"
                    />
                </div>
                <div>
                  <p className={`font-bold text-foreground text-lg ${cinzel.className}`}>{testimonial.name}</p>
                  <p className={`text-xs text-muted-foreground uppercase tracking-wider ${montserrat.className}`}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BRAND STORY (Image 20) --- */}
      <section className="relative py-32 md:py-48 px-4 bg-gradient-to-br from-[var(--brand-bg-start)] via-[var(--brand-bg-via)] to-[var(--brand-bg-end)] text-white overflow-hidden attachment-fixed bg-fixed">
        {/* Background Texture/Image */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"
            alt="texture"
            fill
            className="object-cover"
          />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-ping delay-0" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping delay-[2000ms]" />
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/30 rounded-full animate-ping delay-[4000ms]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Award className="w-20 h-20 mx-auto mb-8 text-[var(--badge-icon)] animate-bounce" />
          {/* Font: Cinzel */}
          <h2
            className={`text-5xl md:text-8xl font-black mb-12 leading-tight ${cinzel.className}`}
          >
            {t("about.title")}
          </h2>
          {/* Font: Dancing Script */}
          <p
            className={`text-2xl md:text-4xl mb-16 leading-relaxed font-light text-white/90 ${dancing.className}`}
          >
            "{t("about.description")}"
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-16 opacity-70">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[var(--divider-color)]" />
            <Sparkles className="w-6 h-6 text-[var(--divider-color)] animate-spin-slow" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[var(--divider-color)]" />
          </div>

          <Link
            href={`/${locale}/about`}
            className={`group inline-block px-14 py-6 bg-white dark:bg-stone-800 text-[var(--badge-text)] dark:text-amber-100 font-black rounded-full hover:scale-110 transition-all shadow-2xl hover:shadow-white/20 text-xl tracking-widest relative overflow-hidden uppercase ${oswald.className}`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors">
              Read Our Philosophy
            </span>
          </Link>
        </div>
      </section>

      {/* --- VISIT US SECTION (Images 21-24) --- */}
      <section className="py-24 px-4 bg-gradient-to-b from-white dark:from-background to-[var(--hero-bg-start)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className={`inline-block mb-4 px-4 py-1 bg-[var(--blob-1)]/50 text-[var(--badge-text)] text-xs font-bold uppercase tracking-widest rounded-full ${montserrat.className}`}>
                Visit Us
              </div>
              <h2
                className={`text-4xl md:text-7xl font-black mb-6 text-foreground ${playfair.className}`}
              >
                Experience the Magic
              </h2>
              <p
                className={`text-xl text-[var(--text-body-color)] mb-10 leading-relaxed ${lora.className}`}
              >
                Come visit our bakery and watch master bakers craft each item
                with love and precision. The aroma alone is worth the trip.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-5 p-4 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white transition-colors">
                  <MapPin className="w-8 h-8 text-[var(--badge-icon)] flex-shrink-0 mt-1" />
                  <div>
                    <p className={`font-bold text-foreground text-lg ${cinzel.className}`}>
                      Shyamnagar, West Bengal
                    </p>
                    <p className="text-muted-foreground">78 Baker Street, Near Central Park, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-4 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white transition-colors">
                  <Clock className="w-8 h-8 text-[var(--badge-icon)] flex-shrink-0 mt-1" />
                  <div>
                    <p className={`font-bold text-foreground text-lg ${cinzel.className}`}>Open Daily</p>
                    <p className="text-muted-foreground">7:00 AM - 8:00 PM (Happy Hours: 6-8 PM)</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                  <Link
                    href={`/${locale}/contact`}
                    className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl uppercase tracking-wider ${oswald.className}`}
                  >
                    Get Directions
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="p-4 rounded-full border-2 border-[var(--badge-text)] text-[var(--badge-text)] hover:bg-[var(--badge-text)] hover:text-white transition-all">
                      <Instagram className="w-6 h-6" />
                  </button>
              </div>

              {/* Mini Gallery Grid */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                  {[
                      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&q=80",
                      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80",
                      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=300&q=80"
                  ].map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                          <Image src={src} alt="Bakery Vibes" fill className="object-cover" sizes="150px" />
                      </div>
                  ))}
              </div>
            </div>

            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-stone-800">
              <Image
                src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80"
                alt="Bakery interior"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                  <div className="flex items-center gap-2 mb-2">
                      <Coffee className="w-6 h-6" />
                      <span className={`text-lg uppercase tracking-widest ${oswald.className}`}>Coffee Bar</span>
                  </div>
                  <p className={`text-3xl font-bold leading-tight ${playfair.className}`}>Fresh Brews &<br/>Warm Hugs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}