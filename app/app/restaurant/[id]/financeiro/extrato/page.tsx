'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ExtratoPage() {
  const params = useParams()
  const router = useRouter()
  const [period, setPeriod] = useState('30')

  const transactions = [
    { date: '15/01/2025', description: 'Mensalidade Premium', type: 'débito', value: -99.90, balance: 1250.50 },
    { date: '14/01/2025', description: 'Pedido #1234', type: 'crédito', value: 125.00, balance: 1350.40 },
    { date: '14/01/2025', description: 'Pedido #1233', type: 'crédito', value: 89.50, balance: 1225.40 },
    { date: '13/01/2025', description: 'Pedido #1232', type: 'crédito', value: 156.90, balance: 1135.90 },
    { date: '13/01/2025', description: 'Taxa de entrega', type: 'débito', value: -12.00, balance: 979.00 },
    { date: '12/01/2025', description: 'Pedido #1231', type: 'crédito', value: 201.50, balance: 991.00 },
    { date: '12/01/2025', description: 'Pedido #1230', type: 'crédito', value: 78.30, balance: 789.50 },
    { date: '11/01/2025', description: 'Pedido #1229', type: 'crédito', value: 145.80, balance: 711.20 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Extrato</h1>
          <p className="text-gray-600">Histórico completo de transações</p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">Saldo Atual</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">R$ 1.250,50</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">Receitas (30d)</p>
            </div>
            <p className="text-3xl font-bold text-green-600">R$ 3.487,20</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">Despesas (30d)</p>
            </div>
            <p className="text-3xl font-bold text-red-600">R$ 111,90</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar transação..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>
            <div className="flex items-end gap-2">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Transações */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Transações</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Valor</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${transaction.type === 'crédito' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-gray-900">{transaction.description}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${transaction.type === 'crédito' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'crédito' ? '+' : ''} R$ {Math.abs(transaction.value).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      R$ {transaction.balance.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
