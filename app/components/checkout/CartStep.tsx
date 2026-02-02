"use client";

import { useState } from "react";
import { useCart } from "@/app/lib/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

interface CartStepProps {
  onNext: () => void;
  restaurantId: string;
}

export default function CartStep({ onNext, restaurantId }: CartStepProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [notes, setNotes] = useState("");

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setValidatingCoupon(true);
    setCouponError("");
    
    try {
      const response = await fetch(`${API_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          restaurantId,
          orderValueCents: cartTotal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedCoupon(data);
        setCouponError("");
      } else {
        const error = await response.json();
        setCouponError(error.error || "Cupom inválido");
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError("Erro ao validar cupom");
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const discountCents = appliedCoupon?.discountCents || 0;
  const finalTotal = Math.max(0, cartTotal - discountCents);

  const handleNext = () => {
    if (cart.length === 0) {
      alert("Adicione itens ao carrinho");
      return;
    }
    
    sessionStorage.setItem("checkout_coupon", JSON.stringify(appliedCoupon));
    sessionStorage.setItem("checkout_notes", notes);
    sessionStorage.setItem("checkout_total", finalTotal.toString());
    
    onNext();
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sua sacola está vazia</h3>
        <p className="text-gray-600">Adicione produtos para continuar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sua sacola</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{item.productName}</h4>
              <p className="text-sm text-gray-500">R$ {(item.priceCents / 100).toFixed(2).replace(".", ",")}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold">-</button>
              <span className="font-bold w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold">+</button>
            </div>

            <button onClick={() => removeFromCart(item.productId)} className="text-red-600 hover:text-red-700 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="font-bold text-gray-900">R$ {((item.priceCents * item.quantity) / 100).toFixed(2).replace(".", ",")}</div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Aplicar benefício</h3>
        {!appliedCoupon ? (
          <div>
            <div className="flex gap-2">
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Código do cupom" className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              <button onClick={validateCoupon} disabled={validatingCoupon || !couponCode.trim()} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-xl">
                {validatingCoupon ? "..." : "Aplicar"}
              </button>
            </div>
            {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-700 text-lg">{appliedCoupon.coupon.code}</div>
              <div className="text-sm text-emerald-600">Desconto: R$ {(appliedCoupon.discountCents / 100).toFixed(2).replace(".", ",")}</div>
            </div>
            <button onClick={removeCoupon} className="text-red-600 hover:text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block font-bold text-gray-900 mb-2">Observações</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alguma observação sobre o pedido?" rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="border-t pt-6 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>R$ {(cartTotal / 100).toFixed(2).replace(".", ",")}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Desconto</span>
            <span>- R$ {(discountCents / 100).toFixed(2).replace(".", ",")}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span className="text-emerald-600">R$ {(finalTotal / 100).toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      <button onClick={handleNext} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg">
        Próximo
      </button>
    </div>
  );
}
