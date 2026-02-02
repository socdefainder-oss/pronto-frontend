"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/lib/CartContext";
import CartStep from "@/app/components/checkout/CartStep";
import AddressStep from "@/app/components/checkout/AddressStep";
import PaymentStep from "@/app/components/checkout/PaymentStep";
import CustomerStep from "@/app/components/checkout/CustomerStep";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const { cart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const response = await fetch(`${API_URL}/api/public/restaurants/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data);
        }
      } catch (error) {
        console.error("Erro ao carregar restaurante:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [slug]);

  useEffect(() => {
    if (!loading && cart.length === 0 && currentStep === 1) {
      router.push(`/r/${slug}`);
    }
  }, [cart, loading, currentStep, slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  const steps = [
    { number: 1, name: "Sacola" },
    { number: 2, name: "Endereço" },
    { number: 3, name: "Pagamento" },
    { number: 4, name: "Dados" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/r/${slug}`} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
          {restaurant && (
            <div className="font-bold text-gray-900">{restaurant.name}</div>
          )}
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step.number ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {step.number}
                </div>
                <div className={`mt-2 text-sm font-bold ${currentStep >= step.number ? "text-emerald-600" : "text-gray-600"}`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 ${currentStep > step.number ? "bg-emerald-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {currentStep === 1 && (
            <CartStep onNext={() => setCurrentStep(2)} restaurantId={restaurant?.id} />
          )}
          {currentStep === 2 && (
            <AddressStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
          )}
          {currentStep === 3 && (
            <PaymentStep onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
          )}
          {currentStep === 4 && (
            <CustomerStep onBack={() => setCurrentStep(3)} restaurantId={restaurant?.id} />
          )}
        </div>
      </div>
    </div>
  );
}
