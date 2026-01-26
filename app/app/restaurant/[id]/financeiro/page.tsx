'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FinanceiroPage() {
  const params = useParams()
  const router = useRouter()
  const [restaurantName, setRestaurantName] = useState('')

  useEffect(() => {
    // Buscar nome do restaurante
    fetch(`/api/restaurants/${params.id}`)
      .then(res => res.json())
      .then(data => setRestaurantName(data.name))
      .catch(() => setRestaurantName(''))
  }, [params.id])

  const sections = [
    {
      id: 'mensalidade',
      title: 'Mensalidade',
      description: 'Gerencie sua assinatura e plano',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'blue',
      href: `/app/restaurant/${params.id}/financeiro/mensalidade`
    },
    {
      id: 'extrato',
      title: 'Extrato',
      description: 'Visualize seu histórico financeiro',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'purple',
      href: `/app/restaurant/${params.id}/financeiro/extrato`
    },
    {
      id: 'relatorio',
      title: 'Relatório',
      description: 'Análises e métricas financeiras',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'green',
      href: `/app/restaurant/${params.id}/financeiro/relatorio`
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configure preferências financeiras',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'orange',
      href: `/app/restaurant/${params.id}/financeiro/configuracoes`
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; hover: string; text: string }> = {
      blue: {
        border: 'border-blue-200',
        hover: 'hover:border-blue-500 hover:bg-blue-50',
        text: 'text-blue-600'
      },
      purple: {
        border: 'border-purple-200',
        hover: 'hover:border-purple-500 hover:bg-purple-50',
        text: 'text-purple-600'
      },
      green: {
        border: 'border-green-200',
        hover: 'hover:border-green-500 hover:bg-green-50',
        text: 'text-green-600'
      },
      orange: {
        border: 'border-orange-200',
        hover: 'hover:border-orange-500 hover:bg-orange-50',
        text: 'text-orange-600'
      }
    }
    return colors[color]
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financeiro</h1>
          {restaurantName && (
            <p className="text-gray-600">Gestão financeira de {restaurantName}</p>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const colors = getColorClasses(section.color)
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`p-8 rounded-2xl border-2 ${colors.border} ${colors.hover} transition-all duration-200 bg-white shadow-sm hover:shadow-lg group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${colors.text} group-hover:scale-110 transition-transform`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {section.title}
                    </h2>
                    <p className="text-gray-600">
                      {section.description}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Central Financeira</h3>
              <p className="text-blue-800 text-sm">
                Aqui você pode gerenciar todos os aspectos financeiros do seu restaurante, incluindo assinaturas, extratos, relatórios detalhados e configurações de pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
