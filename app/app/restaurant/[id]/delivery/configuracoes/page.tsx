'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ConfiguracoesDeliveryPage() {
  const params = useParams()
  const router = useRouter()
  const [autoAccept, setAutoAccept] = useState(true)
  const [minOrder, setMinOrder] = useState('20.00')
  const [taxaBase, setTaxaBase] = useState('5.00')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Delivery
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configurações de Delivery</h1>
          <p className="text-gray-600">Defina áreas de entrega, taxas e regras</p>
        </div>

        {/* Configurações Gerais */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações Gerais</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">Aceitar Pedidos Automaticamente</p>
                <p className="text-sm text-gray-600">Aceitar novos pedidos sem confirmação manual</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={autoAccept} onChange={(e) => setAutoAccept(e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pedido Mínimo</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-700">R$</span>
                <input type="text" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="w-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 outline-none text-lg font-semibold" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Taxa de Entrega Base</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-700">R$</span>
                <input type="text" value={taxaBase} onChange={(e) => setTaxaBase(e.target.value)} className="w-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 outline-none text-lg font-semibold" />
              </div>
            </div>
          </div>
        </div>

        {/* Áreas de Entrega */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Áreas de Entrega</h2>
          <div className="space-y-4 mb-6">
            {[
              { bairro: 'Centro', distancia: '0-3 km', taxa: 'R$ 5,00', tempo: '15-25 min' },
              { bairro: 'Jardim das Flores', distancia: '3-5 km', taxa: 'R$ 8,00', tempo: '25-35 min' },
              { bairro: 'Vila Nova', distancia: '5-7 km', taxa: 'R$ 12,00', tempo: '35-45 min' }
            ].map((area, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{area.bairro}</h3>
                  <p className="text-sm text-gray-600">Distância: {area.distancia} • Tempo: {area.tempo}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-green-600">{area.taxa}</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition text-sm">Editar</button>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition text-sm">Remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-cyan-400 hover:text-cyan-600 transition w-full justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Nova Área
          </button>
        </div>

        {/* Horário de Funcionamento */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Horário de Delivery</h2>
          <div className="space-y-4">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
              <div key={dia} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl">
                <div className="w-32">
                  <p className="font-semibold text-gray-900">{dia}</p>
                </div>
                <input type="time" defaultValue="11:00" className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-cyan-500 outline-none" />
                <span className="text-gray-600">até</span>
                <input type="time" defaultValue="22:00" className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-cyan-500 outline-none" />
                <label className="relative inline-flex items-center cursor-pointer ml-auto">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            ))}
          </div>
          <button className="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition">Salvar Configurações</button>
        </div>
      </div>
    </div>
  )
}
