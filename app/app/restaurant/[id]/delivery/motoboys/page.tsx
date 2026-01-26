'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MotoboysPage() {
  const params = useParams()
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)

  const motoboys = [
    {
      id: 1,
      name: 'João Silva',
      phone: '(11) 98765-4321',
      status: 'disponivel',
      deliveries: 12,
      rating: 4.8,
      vehicle: 'Moto - Honda CG 160'
    },
    {
      id: 2,
      name: 'Maria Santos',
      phone: '(11) 97654-3210',
      status: 'em_entrega',
      deliveries: 8,
      rating: 4.9,
      vehicle: 'Moto - Yamaha Factor'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      phone: '(11) 96543-2109',
      status: 'disponivel',
      deliveries: 15,
      rating: 4.7,
      vehicle: 'Moto - Honda Biz'
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      phone: '(11) 95432-1098',
      status: 'offline',
      deliveries: 5,
      rating: 5.0,
      vehicle: 'Bicicleta Elétrica'
    }
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      disponivel: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disponível' },
      em_entrega: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Entrega' },
      offline: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Offline' }
    }
    const badge = badges[status] || badges.offline
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs rounded-full font-semibold`}>
        {badge.label}
      </span>
    )
  }

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
            Voltar ao Delivery
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Motoboys</h1>
              <p className="text-gray-600">Gerencie sua equipe de entregadores</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Motoboy
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Disponíveis</p>
            <p className="text-4xl font-bold text-green-600">2</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Em Entrega</p>
            <p className="text-4xl font-bold text-blue-600">1</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Offline</p>
            <p className="text-4xl font-bold text-gray-600">1</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Total de Entregas</p>
            <p className="text-4xl font-bold text-purple-600">40</p>
          </div>
        </div>

        {/* Formulário Adicionar (condicional) */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Novo Motoboy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Veículo</label>
                <input
                  type="text"
                  placeholder="Ex: Moto - Honda CG 160"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Placa</label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CNH</label>
                <input
                  type="text"
                  placeholder="Número da CNH"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                Salvar Motoboy
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Motoboys */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Equipe de Entregadores</h2>
          </div>
          <div className="divide-y-2 divide-gray-100">
            {motoboys.map((motoboy) => (
              <div key={motoboy.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {motoboy.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{motoboy.name}</h3>
                        {getStatusBadge(motoboy.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{motoboy.phone}</p>
                      <p className="text-sm text-gray-500">{motoboy.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{motoboy.deliveries}</p>
                      <p className="text-xs text-gray-600">Entregas Hoje</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="text-lg font-bold text-gray-900">{motoboy.rating}</p>
                      </div>
                      <p className="text-xs text-gray-600">Avaliação</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-sm">
                        Editar
                      </button>
                      <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition text-sm">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
