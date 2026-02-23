'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, ChefHat, Cake, Pizza, Utensils, Flower, 
  Send, User, Phone, MapPin, Sparkles, CheckCircle2, 
  Lightbulb, Package
} from 'lucide-react';
import details from '@/config/details.json'
import Image from 'next/image';

type Category = 'cake' | 'pizza' | 'flower' | 'other' | 'catalogue' | null;

interface CustomFormData {
  category: Category;
  flavor?: string;
  weight?: string;
  isEggless?: boolean;
  messageOnCake?: string;
  pizzaSize?: string;
  pizzaCrust?: string;
  toppings?: string;
  description?: string;
  flowerPackage?: string;
  addLights?: boolean;
  addNameTag?: boolean;
  nameTagText?: string;
  selectedCatalogueId?: string;
  selectedCatalogueName?: string;
  name: string;
  mobile: string;
  address: string;
  pincode: string;
}

export default function CustomizationClient({ catalogues }: { catalogues: any[] }) {
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [formData, setFormData] = useState<CustomFormData>({
    category: null,
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    isEggless: false,
    pizzaSize: 'Medium',
    pizzaCrust: 'Thin Crust',
    flowerPackage: '3 Roses (₹165)',
    addLights: false,
    addNameTag: false,
    nameTagText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('bakery_user_info');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || '',
          mobile: parsed.mobile || '',
          address: parsed.address || '',
          pincode: parsed.pincode || ''
        }));
      } catch (e) {
        console.error("Failed to load user info");
      }
    }
  }, []);

  const handleCategorySelect = (category: Category, catMeta?: any) => {
    setSelectedCategory(category);
    setFormData(prev => ({ 
        ...prev, 
        category,
        ...(catMeta?.id && { selectedCatalogueId: catMeta.id, selectedCatalogueName: catMeta.name })
    }));
    setStep(2); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleEggless = () => setFormData(prev => ({ ...prev, isEggless: !prev.isEggless }));
  const handleToggleLights = () => setFormData(prev => ({ ...prev, addLights: !prev.addLights }));
  const handleToggleNameTag = () => setFormData(prev => ({ ...prev, addNameTag: !prev.addNameTag }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userDetails = {
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      pincode: formData.pincode
    };
    localStorage.setItem('bakery_user_info', JSON.stringify(userDetails));

    const phoneNumber = details.contact.primaryPhone; 
    let detailsText = '';

    if (selectedCategory === 'cake') {
      detailsText = `*Type:* 🎂 Custom Cake\n*Flavor:* ${formData.flavor || 'N/A'}\n*Weight:* ${formData.weight || '0.5kg'}\n*Eggless:* ${formData.isEggless ? 'Yes' : 'No'}\n*Message on Cake:* ${formData.messageOnCake || 'None'}`;
    } else if (selectedCategory === 'pizza') {
      detailsText = `*Type:* 🍕 Custom Pizza\n*Size:* ${formData.pizzaSize}\n*Crust:* ${formData.pizzaCrust}\n*Toppings/Preferences:* ${formData.toppings || 'None'}`;
    } else if (selectedCategory === 'flower') {
      detailsText = `*Type:* 💐 Faux Flower Bouquet\n*Package:* ${formData.flowerPackage}\n*Add-ons:*\n${formData.addLights ? '• ✨ LED Lights (+₹80)' : ''}\n${formData.addNameTag ? `• ✍️ Name Tag (+₹20): ${formData.nameTagText}` : ''}\n${!formData.addLights && !formData.addNameTag ? 'None' : ''}`;
    } else if (selectedCategory === 'catalogue') {
      detailsText = `*Type:* 🎁 Custom Package\n*Package:* ${formData.selectedCatalogueName}\n*Extra Notes:* ${formData.description || 'None'}`;
    } else {
      detailsText = `*Type:* 🍽️ Special Request\n*Description:* ${formData.description || 'N/A'}`;
    }

    const finalMessage = `*New Order Request* ✨\n\n${detailsText.trim()}\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.mobile}\nAddress: ${formData.address} (${formData.pincode})`.trim();

    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`, '_blank');
      setIsSubmitting(false);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const selectedCatalogueData = catalogues.find(c => c.id === formData.selectedCatalogueId);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="relative py-12 md:py-20 bg-card border-b border-border overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6">
               <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4">
              The Custom Studio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-serif italic">
              "If you can dream it, we can create it. Design your perfect treat or choose a special package."
            </p>
         </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="mb-6 flex items-center text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-6xl mx-auto space-y-12">
              
              {/* Build from Scratch Options */}
              <div>
                <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2"><ChefHat className="w-5 h-5 text-primary"/> Build From Scratch</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Cards */}
                  <motion.button whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => handleCategorySelect('cake')} className="bg-card p-8 rounded-2xl border flex flex-col items-center text-center group transition-all shadow-sm hover:shadow-xl">
                    <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-6"><Cake className="w-10 h-10 text-pink-500" /></div>
                    <h3 className="font-serif text-xl font-bold mb-2">Custom Cake</h3>
                    <p className="text-muted-foreground text-sm">Flavors, weights & designs.</p>
                  </motion.button>
                  <motion.button whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => handleCategorySelect('pizza')} className="bg-card p-8 rounded-2xl border flex flex-col items-center text-center group transition-all shadow-sm hover:shadow-xl">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6"><Pizza className="w-10 h-10 text-orange-500" /></div>
                    <h3 className="font-serif text-xl font-bold mb-2">Build a Pizza</h3>
                    <p className="text-muted-foreground text-sm">Crusts, sauces & toppings.</p>
                  </motion.button>
                  <motion.button whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => handleCategorySelect('flower')} className="bg-card p-8 rounded-2xl border flex flex-col items-center text-center group transition-all shadow-sm hover:shadow-xl">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6"><Flower className="w-10 h-10 text-red-500" /></div>
                    <h3 className="font-serif text-xl font-bold mb-2">Faux Flowers</h3>
                    <p className="text-muted-foreground text-sm">Real-touch roses & bundles.</p>
                  </motion.button>
                  <motion.button whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => handleCategorySelect('other')} className="bg-card p-8 rounded-2xl border flex flex-col items-center text-center group transition-all shadow-sm hover:shadow-xl">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6"><Utensils className="w-10 h-10 text-blue-500" /></div>
                    <h3 className="font-serif text-xl font-bold mb-2">Something Else</h3>
                    <p className="text-muted-foreground text-sm">Pastries, bulk orders & more.</p>
                  </motion.button>
                </div>
              </div>

              {/* Special Packages / Custom Catalogues */}
              {catalogues.length > 0 && (
                 <div>
                    <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2 pt-8 border-t"><Sparkles className="w-5 h-5 text-primary"/> Special Packages & Combos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {catalogues.map(cat => (
                         <motion.div key={cat.id} whileHover={{ y: -3 }} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col cursor-pointer" onClick={() => handleCategorySelect('catalogue', cat)}>
                            <div className="relative h-48 bg-muted">
                               <Image src={cat.image_url || '/assets/placeholder.jpg'} alt={cat.name} fill className="object-cover" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                  <h3 className="font-serif text-2xl font-bold text-white">{cat.name}</h3>
                               </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                               <p className="text-muted-foreground text-sm flex-grow line-clamp-3 mb-4">{cat.description}</p>
                               <div className="text-xs uppercase tracking-widest font-bold text-primary flex items-center justify-between">
                                  <span>{cat.catalogue_items?.length || 0} Items</span>
                                  <span className="flex items-center gap-1 group-hover:underline">Customize <ArrowRight className="w-3 h-3" /></span>
                               </div>
                            </div>
                         </motion.div>
                       ))}
                    </div>
                 </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl border overflow-hidden">
              <div className="bg-secondary/50 p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-3">
                 <div className="flex items-center gap-3">
                     <ChefHat className="w-6 h-6 text-primary" />
                     <h2 className="font-serif text-xl font-bold text-foreground">
                        Customize your {
                           selectedCategory === 'cake' ? 'Cake' : 
                           selectedCategory === 'pizza' ? 'Pizza' : 
                           selectedCategory === 'flower' ? 'Bouquet' : 
                           selectedCategory === 'catalogue' ? 'Package' : 'Order'
                        }
                     </h2>
                 </div>
                 {selectedCategory === 'catalogue' && selectedCatalogueData && (
                     <span className="text-sm font-medium px-3 py-1 bg-primary/20 text-primary rounded-full">{selectedCatalogueData.name}</span>
                 )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Product Details</h3>
                  
                  {selectedCategory === 'cake' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-sm font-medium">Flavor Preference</label><input name="flavor" required placeholder="e.g. Chocolate Truffle" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}/></div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Weight (approx)</label>
                         <select name="weight" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}>
                            <option value="0.5kg">0.5 kg</option><option value="1kg">1.0 kg</option><option value="1.5kg">1.5 kg</option><option value="2kg+">2.0 kg+</option>
                         </select>
                      </div>
                      <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium">Message on Cake</label><input name="messageOnCake" placeholder="e.g. Happy Birthday Rahul!" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}/></div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${formData.isEggless ? 'bg-green-500 border-green-500' : 'bg-background'}`}>{formData.isEggless && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
                          <input type="checkbox" className="hidden" onChange={handleToggleEggless} checked={formData.isEggless} />
                          <span className="text-sm font-medium group-hover:text-primary">I prefer an Eggless cake</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'pizza' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-sm font-medium">Size</label><select name="pizzaSize" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}><option value="Regular">Regular (8")</option><option value="Medium">Medium (10")</option><option value="Large">Large (12")</option></select></div>
                        <div className="space-y-2"><label className="text-sm font-medium">Crust Type</label><select name="pizzaCrust" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}><option value="Thin Crust">Thin Crust</option><option value="Pan Pizza">Pan Pizza (Thick)</option><option value="Cheese Burst">Cheese Burst (+₹50)</option></select></div>
                        <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium">Toppings & Preferences</label><textarea name="toppings" rows={3} placeholder="e.g. Extra cheese, no onions..." className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none resize-none" onChange={handleInputChange}/></div>
                     </div>
                  )}

                  {selectedCategory === 'flower' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-medium">Select Package</label>
                           <select name="flowerPackage" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange} value={formData.flowerPackage}>
                              <optgroup label="Standard Bunches"><option value="3 Roses (₹165)">3 Roses - ₹165</option><option value="6 Roses (₹280)">6 Roses - ₹280</option></optgroup>
                              <optgroup label="Premium Bundles (Includes Butterfly)"><option value="8 Roses + Butterfly (₹360)">8 Roses + Butterfly - ₹360</option><option value="12 Roses + Butterfly (₹480)">12 Roses + Butterfly - ₹480</option><option value="16 Roses + Butterfly (₹560)">16 Roses + Butterfly - ₹560</option></optgroup>
                           </select>
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-sm font-medium">Add-ons</label>
                          <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${formData.addLights ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-border'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${formData.addLights ? 'bg-yellow-400 text-white' : 'bg-muted'}`}><Lightbulb className="w-5 h-5" /></div>
                              <div className="flex flex-col"><span className="font-medium">Add LED Lights</span><span className="text-xs text-muted-foreground">Includes battery (+₹80)</span></div>
                            </div>
                            <input type="checkbox" className="hidden" onChange={handleToggleLights} checked={formData.addLights} />
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.addLights ? 'bg-yellow-400 border-yellow-400' : 'border-border'}`}>{formData.addLights && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
                          </label>
                          <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${formData.addNameTag ? 'border-primary bg-primary/10' : 'border-border'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${formData.addNameTag ? 'bg-primary text-white' : 'bg-muted'}`}><User className="w-5 h-5" /></div>
                              <div className="flex flex-col"><span className="font-medium">Add Personal Name Tag</span><span className="text-xs text-muted-foreground">Max 6 letters (+₹20)</span></div>
                            </div>
                            <input type="checkbox" className="hidden" onChange={handleToggleNameTag} checked={formData.addNameTag} />
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.addNameTag ? 'bg-primary border-primary' : 'border-border'}`}>{formData.addNameTag && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
                          </label>
                        </div>
                        <AnimatePresence>
                          {formData.addNameTag && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:col-span-2 overflow-hidden">
                              <div className="space-y-2"><label className="text-sm font-medium">Name on Tag</label><input name="nameTagText" placeholder="Enter Name (Max 6 letters)" maxLength={15} className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange} value={formData.nameTagText}/><p className="text-xs text-muted-foreground">*Names longer than 6 letters charged at ₹2 per extra character.</p></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                  )}

                  {selectedCategory === 'catalogue' && selectedCatalogueData && (
                     <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg">
                           <h4 className="font-bold mb-2">Package Items Included:</h4>
                           <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {selectedCatalogueData.catalogue_items?.map((item: any, i: number) => (
                                 <li key={i}>{item.products?.name} <span className="text-xs opacity-70">(₹{item.products?.price})</span></li>
                              ))}
                           </ul>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Any special notes or substitutions?</label>
                           <textarea name="description" rows={3} placeholder="E.g. No nuts in the cake, please wrap the box in red ribbon..." className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none resize-none" onChange={handleInputChange}/>
                        </div>
                     </div>
                  )}

                  {selectedCategory === 'other' && (
                     <div className="space-y-4">
                        <div className="space-y-2"><label className="text-sm font-medium">Describe your request</label><textarea name="description" required rows={5} placeholder="Tell us exactly what you need..." className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none resize-none" onChange={handleInputChange}/></div>
                     </div>
                  )}
                </div>

                <div className="space-y-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Contact Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 relative"><label className="text-sm font-medium">Your Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input name="name" required value={formData.name} placeholder="Full Name" className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}/></div></div>
                      <div className="space-y-2 relative"><label className="text-sm font-medium">Mobile Number</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input name="mobile" required type="tel" pattern="[0-9]{10}" value={formData.mobile} placeholder="10-digit Number" className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}/></div></div>
                      <div className="space-y-2 md:col-span-2 relative"><label className="text-sm font-medium">Delivery Address</label><div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><textarea name="address" required rows={2} value={formData.address} placeholder="House No, Street, Landmark..." className="w-full pl-10 p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none resize-none" onChange={handleInputChange}/></div></div>
                      <div className="space-y-2"><label className="text-sm font-medium">Pincode</label><input name="pincode" required type="text" pattern="[0-9]{6}" value={formData.pincode} placeholder="6-digit PIN" className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none" onChange={handleInputChange}/></div>
                   </div>
                </div>

                <div className="pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70">
                    {isSubmitting ? <span className="animate-pulse">Processing...</span> : <><Send className="w-5 h-5" /> Send Request via WhatsApp</>}
                  </motion.button>
                  <p className="text-center text-xs text-muted-foreground mt-4">Clicking send will open WhatsApp with your pre-filled order details.</p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
