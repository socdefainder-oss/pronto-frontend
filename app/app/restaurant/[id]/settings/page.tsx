"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "../../../../lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

type Section = 'dados' | 'horarios' | 'entrega' | 'pagamento' | 'motoboys' | 'impressao' | 'usuarios';

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState<Section>('dados');
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);

  // Form fields - Dados da Loja
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [slogan, setSlogan] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  
  // Novos campos
  const [brandName, setBrandName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [acceptsDelivery, setAcceptsDelivery] = useState(true);
  const [minDeliveryValue, setMinDeliveryValue] = useState("");
  const [freeDeliveryFrom, setFreeDeliveryFrom] = useState("");
  const [acceptsPickup, setAcceptsPickup] = useState(true);
  const [pickupMinTime, setPickupMinTime] = useState("");
  const [pickupMaxTime, setPickupMaxTime] = useState("");
  const [acceptsDineIn, setAcceptsDineIn] = useState(false);
  const [acceptsScheduled, setAcceptsScheduled] = useState(false);
  const [useReadyColumn, setUseReadyColumn] = useState(true);
  const [useCompletedColumn, setUseCompletedColumn] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [cnpjStatus, setCnpjStatus] = useState("");
  const [cnae, setCnae] = useState("");
  const [isMEI, setIsMEI] = useState("");
  const [cnpjValid, setCnpjValid] = useState(false);
  const [cnpjAnalyzedAt, setCnpjAnalyzedAt] = useState("");
  
  // Estados para Horários
  const [currentTime, setCurrentTime] = useState("");
  const [schedules, setSchedules] = useState<{
    [key: string]: { start: string; end: string }[];
  }>({
    monday: [{ start: "17:30", end: "23:30" }],
    tuesday: [{ start: "17:30", end: "23:30" }],
    wednesday: [{ start: "17:30", end: "23:30" }],
    thursday: [{ start: "17:30", end: "23:30" }],
    friday: [{ start: "17:30", end: "23:30" }],
    saturday: [{ start: "17:30", end: "23:30" }],
    sunday: [{ start: "17:30", end: "23:30" }],
  });

  useEffect(() => {
    if (!restaurantId) return;
    loadRestaurant();
    
    // Atualiza o horário atual a cada segundo
    const timer = setInterval(() => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo'
      });
      setCurrentTime(formatter.format(now));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [restaurantId]);

  async function loadRestaurant() {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao carregar restaurante");

      const data = await res.json();
      setName(data.name || "");
      setSlug(data.slug || "");
      setPhone(data.phone || "");
      setDescription(data.description || "");
      setSlogan(data.slogan || "");
      setAddress(data.address || "");
      setLogoUrl(data.logoUrl || "");
      setCnpj(data.cnpj || "");
      setEmail(data.email || "");
      
      // Novos campos
      setBrandName(data.brandName || "");
      setUnitName(data.unitName || "");
      setAcceptsDelivery(data.acceptsDelivery !== undefined ? data.acceptsDelivery : true);
      setMinDeliveryValue(data.minDeliveryValue || "");
      setFreeDeliveryFrom(data.freeDeliveryFrom || "");
      setAcceptsPickup(data.acceptsPickup !== undefined ? data.acceptsPickup : true);
      setPickupMinTime(data.pickupMinTime || "");
      setPickupMaxTime(data.pickupMaxTime || "");
      setAcceptsDineIn(data.acceptsDineIn || false);
      setAcceptsScheduled(data.acceptsScheduled || false);
      setUseReadyColumn(data.useReadyColumn !== undefined ? data.useReadyColumn : true);
      setUseCompletedColumn(data.useCompletedColumn !== undefined ? data.useCompletedColumn : true);
      setCompanyName(data.companyName || "");
      setCnpjStatus(data.cnpjStatus || "");
      setCnae(data.cnae || "");
      setIsMEI(data.isMEI || "");
      setCnpjValid(data.cnpjValid || false);
      setCnpjAnalyzedAt(data.cnpjAnalyzedAt || "");
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDados(e: React.FormEvent) {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug,
          phone,
          description,
          slogan,
          address,
          logoUrl,
          cnpj,
          email,
          brandName,
          unitName,
          acceptsDelivery,
          minDeliveryValue,
          freeDeliveryFrom,
          acceptsPickup,
          pickupMinTime,
          pickupMaxTime,
          acceptsDineIn,
          acceptsScheduled,
          useReadyColumn,
          useCompletedColumn,
          companyName,
          cnpjStatus,
          cnae,
          isMEI,
          cnpjValid,
          cnpjAnalyzedAt,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar alterações");

      setSuccess("Dados salvos com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar dados");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dados' as Section, label: 'Dados da loja' },
    { id: 'horarios' as Section, label: 'Horários' },
    { id: 'entrega' as Section, label: 'Entrega' },
    { id: 'pagamento' as Section, label: 'Pagamento' },
    { id: 'motoboys' as Section, label: 'Motoboys' },
    { id: 'impressao' as Section, label: 'Impressão' },
    { id: 'usuarios' as Section, label: 'Usuários' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Configurações
              </h1>
              <p className="mt-2 text-gray-600">
                Configure as informações e preferências do seu restaurante
              </p>
            </div>
            <Link
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
              href="/app"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </Link>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Content Area with Tabs */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-white">
            <nav className="flex overflow-x-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                    activeSection === item.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
                {/* Dados da Loja */}
                {activeSection === 'dados' && (
                  <form onSubmit={handleSaveDados} className="space-y-8">
                    {/* Informações da Loja */}
                    <div>
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Informações da Loja</h2>
                        <p className="text-sm text-gray-600 mt-1">Preencha os detalhes da sua loja.</p>
                      </div>

                      <div className="space-y-4">
                        {/* Upload de Logo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo da Loja
                          </label>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Escolher arquivo
                            </button>
                            <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
                          </div>
                        </div>

                        {/* Upload de Banner */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Banner da Loja
                          </label>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Escolher arquivo
                            </button>
                            <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
                          </div>
                        </div>

                        {/* Nome da Loja (principal) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Loja *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            placeholder="Ex: Xcalota - Barueri"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Este é o nome principal que aparece no sistema
                          </p>
                        </div>

                        {/* Nome da marca */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da marca
                          </label>
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            placeholder="Ex: Xcalota"
                          />
                        </div>

                        {/* Nome da unidade */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da unidade
                          </label>
                          <input
                            type="text"
                            value={unitName}
                            onChange={(e) => setUnitName(e.target.value)}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            placeholder="Ex: Barueri"
                          />
                        </div>

                        {/* Link personalizado */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link personalizado do seu cardápio
                          </label>
                          <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                          />
                          <p className="mt-2 text-sm text-gray-600">
                            Este será o link do seu cardápio: <span className="font-semibold">pronto.app/{slug || "seu-link"}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Modos de pedidos */}
                    <div className="border-t-2 pt-8">
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Modos de pedidos</h2>
                        <p className="text-sm text-gray-600 mt-1">Escolha os modos de pedidos disponíveis para a sua loja.</p>
                      </div>

                      <div className="space-y-6">
                        {/* Delivery */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acceptsDelivery}
                              onChange={(e) => setAcceptsDelivery(e.target.checked)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="font-semibold text-gray-900">Aceitar pedidos para delivery</span>
                          </label>
                          
                          {acceptsDelivery && (
                            <div className="mt-4 space-y-4 pl-8">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Pedido mínimo para entrega
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">R$</span>
                                  <input
                                    type="text"
                                    value={minDeliveryValue}
                                    onChange={(e) => setMinDeliveryValue(e.target.value)}
                                    className="w-32 rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                    placeholder="0,00"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Frete grátis para pedidos a partir de um valor
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">R$</span>
                                  <input
                                    type="text"
                                    value={freeDeliveryFrom}
                                    onChange={(e) => setFreeDeliveryFrom(e.target.value)}
                                    className="w-32 rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                    placeholder="0,00"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Retirada */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acceptsPickup}
                              onChange={(e) => setAcceptsPickup(e.target.checked)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="font-semibold text-gray-900">Aceitar pedidos para retirada</span>
                          </label>
                          
                          {acceptsPickup && (
                            <div className="mt-4 grid grid-cols-2 gap-4 pl-8">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tempo mínimo
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={pickupMinTime}
                                    onChange={(e) => setPickupMinTime(e.target.value)}
                                    className="w-20 rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                  />
                                  <span className="text-gray-600">min</span>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tempo máximo
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={pickupMaxTime}
                                    onChange={(e) => setPickupMaxTime(e.target.value)}
                                    className="w-20 rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                  />
                                  <span className="text-gray-600">min</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Balcão */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acceptsDineIn}
                              onChange={(e) => setAcceptsDineIn(e.target.checked)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="font-semibold text-gray-900">Aceitar pedidos no balcão (consumo no local)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Configurações de agendamento */}
                    <div className="border-t-2 pt-8">
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Configurações de agendamento</h2>
                        <p className="text-sm text-gray-600 mt-1">Configure as opções de agendamento para a sua loja.</p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptsScheduled}
                            onChange={(e) => setAcceptsScheduled(e.target.checked)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="font-semibold text-gray-900">Receber pedidos agendados</span>
                        </label>
                      </div>
                    </div>

                    {/* Interface dos Pedidos */}
                    <div className="border-t-2 pt-8">
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Interface dos Pedidos</h2>
                        <p className="text-sm text-gray-600 mt-1">Configure as colunas e status visíveis na página de pedidos.</p>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={useReadyColumn}
                            onChange={(e) => setUseReadyColumn(e.target.checked)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="font-medium text-gray-900">Usar coluna 'Pronto' (pedidos prontos para entrega)</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={useCompletedColumn}
                            onChange={(e) => setUseCompletedColumn(e.target.checked)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="font-medium text-gray-900">Usar coluna 'Finalizados' (pedidos entregues hoje)</span>
                        </label>
                      </div>
                    </div>

                    {/* Dados da Empresa */}
                    <div className="border-t-2 pt-8">
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Dados da Empresa</h2>
                        <p className="text-sm text-gray-600 mt-1">Informações cadastrais da sua empresa.</p>
                        <p className="text-xs text-gray-500 mt-2">Para alterar o CNPJ, nos chame no suporte.</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome/Razão Social:
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CNPJ:
                          </label>
                          <input
                            type="text"
                            value={cnpj}
                            disabled
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 bg-gray-100 text-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Situação Cadastral:
                          </label>
                          <input
                            type="text"
                            value={cnpjStatus}
                            disabled
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 bg-gray-100 text-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Atividade Principal (CNAE):
                          </label>
                          <input
                            type="text"
                            value={cnae}
                            disabled
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 bg-gray-100 text-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Microempreendedor Individual:
                          </label>
                          <input
                            type="text"
                            value={isMEI}
                            disabled
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 bg-gray-100 text-gray-600"
                          />
                        </div>

                        {cnpjValid && (
                          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <p className="text-green-800 font-semibold">✓ CNPJ Válido</p>
                            {cnpjAnalyzedAt && (
                              <p className="text-sm text-green-700 mt-1">Analisado em: {cnpjAnalyzedAt}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Salvar */}
                    <div className="border-t-2 pt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? "Salvando..." : "Salvar Alterações"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Horários */}
                {activeSection === 'horarios' && (
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Horários de funcionamento</h2>
                        <p className="text-sm text-gray-600 mt-1">Configure abaixo os dias e horários em que sua loja estará aberta para pedidos.</p>
                        <p className="text-sm text-gray-600">Importante: os horários de funcionamento levam em consideração o fuso horário da sua loja.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Agendar pausa
                        </button>
                        <button
                          type="button"
                          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>

                    {/* Horário atual */}
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Horário atual na loja</h3>
                      <div className="flex items-center gap-2 text-blue-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-2xl font-bold">{currentTime.split(',')[1]?.trim().split(' ')[0] || "00:00"}</span>
                        <span className="text-sm">{currentTime}</span>
                      </div>
                    </div>

                    {/* Dias da semana */}
                    <div className="space-y-6">
                      {[
                        { key: 'monday', label: 'Segunda-feira' },
                        { key: 'tuesday', label: 'Terça-feira' },
                        { key: 'wednesday', label: 'Quarta-feira' },
                        { key: 'thursday', label: 'Quinta-feira' },
                        { key: 'friday', label: 'Sexta-feira' },
                        { key: 'saturday', label: 'Sábado' },
                        { key: 'sunday', label: 'Domingo' },
                      ].map((day, dayIndex) => (
                        <div key={day.key}>
                          <h3 className="font-semibold text-gray-900 mb-3">{day.label}</h3>
                          {schedules[day.key]?.map((period, periodIndex) => (
                            <div key={periodIndex} className="flex items-center gap-3 mb-3">
                              {/* Horário de início */}
                              <div className="relative">
                                <input
                                  type="time"
                                  value={period.start}
                                  onChange={(e) => {
                                    const newSchedules = { ...schedules };
                                    newSchedules[day.key][periodIndex].start = e.target.value;
                                    setSchedules(newSchedules);
                                  }}
                                  className="w-28 px-3 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                />
                              </div>

                              <span className="text-gray-600">até</span>

                              {/* Horário de fim */}
                              <div className="relative">
                                <input
                                  type="time"
                                  value={period.end}
                                  onChange={(e) => {
                                    const newSchedules = { ...schedules };
                                    newSchedules[day.key][periodIndex].end = e.target.value;
                                    setSchedules(newSchedules);
                                  }}
                                  className="w-28 px-3 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                />
                              </div>

                              {/* Botão deletar */}
                              <button
                                type="button"
                                onClick={() => {
                                  const newSchedules = { ...schedules };
                                  newSchedules[day.key].splice(periodIndex, 1);
                                  if (newSchedules[day.key].length === 0) {
                                    newSchedules[day.key] = [{ start: "", end: "" }];
                                  }
                                  setSchedules(newSchedules);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}

                          {/* Botões de ação */}
                          <div className="flex gap-3 mt-3">
                            {dayIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const prevDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayIndex - 1];
                                  const newSchedules = { ...schedules };
                                  newSchedules[day.key] = JSON.parse(JSON.stringify(schedules[prevDay]));
                                  setSchedules(newSchedules);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Copiar horário acima
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newSchedules = { ...schedules };
                                newSchedules[day.key].push({ start: "17:30", end: "23:30" });
                                setSchedules(newSchedules);
                              }}
                              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Novo período
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder para outras seções */}
                {activeSection !== 'dados' && activeSection !== 'horarios' && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {menuItems.find(item => item.id === activeSection)?.label}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Esta seção está em desenvolvimento
                    </p>
                    <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      Em breve
                    </div>
                  </div>
                )}
              </div>
            </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
