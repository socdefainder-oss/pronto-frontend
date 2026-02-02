"use client";

import { CartProvider } from "@/app/lib/CartContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
