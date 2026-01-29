import type { Metadata } from "next";
import Image from "next/image";
import details from "@/config/details.json";
import {
  Playfair_Display,
  Cinzel,
  Montserrat,
  Lora,
  Oswald,
  Dancing_Script,
} from "next/font/google";
import {
  Sparkles,
  Heart,
  Leaf,
  Clock,
  ChefHat,
  Target
} from "lucide-react";

// --- Font Configurations ---
const playfair = Playfair_Display({ subsets: ["latin"] });
const cinzel = Cinzel({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });
const dancing = Dancing_Script({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `About ${details.store.name} | Artisan Bakery`,
  description: `Learn about ${details.store.name} - ${details.store.slogan}. Fresh, honest, small-batch baked goods made with time-tested techniques at our bakery in ${details.location.state}.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917]">
      
      {/* --- HEADER SECTION (Editorial Style) --- */}
      <div className="w-full bg-[#1C1917] text-[#FAFAF9] pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
            <span className={`inline-block py-2 px-6 border border-[#FAFAF9]/30 rounded-full text-sm uppercase tracking-[0.2em] mb-6 ${montserrat.className}`}>
                Est. 2023
            </span>
            <h1 className={`text-5xl md:text-8xl font-black mb-8 leading-none ${cinzel.className}`}>
                Science<br />
                <span className={`text-4xl md:text-6xl font-normal italic ${dancing.className} text-[#D6D3D1]`}>&</span> Soul
            </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 mb-24 relative z-10">
        {/* --- MAIN STORY BLOCK --- */}
        <div className="bg-white p-8 md:p-16 shadow-2xl border-t-4 border-[#1C1917]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                     <h2 className={`text-3xl font-bold mb-6 text-[#1C1917] uppercase tracking-widest ${oswald.className}`}>
                        About Crumbs O' Bliss
                    </h2>
                    <p className={`text-xl leading-relaxed text-[#57534E] mb-6 ${lora.className}`}>
                        Crumbs O' Bliss is an artisan bakery focused on fresh, honest, small-batch baked goods made with time-tested
                        techniques and thoughtfully sourced ingredients. 
                    </p>
                    <p className={`text-xl leading-relaxed text-[#57534E] ${lora.className}`}>
                        Baking is treated as both science and soul, balancing
                        precision with warmth and care. Every item we create reflects our commitment to quality and our dedication
                        to bringing joy through exceptional baked goods.
                    </p>
                    <div className="mt-8">
                        <span className={`text-4xl ${dancing.className}`}>The Baker's Family</span>
                    </div>
                </div>
                <div className="relative h-[400px] w-full rounded-none overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                     <Image 
                        src="https://media.istockphoto.com/id/1299566263/photo/a-baker-dusting-flour-on-a-dough-to-make-bread.jpg?s=612x612&w=0&k=20&c=eBd1Y6NI9sE1RvGxuRJhwmKmY-423Q4Ix7wUNsumtic="
                        alt="Baker kneading dough"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* --- VALUES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-12 mb-20">
          <div className="text-center mb-16">
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-[#1C1917]" />
              <h2 className={`text-4xl md:text-5xl font-black ${cinzel.className}`}>Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Leaf,
                  title: "Quality Ingredients",
                  description: "We source only the finest, freshest ingredients from trusted suppliers.",
                },
                {
                  icon: Clock,
                  title: "Time-Tested Techniques",
                  description: "Traditional baking methods combined with precision and care.",
                },
                {
                  icon: Heart,
                  title: "Small Batches",
                  description: "Limited production ensures freshness and attention to detail.",
                },
              ].map((value, idx) => (
                <div key={idx} className="group p-8 border border-[#E7E5E4] bg-white hover:bg-[#1C1917] hover:text-[#FAFAF9] transition-all duration-500">
                    <value.icon className="w-10 h-10 mb-6 text-[#1C1917] group-hover:text-[#FAFAF9] transition-colors" />
                    <h3 className={`text-2xl font-bold mb-4 uppercase tracking-wide ${oswald.className}`}>{value.title}</h3>
                    <p className={`text-lg opacity-80 ${lora.className}`}>{value.description}</p>
                </div>
              ))}
          </div>
      </div>

      {/* --- MISSION & CRAFT SECTION (Editorial Split) --- */}
      <div className="bg-[#E7E5E4] py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                
                {/* Mission */}
                <div className="relative">
                    <div className="absolute -left-4 -top-4 w-12 h-12 border-t-2 border-l-2 border-[#1C1917]" />
                    <Target className="w-8 h-8 mb-4" />
                    <h2 className={`text-3xl font-bold mb-6 ${playfair.className}`}>Our Mission</h2>
                    <p className={`text-xl text-[#44403C] leading-loose italic ${lora.className}`}>
                        "To create exceptional baked goods that celebrate the art and craft of traditional baking while building
                        a warm community around the love of fresh, quality food."
                    </p>
                </div>

                {/* Craft */}
                <div className="relative">
                    <div className="absolute -right-4 -bottom-4 w-12 h-12 border-b-2 border-r-2 border-[#1C1917]" />
                    <ChefHat className="w-8 h-8 mb-4" />
                    <h2 className={`text-3xl font-bold mb-6 ${playfair.className}`}>Our Craft</h2>
                    <p className={`text-lg text-[#44403C] leading-relaxed ${lora.className}`}>
                        Baking is where science meets soul. Each morning, our bakers begin their work with precision and
                        passion. We measure ingredients with exactitude, respect fermentation times, and understand the
                        chemistry of a perfect rise. Yet, we also bring warmth, creativity, and care to every batch.
                    </p>
                </div>

            </div>
          </div>
      </div>
    </div>
  );
}
