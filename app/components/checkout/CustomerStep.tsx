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
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);

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
      const cardData = JSON.parse(sessionStorage.getItem("checkout_card_data") || "null");

      // Criar pedido
      const orderData = {
        restaurantId,
        customer: { 
          name, 
          phone, 
          email: email || undefined,
          cpfCnpj: cpfCnpj || undefined
        },
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

      // Se pagamento online, criar pagamento no ASAAS
      if (paymentMethod === "pix" || paymentMethod === "credit_card") {
        try {
          const paymentResponse = await fetch(`${API_URL}/api/asaas/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              paymentMethod: paymentMethod,
              cardData: paymentMethod === "credit_card" ? cardData : undefined,
            }),
          });

          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            
            if (paymentMethod === "pix") {
              // Mostrar QR Code do PIX
              setPixData(paymentData);
            } else {
              // Cartão de crédito processado
              clearCart();
              sessionStorage.clear();
              alert(`Pedido #${order.orderNumber} criado com sucesso!\nPagamento processado.`);
              router.push(`/r/${restaurantId}`);
            }
          } else {
            const error = await paymentResponse.json();
            alert(`Erro ao processar pagamento: ${error.error || "Tente novamente"}`);
          }
        } catch (paymentError) {
          console.error("Erro ao criar pagamento:", paymentError);
          alert("Erro ao processar pagamento. Entre em contato com o restaurante.");
        }
      } else {
        // Pagamento na entrega - mostrar sucesso
        clearCart();
        sessionStorage.clear();
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

  const copyPixCode = () => {
    if (pixData?.pixCopyPaste) {
      navigator.clipboard.writeText(pixData.pixCopyPaste);
      alert("Código PIX copiado!");
    }
  };

  const handlePixComplete = () => {
    clearCart();
    sessionStorage.clear();
    router.push(`/r/${restaurantId}`);
  };

  // Se tiver dados PIX, mostrar QR Code
  if (pixData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido criado com sucesso!</h2>
          <p className="text-gray-600">Escaneie o QR Code para pagar com PIX</p>
        </div>

        {pixData.pixQrCodeUrl && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
            <img 
              src={pixData.pixQrCodeUrl} 
              alt="QR Code PIX" 
              className="w-64 h-64 mx-auto mb-4"
            />
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">Ou copie o código:</p>
              <div className="bg-gray-50 p-3 rounded-lg break-all text-sm font-mono">
                {pixData.pixCopyPaste}
              </div>
              <button 
                onClick={copyPixCode}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
              >
                Copiar código PIX
              </button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Após o pagamento:</p>
              <p>Seu pedido será confirmado automaticamente e o restaurante receberá a notificação.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePixComplete}
          className="w-full py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
        >
          Concluir
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Seus dados</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Telefone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">CPF/CNPJ</label>
          <input
            type="text"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ''))}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">Necessário para pagamentos online</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          onClick={handleFinish}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg"
        >
          {loading ? "Processando..." : "Finalizar Pedido"}
        </button>
      </div>
    </div>
  );
}
