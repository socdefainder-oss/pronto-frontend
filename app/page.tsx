import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header/Nav */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">pronto</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-gray-900 font-medium transition">Como funciona</a>
            <a href="#recursos" className="text-gray-600 hover:text-gray-900 font-medium transition">Recursos</a>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30"
            >
              Começar agora
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-white to-white opacity-60"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-emerald-700">A plataforma completa para seu delivery</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Seu delivery
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  completo e automático
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Cardápio digital + atendimento por IA + gestão completa. Tudo em um só lugar para você vender mais e trabalhar menos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-xl shadow-emerald-600/30 text-center"
                >
                  Criar conta grátis
                </Link>
                <a
                  href="#recursos"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition text-center"
                >
                  Ver recursos
                </a>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Sem mensalidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Sem comissão</span>
                </div>
              </div>
            </div>

            {/* Preview do Cardápio */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden transform rotate-2 hover:rotate-0 transition duration-300">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-center">
                  <h3 className="text-white font-bold text-lg">Seu Restaurante</h3>
                  <p className="text-emerald-100 text-sm">Aberto • Entrega em 30-40min</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                      🍔
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Hambúrguer Artesanal</h4>
                      <p className="text-sm text-gray-600">Pão brioche, carne 180g...</p>
                      <p className="text-emerald-600 font-bold mt-1">R$ 29,90</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                      🍨
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Açaí 500ml</h4>
                      <p className="text-sm text-gray-600">Açaí cremoso com granola</p>
                      <p className="text-emerald-600 font-bold mt-1">R$ 19,90</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition">
                    Fazer Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Principais */}
      <section id="recursos" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramenta completa para vender mais e trabalhar menos, sem complicação
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cardápio Digital */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cardápio Digital Bonito</h3>
              <p className="text-gray-600 mb-4">
                Link personalizado que você pode compartilhar por WhatsApp, redes sociais ou transformar em QR Code. Seus clientes acessam de qualquer celular.
              </p>
              <a href="#" className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center gap-1">
                Ver exemplo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Atendimento Automático */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Atendente Virtual Inteligente</h3>
              <p className="text-gray-600 mb-4">
                Robô que atende seus clientes automaticamente, tira dúvidas, recebe pedidos e envia tudo pronto para você. Funciona 24 horas sem parar.
              </p>
              <span className="text-blue-600 font-semibold">Vendendo enquanto você dorme</span>
            </div>

            {/* Pedidos WhatsApp */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pedidos Direto no WhatsApp</h3>
              <p className="text-gray-600 mb-4">
                Cliente monta o pedido no cardápio e envia tudo formatado direto no seu WhatsApp com 1 clique. Sem precisar instalar nada, sem complicação.
              </p>
              <span className="text-green-600 font-semibold">Prático para seus clientes</span>
            </div>

            {/* Marketing Automático */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ferramentas de Marketing</h3>
              <p className="text-gray-600 mb-4">
                Crie promoções, cupons de desconto, banners chamativos e campanhas para trazer clientes de volta. Tudo feito para aumentar suas vendas.
              </p>
              <span className="text-purple-600 font-semibold">Venda mais todos os dias</span>
            </div>

            {/* Relatórios */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relatórios e Dados</h3>
              <p className="text-gray-600 mb-4">
                Veja quanto você está vendendo, quais produtos saem mais, quem são seus melhores clientes. Tudo em gráficos simples de entender.
              </p>
              <span className="text-orange-600 font-semibold">Tome decisões inteligentes</span>
            </div>

            {/* Pagamento Online */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border-2 border-teal-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento Online</h3>
              <p className="text-gray-600 mb-4">
                Cliente pode pagar com cartão ou PIX antes mesmo do pedido chegar. Dinheiro cai direto na sua conta, sem preocupação com troco.
              </p>
              <span className="text-teal-600 font-semibold">Receba na hora</span>
            </div>

            {/* Gestão de Pedidos */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border-2 border-indigo-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Painel de Controle Completo</h3>
              <p className="text-gray-600 mb-4">
                Organize todos os pedidos em um só lugar. Veja o que está fazendo, o que está a caminho e o que já foi entregue. Simples e rápido.
              </p>
              <span className="text-indigo-600 font-semibold">Controle total</span>
            </div>

            {/* Delivery/Motoboys */}
            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border-2 border-red-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gestão de Entregas</h3>
              <p className="text-gray-600 mb-4">
                Gerencie seus entregadores, acompanhe cada entrega em tempo real e saiba onde está cada pedido. Seus clientes sempre informados.
              </p>
              <span className="text-red-600 font-semibold">Entregas organizadas</span>
            </div>

            {/* Fidelização */}
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border-2 border-pink-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Programa de Fidelidade</h3>
              <p className="text-gray-600 mb-4">
                Recompense clientes fiéis com pontos, descontos e brindes. Faça eles voltarem sempre e indicarem seus amigos.
              </p>
              <span className="text-pink-600 font-semibold">Clientes que voltam</span>
            </div>

            {/* Mensagens Inteligentes */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border-2 border-yellow-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mensagens Automáticas</h3>
              <p className="text-gray-600 mb-4">
                Envie promoções, avisos e novidades automaticamente para os clientes certos na hora certa. Traga clientes que estavam esquecidos de volta.
              </p>
              <span className="text-yellow-600 font-semibold">Marketing que funciona</span>
            </div>

            {/* Anúncios */}
            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Anúncios Otimizados</h3>
              <p className="text-gray-600 mb-4">
                Criamos e gerenciamos anúncios no Facebook, Instagram e Google para trazer novos clientes. Você só paga pelo que funciona.
              </p>
              <span className="text-cyan-600 font-semibold">Mais clientes todo dia</span>
            </div>

            {/* Integrações */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integrações com Tudo</h3>
              <p className="text-gray-600 mb-4">
                Conecte com iFood, Rappi, seu sistema de caixa, contabilidade e muito mais. Todos os pedidos em um só lugar, sem precisar ficar trocando de tela.
              </p>
              <span className="text-gray-700 font-semibold">Tudo conectado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comece a vender em 3 passos
            </h2>
            <p className="text-xl text-gray-600">
              Configure em minutos e já comece a receber pedidos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-xl transition">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Crie sua conta</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cadastro rápido e grátis. Em menos de 2 minutos você já tem acesso ao painel completo e pode começar a configurar.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-xl transition">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Configure seu delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Adicione seus produtos com fotos e preços, configure entregas, formas de pagamento. Interface simples, do jeito que você entende.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-xl transition">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Comece a vender</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compartilhe seu link nas redes sociais, WhatsApp, cole em QR Code. Pronto! Já pode começar a receber pedidos no automático.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-xl shadow-emerald-600/30"
            >
              Criar minha conta grátis
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para vender mais e trabalhar menos?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a centenas de restaurantes que já automatizaram seu delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-emerald-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition shadow-xl"
            >
              Começar agora — É grátis
            </Link>
            <a
              href="#recursos"
              className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition"
            >
              Conhecer recursos
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-white">pronto</span>
            </div>
            <p className="text-center">
              © 2026 pronto — A plataforma completa para seu delivery
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition">Termos</a>
              <a href="#" className="hover:text-white transition">Privacidade</a>
              <a href="#" className="hover:text-white transition">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
