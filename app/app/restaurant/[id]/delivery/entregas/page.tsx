'use client'

import { useParams, useRouter } from 'next/navigation'

export default function EntregasPage() {
  const params = useParams()
  const router = useRouter()

  const entregas = [
    {
      id: '#1245',
      cliente: 'Carlos Silva',
      endereco: 'Rua das Flores, 123 - Centro',
      motoboy: 'Maria Santos',
      tempo: '12 min',
      distancia: '2.5 km',
      valor: 'R$ 45,90',
      status: 'a_caminho'
    },
    {
      id: '#1244',
      cliente: 'Ana Costa',
      endereco: 'Av. Paulista, 1000 - Bela Vista',
      motoboy: 'Aguardando...',
      tempo: '5 min',
      distancia: '1.2 km',
      valor: 'R$ 32,50',
      status: 'aguardando'
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Entregas em Andamento</h1>
          <p className="text-gray-600">Acompanhe todas as entregas em tempo real</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entregas.map((entrega) => (
            <div key={entrega.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Pedido {entrega.id}</h3>
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                  entrega.status === 'a_caminho' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {entrega.status === 'a_caminho' ? '🚚 A Caminho' : '⏳ Aguardando'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{entrega.cliente}</p>
                    <p className="text-sm text-gray-600">{entrega.endereco}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Entregador:</span> {entrega.motoboy}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{entrega.tempo}</p>
                  <p className="text-xs text-gray-600">Tempo Est.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{entrega.distancia}</p>
                  <p className="text-xs text-gray-600">Distância</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-green-600">{entrega.valor}</p>
                  <p className="text-xs text-gray-600">Valor</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                  Ver no Mapa
                </button>
                <button className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition">
                  Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
