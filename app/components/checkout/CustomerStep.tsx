"use client";

import { useState } from "react";
import { useCart } from "@/app/lib/CartContext";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

interface CustomerStepProps {
  onBack: () => void;
  restaurantId: string;
}

export default function CustomerStep({ onBack, restaurantId }: CustomerStepProps) {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!name || !phone) {
      alert("Preencha nome e telefone");
      return;
    }

    setLoading(true);

    try {
      // Recuperar dados do sessionStorage
      const coupon = JSON.parse(sessionStorage.getItem("checkout_coupon") || "null");
      const notes = sessionStorage.getItem("checkout_notes") || "";
      const deliveryType = sessionStorage.getItem("checkout_delivery_type") || "pickup";
      const address = JSON.parse(sessionStorage.getItem("checkout_address") || "null");
      const paymentMethod = sessionStorage.getItem("checkout_payment_method") || "pix";

      // Criar pedido
      const orderData = {
        restaurantId,
        customer: { name, phone, email: email || undefined },
        address: address || undefined,
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod,
        notes: notes || undefined,
        deliveryFeeCents: 0,
        couponCode: coupon?.coupon?.code || undefined,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Erro ao criar pedido");

      const order = await response.json();

      // Limpar carrinho e sessionStorage
      clearCart();
      sessionStorage.removeItem("checkout_coupon");
      sessionStorage.removeItem("checkout_notes");
      sessionStorage.removeItem("checkout_delivery_type");
      sessionStorage.removeItem("checkout_address");
      sessionStorage.removeItem("checkout_payment_method");
      sessionStorage.removeItem("checkout_payment_category");
      sessionStorage.removeItem("checkout_card_brand");

      // Se pagamento online, criar pagamento no Mercado Pago
      if (paymentMethod === "pix" || paymentMethod === "credit_card") {
        try {
          const paymentResponse = await fetch(`${API_URL}/api/payments/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              paymentMethod: paymentMethod,
            }),
          });

          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            window.location.href = paymentData.sandboxInitPoint;
          } else {
            alert("Erro ao processar pagamento online");
          }
        } catch (paymentError) {
          console.error("Erro ao criar pagamento:", paymentError);
          alert("Erro ao processar pagamento. Entre em contato com o restaurante.");
        }
      } else {
        // Pagamento na entrega - mostrar sucesso
        alert(`Pedido #${order.orderNumber} criado com sucesso!\nO restaurante receberá sua solicitação.`);
        router.push(`/r/${restaurantId}`);
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao criar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Seus dados</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Telefone *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} disabled={loading} className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50">
          Voltar
        </button>
        <button onClick={handleFinish} disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg">
          {loading ? "Processando..." : "Finalizar Pedido"}
        </button>
      </div>
    </div>
  );
}
