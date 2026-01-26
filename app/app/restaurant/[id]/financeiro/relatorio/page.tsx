'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RelatorioPage() {
  const params = useParams()
  const router = useRouter()
  const [period, setPeriod] = useState('30')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Relatório Financeiro</h1>
          <p className="text-gray-600">Análises e métricas do seu negócio</p>
        </div>

        {/* Filtro de Período */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-700">Período:</label>
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none font-semibold"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
            <button className="ml-auto px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">Faturamento</p>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">+15%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">R$ 12.450</p>
            <p className="text-xs text-gray-500">últimos 30 dias</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">Pedidos</p>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">+8%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">342</p>
            <p className="text-xs text-gray-500">últimos 30 dias</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">Ticket Médio</p>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">+6%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">R$ 36,40</p>
            <p className="text-xs text-gray-500">por pedido</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-600">Lucro Líquido</p>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">+12%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">R$ 3.735</p>
            <p className="text-xs text-gray-500">margem de 30%</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Receitas vs Despesas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Receitas vs Despesas</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Receitas</span>
                  <span className="text-lg font-bold text-green-600">R$ 12.450</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Despesas</span>
                  <span className="text-lg font-bold text-red-600">R$ 8.715</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '64%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Lucro Líquido</span>
                  <span className="text-2xl font-bold text-blue-600">R$ 3.735</span>
                </div>
              </div>
            </div>
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
              {[
                { name: 'Açaí 500ml', sales: 156, value: 'R$ 3.120' },
                { name: 'Açaí 700ml', sales: 98, value: 'R$ 2.450' },
                { name: 'Bowl de Frutas', sales: 67, value: 'R$ 1.675' },
                { name: 'Vitamina de Açaí', sales: 45, value: 'R$ 900' },
                { name: 'Sorvete Açaí', sales: 34, value: 'R$ 680' }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl hover:border-green-300 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} vendas</p>
                  </div>
                  <p className="font-bold text-green-600">{product.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análise de Desempenho */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Taxa de Conversão</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset="67.858" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">80%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600">De visitantes que fazem pedidos</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tempo Médio de Entrega</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">28</p>
                <p className="text-gray-600 font-semibold">minutos</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              5 min mais rápido que mês anterior
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Satisfação do Cliente</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-500 mb-2">4.8</p>
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600">Baseado em 234 avaliações</p>
          </div>
        </div>
      </div>
    </div>
  )
}
