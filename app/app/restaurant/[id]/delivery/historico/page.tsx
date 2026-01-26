'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HistoricoDeliveryPage() {
  const params = useParams()
  const router = useRouter()
  const [period, setPeriod] = useState('7')

  const historico = [
    { id: '#1243', data: '26/01/2025 18:45', cliente: 'João Pedro', endereco: 'Rua A, 100', motoboy: 'João Silva', tempo: '18 min', valor: 'R$ 52,30', status: 'entregue' },
    { id: '#1242', data: '26/01/2025 18:20', cliente: 'Maria Lima', endereco: 'Av. B, 250', motoboy: 'Pedro Costa', tempo: '22 min', valor: 'R$ 38,90', status: 'entregue' },
    { id: '#1241', data: '26/01/2025 17:50', cliente: 'José Santos', endereco: 'Rua C, 75', motoboy: 'Maria Santos', tempo: '15 min', valor: 'R$ 45,00', status: 'entregue' },
    { id: '#1240', data: '26/01/2025 17:30', cliente: 'Ana Silva', endereco: 'Av. D, 500', motoboy: 'João Silva', tempo: '25 min', valor: 'R$ 67,80', status: 'entregue' },
    { id: '#1239', data: '26/01/2025 16:45', cliente: 'Carlos Souza', endereco: 'Rua E, 320', motoboy: 'Pedro Costa', tempo: '12 min', valor: 'R$ 29,50', status: 'cancelado' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Delivery
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Histórico de Entregas</h1>
          <p className="text-gray-600">Consulte todas as entregas realizadas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Total Entregue (7d)</p>
            <p className="text-4xl font-bold text-green-600">89</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Tempo Médio</p>
            <p className="text-4xl font-bold text-purple-600">18min</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Faturamento (7d)</p>
            <p className="text-4xl font-bold text-blue-600">R$ 3.245</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none font-semibold">
              <option value="1">Hoje</option>
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
            </select>
            <input type="text" placeholder="Buscar por pedido..." className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none" />
            <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">Exportar</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pedido</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data/Hora</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Motoboy</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Tempo</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Valor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {historico.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.data}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.cliente}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.motoboy}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{item.tempo}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">{item.valor}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'entregue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'entregue' ? '✓ Entregue' : '✗ Cancelado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
