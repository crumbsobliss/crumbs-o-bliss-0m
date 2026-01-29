import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import details from "@/config/details.json";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Coffee,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import {
  Playfair_Display,
  Cinzel,
  Montserrat,
  Lora,
  Oswald,
  Dancing_Script,
} from "next/font/google";

// --- Font Configurations ---
const playfair = Playfair_Display({ subsets: ["latin"] });
const cinzel = Cinzel({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });
const dancing = Dancing_Script({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contact Us | Crumbs O' Bliss",
  description: `Get in touch with ${details.store.name}. Call ${details.contact.primaryPhone} or visit us at ${details.location.address}, ${details.location.city}.`,
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="w-full min-h-screen bg-[#FAFAF9] text-[#1C1917]">
      
      {/* --- HEADER SECTION (Solid Color, Editorial Style) --- */}
      <div className="w-full bg-[#1C1917] text-[#FAFAF9] pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
            <span className={`inline-block py-2 px-6 border border-[#FAFAF9]/30 rounded-full text-sm uppercase tracking-[0.2em] mb-6 ${montserrat.className}`}>
                Get in Touch
            </span>
            <h1 className={`text-6xl md:text-9xl font-black mb-8 leading-none ${cinzel.className}`}>
                Let's Bake<br />Memories
            </h1>
            <p className={`text-xl md:text-2xl opacity-80 max-w-2xl mx-auto italic ${lora.className}`}>
                Have a question about our sourdough? Want to order a custom cake? Or just want to say hi? We are all ears.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 shadow-2xl">
            
            {/* --- LEFT: CONTACT INFO (Solid Dark Stone) --- */}
            <div className="lg:col-span-2 bg-[#292524] text-[#E7E5E4] p-12 flex flex-col justify-between min-h-[600px]">
                <div>
                    <h3 className={`text-3xl font-bold mb-10 text-[#D6D3D1] ${playfair.className}`}>Contact Information</h3>
                    
                    <div className="space-y-10">
                        <div className="flex items-start gap-6 group">
                            <div className="p-4 bg-[#1C1917] rounded-none border border-[#44403C] group-hover:border-[#E7E5E4] transition-colors">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <span className={`block text-xs uppercase tracking-widest opacity-60 mb-1 ${montserrat.className}`}>Visit Us</span>
                                <p className={`text-lg leading-relaxed ${lora.className}`}>
                                    {details.location.address}, <br />
                                    {details.location.city}, {details.location.state},<br />
                                    India {details.location.postalCode}
                                </p>
                                <p className={`text-sm mt-2 opacity-70 ${lora.className}`}>
                                    Landmark: {details.location.landmark}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                             <div className="p-4 bg-[#1C1917] rounded-none border border-[#44403C] group-hover:border-[#E7E5E4] transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <span className={`block text-xs uppercase tracking-widest opacity-60 mb-1 ${montserrat.className}`}>Email Us</span>
                                <p className={`text-lg ${lora.className}`}>{details.contact.email}</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-6 group">
                             <div className="p-4 bg-[#1C1917] rounded-none border border-[#44403C] group-hover:border-[#E7E5E4] transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <span className={`block text-xs uppercase tracking-widest opacity-60 mb-1 ${montserrat.className}`}>Call Us</span>
                                <p className={`text-lg ${lora.className}`}>{details.contact.primaryPhone}</p>
                                <p className={`text-lg ${lora.className}`}>{details.contact.secondaryPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <span className={`block text-xs uppercase tracking-widest opacity-60 mb-4 ${montserrat.className}`}>Follow Our Journey</span>
                    <div className="flex gap-4">
                        <button className="p-3 border border-[#44403C] hover:bg-[#E7E5E4] hover:text-[#1C1917] transition-all">
                            <Instagram className="w-5 h-5" />
                        </button>
                         <button className="p-3 border border-[#44403C] hover:bg-[#E7E5E4] hover:text-[#1C1917] transition-all">
                            <Facebook className="w-5 h-5" />
                        </button>
                         <button className="p-3 border border-[#44403C] hover:bg-[#E7E5E4] hover:text-[#1C1917] transition-all">
                            <Twitter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- RIGHT: FORM SECTION (Solid White/Cream) --- */}
            <div className="lg:col-span-3 bg-white p-12 md:p-16 relative overflow-hidden">
                {/* Decorative background letter */}
                <div className={`absolute -top-10 -right-10 text-[20rem] opacity-5 font-black pointer-events-none select-none ${cinzel.className}`}>
                    @
                </div>

                <h3 className={`text-4xl md:text-5xl font-bold mb-2 text-[#1C1917] ${playfair.className}`}>Send a Message</h3>
                <p className={`text-[#78716C] mb-12 italic ${dancing.className} text-2xl`}>We promise to reply faster than our dough rises.</p>

                <form className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 text-[#78716C] group-focus-within:text-[#1C1917] transition-colors ${montserrat.className}`}>Your Name</label>
                            <input 
                                type="text" 
                                className={`w-full bg-[#FAFAF9] border-b-2 border-[#E7E5E4] px-4 py-4 text-lg outline-none focus:border-[#1C1917] transition-all placeholder:text-[#D6D3D1] ${lora.className}`}
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="group">
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 text-[#78716C] group-focus-within:text-[#1C1917] transition-colors ${montserrat.className}`}>Email Address</label>
                            <input 
                                type="email" 
                                className={`w-full bg-[#FAFAF9] border-b-2 border-[#E7E5E4] px-4 py-4 text-lg outline-none focus:border-[#1C1917] transition-all placeholder:text-[#D6D3D1] ${lora.className}`}
                                placeholder="jane@example.com"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 text-[#78716C] group-focus-within:text-[#1C1917] transition-colors ${montserrat.className}`}>Subject</label>
                        <select className={`w-full bg-[#FAFAF9] border-b-2 border-[#E7E5E4] px-4 py-4 text-lg outline-none focus:border-[#1C1917] transition-all text-[#1C1917] ${lora.className}`}>
                            <option>General Inquiry</option>
                            <option>Wedding Cake Consultation</option>
                            <option>Wholesale Order</option>
                            <option>Feedback</option>
                        </select>
                    </div>

                    <div className="group">
                        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 text-[#78716C] group-focus-within:text-[#1C1917] transition-colors ${montserrat.className}`}>Message</label>
                        <textarea 
                            rows={4}
                            className={`w-full bg-[#FAFAF9] border-b-2 border-[#E7E5E4] px-4 py-4 text-lg outline-none focus:border-[#1C1917] transition-all placeholder:text-[#D6D3D1] resize-none ${lora.className}`}
                            placeholder="Tell us about your sweet cravings..."
                        />
                    </div>

                    <div className="pt-4">
                        <button className={`w-full md:w-auto bg-[#1C1917] text-white px-10 py-5 text-lg font-bold hover:bg-[#44403C] transition-colors flex items-center justify-center gap-3 uppercase tracking-widest ${oswald.className}`}>
                            Send Message
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>

      {/* --- MAP / HOURS SECTION (Solid Colors) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          <div className="bg-[#E7E5E4] relative min-h-[400px]">
            {/* Placeholder for Map - Using an Image for aesthetic if real map not available */}
            <Image 
                src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&q=80"
                alt="Map location"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-white p-6 shadow-2xl">
                    <span className={`text-3xl font-bold tracking-tighter ${cinzel.className}`}>COB</span>
                 </div>
            </div>
          </div>

          <div className="bg-[#1C1917] text-[#FAFAF9] p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <Coffee className="w-12 h-12 mb-8 text-[#D6D3D1]" />
                <h3 className={`text-4xl md:text-5xl font-black mb-10 ${cinzel.className}`}>Opening Hours</h3>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#44403C] pb-4">
                        <span className={`text-lg uppercase tracking-widest ${oswald.className}`}>Monday - Friday</span>
                        <span className={`text-xl ${lora.className}`}>7:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#44403C] pb-4">
                        <span className={`text-lg uppercase tracking-widest ${oswald.className}`}>Saturday</span>
                        <span className={`text-xl ${lora.className}`}>8:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#44403C] pb-4 text-[#A8A29E]">
                        <span className={`text-lg uppercase tracking-widest ${oswald.className}`}>Sunday</span>
                        <span className={`text-xl ${lora.className}`}>8:00 AM - 6:00 PM</span>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-[#292524] border-l-4 border-white">
                    <p className={`italic text-lg text-[#D6D3D1] ${lora.className}`}>
                        "The early bird gets the fresh croissant. But the late comer gets the discount on day-old loaves."
                    </p>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
}
