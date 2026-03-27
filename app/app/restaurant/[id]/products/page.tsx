"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getToken } from "../../../../lib/api";

type Product = {
  id: string;
  name: string;
  pdvCode?: string | null;
  portionSize?: string | null;
  servesUpTo?: number | null;
  description: string | null;
  priceCents: number;
  isActive: boolean;
  sortOrder: number;
  categoryId: string | null;
  imageUrl: string | null;
  hasComplements?: boolean;
  complementGroups?: ComplementGroup[];
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  } | null;
};

type ComplementOption = {
  name: string;
  priceCents: number;
  status: "active" | "inactive" | "out_of_stock";
  sortOrder?: number;
};

type ComplementGroup = {
  title: string;
  minSelect: number;
  maxSelect: number;
  status: "active" | "inactive" | "out_of_stock";
  sortOrder?: number;
  options: ComplementOption[];
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

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [pdvCode, setPdvCode] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [servesUpTo, setServesUpTo] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [hasComplements, setHasComplements] = useState(false);
  const [complementGroups, setComplementGroups] = useState<ComplementGroup[]>([]);
  const [showComplementEditor, setShowComplementEditor] = useState(false);
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);

  const [groupTitle, setGroupTitle] = useState("");
  const [groupMinSelect, setGroupMinSelect] = useState("0");
  const [groupMaxSelect, setGroupMaxSelect] = useState("1");
  const [groupStatus, setGroupStatus] = useState<"active" | "inactive" | "out_of_stock">("active");
  const [groupOptions, setGroupOptions] = useState<ComplementOption[]>([]);

  // Load data
  useEffect(() => {
    if (!restaurantId) {
      console.error("Restaurant ID não encontrado");
      return;
    }
    console.log("Carregando dados para restaurante:", restaurantId);
    loadData();
  }, [restaurantId]);

  async function loadData() {
    if (!restaurantId) return;

    setLoading(true);
    setError("");
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      console.log("Carregando produtos...");
      const productsData = await api(`/api/catalog/products/${restaurantId}`, {
        method: "GET",
      });
      setProducts(productsData.products || []);

      console.log("Carregando categorias...");
      const categoriesData = await api(`/api/catalog/categories/${restaurantId}`, {
        method: "GET",
      });
      setCategories(categoriesData.categories || []);

    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro de conexão ao carregar dados. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  }

  // Handle form
  function handleEdit(product: Product) {
    console.log("Editando produto:", product);
    setEditingProduct(product);
    setName(product.name);
    setPdvCode(product.pdvCode || "");
    setPortionSize(product.portionSize || "");
    setServesUpTo(product.servesUpTo ? String(product.servesUpTo) : "");
    setDescription(product.description || "");
    setPrice((product.priceCents / 100).toString());
    setCategoryId(product.categoryId || "");
    setIsActive(product.isActive);
    setImageUrl(product.imageUrl || "");
    setImageFile(null);
    setImagePreview(product.imageUrl || "");
    setHasComplements(!!product.hasComplements);
    setComplementGroups((product.complementGroups || []).map((group, groupIndex) => ({
      ...group,
      sortOrder: group.sortOrder ?? groupIndex,
      options: (group.options || []).map((option, optionIndex) => ({
        ...option,
        sortOrder: option.sortOrder ?? optionIndex,
      })),
    })));
    setShowForm(true);
  }

  function handleCancel() {
    console.log("Cancelando formulário");
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  }

  function resetForm() {
    setName("");
    setPdvCode("");
    setPortionSize("");
    setServesUpTo("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setIsActive(true);
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setHasComplements(false);
    setComplementGroups([]);
    resetComplementEditor();
  }

  function resetComplementEditor() {
    setEditingGroupIndex(null);
    setGroupTitle("");
    setGroupMinSelect("0");
    setGroupMaxSelect("1");
    setGroupStatus("active");
    setGroupOptions([]);
  }

  function openNewComplementGroup() {
    resetComplementEditor();
    setShowComplementEditor(true);
  }

  function openEditComplementGroup(index: number) {
    const group = complementGroups[index];
    if (!group) return;

    setEditingGroupIndex(index);
    setGroupTitle(group.title);
    setGroupMinSelect(String(group.minSelect));
    setGroupMaxSelect(String(group.maxSelect));
    setGroupStatus(group.status);
    setGroupOptions(group.options || []);
    setShowComplementEditor(true);
  }

  function addEmptyOption() {
    setGroupOptions((previous) => [
      ...previous,
      {
        name: "",
        priceCents: 0,
        status: "active",
      },
    ]);
  }

  function updateGroupOption(index: number, patch: Partial<ComplementOption>) {
    setGroupOptions((previous) => previous.map((option, optionIndex) => (
      optionIndex === index ? { ...option, ...patch } : option
    )));
  }

  function removeGroupOption(index: number) {
    setGroupOptions((previous) => previous.filter((_, optionIndex) => optionIndex !== index));
  }

  function saveComplementGroup() {
    if (!groupTitle.trim()) {
      setError("Título da variação é obrigatório");
      return;
    }

    const minSelect = Math.max(0, Number(groupMinSelect || "0"));
    const maxSelect = Math.max(1, Number(groupMaxSelect || "1"));

    if (minSelect > maxSelect) {
      setError("Quantidade mínima não pode ser maior que a máxima");
      return;
    }

    const normalizedOptions = groupOptions
      .map((option, index) => ({
        name: option.name.trim(),
        priceCents: Number(option.priceCents || 0),
        status: option.status,
        sortOrder: option.sortOrder ?? index,
      }))
      .filter((option) => option.name.length > 0)
      .map((option, index) => ({ ...option, sortOrder: index }));

    if (normalizedOptions.length === 0) {
      setError("Adicione pelo menos uma opção no complemento");
      return;
    }

    const payload: ComplementGroup = {
      title: groupTitle.trim(),
      minSelect,
      maxSelect,
      status: groupStatus,
      options: normalizedOptions,
    };

    setComplementGroups((previous) => {
      if (editingGroupIndex === null) {
        return [...previous, { ...payload, sortOrder: previous.length }];
      }

      return previous.map((group, index) => (
        index === editingGroupIndex ? { ...payload, sortOrder: index } : group
      ));
    });

    setError("");
    setShowComplementEditor(false);
    resetComplementEditor();
  }

  function deleteComplementGroup(index: number) {
    setComplementGroups((previous) => previous
      .filter((_, groupIndex) => groupIndex !== index)
      .map((group, groupIndex) => ({ ...group, sortOrder: groupIndex }))
    );
  }

  // Handle image file selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError("Arquivo deve ser uma imagem");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo: 5MB");
      return;
    }

    setImageFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Upload image to server
  async function uploadImage(file: File): Promise<string | null> {
    try {
      setUploading(true);
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string;
            
            const response = await api(`/api/upload/image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: base64,
                fileName: file.name,
              }),
            });

            resolve(response.url);
          } catch (error) {
            reject(error);
          } finally {
            setUploading(false);
          }
        };
        reader.onerror = () => {
          reject(new Error('Erro ao ler arquivo'));
          setUploading(false);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      setUploading(false);
      throw error;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Enviando formulário...");

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Validation
    if (!name.trim()) {
      setError("Nome do produto é obrigatório");
      return;
    }

    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat < 0) {
      setError("Preço inválido. Use números positivos.");
      return;
    }

    const priceCents = Math.round(priceFloat * 100);

    setError("");
    setSuccess("");

    try {
      // Se tem arquivo de imagem, faz upload primeiro
      let finalImageUrl = imageUrl;
      if (imageFile) {
        console.log("Fazendo upload da imagem...");
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const productData = {
        restaurantId,
        name: name.trim(),
        pdvCode: pdvCode.trim() || null,
        portionSize: portionSize.trim() || null,
        servesUpTo: servesUpTo ? Number(servesUpTo) : null,
        description: description.trim() || null,
        priceCents,
        categoryId: categoryId || null,
        isActive,
        imageUrl: finalImageUrl || null,
        hasComplements,
        complementGroups: hasComplements
          ? complementGroups.map((group, groupIndex) => ({
              title: group.title,
              minSelect: group.minSelect,
              maxSelect: group.maxSelect,
              status: group.status,
              sortOrder: group.sortOrder ?? groupIndex,
              options: (group.options || []).map((option, optionIndex) => ({
                name: option.name,
                priceCents: option.priceCents,
                status: option.status,
                sortOrder: option.sortOrder ?? optionIndex,
              })),
            }))
          : [],
      };

      console.log("Dados do produto:", productData);

      if (editingProduct) {
        // Update product
        console.log("Atualizando produto:", editingProduct.id);
        await api(`/api/catalog/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        setSuccess("Produto atualizado com sucesso!");
      } else {
        // Create product
        console.log("Criando novo produto");
        await api(`/api/catalog/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        setSuccess("Produto criado com sucesso!");
      }

      handleCancel();
      loadData(); // Recarrega a lista

    } catch (err: any) {
      console.error("Erro completo:", err);
      setError((err.message || "Erro ao salvar produto"));
    }
  }

  async function handleDelete(productId: string) {
    console.log("Tentando excluir produto:", productId);
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await api(`/api/catalog/products/${productId}`, {
        method: "DELETE",
      });

      setSuccess("Produto excluído com sucesso!");
      loadData();

    } catch (err: any) {
      console.error("Erro delete:", err);
      setError(err.message);
    }
  }

  async function handleToggleActive(productId: string, currentActive: boolean) {
    console.log("Alternando ativo:", productId, "de", currentActive, "para", !currentActive);
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await api(`/api/catalog/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentActive }),
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(`Produto ${!currentActive ? "ativado" : "desativado"} com sucesso!`);
      loadData();

    } catch (err: any) {
      console.error("Erro toggle:", err);
      setError(err.message);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-emerald-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Carregando produtos...</p>
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

      <main className="relative mx-auto max-w-7xl px-6 py-12">
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
                Gerenciar Produtos
              </h1>
              <p className="mt-2 text-gray-600">
                Cadastre e organize os produtos do seu cardápio
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/app"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </Link>
              <button
                onClick={() => {
                  console.log("Abrindo formulário novo produto");
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Produto
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-red-900">Erro</p>
                <p className="text-red-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-green-900">Sucesso</p>
                <p className="text-green-800 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingProduct ? "✏️ Editar Produto" : "✨ Novo Produto"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <p className="mt-2 text-sm text-gray-500">
                    Valor final: <span className="font-semibold text-emerald-600">R$ {price || "0,00"}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código PDV
                  </label>
                  <input
                    type="text"
                    value={pdvCode}
                    onChange={(e) => setPdvCode(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    placeholder="Ex: PDV-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tamanho da porção
                  </label>
                  <input
                    type="text"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    placeholder="Ex: 350 g"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Serve até
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={servesUpTo}
                    onChange={(e) => setServesUpTo(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    placeholder="Ex: 4"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition resize-none"
                    placeholder="Ex: Açaí cremoso com granola, leite condensado e banana..."
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Crie categorias primeiro em "Gerenciar categorias"
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagem do produto (PNG, JPG — máx. 5MB)
                  </label>

                  {/* Preview da imagem */}
                  {imagePreview && (
                    <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(""); setImageFile(null); setImageUrl(""); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-400 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">
                        {imageFile ? imageFile.name : "Clique para selecionar uma imagem"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP até 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="md:col-span-2 rounded-xl border-2 border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adicionar complemento</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Habilite para configurar adicionais na tela do cliente
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasComplements}
                        onChange={(e) => setHasComplements(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="text-sm font-semibold text-gray-700">Usar adicionais</span>
                    </label>
                  </div>

                  {hasComplements && (
                    <div className="mt-4 space-y-3">
                      <button
                        type="button"
                        onClick={openNewComplementGroup}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                      >
                        + Adicionar complemento
                      </button>

                      {complementGroups.length === 0 ? (
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          Nenhum complemento configurado. Clique em "+ Adicionar complemento".
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {complementGroups.map((group, groupIndex) => (
                            <div key={`${group.title}-${groupIndex}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                              <div>
                                <p className="font-semibold text-gray-900">{group.title}</p>
                                <p className="text-xs text-gray-600">
                                  Escolha de {group.minSelect} até {group.maxSelect} | {group.options.length} opção(ões)
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditComplementGroup(groupIndex)}
                                  className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteComplementGroup(groupIndex)}
                                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-50"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="productActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <label htmlFor="productActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Produto ativo e disponível no cardápio
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading
                    ? "⏳ Enviando imagem..."
                    : editingProduct
                    ? "💾 Atualizar Produto"
                    : "✨ Criar Produto"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {showComplementEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Editar complemento</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowComplementEditor(false);
                    resetComplementEditor();
                  }}
                  className="w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título da variação</label>
                  <input
                    type="text"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Ex: Adicional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">O cliente escolherá de</label>
                    <input
                      type="number"
                      min="0"
                      value={groupMinSelect}
                      onChange={(e) => setGroupMinSelect(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">até</label>
                    <input
                      type="number"
                      min="1"
                      value={groupMaxSelect}
                      onChange={(e) => setGroupMaxSelect(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={groupStatus}
                      onChange={(e) => setGroupStatus(e.target.value as "active" | "inactive" | "out_of_stock")}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="out_of_stock">Em falta</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">Opções</h4>
                    <button
                      type="button"
                      onClick={addEmptyOption}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50"
                    >
                      + Adicionar nova opção
                    </button>
                  </div>

                  {groupOptions.length === 0 && (
                    <p className="text-sm text-gray-500">Nenhuma opção adicionada ainda.</p>
                  )}

                  {groupOptions.map((option, optionIndex) => (
                    <div key={`option-${optionIndex}`} className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-xl border border-gray-200 p-3">
                      <div className="md:col-span-5">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nome da opção</label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateGroupOption(optionIndex, { name: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
                          placeholder="Ex: Hambúrguer (4 hambúrgueres)"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Preço (R$)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={(option.priceCents / 100).toFixed(2)}
                          onChange={(e) => {
                            const cents = Math.round(Number(e.target.value || "0") * 100);
                            updateGroupOption(optionIndex, { priceCents: isNaN(cents) ? 0 : cents });
                          }}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                        <select
                          value={option.status}
                          onChange={(e) => updateGroupOption(optionIndex, { status: e.target.value as "active" | "inactive" | "out_of_stock" })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                          <option value="out_of_stock">Em falta</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => removeGroupOption(optionIndex)}
                          className="w-full rounded-lg border border-red-200 text-red-700 px-2 py-2 hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-5 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowComplementEditor(false);
                    resetComplementEditor();
                  }}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveComplementGroup}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700"
                >
                  Salvar complemento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Produtos Cadastrados</h2>
                <p className="mt-1 text-gray-600">
                  {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
                </p>
              </div>
              <Link
                href={`/app/restaurant/${restaurantId}/categories`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Categorias
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto cadastrado</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Clique em "Novo Produto" para começar a criar seu cardápio
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Ou primeiro crie categorias para organizar seus produtos
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Criar primeiro produto
                </button>
                <Link
                  href={`/app/restaurant/${restaurantId}/categories`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Gerenciar categorias
                </Link>
              </div>
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
                          {product.isActive ? "✓ Ativo" : "✕ Inativo"}
                        </span>
                        {product.imageUrl && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-300">
                            📷 Foto
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-gray-600 mb-3">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-emerald-600">
                          R$ {(product.priceCents / 100).toFixed(2).replace('.', ',')}
                        </span>

                        {product.pdvCode && (
                          <span className="px-3 py-1 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-700 border border-indigo-200">
                            PDV: {product.pdvCode}
                          </span>
                        )}

                        {product.portionSize && (
                          <span className="px-3 py-1 bg-purple-50 rounded-lg text-sm font-medium text-purple-700 border border-purple-200">
                            Porção: {product.portionSize}
                          </span>
                        )}

                        {product.servesUpTo && (
                          <span className="px-3 py-1 bg-emerald-50 rounded-lg text-sm font-medium text-emerald-700 border border-emerald-200">
                            Serve até {product.servesUpTo}
                          </span>
                        )}

                        {product.hasComplements && (
                          <span className="px-3 py-1 bg-amber-50 rounded-lg text-sm font-medium text-amber-700 border border-amber-200">
                            + Adicionais
                          </span>
                        )}

                        {product.category && (
                          <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                            {product.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
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
                        onClick={() => handleDelete(product.id)}
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
      </main>

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
