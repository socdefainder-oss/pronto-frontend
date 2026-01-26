'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function IntegracoesPage() {
  const params = useParams()
  const router = useRouter()

  const integrations = [
    {
      id: 'ifood',
      name: 'iFood',
      description: 'Integre seu cardápio com a maior plataforma de delivery do Brasil',
      icon: '🍔',
      color: 'red',
      status: 'available',
      connected: false
    },
    {
      id: 'rappi',
      name: 'Rappi',
      description: 'Expanda suas vendas com a Rappi',
      icon: '🛵',
      color: 'orange',
      status: 'available',
      connected: false
    },
    {
      id: 'ubereats',
      name: 'Uber Eats',
      description: 'Conecte-se com milhões de usuários do Uber Eats',
      icon: '🚗',
      color: 'green',
      status: 'available',
      connected: false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Receba pedidos direto pelo WhatsApp',
      icon: '💬',
      color: 'green',
      status: 'available',
      connected: false
    },
    {
      id: 'instagram',
      name: 'Instagram Shopping',
      description: 'Venda pelo Instagram com catálogo integrado',
      icon: '📸',
      color: 'pink',
      status: 'available',
      connected: false
    },
    {
      id: 'facebook',
      name: 'Facebook Marketplace',
      description: 'Anuncie seus produtos no Facebook',
      icon: '👥',
      color: 'blue',
      status: 'available',
      connected: false
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Gateway de pagamento completo',
      icon: '💳',
      color: 'cyan',
      status: 'available',
      connected: false
    },
    {
      id: 'pagseguro',
      name: 'PagSeguro',
      description: 'Aceite pagamentos com PagSeguro',
      icon: '💰',
      color: 'yellow',
      status: 'available',
      connected: false
    },
    {
      id: 'google',
      name: 'Google Meu Negócio',
      description: 'Apareça nas buscas do Google',
      icon: '🔍',
      color: 'blue',
      status: 'available',
      connected: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Conecte com milhares de aplicativos',
      icon: '⚡',
      color: 'orange',
      status: 'coming-soon',
      connected: false
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Envie campanhas de e-mail marketing',
      icon: '📧',
      color: 'yellow',
      status: 'coming-soon',
      connected: false
    },
    {
      id: 'rdstation',
      name: 'RD Station',
      description: 'Automação de marketing completa',
      icon: '📊',
      color: 'green',
      status: 'coming-soon',
      connected: false
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; hover: string }> = {
      red: { bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:border-red-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:border-orange-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:border-green-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', hover: 'hover:border-pink-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:border-blue-500' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', hover: 'hover:border-cyan-500' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', hover: 'hover:border-yellow-500' }
    }
    return colors[color] || colors.blue
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
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Integrações</h1>
          <p className="text-gray-600">Conecte seu restaurante com as principais plataformas</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-8">
          <button className="px-4 py-2 bg-pink-600 text-white rounded-xl font-semibold shadow-sm">
            Todas
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-pink-300 transition">
            Conectadas
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-pink-300 transition">
            Disponíveis
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-pink-300 transition">
            Em Breve
          </button>
        </div>

        {/* Grid de Integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const colors = getColorClasses(integration.color)
            return (
              <div
                key={integration.id}
                className={`p-6 rounded-2xl border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 bg-white shadow-sm hover:shadow-lg`}
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{integration.icon}</div>
                  {integration.status === 'coming-soon' ? (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-semibold">
                      Em Breve
                    </span>
                  ) : integration.connected ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                      Conectado
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      Disponível
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {integration.description}
                </p>

                {/* Ações */}
                <div className="flex gap-2">
                  {integration.status === 'coming-soon' ? (
                    <button
                      disabled
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Em Breve
                    </button>
                  ) : integration.connected ? (
                    <>
                      <button className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition">
                        Configurar
                      </button>
                      <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition">
                        Desconectar
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition">
                      Conectar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-pink-50 border-2 border-pink-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-pink-900 mb-1">Central de Integrações</h3>
              <p className="text-pink-800 text-sm">
                Conecte seu restaurante com as principais plataformas de delivery, pagamento e marketing. Todas as integrações são sincronizadas automaticamente em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
