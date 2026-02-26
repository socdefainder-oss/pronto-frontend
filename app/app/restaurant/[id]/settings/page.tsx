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

  // Estados para Usuários
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    cpf: "",
    role: "operador" as "operador" | "gerente" | "dono",
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
          schedules,
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

  // Salvar horários
  async function handleSaveSchedules() {
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
        body: JSON.stringify({ schedules }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar horários");
      }

      setSuccess("Horários salvos com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Funções para gerenciar usuários
  async function loadUsers() {
    const token = getToken();
    if (!token) return;

    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao carregar usuários");

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    if (activeSection === 'usuarios') {
      loadUsers();
    }
  }, [activeSection]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao criar usuário");
      }

      const data = await res.json();
      
      if (data.emailSent) {
        setSuccess(`✅ Usuário criado! Um email com a senha foi enviado para ${userForm.email}`);
      } else {
        setSuccess("Usuário criado com sucesso!");
      }
      
      setShowUserModal(false);
      setUserForm({
        nome: "",
        email: "",
        whatsapp: "",
        cpf: "",
        role: "operador",
      });
      loadUsers();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(userId: string, isOwner: boolean) {
    if (isOwner) {
      alert("Não é possível remover o dono do restaurante");
      return;
    }

    if (!confirm("Tem certeza que deseja remover este usuário?")) return;

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao remover usuário");

      setSuccess("Usuário removido com sucesso!");
      loadUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao remover usuário");
    }
  }

  const roleDescriptions = {
    operador: "Sem permissão ao financeiro e Relatórios",
    gerente: "Sem permissão a configurações de repasse",
    dono: "Permissão total",
  };

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
                          <div className="mt-2 flex items-center gap-2">
                            <p className="text-sm text-gray-600">
                              Este será o link do seu cardápio:{" "}
                              <a 
                                href={`https://pronto-frontend-rust.vercel.app/r/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-600 hover:underline"
                              >
                                pronto-frontend-rust.vercel.app/r/{slug || "seu-link"}
                              </a>
                            </p>
                            {slug && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://pronto-frontend-rust.vercel.app/r/${slug}`);
                                  alert('Link copiado para a área de transferência!');
                                }}
                                className="p-1 text-gray-600 hover:text-blue-600"
                                title="Copiar link"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                          </div>
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
                          onClick={handleSaveSchedules}
                          disabled={saving}
                          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? "Salvando..." : "Salvar"}
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
                {activeSection !== 'dados' && activeSection !== 'horarios' && activeSection !== 'usuarios' && (
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

                {/* Seção de Usuários */}
                {activeSection === 'usuarios' && (
                  <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
                    <div className="p-8 border-b-2 border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
                          <p className="text-gray-600 mt-1">Adicione usuários com diferentes níveis de permissão</p>
                        </div>
                        <button
                          onClick={() => setShowUserModal(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Criar Novo Usuário
                        </button>
                      </div>
                    </div>

                    <div className="p-8">
                      {loadingUsers ? (
                        <div className="text-center py-12">
                          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="mt-4 text-gray-600">Carregando usuários...</p>
                        </div>
                      ) : users.length === 0 ? (
                        <div className="text-center py-12">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum usuário adicional</h3>
                          <p className="text-gray-600">Clique em "Criar Novo Usuário" para adicionar um usuário</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                      {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                  </div>
                                  {user.isOwner && (
                                    <span className="ml-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                                      PROPRIETÁRIO
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                  {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      {user.phone}
                                    </div>
                                  )}
                                  {user.cpf && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                      </svg>
                                      CPF: {user.cpf}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div
                                    className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${
                                      user.role === 'dono'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                        : user.role === 'gerente'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                        : 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                                    }`}
                                  >
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {roleDescriptions[user.role as keyof typeof roleDescriptions]}
                                  </p>
                                </div>

                                {!user.isOwner && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.isOwner)}
                                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Remover usuário"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
      </main>

      {/* Modal de Criar Usuário */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Criar Novo Usuário</h2>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userForm.nome}
                  onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="Nome completo do usuário"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={userForm.whatsapp}
                    onChange={(e) => setUserForm({ ...userForm, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={userForm.cpf}
                    onChange={(e) => setUserForm({ ...userForm, cpf: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {(['operador', 'gerente', 'dono'] as const).map((role) => (
                    <label
                      key={role}
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                        userForm.role === role
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={userForm.role === role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 mb-1">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {roleDescriptions[role]}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Criando..." : "Criar Usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


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
