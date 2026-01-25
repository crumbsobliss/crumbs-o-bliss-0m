"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Playfair_Display, 
  Montserrat, 
  Great_Vibes, 
  Cinzel, 
  Lato, 
  Dancing_Script 
} from 'next/font/google';
import { ChevronDown, Check, Phone } from 'lucide-react';

// --- Font Configuration ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-great-vibes' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-lato' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing' });

// --- Types ---
type CakeState = {
  flavor: string;
  shape: string;
  tiers: number;
  message: string;
  frostingColor: string;
  toppings: string[];
};

type PizzaState = {
  size: string;
  crust: string;
  baseSauce: string;
  cheeseLevel: string;
  toppings: string[];
};

// --- Helper Components for Visualization ---

const ToppingIcon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    'Fresh Berries': '🍓', 'Gold Leaf': '✨', 'Macarons': '🥯', 'Flowers': '🌸',
    'Sprinkles': '🔹', 'Choco Drip': '', // Handled via CSS
    'Olives': '🫒', 'Mushrooms': '🍄', 'Bell Peppers': '🫑', 'Onions': '🧅',
    'Pepperoni': '🍕', 'Chicken BBQ': '🍗', 'Basil': '🍃', 'Jalapenos': '🌶️', 'Pineapple': '🍍'
  };
  return <span>{icons[name] || '•'}</span>;
};

// --- Main Component ---
export default function CustomizationPage() {
  const [activePanel, setActivePanel] = useState<'cake' | 'pizza'>('cake');
  const [mounted, setMounted] = useState(false);

  // State for Cake
  const [cakeDetails, setCakeDetails] = useState<CakeState>({
    flavor: 'Vanilla Bean',
    shape: 'Round',
    tiers: 2,
    message: '',
    frostingColor: '#fce4ec',
    toppings: [],
  });

  // State for Pizza
  const [pizzaDetails, setPizzaDetails] = useState<PizzaState>({
    size: 'Medium (12")',
    crust: 'Thin Crust',
    baseSauce: 'Classic Tomato',
    cheeseLevel: 'Regular',
    toppings: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContactRedirect = () => {
    if (!mounted) return;

    // Retrieve user details from localStorage
    const storedUser = localStorage.getItem('user'); 
    const userDetails = storedUser ? JSON.parse(storedUser) : { name: 'Guest', phone: 'Not Provided' };

    let message = '';
    const header = `*New Customization Inquiry*\n\n*Customer:* ${userDetails.name || 'Guest'}\n*Phone:* ${userDetails.phone || 'N/A'}\n\n`;

    if (activePanel === 'cake') {
      message = `${header}*--- CAKE CUSTOMIZATION ---*\n` +
        `• *Flavor:* ${cakeDetails.flavor}\n` +
        `• *Shape:* ${cakeDetails.shape}\n` +
        `• *Tiers:* ${cakeDetails.tiers}\n` +
        `• *Frosting:* ${cakeDetails.frostingColor}\n` +
        `• *Message:* "${cakeDetails.message || 'None'}"\n` +
        `• *Toppings:* ${cakeDetails.toppings.length > 0 ? cakeDetails.toppings.join(', ') : 'None'}`;
    } else {
      message = `${header}*--- PIZZA CUSTOMIZATION ---*\n` +
        `• *Size:* ${pizzaDetails.size}\n` +
        `• *Crust:* ${pizzaDetails.crust}\n` +
        `• *Sauce:* ${pizzaDetails.baseSauce}\n` +
        `• *Cheese:* ${pizzaDetails.cheeseLevel}\n` +
        `• *Toppings:* ${pizzaDetails.toppings.length > 0 ? pizzaDetails.toppings.join(', ') : 'None'}`;
    }

    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleSelection = (list: string[], item: string, setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // --- Dynamic Visualizers ---

  const CakeVisualizer = () => {
    // Helper to generate toppings for a tier
    const renderToppings = (count: number) => {
      const activeToppings = cakeDetails.toppings.filter(t => t !== 'Choco Drip');
      if (activeToppings.length === 0) return null;
      
      return Array.from({ length: count }).map((_, i) => {
        const toppingName = activeToppings[i % activeToppings.length];
        const randomLeft = Math.floor(Math.random() * 80) + 10; // 10% to 90%
        return (
          <div key={i} className="absolute -top-3 transform -translate-x-1/2 text-xl drop-shadow-md z-10" style={{ left: `${randomLeft}%` }}>
            <ToppingIcon name={toppingName} />
          </div>
        );
      });
    };

    const hasDrip = cakeDetails.toppings.includes('Choco Drip');
    
    // Shape Styles
    const getShapeStyle = () => {
        if (cakeDetails.shape === 'Round') return 'rounded-[50%]';
        if (cakeDetails.shape === 'Square') return 'rounded-lg';
        return ''; // Heart handled differently via clip-path or structure
    };

    // Wrapper for Heart Shape clip-path if needed
    const HeartWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        if (cakeDetails.shape !== 'Heart') return <div className={`${getShapeStyle()} ${className}`}>{children}</div>;
        
        // CSS Heart using clip-path isn't great for stacking "3D" elements. 
        // We'll use a standard shape but mask it? No, let's stick to a robust SVG-like approach for CSS hearts or simplified rounded logic.
        // For robustness in this demo, let's use a specialized "Heart-like" border radius trick or just clip-path on a container.
        return (
             <div className={`relative ${className}`} style={{ clipPath: "path('M150 50 C100 0 20 60 150 200 C280 60 200 0 150 50 Z')" }}>
                {children}
             </div>
        );
    };

    // Since clip-path cuts off shadows/depth, we'll use a simpler approximation for Heart:
    // Just high border radius on top corners for "Heart-ish" or stick to distinct shapes.
    // Let's stick to standard logic but specialized style for Heart to keep it responsive.
    const isHeart = cakeDetails.shape === 'Heart';

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center pt-10">
        <div className="relative flex flex-col items-center justify-end">
          {/* Tiers Loop (Reverse order to stack bottom-up visually, but we render top-down) */}
          {Array.from({ length: cakeDetails.tiers }).reverse().map((_, index) => {
             const tierLevel = cakeDetails.tiers - index; // 1 (top) to N (bottom)
             // Width increases with tier level (visual index)
             const width = isHeart ? 160 + (index * 60) : 140 + (index * 50); 
             const height = 70;
             const isTop = index === 0;

             return (
               <div 
                  key={index} 
                  className={`relative flex items-center justify-center transition-all duration-500`}
                  style={{ 
                    width: `${width}px`, 
                    height: `${height}px`,
                    zIndex: 10 - index
                  }}
               >
                 {/* The Cake Layer */}
                 <div 
                    className={`absolute inset-0 shadow-xl transition-colors duration-500 flex items-center justify-center
                      ${!isHeart && getShapeStyle()}
                      ${isHeart ? 'custom-heart-shape' : ''}
                    `}
                    style={{ 
                      backgroundColor: cakeDetails.frostingColor,
                      // For Heart shape, we need a special clip path if active
                      clipPath: isHeart ? "path('M 50% 15% Q 100% -10% 100% 40% Q 100% 100% 50% 100% Q 0% 100% 0% 40% Q 0% -10% 50% 15%')" : undefined,
                      // Adjust heart scale per tier
                      transform: isHeart ? `scale(${1 + index * 0.3})` : 'none',
                      marginTop: isHeart ? `${index * 20}px` : '0' // Adjust stacking for hearts
                    }}
                 >
                    {/* Drip Effect */}
                    {hasDrip && (
                      <div 
                        className="absolute top-0 left-0 w-full h-4 bg-[#3E2723] opacity-90"
                        style={{ 
                          borderRadius: isHeart ? '0' : (cakeDetails.shape === 'Round' ? '50% 50% 0 0' : '8px 8px 0 0'),
                          clipPath: isHeart ? undefined : "polygon(0% 0%, 0% 100%, 10% 80%, 20% 100%, 30% 70%, 40% 100%, 50% 80%, 60% 100%, 70% 60%, 80% 100%, 90% 80%, 100% 100%, 100% 0%)"
                        }} 
                      />
                    )}
                    
                    {/* Message on Middle/Top Tier */}
                    {cakeDetails.message && isTop && (
                      <div className="absolute z-20 text-center px-4 w-full">
                        <span className="font-dancing text-[#2C241B] text-lg md:text-xl drop-shadow-sm leading-tight block truncate">
                          {cakeDetails.message}
                        </span>
                      </div>
                    )}
                 </div>

                 {/* Toppings on Top Edge */}
                 <div 
                    className="absolute top-0 w-full h-full pointer-events-none"
                    style={{ 
                        transform: isHeart ? `scale(${1 + index * 0.3})` : 'none',
                        marginTop: isHeart ? `${index * 20}px` : '0'
                    }}
                 >
                    {renderToppings(3 + index)} 
                 </div>
               </div>
             );
          })}
          
          {/* Cake Stand/Plate */}
          <div className="w-64 h-4 bg-gray-200 rounded-[50%] shadow-2xl mt-1 z-0 relative top-[-5px]"></div>
        </div>
      </div>
    );
  };

  const PizzaVisualizer = () => {
     // Config Mapping
     const sizeScale = {
       'Small (8")': 0.7,
       'Medium (12")': 0.85,
       'Large (16")': 1,
       'Party (20")': 1.15
     }[pizzaDetails.size] || 0.85;

     const crustColor = {
       'Thin Crust': '#eec07b',
       'Cheese Burst': '#f5d79b', // Thicker, lighter
       'Pan Pizza': '#d4a259',
       'Gluten Free': '#d8c0a4'
     }[pizzaDetails.crust] || '#eec07b';

     const crustWidth = pizzaDetails.crust === 'Cheese Burst' ? '16px' : '10px';

     const sauceColor = {
        'Classic Tomato': '#d32f2f',
        'Pesto Green': '#388e3c',
        'Creamy Alfredo': '#fff9c4'
     }[pizzaDetails.baseSauce] || '#d32f2f';

     const cheeseOpacity = {
       'None': 0,
       'Light': 0.4,
       'Regular': 0.75,
       'Extra': 0.92
     }[pizzaDetails.cheeseLevel] || 0.75;

     // Generate random but deterministic positions for toppings
     const renderedToppings = useMemo(() => {
        if (pizzaDetails.toppings.length === 0) return null;
        
        // Create 20 random slots
        return Array.from({ length: 20 }).map((_, i) => {
            const topping = pizzaDetails.toppings[i % pizzaDetails.toppings.length];
            const r = Math.sqrt(Math.random()) * 40; // Radius logic to keep inside circle
            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.cos(theta) + 50;
            const y = r * Math.sin(theta) + 50;
            const rot = Math.random() * 360;

            return (
                <div 
                  key={i} 
                  className="absolute text-xl md:text-2xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-sm"
                  style={{ top: `${y}%`, left: `${x}%`, rotate: `${rot}deg` }}
                >
                    <ToppingIcon name={topping} />
                </div>
            );
        });
     }, [pizzaDetails.toppings]);

     return (
        <div className="w-full h-full flex items-center justify-center p-4">
           <div 
             className="relative rounded-full shadow-2xl transition-all duration-500 overflow-hidden"
             style={{ 
               width: '320px', 
               height: '320px', 
               transform: `scale(${sizeScale})`,
               backgroundColor: crustColor,
               padding: crustWidth
             }}
           >
              {/* Inner Sauce Layer */}
              <div 
                className="w-full h-full rounded-full relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: sauceColor }}
              >
                  {/* Cheese Layer */}
                  <div 
                    className="absolute inset-0 bg-[#fffde7] transition-opacity duration-500"
                    style={{ opacity: cheeseOpacity }}
                  ></div>
                  
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stucco.png')]"></div>

                  {/* Toppings */}
                  <div className="absolute inset-0">
                      {renderedToppings}
                  </div>
              </div>
           </div>
        </div>
     );
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-background text-[var(--text)] selection:bg-[#D4AF37] selection:text-white
      ${playfair.variable} ${montserrat.variable} ${greatVibes.variable} ${cinzel.variable} ${lato.variable} ${dancingScript.variable}`}>
      
      {/* Header */}
      <header className="pt-12 pb-8 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold text-[var(--text)] mb-2 tracking-tight">
          The Artisan's Studio
        </h1>
        <p className="font-great-vibes text-2xl md:text-3xl text-[#8B7355] mt-2">
          Craft your perfect delight
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-12 px-4">
        <div className="flex bg-white p-1 rounded-full shadow-lg border border-[#E5E0D8]">
          <button
            onClick={() => setActivePanel('cake')}
            className={`px-8 py-3 rounded-full text-sm md:text-base font-cinzel font-bold tracking-widest transition-all duration-300 ${
              activePanel === 'cake' 
                ? 'bg-[#2C241B] text-[#D4AF37] shadow-md' 
                : 'text-[#8B7355] hover:bg-[#F5F5F0]'
            }`}
          >
            CAKE
          </button>
          <button
            onClick={() => setActivePanel('pizza')}
            className={`px-8 py-3 rounded-full text-sm md:text-base font-cinzel font-bold tracking-widest transition-all duration-300 ${
              activePanel === 'pizza' 
                ? 'bg-[#2C241B] text-[#D4AF37] shadow-md' 
                : 'text-[#8B7355] hover:bg-[#F5F5F0]'
            }`}
          >
            PIZZA
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: VISUALIZER */}
        <div className="lg:col-span-5 sticky top-8 z-10">
          <div className="bg-background rounded-[2rem] shadow-2xl overflow-hidden border border-[#E5E0D8] relative h-[500px] flex flex-col items-center justify-center transition-all duration-500">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            {/* Dynamic Rendering Area */}
            <div className="w-full h-full overflow-hidden relative">
               {activePanel === 'cake' ? <CakeVisualizer /> : <PizzaVisualizer />}
            </div>

            {/* Legend/Info Overlay */}
            <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-sm border-t border-[#E5E0D8] p-4 flex justify-between items-center text-xs md:text-sm font-montserrat text-gray-500">
                <span>{activePanel === 'cake' ? `${cakeDetails.tiers} Tier ${cakeDetails.shape}` : `${pizzaDetails.size} Pizza`}</span>
                <span className="uppercase tracking-widest font-bold text-[#D4AF37]">Live Preview</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CONTROLS */}
        <div className="lg:col-span-7">
          <div className="bg-background rounded-[2rem] shadow-xl border border-[#E5E0D8] overflow-hidden">
            <div className="p-8 md:p-10">
              
              {activePanel === 'cake' ? (
                // --- CAKE FORM ---
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <h2 className="font-cinzel text-2xl text-[var(--text)] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
                      Cake Configuration
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Flavor */}
                    <div className="space-y-2">
                      <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Flavor Profile</label>
                      <div className="relative">
                        <select 
                          value={cakeDetails.flavor}
                          onChange={(e) => setCakeDetails({...cakeDetails, flavor: e.target.value})}
                          className="w-full bg-[#FDFBF7] border border-[#E5E0D8] text-[#2C241B] py-3 px-4 rounded-lg font-montserrat focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] appearance-none"
                        >
                          {['Vanilla Bean', 'Dark Belgian Chocolate', 'Red Velvet', 'Lemon Zest', 'Salted Caramel'].map(o => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Shape */}
                    <div className="space-y-2">
                      <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Geometry</label>
                      <div className="flex gap-2">
                        {['Round', 'Square', 'Heart'].map(shape => (
                          <button
                            key={shape}
                            onClick={() => setCakeDetails({...cakeDetails, shape})}
                            className={`flex-1 py-3 px-2 rounded-lg font-montserrat text-sm transition-all border ${
                              cakeDetails.shape === shape 
                              ? 'bg-[#2C241B] text-[#D4AF37] border-[#2C241B]' 
                              : 'bg-white text-gray-600 border-[#E5E0D8] hover:border-[#D4AF37]'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tiers & Frosting */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Tiers</label>
                        <div className="flex items-center bg-[#FDFBF7] rounded-lg border border-[#E5E0D8] p-1">
                          {[1, 2, 3].map(tier => (
                            <button
                              key={tier}
                              onClick={() => setCakeDetails({...cakeDetails, tiers: tier})}
                              className={`flex-1 py-2 rounded-md font-playfair font-bold text-lg transition-all ${
                                cakeDetails.tiers === tier
                                ? 'bg-white shadow-sm text-[#D4AF37]' 
                                : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {tier}
                            </button>
                          ))}
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Frosting Color</label>
                        <div className="flex gap-3 pt-2">
                          {['#fce4ec', '#ffffff', '#e3f2fd', '#fff3e0', '#3e2723', '#ef9a9a', '#ce93d8'].map(color => (
                            <button
                              key={color}
                              onClick={() => setCakeDetails({...cakeDetails, frostingColor: color})}
                              className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                                cakeDetails.frostingColor === color ? 'border-[#D4AF37] ring-2 ring-offset-2 ring-[#D4AF37]/30' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                     </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Inscription</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Happy Birthday!"
                      value={cakeDetails.message}
                      onChange={(e) => setCakeDetails({...cakeDetails, message: e.target.value})}
                      maxLength={25}
                      className="w-full bg-[#FDFBF7] border-b-2 border-[#E5E0D8] text-[#2C241B] py-3 px-4 font-dancing text-xl focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-300 placeholder:font-lato placeholder:text-base"
                    />
                  </div>

                  {/* Toppings Checklist */}
                  <div className="space-y-3">
                    <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Embellishments</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Fresh Berries', 'Gold Leaf', 'Macarons', 'Flowers', 'Sprinkles', 'Choco Drip'].map(item => (
                        <button
                          key={item}
                          onClick={() => toggleSelection(cakeDetails.toppings, item, (t) => setCakeDetails({...cakeDetails, toppings: t}))}
                          className={`py-2 px-3 rounded text-sm font-montserrat text-left flex items-center justify-between group transition-all ${
                            cakeDetails.toppings.includes(item)
                            ? 'bg-[#2C241B] text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {item}
                          {cakeDetails.toppings.includes(item) && <Check className="w-3 h-3 text-[#D4AF37]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                // --- PIZZA FORM ---
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <h2 className="font-cinzel text-2xl text-[#2C241B] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
                      Pizza Customization
                    </h2>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Size */}
                    <div className="space-y-2">
                      <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Diameter</label>
                      <select 
                        value={pizzaDetails.size}
                        onChange={(e) => setPizzaDetails({...pizzaDetails, size: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-[#E5E0D8] text-[#2C241B] py-3 px-4 rounded-lg font-montserrat focus:outline-none focus:border-[#D4AF37]"
                      >
                        {['Small (8")', 'Medium (12")', 'Large (16")', 'Party (20")'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Crust */}
                    <div className="space-y-2">
                      <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Crust Type</label>
                      <select 
                        value={pizzaDetails.crust}
                        onChange={(e) => setPizzaDetails({...pizzaDetails, crust: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-[#E5E0D8] text-[#2C241B] py-3 px-4 rounded-lg font-montserrat focus:outline-none focus:border-[#D4AF37]"
                      >
                        {['Thin Crust', 'Cheese Burst', 'Pan Pizza', 'Gluten Free'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Sauce & Cheese */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Base Sauce</label>
                        <div className="flex flex-col gap-2">
                          {['Classic Tomato', 'Pesto Green', 'Creamy Alfredo'].map(sauce => (
                             <label key={sauce} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${pizzaDetails.baseSauce === sauce ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                                   {pizzaDetails.baseSauce === sauce && <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>}
                                </div>
                                <input 
                                  type="radio" 
                                  name="sauce" 
                                  className="hidden" 
                                  checked={pizzaDetails.baseSauce === sauce} 
                                  onChange={() => setPizzaDetails({...pizzaDetails, baseSauce: sauce})} 
                                />
                                <span className={`font-montserrat text-sm ${pizzaDetails.baseSauce === sauce ? 'text-[#2C241B] font-semibold' : 'text-gray-500 group-hover:text-[#D4AF37]'}`}>{sauce}</span>
                             </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Cheese Level</label>
                        <input 
                           type="range" 
                           min="0" max="3" step="1" 
                           value={['None', 'Light', 'Regular', 'Extra'].indexOf(pizzaDetails.cheeseLevel)}
                           onChange={(e) => setPizzaDetails({...pizzaDetails, cheeseLevel: ['None', 'Light', 'Regular', 'Extra'][parseInt(e.target.value)]})}
                           className="w-full accent-[#D4AF37] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-lato text-gray-400 mt-1 uppercase tracking-wider">
                           <span>None</span><span>Light</span><span>Regular</span><span>Extra</span>
                        </div>
                      </div>
                   </div>

                   {/* Toppings Grid */}
                   <div className="space-y-3">
                    <label className="font-lato text-xs font-bold uppercase tracking-widest text-gray-500">Toppings (Veg & Non-Veg)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['Olives', 'Mushrooms', 'Bell Peppers', 'Onions', 'Pepperoni', 'Chicken BBQ', 'Basil', 'Jalapenos', 'Pineapple'].map(item => (
                        <button
                          key={item}
                          onClick={() => toggleSelection(pizzaDetails.toppings, item, (t) => setPizzaDetails({...pizzaDetails, toppings: t}))}
                          className={`py-2 px-3 rounded text-sm font-montserrat flex items-center justify-between transition-all border ${
                            pizzaDetails.toppings.includes(item)
                            ? 'bg-[#2C241B] text-[#D4AF37] border-[#2C241B]'
                            : 'bg-white text-gray-600 border-[#E5E0D8] hover:border-[#D4AF37]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ACTION AREA */}
              <div className="mt-12 pt-8 border-t border-[#E5E0D8] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="font-playfair text-lg text-[#2C241B]">Ready to taste perfection?</p>
                  <p className="font-lato text-sm text-gray-500">Your details will be attached automatically.</p>
                </div>
                
                <button
                  onClick={handleContactRedirect}
                  className="group relative px-8 py-4 bg-[#2C241B] text-white overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 w-full md:w-auto"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-cinzel font-bold tracking-widest">Send Inquiry via WhatsApp</span>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}