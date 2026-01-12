"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  isActive: boolean;
  sortOrder: number;
  categoryId: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params?.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

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
      // Load products
      const productsRes = await fetch(`${API_URL}/api/catalog/products/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      } else {
        console.error("Erro ao carregar produtos:", productsRes.status);
      }

      // Load categories
      const categoriesRes = await fetch(`${API_URL}/api/catalog/categories/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }

    } catch (err: any) {
      setError("Erro ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle form
  function handleEdit(product: Product) {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice((product.priceCents / 100).toString());
    setCategoryId(product.categoryId || "");
    setIsActive(product.isActive);
    setImageUrl(product.imageUrl || "");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  }

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setIsActive(true);
    setImageUrl("");
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
      setError("Nome do produto é obrigatório");
      return;
    }

    const priceCents = Math.round(parseFloat(price) * 100);
    if (isNaN(priceCents) || priceCents < 0) {
      setError("Preço inválido");
      return;
    }

    const productData = {
      restaurantId,
      name: name.trim(),
      description: description.trim() || null,
      priceCents,
      categoryId: categoryId || null,
      isActive,
      imageUrl: imageUrl.trim() || null,
    };

    setError("");
    setSuccess("");

    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`${API_URL}/api/catalog/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro ao atualizar produto");
        }
        
        setSuccess("✅ Produto atualizado com sucesso!");
      } else {
        // Create product
        const res = await fetch(`${API_URL}/api/catalog/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro ao criar produto");
        }
        
        setSuccess("✅ Produto criado com sucesso!");
      }

      handleCancel();
      loadData();
      
    } catch (err: any) {
      setError("❌ " + err.message);
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const token = getToken();
    if (!token) {
      setError("Você não está logado");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/catalog/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir produto");
      
      setSuccess("✅ Produto excluído com sucesso!");
      loadData();
      
    } catch (err: any) {
      setError("❌ " + err.message);
    }
  }

  async function handleToggleActive(productId: string, currentActive: boolean) {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/catalog/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar produto");
      
      setSuccess(`✅ Produto ${!currentActive ? "ativado" : "desativado"} com sucesso!`);
      loadData();
      
    } catch (err: any) {
      setError("❌ " + err.message);
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
          <span className="ml-3">Carregando produtos...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
          <p className="mt-1 text-zinc-600">
            Cadastre e organize os produtos do seu cardápio
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            className="px-4 py-2 rounded-lg border hover:bg-zinc-50"
            href={`/app/restaurant/${restaurantId}`}
          >
            ← Voltar
          </Link>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800"
          >
            + Novo Produto
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

      {/* Product Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? "Editar Produto" : "Novo Produto"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do produto *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  placeholder="Ex: Açaí 500ml"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  placeholder="Ex: 19.90"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Será salvo como: R$ {price || "0.00"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  placeholder="Ex: Açaí cremoso com granola, leite condensado..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-zinc-500">
                  {categories.length === 0 && "Crie categorias primeiro"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  URL da imagem (opcional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-zinc-300"
                  />
                  <span className="text-sm font-medium">Produto ativo no cardápio</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-zinc-900 font-semibold text-white hover:bg-zinc-800"
              >
                {editingProduct ? "Atualizar" : "Criar"}
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

      {/* Products List */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Produtos ({products.length})</h2>
            <button
              onClick={() => router.push(`/app/restaurant/${restaurantId}/categories`)}
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Gerenciar categorias →
            </button>
          </div>
          
          {products.length === 0 && (
            <p className="mt-2 text-zinc-600">
              Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
            </p>
          )}
        </div>

        <div className="divide-y divide-zinc-100">
          {products.map((product) => (
            <div key={product.id} className="p-6 hover:bg-zinc-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  
                  {product.description && (
                    <p className="mt-1 text-zinc-600 text-sm">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="font-bold">
                      R$ {(product.priceCents / 100).toFixed(2).replace('.', ',')}
                    </span>
                    
                    {product.categoryId && (
                      <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-700">
                        {categories.find(c => c.id === product.categoryId)?.name || "Categoria"}
                      </span>
                    )}
                    
                    {product.imageUrl && (
                      <span className="text-blue-600">📷 Tem foto</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(product.id, product.isActive)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      product.isActive
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {product.isActive ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="font-bold mb-2">📊 Próximos passos</h3>
          <ul className="text-sm text-zinc-600 space-y-1">
            <li>1. Crie categorias para organizar seus produtos</li>
            <li>2. Adicione preços e descrições atrativas</li>
            <li>3. Ative/desative produtos conforme estoque</li>
            <li>4. Teste o cardápio público</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="font-bold mb-2">🔗 Link do cardápio</h3>
          <p className="text-sm text-zinc-600 mb-3">
            Seu cardápio público ficará disponível em:
          </p>
          <code className="block bg-zinc-100 p-3 rounded-lg text-sm font-mono break-all">
            https://pronto-frontend-rust.vercel.app/r/SEU-SLUG-AQUI
          </code>
          <p className="mt-2 text-xs text-zinc-500">
            (O slug é definido nas configurações do restaurante)
          </p>
        </div>
      </div>
    </main>
  );
}