"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "../../../lib/api";

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
  productCount?: number;
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

  // Product form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  // Category form states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState("0");
  const [categoryIsActive, setCategoryIsActive] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

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
      router.push("/login");
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
      }

      // Load categories
      const categoriesRes = await fetch(`${API_URL}/api/catalog/categories/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        const cats = data.categories || [];
        // Count products per category
        const catsWithCount = cats.map((cat: Category) => ({
          ...cat,
          productCount: (data.products || []).filter((p: Product) => p.categoryId === cat.id).length
        }));
        setCategories(catsWithCount);
      }

    } catch (err: any) {
      setError("Erro ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Product handlers
  function handleEditProduct(product: Product) {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice((product.priceCents / 100).toString());
    setCategoryId(product.categoryId || "");
    setIsActive(product.isActive);
    setImageUrl(product.imageUrl || "");
    setShowProductForm(true);
  }

  function handleCancelProduct() {
    setShowProductForm(false);
    setEditingProduct(null);
    resetProductForm();
  }

  function resetProductForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setIsActive(true);
    setImageUrl("");
  }

  async function handleSubmitProduct(e: React.FormEvent) {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

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

        setSuccess("Produto atualizado com sucesso!");
      } else {
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

        setSuccess("Produto criado com sucesso!");
      }

      handleCancelProduct();
      loadData();

    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/catalog/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir produto");

      setSuccess("Produto excluído com sucesso!");
      loadData();

    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleToggleProductActive(productId: string, currentActive: boolean) {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

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

      setSuccess(`Produto ${!currentActive ? "ativado" : "desativado"} com sucesso!`);
      loadData();

    } catch (err: any) {
      setError(err.message);
    }
  }

  // Category handlers
  function handleEditCategory(category: Category) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategorySortOrder(category.sortOrder.toString());
    setCategoryIsActive(category.isActive);
    setShowCategoryModal(true);
  }

  function handleCancelCategory() {
    setShowCategoryModal(false);
    setEditingCategory(null);
    resetCategoryForm();
  }

  function resetCategoryForm() {
    setCategoryName("");
    setCategorySortOrder("0");
    setCategoryIsActive(true);
  }

  async function handleSubmitCategory(e: React.FormEvent) {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    if (!categoryName.trim()) {
      setError("Nome da categoria é obrigatório");
      return;
    }

    const orderNum = parseInt(categorySortOrder) || 0;

    const categoryData = {
      restaurantId,
      name: categoryName.trim(),
      sortOrder: orderNum,
      isActive: categoryIsActive,
      ...(editingCategory && { id: editingCategory.id }),
    };

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/catalog/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao salvar categoria");
      }

      setSuccess(editingCategory ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!");
      handleCancelCategory();
      loadData();

    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    if (categoryProducts.length > 0) {
      setError(`Não é possível excluir: Esta categoria tem ${categoryProducts.length} produto(s). Mova os produtos para outra categoria primeiro.`);
      return;
    }

    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

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
          isActive: false
        }),
      });

      if (!res.ok) throw new Error("Erro ao excluir categoria");

      setSuccess("Categoria excluída com sucesso!");
      loadData();

    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleToggleCategoryActive(categoryId: string, currentActive: boolean) {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

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

      setSuccess(`Categoria ${!currentActive ? "ativada" : "desativada"} com sucesso!`);
      loadData();

    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-emerald-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Carregando...</p>
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

      <main className="relative mx-auto max-w-[1600px] px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                Gerenciar Produtos & Categorias
              </h1>
              <p className="mt-2 text-gray-600">
                Cadastre produtos e organize seu cardápio
              </p>
            </div>
            <Link
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
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

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* LEFT COLUMN - Products */}
          <div className="space-y-6">
            {/* Product Form */}
            {showProductForm && (
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {editingProduct ? " Editar Produto" : " Novo Produto"}
                </h2>

                <form onSubmit={handleSubmitProduct} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome do produto *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                        placeholder="Ex: Açaí 500ml"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preço (R$) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                          placeholder="19.90"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition resize-none"
                        placeholder="Ex: Açaí cremoso com granola..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoria
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                      >
                        <option value="">Sem categoria</option>
                        {categories.filter(c => c.isActive).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL da imagem
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-gray-700">Produto ativo</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30"
                    >
                      {editingProduct ? "Atualizar Produto" : "Criar Produto"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelProduct}
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
                    <p className="mt-1 text-gray-600">
                      {products.length} {products.length === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                  {!showProductForm && (
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Novo Produto
                    </button>
                  )}
                </div>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum produto cadastrado</h3>
                  <p className="text-gray-600">Clique em "Novo Produto" para começar</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <div key={product.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full ${
                                product.isActive
                                  ? "bg-green-100 text-green-700 border border-green-300"
                                  : "bg-red-100 text-red-700 border border-red-300"
                              }`}
                            >
                              {product.isActive ? " Ativo" : " Inativo"}
                            </span>
                          </div>

                          {product.description && (
                            <p className="text-gray-600 mb-3">{product.description}</p>
                          )}

                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-emerald-600">
                              R$ {(product.priceCents / 100).toFixed(2).replace('.', ',')}
                            </span>

                            {product.categoryId && (
                              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                                {categories.find(c => c.id === product.categoryId)?.name || "Categoria"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleProductActive(product.id, product.isActive)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
                              product.isActive
                                ? "bg-amber-50 text-amber-700 border-2 border-amber-200 hover:bg-amber-100"
                                : "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            {product.isActive ? "Desativar" : "Ativar"}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 font-semibold border-2 border-red-200 hover:bg-red-100 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Categories Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
            <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Categorias</h2>
                <p className="text-sm text-gray-600">{categories.length} categorias</p>
              </div>

              <div className="p-4">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg shadow-purple-600/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Categoria
                </button>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Nenhuma categoria</p>
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{cat.name}</h3>
                          <p className="text-xs text-gray-500">{cat.productCount || 0} produtos</p>
                        </div>
                        <button
                          onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                            cat.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          title={cat.isActive ? "Ativo" : "Inativo"}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              cat.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border-2 border-gray-200 text-xs text-gray-700 font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border-2 border-red-200 text-xs text-red-700 font-semibold hover:bg-red-100 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? " Editar Categoria" : " Nova Categoria"}
              </h2>
            </div>

            <form onSubmit={handleSubmitCategory} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da categoria *
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="Ex: Açaís, Sucos, Lanches..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ordem de exibição
                </label>
                <input
                  type="number"
                  value={categorySortOrder}
                  onChange={(e) => setCategorySortOrder(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="0"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Menor número aparece primeiro no cardápio
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryIsActive}
                    onChange={(e) => setCategoryIsActive(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-semibold text-gray-700">Categoria ativa</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg shadow-purple-600/30"
                >
                  {editingCategory ? "Atualizar" : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelCategory}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancelar
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

