'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { BakeryItem } from './items'

export interface CartItem {
  item: BakeryItem
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: BakeryItem, quantity: number) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('bakery_cart')
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart)
        setItems(parsed)
      } catch (e) {
        console.error('Failed to parse cart data')
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bakery_cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: BakeryItem, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((ci) => ci.item.id === item.id)
      if (existingItem) {
        return prevItems.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        )
      }
      return [...prevItems, { item, quantity }]
    })
  }

  const removeItem = (itemId: number) => {
    setItems((prevItems) => prevItems.filter((ci) => ci.item.id !== itemId))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
    } else {
      setItems((prevItems) =>
        prevItems.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity } : ci
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((total, ci) => total + ci.item.price * ci.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, ci) => count + ci.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
