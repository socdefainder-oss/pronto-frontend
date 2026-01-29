"use client";

import { useEffect, useState } from "react";
import { api, clearToken } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    restaurants: number;
  };
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await api("/api/admin/users");
      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("403") || err.message?.includes("admin")) {
        setError("Acesso negado. Apenas administradores.");
        setTimeout(() => router.push("/app"), 2000);
      } else {
        setError(err.message || "Erro ao carregar usuários");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      await api(`/api/admin/users/${id}/activate`, { method: "PATCH" });
      loadUsers();
    } catch (err: any) {
      alert("Erro ao ativar: " + err.message);
    }
  }

  async function handleBlock(id: string) {
    if (!confirm("Deseja bloquear este usuário?")) return;
    try {
      await api(`/api/admin/users/${id}/block`, { method: "PATCH" });
      loadUsers();
    } catch (err: any) {
      alert("Erro ao bloquear: " + err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ATENÇÃO: Deseja REMOVER permanentemente este usuário? Esta ação não pode ser desfeita!")) return;
    try {
      await api(`/api/admin/users/${id}`, { method: "DELETE" });
      loadUsers();
    } catch (err: any) {
      alert("Erro ao remover: " + err.message);
    }
  }

  useEffect(() => {
    loadUsers();
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
                <p className="text-sm text-gray-600">Gerenciar Usuários</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/restaurants"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Restaurantes
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
          <h2 className="text-2xl font-bold text-gray-900">Todos os Usuários</h2>
          <p className="mt-1 text-gray-600">
            {loading ? "Carregando..." : `${users.length} usuários no sistema`}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Restaurantes</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{u.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{u._count.restaurants}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {u.isActive ? "Ativo" : "Bloqueado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role !== "admin" && (
                            <>
                              {u.isActive ? (
                                <button
                                  onClick={() => handleBlock(u.id)}
                                  className="px-3 py-1 text-sm rounded-lg border border-orange-300 text-orange-700 hover:bg-orange-50 transition"
                                >
                                  Bloquear
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(u.id)}
                                  className="px-3 py-1 text-sm rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition"
                                >
                                  Ativar
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                              >
                                Remover
                              </button>
                            </>
                          )}
                          {u.role === "admin" && (
                            <span className="text-xs text-gray-500 italic">Protegido</span>
                          )}
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
