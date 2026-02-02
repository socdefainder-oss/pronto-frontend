"use client";

import { useState } from "react";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const [paymentCategory, setPaymentCategory] = useState<"online" | "delivery">("online");
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [showCardBrandModal, setShowCardBrandModal] = useState(false);
  const [selectedCardBrand, setSelectedCardBrand] = useState("");

  const handleMethodSelect = (method: string) => {
    setPaymentMethod(method);
    
    if (method === "credit_card_delivery" || method === "debit_delivery") {
      setShowCardBrandModal(true);
    } else {
      setShowCardBrandModal(false);
      setSelectedCardBrand("");
    }
  };

  const handleCardBrandSelect = (brand: string) => {
    setSelectedCardBrand(brand);
    setShowCardBrandModal(false);
  };

  const handleNext = () => {
    if (!paymentMethod) {
      alert("Selecione uma forma de pagamento");
      return;
    }

    if ((paymentMethod === "credit_card_delivery" || paymentMethod === "debit_delivery") && !selectedCardBrand) {
      alert("Selecione a bandeira do cartão");
      return;
    }

    sessionStorage.setItem("checkout_payment_method", paymentMethod);
    sessionStorage.setItem("checkout_payment_category", paymentCategory);
    if (selectedCardBrand) {
      sessionStorage.setItem("checkout_card_brand", selectedCardBrand);
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Como você prefere pagar?</h2>

      {/* Pagar online */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="font-bold text-gray-900">Pagar online</h3>
        </div>

        <div className="space-y-3">
          <div onClick={() => { setPaymentCategory("online"); handleMethodSelect("pix"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "online" && paymentMethod === "pix" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold text-gray-900">Pix</div>
                  <div className="text-sm text-gray-600">Aprovação imediata</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "online" && paymentMethod === "pix" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "online" && paymentMethod === "pix" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>

          <div onClick={() => { setPaymentCategory("online"); handleMethodSelect("credit_card"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "online" && paymentMethod === "credit_card" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <div className="font-bold text-gray-900">Crédito</div>
                  <div className="text-sm text-gray-600">Pagamento rápido e seguro</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "online" && paymentMethod === "credit_card" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "online" && paymentMethod === "credit_card" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagar na entrega */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="font-bold text-gray-900">Pagar na entrega</h3>
        </div>

        <div className="space-y-3">
          <div onClick={() => { setPaymentCategory("delivery"); handleMethodSelect("cash"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "delivery" && paymentMethod === "cash" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="font-bold text-gray-900">Dinheiro</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "delivery" && paymentMethod === "cash" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "delivery" && paymentMethod === "cash" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>

          <div onClick={() => { setPaymentCategory("delivery"); handleMethodSelect("credit_card_delivery"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "delivery" && paymentMethod === "credit_card_delivery" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <div className="font-bold text-gray-900">Crédito</div>
                  {selectedCardBrand && paymentMethod === "credit_card_delivery" && (
                    <div className="text-sm text-emerald-600">Bandeira: {selectedCardBrand}</div>
                  )}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "delivery" && paymentMethod === "credit_card_delivery" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "delivery" && paymentMethod === "credit_card_delivery" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>

          <div onClick={() => { setPaymentCategory("delivery"); handleMethodSelect("debit_delivery"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "delivery" && paymentMethod === "debit_delivery" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <div className="font-bold text-gray-900">Débito</div>
                  {selectedCardBrand && paymentMethod === "debit_delivery" && (
                    <div className="text-sm text-emerald-600">Bandeira: {selectedCardBrand}</div>
                  )}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "delivery" && paymentMethod === "debit_delivery" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "delivery" && paymentMethod === "debit_delivery" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>

          <div onClick={() => { setPaymentCategory("delivery"); handleMethodSelect("meal_voucher"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "delivery" && paymentMethod === "meal_voucher" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="font-bold text-gray-900">Vale refeição</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "delivery" && paymentMethod === "meal_voucher" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "delivery" && paymentMethod === "meal_voucher" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>

          <div onClick={() => { setPaymentCategory("delivery"); handleMethodSelect("food_voucher"); }} className={`p-4 border-2 rounded-xl cursor-pointer transition ${paymentCategory === "delivery" && paymentMethod === "food_voucher" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="font-bold text-gray-900">Vale alimentação</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentCategory === "delivery" && paymentMethod === "food_voucher" ? "border-emerald-500" : "border-gray-300"}`}>
                {paymentCategory === "delivery" && paymentMethod === "food_voucher" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Brand Modal */}
      {showCardBrandModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Selecione a bandeira do cartão</h3>
            <div className="space-y-3">
              {["Visa", "Mastercard", "Elo"].map((brand) => (
                <button key={brand} onClick={() => handleCardBrandSelect(brand)} className="w-full p-4 border-2 border-gray-300 hover:border-emerald-500 rounded-xl text-left font-bold text-gray-900 transition">
                  {brand}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCardBrandModal(false)} className="w-full mt-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
          Voltar
        </button>
        <button onClick={handleNext} className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg">
          Próximo
        </button>
      </div>
    </div>
  );
}
