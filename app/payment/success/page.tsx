"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Aprovado!</h1>
        <p className="text-gray-600 mb-6">Seu pedido foi confirmado e já está sendo preparado.</p>
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
