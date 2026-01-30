"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: restaurantId } = use(params);
  const router = useRouter();
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
          <div className="flex items-center justify-between flex-wrap gap-4">
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
        </div>

        {/* Main Metrics */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium opacity-90">Faturamento</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              R$ {formatPrice(stats?.totalRevenue || 0)}
            </div>
            <div className="text-sm opacity-90">{periodLabels[period]}</div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600">Total de Pedidos</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats?.totalOrders || 0}
            </div>
            <div className="text-sm text-gray-500">{periodLabels[period]}</div>
          </div>

          {/* Average Ticket */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
             ales by Day Chart */}
        {salesByDay.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Vendas Diárias - Faturamento
            </h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Simple line chart */}
                <div className="relative h-64 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 50}
                        x2="800"
                        y2={i * 50}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Line chart */}
                    {(() => {
                      const maxRevenue = Math.max(...salesByDay.map(d => d.revenue), 1);
                      const points = salesByDay.map((day, i) => {
                        const x = (i / (salesByDay.length - 1)) * 800;
                        const y = 200 - (day.revenue / maxRevenue) * 180;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      return (
                        <>
                          {/* Area fill */}
                          <polygon
                            points={`0,200 ${points} 800,200`}
                            fill="url(#gradient)"
                            opacity="0.3"
                          />
                          {/* Line */}
                          <polyline
                            points={points}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Points */}
                          {salesByDay.map((day, i) => {
                            const x = (i / (salesByDay.length - 1)) * 800;
                            const y = 200 - (day.revenue / maxRevenue) * 180;
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#10b981"
                              />
                            );
                          })}
                        </>
                      );
                    })()}
                    
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-gray-600 px-2">
                  {salesByDay.map((day, i) => {
                    // Show label every N days based on period
                    const showLabel = period === "today" || 
                                     (period === "week" && i % 1 === 0) || 
                                     (period === "month" && i % 5 === 0);
                    return showLabel ? (
                      <div key={i} className="text-center">
                        {formatDateShort(day.date)}
                      </div>
                    ) : <div key={i}></div>;
                  })}
                </div>

                {/* Stats below chart */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Maior Venda</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      R$ {formatPrice(Math.max(...salesByDay.map(d => d.revenue)))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Média Diária</div>
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {formatPrice(salesByDay.reduce((sum, d) => sum + d.revenue, 0) / salesByDay.length)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Dia com Mais Pedidos</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...salesByDay.map(d => d.orders))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Peak Hours Chart */}
        {peakHours.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Horários de Pico
            </h3>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Bar chart */}
                <div className="flex items-end justify-between h-64 gap-1 mb-2">
                  {peakHours.map((hour) => {
                    const maxOrders = Math.max(...peakHours.map(h => h.orders), 1);
                    const heightPercentage = (hour.orders / maxOrders) * 100;
                    
                    return (
                      <div key={hour.hour} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full">
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                              <div className="font-bold">{formatHour(hour.hour)}</div>
                              <div>{hour.orders} pedidos</div>
                              <div>R$ {formatPrice(hour.revenue)}</div>
                            </div>
                          </div>
                          
                          {/* Bar */}
                          <div
                            className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all hover:from-emerald-700 hover:to-teal-600 cursor-pointer"
                            style={{ height: `${heightPercentage}%` }}
                          >
                            {hour.orders > 0 && (
                              <div className="text-xs text-white font-bold text-center pt-1">
                                {hour.orders > 2 ? hour.orders : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels (hours) */}
                <div className="flex justify-between text-xs text-gray-600">
                  {peakHours.map((hour, i) => (
                    i % 2 === 0 ? (
                      <div key={hour.hour} className="flex-1 text-center">
                        {formatHour(hour.hour)}
                      </div>
                    ) : <div key={hour.hour} className="flex-1"></div>
                  ))}
                </div>

                {/* Best hours */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {peakHours
                    .sort((a, b) => b.orders - a.orders)
                    .slice(0, 3)
                    .map((hour, index) => (
                      <div key={hour.hour} className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            'bg-orange-400 text-orange-900'
                          }`}>
                            {index + 1}º
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{formatHour(hour.hour)}</div>
                        </div>
                        <div className="text-sm text-gray-600">{hour.orders} pedidos</div>
                        <div className="text-sm font-semibold text-emerald-700">R$ {formatPrice(hour.revenue)}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue by Category */}
        {categoryRevenue.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Faturamento por Categoria
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie chart visual */}
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {(() => {
                    const total = categoryRevenue.reduce((sum, cat) => sum + cat.revenue, 0);
                    let currentAngle = 0;
                    const colors = [
                      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
                      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
                    ];

                    return (
                      <svg className="w-full h-full" viewBox="0 0 200 200">
                        {categoryRevenue.map((cat, index) => {
                          const percentage = (cat.revenue / total) * 100;
                          const angle = (percentage / 100) * 360;
                          
                          // Calculate path for pie slice
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          currentAngle = endAngle;

                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (endAngle - 90) * (Math.PI / 180);

                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);

                          const largeArc = angle > 180 ? 1 : 0;

                          const pathData = [
                            `M 100 100`,
                            `L ${x1} ${y1}`,
                            `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
                            `Z`
                          ].join(' ');

                          return (
                            <g key={index}>
                              <path
                                d={pathData}
                                fill={colors[index % colors.length]}
                                opacity="0.9"
                                className="hover:opacity-100 transition cursor-pointer"
                              />
                            </g>
                          );
                        })}
                        {/* Center circle for donut effect */}
                        <circle cx="100" cy="100" r="50" fill="white" />
                        <text x="100" y="95" textAnchor="middle" className="text-xs font-bold fill-gray-700">
                          Total
                        </text>
                        <text x="100" y="110" textAnchor="middle" className="text-sm font-bold fill-emerald-600">
                          R$ {formatPrice(total)}
                        </text>
                      </svg>
                    );
                  })()}
                </div>
              </div>

              {/* Legend and data */}
              <div className="space-y-3">
                {categoryRevenue.map((cat, index) => {
                  const total = categoryRevenue.reduce((sum, c) => sum + c.revenue, 0);
                  const percentage = Math.round((cat.revenue / total) * 100);
                  const colors = [
                    'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-red-500', 'bg-purple-500',
                    'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-lime-500'
                  ];

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{cat.categoryName}</div>
                          <div className="text-sm text-gray-600">{cat.quantity} itens vendidos</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">R$ {formatPrice(cat.revenue)}</div>
                        <div className="text-sm text-gray-600">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* S   </svg>
              </div>
              <span className="text-sm font-medium text-gray-600">Ticket Médio</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              R$ {formatPrice(stats?.averageTicket || 0)}
            </div>
            <div className="text-sm text-gray-500">Por pedido</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Orders by Status */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Status dos Pedidos
            </h3>
            <div className="space-y-3">
              {Object.entries(stats?.byStatus || {}).map(([status, count]) => {
                const statusLabels: Record<string, string> = {
                  pending: "Pendentes",
                  confirmed: "Confirmados",
                  preparing: "Preparando",
                  ready: "Prontos",
                  delivering: "Saindo",
                  delivered: "Entregues",
                  cancelled: "Cancelados",
                };
                const total = stats?.totalOrders || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700">{statusLabels[status]}</span>
                      <span className="text-gray-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Status de Pagamento
            </h3>
            <div className="space-y-4">
              {Object.entries(stats?.byPaymentStatus || {}).map(([status, count]) => {
                const paymentLabels: Record<string, string> = {
                  pending: "Pendente",
                  paid: "Pago",
                  failed: "Falhou",
                };
                const total = stats?.totalOrders || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-bold text-gray-900">{paymentLabels[status]}</div>
                      <div className="text-sm text-gray-600">{percentage}% do total</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Produtos Mais Vendidos
          </h3>

          {topProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600">Ainda não há vendas neste período</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-700">#</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700">Produto</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-700">Quantidade</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-700">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-200 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">{product.name}</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">{product.quantity}x</td>
                      <td className="py-4 px-4 text-right font-bold text-emerald-600">
                        R$ {formatPrice(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
