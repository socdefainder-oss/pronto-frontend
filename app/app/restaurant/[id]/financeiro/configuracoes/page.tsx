'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ConfiguracoesFinanceiroPage() {
  const params = useParams()
  const router = useRouter()
  const [autoApproval, setAutoApproval] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configurações Financeiras</h1>
          <p className="text-gray-600">Gerencie suas preferências de pagamento e notificações</p>
        </div>

        {/* Métodos de Pagamento */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Métodos de Pagamento</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-xl bg-blue-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white font-bold text-xs">
                  VISA
                </div>
                <div>
                  <p className="font-semibold text-gray-900">•••• •••• •••• 1234</p>
                  <p className="text-sm text-gray-600">Expira em 12/2026</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-blue-600 font-semibold hover:bg-blue-100 rounded-lg transition">
                  Editar
                </button>
                <button className="px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition">
                  Remover
                </button>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition w-full justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Novo Cartão
          </button>
        </div>

        {/* Dados Bancários */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Bancários para Recebimento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Banco</label>
              <input
                type="text"
                defaultValue="Banco do Brasil"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Agência</label>
              <input
                type="text"
                defaultValue="1234-5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Conta</label>
              <input
                type="text"
                defaultValue="12345-6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Conta</label>
              <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none">
                <option>Conta Corrente</option>
                <option>Conta Poupança</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">CPF/CNPJ</label>
              <input
                type="text"
                defaultValue="123.456.789-00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <button className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition">
            Salvar Dados Bancários
          </button>
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificações Financeiras</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">E-mail de Cobrança</p>
                <p className="text-sm text-gray-600">Receber avisos de vencimento por e-mail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">SMS de Cobrança</p>
                <p className="text-sm text-gray-600">Receber avisos de vencimento por SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">Aprovação Automática</p>
                <p className="text-sm text-gray-600">Aprovar pagamentos automaticamente</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproval}
                  onChange={(e) => setAutoApproval(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notas Fiscais */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notas Fiscais</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Emitir NF-e automaticamente</label>
              <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none">
                <option>Sim, para todos os pedidos</option>
                <option>Apenas para pedidos acima de R$ 100</option>
                <option>Não, emitir manualmente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Série da NF-e</label>
              <input
                type="text"
                defaultValue="001"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Certificado Digital</label>
              <div className="flex gap-3">
                <input
                  type="file"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                  Upload
                </button>
              </div>
            </div>
          </div>

          <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
            Salvar Configurações de NF-e
          </button>
        </div>
      </div>
    </div>
  )
}
