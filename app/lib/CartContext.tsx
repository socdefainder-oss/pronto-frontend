"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  lineId: string;
  productId: string;
  productName: string;
  priceCents: number;
  quantity: number;
  selectedOptionIds?: string[];
  selectedOptions?: Array<{
    id: string;
    name: string;
    priceCents: number;
    groupTitle?: string;
  }>;
}

interface CartContextData {
  cart: CartItem[];
  addToCart: (
    product: any,
    quantity?: number,
    selectedOptions?: Array<{
      id: string;
      name: string;
      priceCents: number;
      groupTitle?: string;
    }>
  ) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pronto_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("pronto_cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("pronto_cart");
    }
  }, [cart]);

  const addToCart = (
    product: any,
    quantity = 1,
    selectedOptions: Array<{
      id: string;
      name: string;
      priceCents: number;
      groupTitle?: string;
    }> = []
  ) => {
    if (quantity <= 0) return;

    const selectedOptionIds = selectedOptions.map((option) => option.id).sort();
    const lineId = selectedOptionIds.length > 0
      ? `${product.id}::${selectedOptionIds.join(",")}`
      : product.id;

    const extraPriceCents = selectedOptions.reduce((sum, option) => sum + option.priceCents, 0);
    const unitPriceCents = product.priceCents + extraPriceCents;

    setCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        lineId,
        productId: product.id,
        productName: product.name,
        priceCents: unitPriceCents,
        quantity,
        selectedOptionIds,
        selectedOptions,
      }];
    });
  };

  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pronto_cart");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
