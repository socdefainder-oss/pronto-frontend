"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

interface Order {
  id: string;
  orderNumber: number;
  status: string;
  totalCents: number;
  deliveryFeeCents: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
  };
  address?: {
    street: string;
    number: string;
    district: string;
    city: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    priceCents: number;
  }>;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  delivering: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  preparing: "bg-purple-100 text-purple-800 border-purple-300",
  ready: "bg-green-100 text-green-800 border-green-300",
  delivering: "bg-indigo-100 text-indigo-800 border-indigo-300",
  delivered: "bg-gray-100 text-gray-800 border-gray-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function OrdersPage({ params }: { params: { id: string } }) {
  const { id: restaurantId } = params;
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [restaurantId, selectedStatus]);

  async function loadOrders() {
    try {
      const token = localStorage.getItem("pronto_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const statusQuery = selectedStatus !== "all" ? `?status=${selectedStatus}` : "";
      const response = await fetch(
        `${API_URL}/api/orders/restaurant/${restaurantId}${statusQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao carregar pedidos");

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const token = localStorage.getItem("pronto_token");
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");

      loadOrders();
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await response.json();
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2).replace(".", ",");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Pedidos
                </h1>
                <p className="text-sm text-gray-500 mt-1">{orders.length} pedido(s) encontrado(s)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { value: "all", label: "Todos" },
              { value: "pending", label: "Pendentes" },
              { value: "confirmed", label: "Confirmados" },
              { value: "preparing", label: "Preparando" },
              { value: "ready", label: "Prontos" },
              { value: "delivering", label: "Saindo" },
              { value: "delivered", label: "Entregues" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  selectedStatus === filter.value
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Os pedidos aparecerão aqui quando os clientes fizerem compras.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl font-bold text-emerald-600">#{order.orderNumber}</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Cliente</div>
                        <div className="font-semibold text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-600">{order.customer.phone}</div>
                      </div>
                      {order.address && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Endereço</div>
                          <div className="text-sm text-gray-900">
                            {order.address.street}, {order.address.number}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.address.district}, {order.address.city}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-sm text-gray-500 mb-2">Itens:</div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="font-semibold">R$ {formatPrice(item.priceCents * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-sm text-gray-500 mb-1">Total</div>
                    <div className="text-3xl font-bold text-gray-900">
                      R$ {formatPrice(order.totalCents)}
                    </div>
                    {order.deliveryFeeCents > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        (+ R$ {formatPrice(order.deliveryFeeCents)} entrega)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Pedido #{selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Status Change */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alterar Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Cliente</h3>
                <p className="text-gray-700">{selectedOrder.customer.name}</p>
                <p className="text-gray-600 text-sm">{selectedOrder.customer.phone}</p>
              </div>

              {/* Address */}
              {selectedOrder.address && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">Endereço de Entrega</h3>
                  <p className="text-gray-700">
                    {selectedOrder.address.street}, {selectedOrder.address.number}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedOrder.address.district}, {selectedOrder.address.city}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Itens do Pedido</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <div className="font-semibold text-gray-900">{item.productName}</div>
                      <div className="text-sm text-gray-500">Quantidade: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        R$ {formatPrice(item.priceCents * item.quantity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        R$ {formatPrice(item.priceCents)} cada
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">
                    R$ {formatPrice(selectedOrder.totalCents - selectedOrder.deliveryFeeCents)}
                  </span>
                </div>
                {selectedOrder.deliveryFeeCents > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Taxa de Entrega</span>
                    <span className="font-semibold">R$ {formatPrice(selectedOrder.deliveryFeeCents)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t-2 border-emerald-300">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    R$ {formatPrice(selectedOrder.totalCents)}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-500">Forma de Pagamento</div>
                  <div className="font-semibold">{selectedOrder.paymentMethod || "Não informado"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status Pagamento</div>
                  <div className="font-semibold">{selectedOrder.paymentStatus === "paid" ? "Pago" : "Pendente"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
