'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function MensalidadePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Financeiro
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mensalidade</h1>
          <p className="text-gray-600">Gerencie sua assinatura e plano</p>
        </div>

        {/* Plano Atual */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Plano Atual</h2>
              <p className="text-gray-600">Assinatura ativa</p>
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              Ativo
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600 font-semibold mb-1">Plano</p>
              <p className="text-2xl font-bold text-gray-900">Premium</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600 font-semibold mb-1">Valor Mensal</p>
              <p className="text-2xl font-bold text-gray-900">R$ 99,90</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600 font-semibold mb-1">Próximo Vencimento</p>
              <p className="text-2xl font-bold text-gray-900">15/02/2025</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
              Alterar Plano
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition">
              Atualizar Pagamento
            </button>
          </div>
        </div>

        {/* Histórico de Pagamentos */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Pagamentos</h2>
          
          <div className="space-y-4">
            {[
              { date: '15/01/2025', value: 'R$ 99,90', status: 'Pago', method: 'Cartão ***1234' },
              { date: '15/12/2024', value: 'R$ 99,90', status: 'Pago', method: 'Cartão ***1234' },
              { date: '15/11/2024', value: 'R$ 99,90', status: 'Pago', method: 'Cartão ***1234' },
              { date: '15/10/2024', value: 'R$ 99,90', status: 'Pago', method: 'Cartão ***1234' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition">
                <div>
                  <p className="font-semibold text-gray-900">{payment.date}</p>
                  <p className="text-sm text-gray-600">{payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{payment.value}</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
