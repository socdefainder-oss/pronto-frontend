"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  byStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
}

interface SalesByDay {
  date: string;
  revenue: number;
  orders: number;
}

interface PeakHour {
  hour: number;
  orders: number;
  revenue: number;
}

interface CategoryRevenue {
  categoryId: string | null;
  categoryName: string;
  revenue: number;
  quantity: number;
}

export default function ReportsPage({ params }: { params: { id: string } }) {
  const { id: restaurantId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "resumo";
  
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [salesByDay, setSalesByDay] = useState<SalesByDay[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [restaurantId, period]);

  async function loadData() {
    try {
      const token = localStorage.getItem("pronto_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const daysMap = { today: "1", week: "7", month: "30" };
      const days = daysMap[period];

      // Buscar todas as estatísticas em paralelo
      const [statsResponse, ordersResponse, salesResponse, peakResponse, categoryResponse] = await Promise.all([
        fetch(`${API_URL}/api/orders/restaurant/${restaurantId}/stats?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/orders/restaurant/${restaurantId}?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/${restaurantId}/sales-by-day?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/${restaurantId}/peak-hours?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/${restaurantId}/revenue-by-category?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      if (!statsResponse.ok) throw new Error("Erro ao carregar estatísticas");
      const statsData = await statsResponse.json();
      setStats(statsData);

      if (!ordersResponse.ok) throw new Error("Erro ao carregar pedidos");
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);

      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesByDay(salesData);
      }

      if (peakResponse.ok) {
        const peakData = await peakResponse.json();
        setPeakHours(peakData);
      }

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategoryRevenue(categoryData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // Calcular produtos mais vendidos
  const getTopProducts = () => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    orders.forEach((order) => {
      order.items?.forEach((item: any) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.priceCents * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2).replace(".", ",");
  };

  const periodLabels = {
    today: "Hoje",
    week: "Últimos 7 dias",
    month: "Último mês",
  };

  // Função para formatar hora (0-23 para "00:00")
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  // Função para formatar data curta (dd/mm)
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const topProducts = getTopProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link
                href={`/app`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Voltar</span>
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Relatórios e Análises
                </h1>
                <p className="text-sm text-gray-500 mt-1">Visualize o desempenho do seu negócio</p>
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2">
              {(["today", "week", "month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    period === p
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "resumo", label: "Resumo geral" },
                { key: "vendas", label: "Vendas" },
                { key: "atendimento", label: "Atendimento" },
                { key: "clientes", label: "Clientes" },
                { key: "cardapio", label: "Cardápio" },
                { key: "historico", label: "Histórico de pedidos" },
                { key: "produtos", label: "Produtos" },
                { key: "feedbacks", label: "Feedbacks" },
                { key: "qualidade", label: "Nível de qualidade" },
              ].map((tab) => (
                <Link
                  key={tab.key}
                  href={`/app/restaurant/${restaurantId}/reports?tab=${tab.key}`}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "resumo" && (
          <>
            {/* Resumo Geral - Dashboard */}
            <div className="space-y-6">
              {/* Header com Faturamento e Data */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Faturamento da sua loja</h2>
                    <div className="text-4xl font-bold text-emerald-600">
                      R$ {formatPrice(stats?.totalRevenue || 0)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition">
                      Data de hoje
                    </button>
                    <button className="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <select className="border-2 border-gray-200 rounded-lg px-3 py-1 text-gray-700 font-medium hover:border-emerald-500 focus:border-emerald-500 focus:outline-none">
                    <option>Todos os status</option>
                    <option>Em trânsito</option>
                    <option>Entregue</option>
                    <option>Pendente</option>
                    <option>Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Cards de Métricas Principais */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Faturamento Total */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Faturamento total</div>
                  <div className="text-2xl font-bold text-gray-900">R$ {formatPrice(stats?.totalRevenue || 0)}</div>
                </div>

                {/* Ticket Médio */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Ticket médio</div>
                  <div className="text-2xl font-bold text-gray-900">R$ {formatPrice(stats?.averageTicket || 0)}</div>
                </div>

                {/* Pedidos Entregues */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Pedidos Entregues no Período</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.byStatus?.delivered || 0}</div>
                </div>

                {/* Pedidos Recebidos */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Pedidos Recebidos no Período</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
                </div>
              </div>

              {/* Cards de Métricas Secundárias */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Pedidos Em Andamento */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Pedidos Em Andamento</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(stats?.byStatus?.preparing || 0) + (stats?.byStatus?.confirmed || 0) + (stats?.byStatus?.ready || 0) + (stats?.byStatus?.delivering || 0)}
                  </div>
                </div>

                {/* Pedidos Rejeitados */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Pedidos Rejeitados</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.byStatus?.cancelled || 0}</div>
                </div>

                {/* Cupons Utilizados */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Cupons utilizados</div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                </div>

                {/* Descontos em Cupons */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Descontos em cupons</div>
                  <div className="text-2xl font-bold text-gray-900">R$ 0,00</div>
                </div>

                {/* Disparos */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Disparos</div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                </div>

                {/* Clientes Novos */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Clientes novos</div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                </div>
              </div>

              {/* Formas de Pagamento e Tipos de Pedido */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Formas de Pagamento */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Formas de pagamento
                  </h3>
                  <div className="space-y-3">
                    {stats?.byPaymentStatus && Object.entries(stats.byPaymentStatus).length > 0 ? (
                      Object.entries(stats.byPaymentStatus).map(([status, count]) => {
                        const paymentLabels: Record<string, string> = {
                          pending: "Pendente",
                          paid: "Pago",
                          failed: "Falhou",
                        };
                        const total = stats?.totalOrders || 1;
                        const percentage = Math.round((count / total) * 100);

                        return (
                          <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">{paymentLabels[status]}</span>
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-gray-600">{percentage}%</div>
                              <div className="text-lg font-bold text-gray-900">{count}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>
                    )}
                  </div>
                </div>

                {/* Tipos de Pedido */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tipos de pedido
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Delivery</span>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">0%</div>
                        <div className="text-lg font-bold text-gray-900">0</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Retirada</span>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">0%</div>
                        <div className="text-lg font-bold text-gray-900">0</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">No local</span>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">0%</div>
                        <div className="text-lg font-bold text-gray-900">0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab Vendas */}
        {activeTab === "vendas" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input type="date" className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium" defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                  <span className="text-gray-500 font-medium">-</span>
                  <input type="date" className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-2">Total em vendas</p>
                <p className="text-5xl font-bold text-emerald-600">R$ {formatPrice(stats?.totalRevenue || 0)}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Faturamento bruto</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">R$ {formatPrice(stats?.totalRevenue || 0)}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Total de Pedidos</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Ticket Médio</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">R$ {formatPrice(stats?.averageTicket || 0)}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-sm text-gray-600">Pedidos com cupom</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Desempenho - Faturamento, Pedidos e Clientes</h3>
                <div className="h-64">
                  {salesByDay && salesByDay.length > 0 ? (
                    <div className="h-full flex items-end justify-between gap-1">
                      {salesByDay.map((day, index) => {
                        const maxRevenue = Math.max(...salesByDay.map(d => d.revenue));
                        const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-emerald-500 rounded-t hover:bg-emerald-600 transition cursor-pointer" style={{ height: `${height}%` }} title={`${formatDateShort(day.date)}: R$ ${formatPrice(day.revenue)}`}></div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">Nenhum dado disponível</div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-gray-700">Faturamento</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-gray-700">Pedidos</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div><span className="text-gray-700">Clientes</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Plataforma</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-48 h-48" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2 0" transform="rotate(-90 50 50)" />
                      <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-sm font-bold fill-gray-700">Menu: 100%</text>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-gray-700">Menu</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Investimento em cupons
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contagem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor investido (R$)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor patrocinado (R$)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket médio (R$)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor total faturado (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Pedidos sem cupom</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{stats?.totalOrders || 0}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">R$ 0,00</td>
                      <td className="px-4 py-4 text-sm text-gray-700">R$ 0,00</td>
                      <td className="px-4 py-4 text-sm text-gray-700">R$ {formatPrice(stats?.averageTicket || 0)}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">R$ {formatPrice(stats?.totalRevenue || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Registros por página: 5</span>
                <span>1-1 de 1</span>
              </div>
            </div>
          </div>
        )}

        {/* Outras Tabs - Em desenvolvimento */}
        {activeTab !== "resumo" && activeTab !== "vendas" && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-12">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relatório em desenvolvimento</h3>
              <p className="text-gray-600">Esta seção estará disponível em breve.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
