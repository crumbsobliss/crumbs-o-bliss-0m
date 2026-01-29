'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChefHat, 
  Cake, 
  Pizza, 
  Utensils, 
  Send, 
  User, 
  Phone, 
  MapPin, 
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

// --- Types ---
type Category = 'cake' | 'pizza' | 'other' | null;

interface CustomFormData {
  // Product Specifics
  category: Category;
  flavor?: string;
  weight?: string;
  isEggless?: boolean;
  messageOnCake?: string;
  pizzaSize?: string;
  pizzaCrust?: string;
  toppings?: string;
  description?: string; // For 'other'
  
  // User Details
  name: string;
  mobile: string;
  address: string;
  pincode: string;
}

export default function CustomizationPage() {
  // --- State ---
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
    pizzaCrust: 'Thin Crust'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data on mount
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

  // --- Handlers ---
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category }));
    setStep(2); // Move to details form
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleEggless = () => {
    setFormData(prev => ({ ...prev, isEggless: !prev.isEggless }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Save User Details
    const userDetails = {
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      pincode: formData.pincode
    };
    localStorage.setItem('bakery_user_info', JSON.stringify(userDetails));

    // 2. Construct WhatsApp Message
    const phoneNumber = '919593035680'; 
    let detailsText = '';

    if (selectedCategory === 'cake') {
      detailsText = `
*Type:* 🎂 Custom Cake
*Flavor:* ${formData.flavor || 'N/A'}
*Weight:* ${formData.weight || 'N/A'}
*Eggless:* ${formData.isEggless ? 'Yes' : 'No'}
*Message on Cake:* ${formData.messageOnCake || 'None'}
      `;
    } else if (selectedCategory === 'pizza') {
      detailsText = `
*Type:* 🍕 Custom Pizza
*Size:* ${formData.pizzaSize}
*Crust:* ${formData.pizzaCrust}
*Toppings/Preferences:* ${formData.toppings || 'None'}
      `;
    } else {
      detailsText = `
*Type:* 🍽️ Special Request
*Description:* ${formData.description || 'N/A'}
      `;
    }

    const finalMessage = `
*New Custom Order Request* ✨

${detailsText.trim()}

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.mobile}
Address: ${formData.address} (${formData.pincode})
    `.trim();

    // 3. Redirect
    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`, '_blank');
      setIsSubmitting(false);
    }, 1000);
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-20 font-sans">
      
      {/* --- Header / Hero --- */}
      <div className="relative py-12 md:py-20 bg-[var(--card)] border-b border-[var(--border)] overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--secondary)] rounded-full mb-6">
               <Sparkles className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-[var(--primary)] mb-4">
              The Custom Studio
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto font-serif italic">
              "If you can dream it, we can bake it. Design your perfect treat."
            </p>
         </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {/* --- Back Button (Only on Step 2) --- */}
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="mb-6 flex items-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </button>
        )}

        <AnimatePresence mode="wait">
          
          {/* --- STEP 1: CATEGORY SELECTION --- */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Cake Option */}
                <motion.button
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelect('cake')}
                  className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] flex flex-col items-center text-center group transition-all"
                >
                  <div className="w-24 h-24 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Cake className="w-12 h-12 text-pink-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Custom Cake</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">Birthday, Wedding, or just a sweet craving. Pick flavors, designs & more.</p>
                </motion.button>

                {/* Pizza Option */}
                <motion.button
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelect('pizza')}
                  className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] flex flex-col items-center text-center group transition-all"
                >
                  <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Pizza className="w-12 h-12 text-orange-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Build a Pizza</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">Choose your crust, sauce, and load it up with your favorite toppings.</p>
                </motion.button>

                {/* Other Option */}
                <motion.button
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelect('other')}
                  className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] flex flex-col items-center text-center group transition-all"
                >
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Utensils className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Something Else</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">Pastries, Breads, or bulk orders? Tell us what you need.</p>
                </motion.button>

              </div>
            </motion.div>
          )}

          {/* --- STEP 2: DETAILS FORM --- */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-3xl mx-auto bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden"
            >
              <div className="bg-[var(--secondary)]/50 p-6 border-b border-[var(--border)] flex items-center gap-3">
                 <ChefHat className="w-6 h-6 text-[var(--primary)]" />
                 <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
                   Customize your {selectedCategory === 'cake' ? 'Cake' : selectedCategory === 'pizza' ? 'Pizza' : 'Order'}
                 </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                {/* Product Specific Section */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">Product Details</h3>
                  
                  {/* CAKE FIELDS */}
                  {selectedCategory === 'cake' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Flavor Preference</label>
                         <input 
                           name="flavor"
                           required
                           placeholder="e.g. Chocolate Truffle, Red Velvet" 
                           className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                           onChange={handleInputChange}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Weight (approx)</label>
                         <select 
                           name="weight"
                           className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                           onChange={handleInputChange}
                         >
                            <option value="0.5kg">0.5 kg</option>
                            <option value="1kg">1.0 kg</option>
                            <option value="1.5kg">1.5 kg</option>
                            <option value="2kg+">2.0 kg+</option>
                         </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-sm font-medium">Message on Cake</label>
                         <input 
                           name="messageOnCake"
                           placeholder="e.g. Happy Birthday Rahul!" 
                           className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                           onChange={handleInputChange}
                         />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-6 h-6 rounded-md border border-[var(--border)] flex items-center justify-center transition-colors ${formData.isEggless ? 'bg-green-500 border-green-500' : 'bg-[var(--background)]'}`}>
                             {formData.isEggless && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" onChange={handleToggleEggless} checked={formData.isEggless} />
                          <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">I prefer an Eggless cake</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* PIZZA FIELDS */}
                  {selectedCategory === 'pizza' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Size</label>
                           <select 
                             name="pizzaSize"
                             className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                             onChange={handleInputChange}
                           >
                              <option value="Regular">Regular (8")</option>
                              <option value="Medium">Medium (10")</option>
                              <option value="Large">Large (12")</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Crust Type</label>
                           <select 
                             name="pizzaCrust"
                             className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                             onChange={handleInputChange}
                           >
                              <option value="Thin Crust">Thin Crust</option>
                              <option value="Pan Pizza">Pan Pizza (Thick)</option>
                              <option value="Cheese Burst">Cheese Burst (+₹50)</option>
                           </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-medium">Toppings & Preferences</label>
                           <textarea 
                             name="toppings"
                             rows={3}
                             placeholder="e.g. Extra cheese, no onions, add jalapeños..." 
                             className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
                             onChange={handleInputChange}
                           />
                        </div>
                     </div>
                  )}

                  {/* OTHER FIELDS */}
                  {selectedCategory === 'other' && (
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Describe your request</label>
                           <textarea 
                             name="description"
                             required
                             rows={5}
                             placeholder="Tell us exactly what you need. E.g. A box of 12 mixed cupcakes for a corporate event..." 
                             className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
                             onChange={handleInputChange}
                           />
                        </div>
                     </div>
                  )}
                </div>

                {/* Personal Details Section */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">Contact Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 relative">
                         <label className="text-sm font-medium">Your Name</label>
                         <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                            <input 
                              name="name"
                              required
                              value={formData.name}
                              placeholder="Full Name" 
                              className="w-full pl-10 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                              onChange={handleInputChange}
                            />
                         </div>
                      </div>
                      <div className="space-y-2 relative">
                         <label className="text-sm font-medium">Mobile Number</label>
                         <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                            <input 
                              name="mobile"
                              required
                              type="tel"
                              pattern="[0-9]{10}"
                              value={formData.mobile}
                              placeholder="10-digit Number" 
                              className="w-full pl-10 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                              onChange={handleInputChange}
                            />
                         </div>
                      </div>
                      <div className="space-y-2 md:col-span-2 relative">
                         <label className="text-sm font-medium">Delivery Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--muted-foreground)]" />
                            <textarea 
                              name="address"
                              required
                              rows={2}
                              value={formData.address}
                              placeholder="House No, Street, Landmark..." 
                              className="w-full pl-10 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
                              onChange={handleInputChange}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Pincode</label>
                         <input 
                              name="pincode"
                              required
                              type="text"
                              pattern="[0-9]{6}"
                              value={formData.pincode}
                              placeholder="6-digit PIN" 
                              className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                              onChange={handleInputChange}
                            />
                      </div>
                   </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Request via WhatsApp
                      </>
                    )}
                  </motion.button>
                  <p className="text-center text-xs text-[var(--muted-foreground)] mt-4">
                    Clicking send will open WhatsApp with your pre-filled order details.
                  </p>
                </div>

              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}