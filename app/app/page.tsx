"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, clearToken } from "../lib/api";
import { useRouter } from "next/navigation";

type Restaurant = { 
  id: string; 
  name: string; 
  slug: string; 
  phone: string; 
  logoUrl?: string | null;
  isActive?: boolean;
};

export default function AppHome() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Usuário");
  
  // User Management State
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"dono" | "gerente" | "operador">("operador");
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await api("/api/restaurants/mine");
      setRestaurants(data?.restaurants || []);
    } catch (e: any) {
      console.error("Erro ao carregar:", e);
      setErr(e.message || "Erro ao carregar restaurantes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Verifica se é admin e redireciona
    try {
      const userStr = localStorage.getItem("pronto_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "admin") {
          router.push("/admin/restaurants");
          return;
        }
        setUserName(user.name || user.email?.split("@")[0] || "Usuário");
      }
    } catch (e) {
      console.error("Erro ao carregar usuário:", e);
    }

    load();
  }, []);

  // Função para convidar usuário
  async function handleInviteUser() {
    setInviteError("");
    setInviteSuccess("");

    // Validações
    if (!inviteEmail.trim()) {
      setInviteError("Email é obrigatório");
      return;
    }

    if (!inviteEmail.includes("@")) {
      setInviteError("Email inválido");
      return;
    }

    if (selectedRestaurants.length === 0) {
      setInviteError("Selecione pelo menos um restaurante");
      return;
    }

    setInviteLoading(true);
    setInviteLink("");

    try {
      const response = await api("/api/restaurants/invite", {
        method: "POST",
        body: JSON.stringify({
          email: inviteEmail.trim().toLowerCase(),
          role: selectedRole,
          restaurantIds: selectedRestaurants,
        }),
      });

      // Se for usuário existente
      if (response.existingUser) {
        setInviteSuccess(`✅ Acesso concedido para ${inviteEmail}! O usuário já tem uma conta.`);
      } 
      // Se for novo usuário (convite criado)
      else if (response.invite) {
        // Verifica se email foi enviado com sucesso ou falhou
        const token = response.invite.token;
        const frontendUrl = window.location.origin;
        const link = `${frontendUrl}/auth/accept-invite/${token}`;
        
        setInviteLink(link);
        setInviteSuccess(`✅ Convite criado! Email enviado para ${inviteEmail}.`);
        setInviteError("");
      }
      
      // Limpar form após 5 segundos (mais tempo para copiar link)
      setTimeout(() => {
        setInviteEmail("");
        setSelectedRole("operador");
        setSelectedRestaurants([]);
        setInviteSuccess("");
        setInviteLink("");
        setShowUserManagement(false);
      }, 5000);

    } catch (error: any) {
      setInviteError(error.message || "Erro ao enviar convite");
    } finally {
      setInviteLoading(false);
    }
  }

  // Toggle restaurant selection
  function toggleRestaurant(restaurantId: string) {
    setSelectedRestaurants(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  }

  // Select all restaurants
  function selectAllRestaurants() {
    if (selectedRestaurants.length === restaurants.length) {
      setSelectedRestaurants([]);
    } else {
      setSelectedRestaurants(restaurants.map(r => r.id));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel pronto</h1>
                <p className="text-sm text-gray-600">Olá, {userName}!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUserManagement(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Gerenciar Usuários
              </button>
              <Link
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-lg"
                href="/app/restaurant/new"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Restaurante
              </Link>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-800 transition shadow-lg"
                onClick={() => { clearToken(); window.location.href = "/"; }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Meus Restaurantes</h2>
          <p className="mt-1 text-gray-600">
            {loading ? "Carregando..." : `${restaurants.length} ${restaurants.length === 1 ? "restaurante cadastrado" : "restaurantes cadastrados"}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
            <p className="mt-4 text-gray-600">Carregando restaurantes...</p>
          </div>
        )}

        {/* Error State */}
        {err && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-red-900">Erro ao carregar</h3>
                <p className="mt-1 text-red-700">{err}</p>
                <button
                  onClick={load}
                  className="mt-3 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restaurants Table */}
        {!loading && !err && (
          <>
            {restaurants.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Restaurante
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Telefone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {restaurants.map((r) => (
                        <tr 
                          key={r.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/app/restaurant/${r.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {r.logoUrl ? (
                                <img
                                  src={r.logoUrl}
                                  alt={r.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-gray-900">{r.name}</div>
                                {r.isActive !== undefined && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    r.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}>
                                    {r.isActive ? "Ativo" : "Inativo"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-gray-700">{r.slug}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                              <span className="font-mono">{r.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-gray-500">{r.id}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/r/${r.slug}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver Cardápio
                              </Link>
                              <Link
                                href={`/app/restaurant/${r.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                              >
                                Entrar
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum restaurante cadastrado</h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Comece criando seu primeiro restaurante para começar a gerenciar pedidos e produtos.
                </p>
                <Link
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
                  href="/app/restaurant/new"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Criar meu primeiro restaurante
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      {/* User Management Modal */}
      {showUserManagement && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-50 animate-in fade-in"
            onClick={() => setShowUserManagement(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
                      <p className="text-blue-100 text-sm">Convide colaboradores para seus restaurantes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserManagement(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Success Message */}
                {inviteSuccess && (
                  <div className="mb-6 rounded-xl border-l-4 border-green-500 bg-green-50 p-4 animate-in slide-in-from-top">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800 font-medium">{inviteSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Invite Link (for manual sharing) */}
                {inviteLink && (
                  <div className="mb-6 rounded-xl border-2 border-blue-300 bg-blue-50 p-5 animate-in slide-in-from-top">
                    <div className="flex items-start gap-3 mb-3">
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-blue-900 font-bold mb-1">📋 Link de Convite</p>
                        <p className="text-blue-800 text-sm mb-3">
                          Copie este link e envie manualmente para o usuário (WhatsApp, Telegram, etc.):
                        </p>
                        <div className="bg-white rounded-lg p-3 border border-blue-200 font-mono text-sm text-gray-700 break-all mb-3">
                          {inviteLink}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteLink);
                            alert("✅ Link copiado para a área de transferência!");
                          }}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copiar Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {inviteError && (
                  <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 animate-in slide-in-from-top">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800 font-medium">{inviteError}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email do Usuário *
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="usuario@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      O usuário receberá um email com instruções para acessar a plataforma
                    </p>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Nível de Acesso * 
 </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("operador")}
                        className={`p-4 rounded-xl border-2 transition ${
                          selectedRole === "operador"
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-center">
                          <div className="mb-2">👨‍💼</div>
                          <div className="font-bold text-sm">Operador</div>
                          <div className="text-xs text-gray-600 mt-1">Acesso básico</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("gerente")}
                        className={`p-4 rounded-xl border-2 transition ${
                          selectedRole === "gerente"
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-center">
                          <div className="mb-2">👔</div>
                          <div className="font-bold text-sm">Gerente</div>
                          <div className="text-xs text-gray-600 mt-1">Gerenciar produtos</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("dono")}
                        className={`p-4 rounded-xl border-2 transition ${
                          selectedRole === "dono"
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-center">
                          <div className="mb-2">👑</div>
                          <div className="font-bold text-sm">Dono</div>
                          <div className="text-xs text-gray-600 mt-1">Acesso total</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Restaurant Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-bold text-gray-700">
                        Selecione os Restaurantes *
                      </label>
                      <button
                        type="button"
                        onClick={selectAllRestaurants}
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {selectedRestaurants.length === restaurants.length ? "Desmarcar todos" : "Selecionar todos"}
                      </button>
                    </div>

                    <div className="border-2 border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2">
                      {restaurants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <p>Nenhum restaurante cadastrado</p>
                        </div>
                      ) : (
                        restaurants.map((restaurant) => (
                          <label
                            key={restaurant.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                          >
                            <input
                              type="checkbox"
                              checked={selectedRestaurants.includes(restaurant.id)}
                              onChange={() => toggleRestaurant(restaurant.id)}
                              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              {restaurant.logoUrl ? (
                                <img
                                  src={restaurant.logoUrl}
                                  alt={restaurant.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-gray-900">{restaurant.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{restaurant.slug}</div>
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUserManagement(false)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleInviteUser}
                  disabled={inviteLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-bold text-white hover:from-blue-700 hover:to-blue-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {inviteLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Convite
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



