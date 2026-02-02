"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Pendente</h1>
        <p className="text-gray-600 mb-6">
          Estamos aguardando a confirmação do seu pagamento. Você receberá uma notificação em breve.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">Pedido: #{orderId}</p>
        )}
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition"
        >
          Voltar para início
        </Link>
      </div>
    </div>
  );
}

export default function PaymentPending() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
