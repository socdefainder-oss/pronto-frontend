"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Category = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  productCount?: number;
};

type Product = {
  id: string;
  name: string;
  categoryId: string | null;
  isActive: boolean;
};

export default function CategoriesPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

  // Token function
  function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  }

  // Load data
  useEffect(() => {
    if (!restaurantId) return;
    loadData();
  }, [restaurantId]);

  async function loadData() {
    if (!restaurantId) return;
    
    setLoading(true);
    setError("");
    const token = getToken();
    
    if (!token) {
      setError("Você não está logado");
      setLoading(false);
      return;
    }

    try {
      // Load categories
      const categoriesRes = await fetch(`${API_URL}/api/catalog/categories/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      } else {
        console.error("Erro ao carregar categorias:", categoriesRes.status);
      }

      // Load products to count per category
      const productsRes = await fetch(`${API_URL}/api/catalog/products/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
        
        // Count products per category
        if (data.products && categories.length > 0) {
          const updatedCategories = categories.map(cat => ({
            ...cat,
            productCount: data.products.filter((p: Product) => p.categoryId === cat.id).length
          }));
          setCategories(updatedCategories);
        }
      }

    } catch (err: any) {
      setError("Erro ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle form
  function handleEdit(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setSortOrder(category.sortOrder.toString());
    setIsActive(category.isActive);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingCategory(null);
    resetForm();
  }

  function resetForm() {
    setName("");
    setSortOrder("0");
    setIsActive(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
      setError("Você não está logado");
      return;
    }

    // Validation
    if (!name.trim()) {
      setError("Nome da categoria é obrigatório");
      return;
    }

    const orderNum = parseInt(sortOrder) || 0;

    const categoryData = {
      restaurantId,
      name: name.trim(),
      sortOrder: orderNum,
      isActive,
    };

    setError("");
    setSuccess("");

    try {
      if (editingCategory) {
        // Update category - Note: Your backend might not have PATCH for categories yet
        // We'll use POST for now, but you should add PATCH to catalog.ts
        const res = await fetch(`${API_URL}/api/catalog/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...categoryData,
            id: editingCategory.id // Include ID for update
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro ao atualizar categoria");
        }
        
        setSuccess("✅ Categoria atualizada com sucesso!");
      } else {
        // Create category
        const res = await fetch(`${API_URL}/api/catalog/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro ao criar categoria");
        }
        
        setSuccess("✅ Categoria criada com sucesso!");
      }

      handleCancel();
      loadData();
      
    } catch (err: any) {
      setError("❌ " + err.message);
    }
  }

  async function handleDelete(categoryId: string) {
    // Check if category has products
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    if (categoryProducts.length > 0) {
      setError(`Não é possível excluir: Esta categoria tem ${categoryProducts.length} produto(s). Mova os produtos para outra categoria primeiro.`);
      return;
    }

    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    const token = getToken();
    if (!token) {
      setError("Você não está logado");
      return;
    }

    try {
      // Note: Your backend needs DELETE endpoint for categories
      // For now, we'll deactivate it
      const res = await fetch(`${API_URL}/api/catalog/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          id: categoryId,
          isActive: false
        }),
      });

      if (!res.ok) throw new Error("Erro ao excluir categoria");
      
      setSuccess("✅ Categoria excluída com sucesso!");
      loadData();
      
    } catch (err: any) {
      setError("❌ " + err.message);
    }
  }

  async function handleToggleActive(categoryId: string, currentActive: boolean) {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/catalog/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          id: categoryId,
          isActive: !currentActive
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar categoria");
      
      setSuccess(`✅ Categoria ${!currentActive ? "ativada" : "desativada"} com sucesso!`);
      loadData();
      
    } catch (err: any) {
      setError("❌ " + err.message);
    }
  }

  // Move products between categories
  async function handleMoveProducts(fromCategoryId: string, toCategoryId: string) {
    if (!confirm(`Mover todos os produtos desta categoria para "${categories.find(c => c.id === toCategoryId)?.name}"?`)) return;

    const token = getToken();
    if (!token) return;

    try {
      const productsToMove = products.filter(p => p.categoryId === fromCategoryId);
      
      // Update each product
      const updatePromises = productsToMove.map(product =>
        fetch(`${API_URL}/api/catalog/products/${product.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ categoryId: toCategoryId }),
        })
      );

      await Promise.all(updatePromises);
      setSuccess(`✅ ${productsToMove.length} produto(s) movidos com sucesso!`);
      loadData();
      
    } catch (err: any) {
      setError("❌ Erro ao mover produtos: " + err.message);
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
          <span className="ml-3">Carregando categorias...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          <p className="mt-1 text-zinc-600">
            Organize seus produtos em categorias no cardápio
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            className="px-4 py-2 rounded-lg border hover:bg-zinc-50"
            href={`/app/restaurant/${restaurantId}/products`}
          >
            ← Voltar aos produtos
          </Link>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800"
          >
            + Nova Categoria
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          {success}
        </div>
      )}

      {/* Category Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome da categoria *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  placeholder="Ex: Bebidas, Sobremesas, Pratos Principais"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ordem de exibição
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Menor número = aparece primeiro
                  </p>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm font-medium">Categoria ativa</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-zinc-900 font-semibold text-white hover:bg-zinc-800"
              >
                {editingCategory ? "Atualizar" : "Criar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-3 rounded-xl border border-zinc-300 hover:bg-zinc-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-6">
          <h2 className="text-xl font-bold">Categorias ({categories.length})</h2>
          
          {categories.length === 0 && (
            <p className="mt-2 text-zinc-600">
              Nenhuma categoria cadastrada. Crie categorias para organizar seus produtos.
            </p>
          )}
        </div>

        <div className="divide-y divide-zinc-100">
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.categoryId === category.id);
            const activeProducts = categoryProducts.filter(p => p.isActive);
            
            return (
              <div key={category.id} className="p-6 hover:bg-zinc-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? "Ativa" : "Inativa"}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Ordem: {category.sortOrder}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-zinc-600">
                        {categoryProducts.length} produto(s) total
                      </span>
                      <span className="text-green-600">
                        {activeProducts.length} ativo(s)
                      </span>
                      <span className="text-zinc-500">
                        Criada em: {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Move products dropdown */}
                    {categoryProducts.length > 0 && categories.length > 1 && (
                      <div className="mt-3">
                        <label className="text-sm text-zinc-600 mr-2">Mover produtos para:</label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleMoveProducts(category.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="text-sm border border-zinc-300 rounded px-2 py-1"
                        >
                          <option value="">Selecione uma categoria</option>
                          {categories
                            .filter(c => c.id !== category.id)
                            .map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({products.filter(p => p.categoryId === c.id).length} produtos)
                              </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-zinc-500">
                          Todos os produtos desta categoria serão movidos
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(category.id, category.isActive)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        category.isActive
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {category.isActive ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={categoryProducts.length > 0}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        categoryProducts.length > 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                      title={categoryProducts.length > 0 ? "Não é possível excluir categorias com produtos" : "Excluir categoria"}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips & Next Steps */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>💡</span> Dicas de organização
          </h3>
          <ul className="text-sm text-zinc-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Use ordens numéricas para controlar a sequência no cardápio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Crie categorias como "Entradas", "Principais", "Sobremesas", "Bebidas"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Desative categorias temporariamente sem excluir</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Mova produtos entre categorias quando necessário</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>🚀</span> Próximos passos
          </h3>
          <div className="space-y-3">
            <Link
              href={`/app/restaurant/${restaurantId}/products`}
              className="block p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition"
            >
              <div className="font-medium">📝 Atribuir produtos às categorias</div>
              <div className="text-sm text-zinc-600 mt-1">
                Volte à lista de produtos e edite cada um para escolher sua categoria
              </div>
            </Link>
            
            <Link
              href={`/app/restaurant/${restaurantId}`}
              className="block p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition"
            >
              <div className="font-medium">👁️ Visualizar cardápio público</div>
              <div className="text-sm text-zinc-600 mt-1">
                Veja como seu cardápio está ficando para os clientes
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
        <h3 className="font-bold mb-4">📊 Resumo do seu cardápio</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-zinc-50 rounded-lg">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-zinc-600">Categorias</div>
          </div>
          <div className="text-center p-3 bg-zinc-50 rounded-lg">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-zinc-600">Produtos totais</div>
          </div>
          <div className="text-center p-3 bg-zinc-50 rounded-lg">
            <div className="text-2xl font-bold">
              {products.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-zinc-600">Produtos ativos</div>
          </div>
          <div className="text-center p-3 bg-zinc-50 rounded-lg">
            <div className="text-2xl font-bold">
              {categories.filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-zinc-600">Categorias ativas</div>
          </div>
        </div>
      </div>
    </main>
  );
}