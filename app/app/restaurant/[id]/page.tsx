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
  hasComplements?: boolean;
  complementGroups?: ComplementGroup[];
  createdAt: string;
  updatedAt: string;
};

type ComplementOption = {
  id?: string;
  name: string;
  pdvCode?: string | null;
  description?: string | null;
  maxQuantity?: number;
  imageUrl?: string | null;
  priceCents: number;
  status: "active" | "inactive" | "out_of_stock";
  sortOrder?: number;
};

type ComplementGroup = {
  id?: string;
  title: string;
  minSelect: number;
  maxSelect: number;
  status: "active" | "inactive" | "out_of_stock";
  sortOrder?: number;
  options: ComplementOption[];
};

type ProductComplementItem = ComplementGroup & {
  productId: string;
  productName: string;
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
  const [activeTab, setActiveTab] = useState<"products" | "complements">("products");
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Complements states
  const [complementSearch, setComplementSearch] = useState("");
  const [showComplementModal, setShowComplementModal] = useState(false);
  const [editingComplement, setEditingComplement] = useState<ProductComplementItem | null>(null);
  const [selectedComplementProductId, setSelectedComplementProductId] = useState("");
  const [complementTitle, setComplementTitle] = useState("");
  const [complementMinSelect, setComplementMinSelect] = useState("0");
  const [complementMaxSelect, setComplementMaxSelect] = useState("0");
  const [complementStatus, setComplementStatus] = useState<"active" | "inactive" | "out_of_stock">("active");
  const [complementOptions, setComplementOptions] = useState<ComplementOption[]>([]);

  // Category form states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState("0");
  const [categoryIsActive, setCategoryIsActive] = useState(true);
  
  // Filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Filtrar produtos baseado na categoria selecionada
  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.categoryId === selectedCategoryId)
    : products;

  const allComplements: ProductComplementItem[] = products.flatMap((product) =>
    (product.complementGroups || []).map((group) => ({
      ...group,
      productId: product.id,
      productName: product.name,
    }))
  );

  const filteredComplements = allComplements.filter((group) => {
    const search = complementSearch.trim().toLowerCase();
    if (!search) return true;

    const inGroup = group.title.toLowerCase().includes(search);
    const inProduct = group.productName.toLowerCase().includes(search);
    const inOptions = (group.options || []).some((option) => option.name.toLowerCase().includes(search));

    return inGroup || inProduct || inOptions;
  });

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

      if (!productsRes.ok) {
        const data = await productsRes.json().catch(() => ({}));
        throw new Error(data?.error?.message || data?.error || "Sem permissão para carregar produtos desta loja");
      }

      const productsData = await productsRes.json();
      setProducts(productsData.products || []);

      // Load categories
      const categoriesRes = await fetch(`${API_URL}/api/catalog/categories/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!categoriesRes.ok) {
        const data = await categoriesRes.json().catch(() => ({}));
        throw new Error(data?.error?.message || data?.error || "Sem permissão para carregar categorias desta loja");
      }

      const categoriesData = await categoriesRes.json();
      const cats = categoriesData.categories || [];
      // Count products per category
      const catsWithCount = cats.map((cat: Category) => ({
        ...cat,
        productCount: (productsData.products || []).filter((p: Product) => p.categoryId === cat.id).length
      }));
      setCategories(catsWithCount);

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
    setImageFile(null);
    setImagePreview(product.imageUrl || "");
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
    setImageFile(null);
    setImagePreview("");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Arquivo deve ser uma imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo: 5MB");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File, token: string): Promise<string> {
    setUploading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: base64,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro no upload da imagem");
      }

      const data = await response.json();
      return data.url;
    } finally {
      setUploading(false);
    }
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

    setError("");
    setSuccess("");

    try {
      let finalImageUrl = imageUrl.trim();
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, token);
      }

      const productData = {
        restaurantId,
        name: name.trim(),
        description: description.trim() || null,
        priceCents,
        categoryId: categoryId || null,
        isActive,
        imageUrl: finalImageUrl || null,
      };

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
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData?.error || "Erro ao excluir produto";
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setSuccess(data?.message || "Produto excluído com sucesso!");
      loadData();

    } catch (err: any) {
      setError(err.message || "Erro ao excluir produto");
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

  function resetComplementForm() {
    setEditingComplement(null);
    setSelectedComplementProductId("");
    setComplementTitle("");
    setComplementMinSelect("0");
    setComplementMaxSelect("0");
    setComplementStatus("active");
    setComplementOptions([]);
  }

  function openCreateComplement() {
    resetComplementForm();
    setShowComplementModal(true);
  }

  function openEditComplement(item: ProductComplementItem) {
    setEditingComplement(item);
    setSelectedComplementProductId(item.productId);
    setComplementTitle(item.title);
    setComplementMinSelect(String(item.minSelect));
    setComplementMaxSelect(String(item.maxSelect));
    setComplementStatus(item.status);
    setComplementOptions((item.options || []).map((option, optionIndex) => ({
      ...option,
      maxQuantity: option.maxQuantity ?? 0,
      sortOrder: option.sortOrder ?? optionIndex,
    })));
    setShowComplementModal(true);
  }

  function addComplementOption() {
    setComplementOptions((prev) => [
      ...prev,
      {
        name: "",
        pdvCode: "",
        description: "",
        maxQuantity: 0,
        imageUrl: null,
        priceCents: 0,
        status: "active",
      },
    ]);
  }

  function updateComplementOption(index: number, patch: Partial<ComplementOption>) {
    setComplementOptions((prev) => prev.map((option, optionIndex) => (
      optionIndex === index ? { ...option, ...patch } : option
    )));
  }

  function removeComplementOption(index: number) {
    setComplementOptions((prev) => prev.filter((_, optionIndex) => optionIndex !== index));
  }

  async function handleOptionImageUpload(index: number, file: File) {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Arquivo deve ser uma imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo: 5MB");
      return;
    }

    try {
      const imageUrl = await uploadImage(file, token);
      updateComplementOption(index, { imageUrl });
    } catch (err: any) {
      setError(err.message || "Erro ao enviar imagem da opção");
    }
  }

  async function handleSaveComplement() {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    if (!selectedComplementProductId) {
      setError("Selecione um produto para vincular o complemento");
      return;
    }

    if (!complementTitle.trim()) {
      setError("Título da variação é obrigatório");
      return;
    }

    const minSelect = Math.max(0, Number(complementMinSelect || "0"));
    const maxSelect = Math.max(0, Number(complementMaxSelect || "0"));

    if (minSelect > maxSelect) {
      setError("Quantidade mínima não pode ser maior que a máxima");
      return;
    }

    const options = complementOptions
      .map((option, index) => ({
        id: option.id,
        name: option.name.trim(),
        pdvCode: option.pdvCode?.trim() || null,
        description: option.description?.trim() || null,
        maxQuantity: Math.max(0, Number(option.maxQuantity || 0)),
        imageUrl: option.imageUrl || null,
        priceCents: Math.max(0, Number(option.priceCents || 0)),
        status: option.status,
        sortOrder: option.sortOrder ?? index,
      }))
      .filter((option) => option.name.length > 0)
      .map((option, index) => ({ ...option, sortOrder: index }));

    if (options.length === 0) {
      setError("Adicione ao menos uma opção no complemento");
      return;
    }

    const targetProduct = products.find((product) => product.id === selectedComplementProductId);
    if (!targetProduct) {
      setError("Produto não encontrado");
      return;
    }

    let nextGroups: ComplementGroup[] = (targetProduct.complementGroups || []).map((group) => ({
      ...group,
      options: (group.options || []).map((option) => ({ ...option })),
    }));

    if (editingComplement && editingComplement.productId === targetProduct.id) {
      nextGroups = nextGroups.map((group) => (
        group.id === editingComplement.id
          ? {
              ...group,
              title: complementTitle.trim(),
              minSelect,
              maxSelect,
              status: complementStatus,
              options,
            }
          : group
      ));
    } else {
      nextGroups.push({
        title: complementTitle.trim(),
        minSelect,
        maxSelect,
        status: complementStatus,
        options,
      });
    }

    const payload = {
      hasComplements: nextGroups.length > 0,
      complementGroups: nextGroups.map((group, groupIndex) => ({
        title: group.title,
        minSelect: group.minSelect,
        maxSelect: group.maxSelect,
        status: group.status,
        sortOrder: group.sortOrder ?? groupIndex,
        options: (group.options || []).map((option, optionIndex) => ({
          name: option.name,
          pdvCode: option.pdvCode ?? null,
          description: option.description ?? null,
          maxQuantity: option.maxQuantity ?? 0,
          imageUrl: option.imageUrl ?? null,
          priceCents: option.priceCents,
          status: option.status,
          sortOrder: option.sortOrder ?? optionIndex,
        })),
      })),
    };

    try {
      const res = await fetch(`${API_URL}/api/catalog/products/${targetProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao salvar complemento");
      }

      setSuccess(editingComplement ? "Complemento atualizado com sucesso!" : "Complemento criado com sucesso!");
      setShowComplementModal(false);
      resetComplementForm();
      loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar complemento");
    }
  }

  async function handleDeleteComplement(item: ProductComplementItem) {
    if (!confirm("Tem certeza que deseja excluir este complemento?")) return;

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const targetProduct = products.find((product) => product.id === item.productId);
    if (!targetProduct) return;

    const nextGroups = (targetProduct.complementGroups || []).filter((group) => group.id !== item.id);

    try {
      const res = await fetch(`${API_URL}/api/catalog/products/${targetProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hasComplements: nextGroups.length > 0,
          complementGroups: nextGroups,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao excluir complemento");
      }

      setSuccess("Complemento excluído com sucesso!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir complemento");
    }
  }

  async function handleToggleComplementStatus(item: ProductComplementItem) {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const targetProduct = products.find((product) => product.id === item.productId);
    if (!targetProduct) return;

    const nextStatus = item.status === "active" ? "inactive" : "active";
    const nextGroups = (targetProduct.complementGroups || []).map((group) => (
      group.id === item.id ? { ...group, status: nextStatus } : group
    ));

    try {
      const res = await fetch(`${API_URL}/api/catalog/products/${targetProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hasComplements: nextGroups.length > 0,
          complementGroups: nextGroups,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao atualizar complemento");
      }

      setSuccess("Status do complemento atualizado!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar complemento");
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

    setError("");
    setSuccess("");

    try {
      if (editingCategory) {
        // Atualizar categoria existente
        const res = await fetch(`${API_URL}/api/catalog/categories/${editingCategory.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: categoryName.trim(),
            sortOrder: orderNum,
            isActive: categoryIsActive,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Erro ao atualizar categoria");
        }

        setSuccess("Categoria atualizada com sucesso!");
      } else {
        // Criar nova categoria
        const res = await fetch(`${API_URL}/api/catalog/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId,
            name: categoryName.trim(),
            sortOrder: orderNum,
            isActive: categoryIsActive,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Erro ao criar categoria");
        }

        setSuccess("Categoria criada com sucesso!");
      }
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
      const res = await fetch(`${API_URL}/api/catalog/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await fetch(`${API_URL}/api/catalog/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
        <div className="grid lg:grid-cols-[320px,1fr] gap-6">
          {/* LEFT COLUMN - Categories */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
            <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-gray-200 p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">Categorias</h2>
                <p className="text-xs text-gray-600">{categories.length} categorias</p>
              </div>

              <div className="p-3">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg shadow-purple-600/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Categoria
                </button>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {/* Botão "Todas as categorias" */}
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full p-4 text-left hover:bg-purple-50 transition ${
                    selectedCategoryId === null ? 'bg-purple-100 border-l-4 border-purple-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-bold ${selectedCategoryId === null ? 'text-purple-900' : 'text-gray-900'}`}>
                        📋 Todas as Categorias
                      </h3>
                      <p className="text-xs text-gray-500">{products.length} produtos no total</p>
                    </div>
                    {selectedCategoryId === null && (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>

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
                    <div key={cat.id} className={`p-4 transition ${
                      selectedCategoryId === cat.id ? 'bg-purple-100 border-l-4 border-purple-600' : 'hover:bg-gray-50'
                    }`}>
                      <button
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className="w-full text-left mb-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <h3 className={`font-bold ${selectedCategoryId === cat.id ? 'text-purple-900' : 'text-gray-900'}`}>
                              {cat.name}
                            </h3>
                            <p className="text-xs text-gray-500">{cat.productCount || 0} produtos</p>
                          </div>
                          {selectedCategoryId === cat.id && (
                            <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                      <div className="flex items-center justify-between gap-3 mb-3 px-2">
                        <button
                          onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            cat.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          title={cat.isActive ? "Ativo" : "Inativo"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              cat.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-xs text-gray-700 font-medium hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium hover:bg-red-100 transition"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* RIGHT COLUMN - Content */}
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="flex items-center gap-6 border-b border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`text-lg font-semibold pb-2 border-b-2 transition ${
                    activeTab === "products"
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-400 border-transparent hover:text-gray-700"
                  }`}
                >
                  Produtos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("complements")}
                  className={`text-lg font-semibold pb-2 border-b-2 transition ${
                    activeTab === "complements"
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-400 border-transparent hover:text-gray-700"
                  }`}
                >
                  Complementos
                </button>
              </div>
            </div>

            {activeTab === "products" && (
              <>
                {/* Product Form */}
                {showProductForm && (
                  <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                      {editingProduct ? " Editar Produto" : " Novo Produto"}
                    </h2>

                    <form onSubmit={handleSubmitProduct} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do produto *</label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Preço (R$) *</label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition resize-none"
                            placeholder="Ex: Açaí cremoso com granola..."
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Imagem do produto (PNG, JPG, WEBP - max 5MB)</label>
                          {imagePreview && (
                            <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview("");
                                  setImageFile(null);
                                  setImageUrl("");
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                              >
                                x
                              </button>
                            </div>
                          )}
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-400 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-sm text-gray-500">{imageFile ? imageFile.name : "Clique para selecionar uma imagem"}</p>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP ate 5MB</p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          </label>
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
                          disabled={uploading}
                          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {uploading ? "Enviando imagem..." : editingProduct ? "Atualizar Produto" : "Criar Produto"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelProduct}
                          disabled={uploading}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-60"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Products List */}
                <div className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-xl">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Produtos
                          {selectedCategoryId && (
                            <span className="ml-3 text-lg font-semibold text-purple-600">• {categories.find(c => c.id === selectedCategoryId)?.name}</span>
                          )}
                        </h2>
                        <p className="mt-1 text-gray-600">
                          {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}
                          {selectedCategoryId && ` nesta categoria`}
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

                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedCategoryId ? "Nenhum produto nesta categoria" : "Nenhum produto cadastrado"}</h3>
                      <p className="text-gray-600">{selectedCategoryId ? "Crie um novo produto e associe a esta categoria" : "Clique em \"Novo Produto\" para começar"}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="p-6 hover:bg-gray-50 transition">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${product.isActive ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                                  {product.isActive ? " Ativo" : " Inativo"}
                                </span>
                              </div>

                              {product.description && <p className="text-gray-600 mb-3">{product.description}</p>}

                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-emerald-600">R$ {(product.priceCents / 100).toFixed(2).replace('.', ',')}</span>
                                {product.categoryId && (
                                  <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                    {categories.find(c => c.id === product.categoryId)?.name || "Categoria"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <button onClick={() => handleEditProduct(product)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                              </button>
                              <button onClick={() => handleToggleProductActive(product.id, product.isActive)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${product.isActive ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                {product.isActive ? "Desativar" : "Ativar"}
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200 hover:bg-red-100 transition">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </>
            )}

            {activeTab === "complements" && (
              <div className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Lista de complementos</h2>
                      <p className="text-sm text-gray-600 mt-1">{filteredComplements.length} complemento(s)</p>
                    </div>
                    <button
                      type="button"
                      onClick={openCreateComplement}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold hover:from-rose-600 hover:to-red-600 transition shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Novo complemento
                    </button>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                      type="text"
                      value={complementSearch}
                      onChange={(e) => setComplementSearch(e.target.value)}
                      placeholder="Pesquisar variações"
                      className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {filteredComplements.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">Nenhum complemento cadastrado.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredComplements.map((item, index) => (
                      <div key={`${item.id || item.title}-${index}`} className="p-4 hover:bg-gray-50 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <button
                                type="button"
                                onClick={() => handleToggleComplementStatus(item)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.status === "active" ? "translate-x-6" : "translate-x-1"}`} />
                              </button>
                              <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Produto vinculado: <span className="font-semibold">{item.productName}</span></p>
                            <p className="text-sm text-gray-600 line-clamp-2">{(item.options || []).map((option) => option.name).join(", ")}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button type="button" onClick={() => openEditComplement(item)} className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-700" title="Editar">
                              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button type="button" onClick={() => handleDeleteComplement(item)} className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50" title="Excluir">
                              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {showComplementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-900">{editingComplement ? "Editar complemento" : "Criar novo complemento"}</h2>
              <button
                type="button"
                onClick={() => {
                  setShowComplementModal(false);
                  resetComplementForm();
                }}
                className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Produto vinculado *</label>
                  <select
                    value={selectedComplementProductId}
                    onChange={(e) => setSelectedComplementProductId(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título da variação</label>
                  <input
                    type="text"
                    value={complementTitle}
                    onChange={(e) => setComplementTitle(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="Adicional"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quantidade para escolha</h3>
                <div className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">O cliente escolherá de</label>
                    <input
                      type="number"
                      min="0"
                      value={complementMinSelect}
                      onChange={(e) => setComplementMinSelect(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">até</label>
                    <input
                      type="number"
                      min="0"
                      value={complementMaxSelect}
                      onChange={(e) => setComplementMaxSelect(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "active", label: "Ativo" },
                        { value: "inactive", label: "Inativo" },
                        { value: "out_of_stock", label: "Em falta" },
                      ].map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => setComplementStatus(status.value as "active" | "inactive" | "out_of_stock")}
                          className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                            complementStatus === status.value
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Opções</h3>
                </div>

                {complementOptions.map((option, index) => (
                  <div key={`complement-option-${index}`} className="rounded-xl border border-gray-200 p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-xl font-bold text-gray-800">Nova opção</h4>
                      <div className="flex flex-wrap gap-2 items-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={(option.priceCents / 100).toFixed(2)}
                          onChange={(e) => {
                            const cents = Math.round(Number(e.target.value || "0") * 100);
                            updateComplementOption(index, { priceCents: isNaN(cents) ? 0 : cents });
                          }}
                          className="w-28 rounded-xl border border-gray-300 px-3 py-2"
                        />
                        {[
                          { value: "active", label: "Ativo" },
                          { value: "inactive", label: "Inativo" },
                          { value: "out_of_stock", label: "Em falta" },
                        ].map((status) => (
                          <button
                            key={status.value}
                            type="button"
                            onClick={() => updateComplementOption(index, { status: status.value as "active" | "inactive" | "out_of_stock" })}
                            className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                              option.status === status.value
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => removeComplementOption(index)}
                          className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          title="Excluir opção"
                        >
                          <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-[1fr,300px] gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da opção</label>
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) => updateComplementOption(index, { name: e.target.value })}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Código PDV</label>
                          <input
                            type="text"
                            value={option.pdvCode || ""}
                            onChange={(e) => updateComplementOption(index, { pdvCode: e.target.value })}
                            placeholder="Digite o código PDV do complemento"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                          <textarea
                            value={option.description || ""}
                            onChange={(e) => updateComplementOption(index, { description: e.target.value })}
                            rows={2}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade máxima dessa opção</label>
                          <input
                            type="number"
                            min="0"
                            value={option.maxQuantity ?? 0}
                            onChange={(e) => updateComplementOption(index, { maxQuantity: Math.max(0, Number(e.target.value || "0")) })}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">{option.imageUrl ? "Arquivo selecionado" : "Nenhum arquivo escolhido"}</p>
                        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                          {option.imageUrl ? (
                            <img src={option.imageUrl} alt="Imagem da opção" className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            <>
                              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="font-semibold text-gray-700">Selecione uma imagem</p>
                              <p className="text-sm text-gray-500 text-center px-4">Arraste e solte ou clique para selecionar</p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleOptionImageUpload(index, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addComplementOption}
                  className="w-full py-4 rounded-xl border-2 border-rose-300 text-rose-500 font-bold text-xl hover:bg-rose-50"
                >
                  + Adicionar nova opção
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveComplement}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-2xl hover:from-emerald-600 hover:to-green-600"
              >
                Salvar complemento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? "✏️ Editar Categoria" : "✨ Nova Categoria"}
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