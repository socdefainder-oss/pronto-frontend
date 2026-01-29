"use client";

import { useEffect, useState } from "react";
import { api, clearToken } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
};

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRestaurants() {
    try {
      setLoading(true);
      const data = await api("/api/admin/restaurants");
      setRestaurants(data.restaurants || []);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("403") || err.message?.includes("admin")) {
        setError("Acesso negado. Apenas administradores.");
        setTimeout(() => router.push("/app"), 2000);
      } else {
        setError(err.message || "Erro ao carregar restaurantes");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      await api(`/api/admin/restaurants/${id}/activate`, { method: "PATCH" });
      loadRestaurants();
    } catch (err: any) {
      alert("Erro ao ativar: " + err.message);
    }
  }

  async function handleBlock(id: string) {
    if (!confirm("Deseja bloquear este restaurante?")) return;
    try {
      await api(`/api/admin/restaurants/${id}/block`, { method: "PATCH" });
      loadRestaurants();
    } catch (err: any) {
      alert("Erro ao bloquear: " + err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ATENÇÃO: Deseja REMOVER permanentemente este restaurante? Esta ação não pode ser desfeita!")) return;
    try {
      await api(`/api/admin/restaurants/${id}`, { method: "DELETE" });
      loadRestaurants();
    } catch (err: any) {
      alert("Erro ao remover: " + err.message);
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
                <p className="text-sm text-gray-600">Gerenciar Restaurantes</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Usuários
              </Link>
              <Link
                href="/app"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Voltar
              </Link>
              <button
                onClick={() => { clearToken(); window.location.href = "/"; }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Todos os Restaurantes</h2>
          <p className="mt-1 text-gray-600">
            {loading ? "Carregando..." : `${restaurants.length} restaurantes no sistema`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Nome</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Dono</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {restaurants.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{r.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-700">{r.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{r.owner.name}</div>
                        <div className="text-xs text-gray-500">{r.owner.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          r.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {r.isActive ? "Ativo" : "Bloqueado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.isActive ? (
                            <button
                              onClick={() => handleBlock(r.id)}
                              className="px-3 py-1 text-sm rounded-lg border border-orange-300 text-orange-700 hover:bg-orange-50 transition"
                            >
                              Bloquear
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(r.id)}
                              className="px-3 py-1 text-sm rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition"
                            >
                              Ativar
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
