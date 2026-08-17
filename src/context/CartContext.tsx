"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  originalPrice?: number;
  offerPrice?: number;
  isOffer?: boolean;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalCount: 0,
  subtotal: 0,
  discountTotal: 0,
  grandTotal: 0,
  totalPrice: 0,
});

const CART_STORAGE_KEY = "ceylon_curry_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Omit<CartItem, "quantity">, qty: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { ...product, quantity: qty }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal calculated at original price
  const subtotal = cart.reduce((sum, item) => {
    const itemOriginalPrice = item.originalPrice || item.price;
    return sum + itemOriginalPrice * item.quantity;
  }, 0);

  // Discount total calculated from offer prices
  const discountTotal = cart.reduce((sum, item) => {
    if (item.isOffer && item.offerPrice && item.originalPrice) {
      return sum + (item.originalPrice - item.offerPrice) * item.quantity;
    }
    return sum;
  }, 0);

  const grandTotal = subtotal - discountTotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discountTotal,
        grandTotal,
        totalPrice: grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
