"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentFailure() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Recusado</h1>
        <p className="text-gray-600 mb-6">Não foi possível processar seu pagamento. Tente novamente.</p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">Pedido: #{orderId}</p>
        )}
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition"
          >
            Tentar novamente
          </button>
          <Link 
            href="/"
            className="block px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
          >
            Voltar para início
          </Link>
        </div>
      </div>
    </div>
  );
}
