'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DeliveryPage() {
  const params = useParams()
  const router = useRouter()
  const [restaurantName, setRestaurantName] = useState('')

  useEffect(() => {
    fetch(`/api/restaurants/${params.id}`)
      .then(res => res.json())
      .then(data => setRestaurantName(data.name))
      .catch(() => setRestaurantName(''))
  }, [params.id])

  const sections = [
    {
      id: 'motoboys',
      title: 'Motoboys',
      description: 'Gerencie sua equipe de entregadores',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue',
      href: `/app/restaurant/${params.id}/delivery/motoboys`
    },
    {
      id: 'entregas',
      title: 'Entregas em Andamento',
      description: 'Acompanhe entregas em tempo real',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'orange',
      href: `/app/restaurant/${params.id}/delivery/entregas`
    },
    {
      id: 'historico',
      title: 'Histórico',
      description: 'Consulte entregas anteriores',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'purple',
      href: `/app/restaurant/${params.id}/delivery/historico`
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Defina áreas de entrega e taxas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'cyan',
      href: `/app/restaurant/${params.id}/delivery/configuracoes`
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; hover: string; text: string }> = {
      blue: {
        border: 'border-blue-200',
        hover: 'hover:border-blue-500 hover:bg-blue-50',
        text: 'text-blue-600'
      },
      orange: {
        border: 'border-orange-200',
        hover: 'hover:border-orange-500 hover:bg-orange-50',
        text: 'text-orange-600'
      },
      purple: {
        border: 'border-purple-200',
        hover: 'hover:border-purple-500 hover:bg-purple-50',
        text: 'text-purple-600'
      },
      cyan: {
        border: 'border-cyan-200',
        hover: 'hover:border-cyan-500 hover:bg-cyan-50',
        text: 'text-cyan-600'
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Delivery</h1>
          {restaurantName && (
            <p className="text-gray-600">Sistema de entregas próprio de {restaurantName}</p>
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
        <div className="mt-8 p-6 bg-cyan-50 border-2 border-cyan-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-cyan-900 mb-1">Sistema de Delivery Próprio</h3>
              <p className="text-cyan-800 text-sm">
                Gerencie sua própria equipe de motoboys, controle entregas em tempo real e tenha total autonomia sobre seu sistema de delivery sem depender de plataformas terceiras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
