"use client";

import { CartProvider } from "@/app/lib/CartContext";
import AsaasSeal from "@/app/components/AsaasSeal";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
            <AsaasSeal variant="positive" />
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
