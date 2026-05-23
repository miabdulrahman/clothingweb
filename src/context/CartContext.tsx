'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('auren_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('auren_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItemKey = `${product.id}-${size}-${color}`;
      const existingItemIdx = prevCart.findIndex((item) => item.id === existingItemKey);

      if (existingItemIdx > -1) {
        // Update quantity of existing item
        const newCart = [...prevCart];
        newCart[existingItemIdx] = {
          ...newCart[existingItemIdx],
          quantity: newCart[existingItemIdx].quantity + quantity,
        };
        return newCart;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: existingItemKey,
          productId: product.id,
          title: product.title,
          price: product.price,
          currency: product.currency || 'LKR',
          selectedSize: size,
          selectedColor: color,
          quantity,
          image: product.images[0] || '',
        };
        return [...prevCart, newItem];
      }
    });
    setCartOpen(true); // Automatically open the cart drawer when an item is added
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
