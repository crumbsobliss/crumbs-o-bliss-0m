"use client";

import React, { useState, useEffect } from "react";
import { items as initialItems, BakeryItem } from "@/lib/items";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Save, 
  X, 
  ChevronRight, 
  Lock, 
  User, 
  Eye, 
  Copy, 
  CheckCircle2,
  Package,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<BakeryItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<BakeryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [copied, setCopied] = useState(false);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  // Delete handler
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Edit handler
  const handleEdit = (item: BakeryItem) => {
    setEditingItem({ ...item });
    setIsAddingNew(false);
  };

  // Save handler (Update or Add)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isAddingNew) {
      setItems([...items, editingItem]);
    } else {
      setItems(items.map((item) => (item.id === editingItem.id ? editingItem : item)));
    }
    setEditingItem(null);
    setIsAddingNew(false);
  };

  // New item template
  const handleAddNew = () => {
    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setEditingItem({
      id: nextId,
      slug: "",
      name: { en: "", bn: "" },
      description: { en: "", bn: "" },
      price: 0,
      currency: "INR",
      ingredients: [],
      weight: 0,
      image: "/assets/products/",
      tags: [],
    });
    setIsAddingNew(true);
  };

  // Copy JSON handler
  const copyToClipboard = () => {
    const jsonStr = `export interface BakeryItem {
  id: number;
  slug: string;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  price: number;
  currency: "INR";
  ingredients: string[];
  weight: number;
  image: string;
  tags: string[];
}

export const items: BakeryItem[] = ${JSON.stringify(items, null, 2)};`;
    
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f1f1b] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#1a2e29]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Please sign in to manage your bakery</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4F600] w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4F600]/50 transition-all font-mono"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4F600] w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4F600]/50 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4F600] text-black font-bold py-3 rounded-xl hover:bg-[#e6ff4d] transition-all transform active:scale-95 shadow-[0_0_20px_rgba(212,246,0,0.2)]"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1f1b] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center text-[#D4F600] mb-4 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Link>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Package className="text-[#D4F600]" /> Bakery Inventory
            </h1>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-[#D4F600] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e6ff4d] transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Item
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="bg-[#1a2e29] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#D4F600]/30 transition-all shadow-lg"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name.en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-[#D4F600] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#D4F600] text-black text-xs font-bold px-2 py-1 rounded">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">{item.name.en}</h3>
                  <p className="text-[#D4F600] text-sm mb-3 font-medium">{item.name.bn}</p>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {item.description.en}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded-full text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Edit Modal (Overlaid) */}
        <AnimatePresence>
          {editingItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1a2e29] border border-white/10 w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">
                    {isAddingNew ? "Add New Item" : "Edit Item"}
                  </h2>
                  <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="col-span-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug</label>
                      <input
                        type="text"
                        required
                        value={editingItem.slug}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name (English)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name.en}
                        onChange={(e) => setEditingItem({ ...editingItem, name: { ...editingItem.name, en: e.target.value } })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name (Bengali)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name.bn}
                        onChange={(e) => setEditingItem({ ...editingItem, name: { ...editingItem.name, bn: e.target.value } })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-[#D4F600] focus:ring-2 focus:ring-[#D4F600]/50 outline-none"
                      />
                    </div>
                  </div>

                  {/* Pricing and Details */}
                  <div className="col-span-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight (g)</label>
                        <input
                          type="number"
                          required
                          value={editingItem.weight}
                          onChange={(e) => setEditingItem({ ...editingItem, weight: Number(e.target.value) })}
                          className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image Path</label>
                      <input
                        type="text"
                        required
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={editingItem.tags.join(", ")}
                        onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none h-[46px]"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="col-span-full space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description (English)</label>
                      <textarea
                        required
                        value={editingItem.description.en}
                        onChange={(e) => setEditingItem({ ...editingItem, description: { ...editingItem.description, en: e.target.value } })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description (Bengali)</label>
                      <textarea
                        required
                        value={editingItem.description.bn}
                        onChange={(e) => setEditingItem({ ...editingItem, description: { ...editingItem.description, bn: e.target.value } })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ingredients (comma separated)</label>
                      <input
                        type="text"
                        value={editingItem.ingredients.join(", ")}
                        onChange={(e) => setEditingItem({ ...editingItem, ingredients: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
                        className="w-full bg-[#0f1f1b] border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D4F600]/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-full pt-4">
                    <button
                      type="submit"
                      className="w-full bg-[#D4F600] text-black font-bold py-4 rounded-xl hover:bg-[#e6ff4d] transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Save Item Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* JSON Export Section */}
        <section className="mt-20 border-t border-white/10 pt-12 mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Export Code</h2>
              <p className="text-gray-400 text-sm">Copy this JSON and paste it back into your lib/items.ts file</p>
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                copied ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy Full Code"}
            </button>
          </div>
          
          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 relative group">
            <pre className="text-sm font-mono text-gray-300 overflow-x-auto custom-scrollbar leading-relaxed">
              {`export interface BakeryItem {
  id: number;
  slug: string;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  price: number;
  currency: "INR";
  ingredients: string[];
  weight: number;
  image: string;
  tags: string[];
}

export const items: BakeryItem[] = ${JSON.stringify(items, null, 2)};`}
            </pre>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f1f1b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a2e29;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a3e39;
        }
      `}</style>
    </div>
  );
}
