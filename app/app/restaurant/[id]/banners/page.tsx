"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "../../../../lib/api";

type Banner = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  backgroundColor: string;
  textColor: string;
  position: string;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
};

type BannerForm = {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  backgroundColor: string;
  textColor: string;
  position: string;
  sortOrder: string;
  startDate: string;
  endDate: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

export default function BannersPage({ params }: { params: { id: string } }) {
  const { id: restaurantId } = params;

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState<BannerForm>({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    position: "top",
    sortOrder: "0",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadBanners();
  }, [restaurantId]);

  async function loadBanners() {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      const response = await fetch(`${API_URL}/api/banners/restaurant/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar banners");
      }

      const data = await response.json();
      setBanners(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar banners");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      position: "top",
      sortOrder: "0",
      startDate: "",
      endDate: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingBanner(null);
  }

  function openCreateModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(banner: Banner) {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || "",
      imageUrl: banner.imageUrl || "",
      linkUrl: banner.linkUrl || "",
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor,
      position: banner.position,
      sortOrder: String(banner.sortOrder),
      startDate: banner.startDate ? banner.startDate.split("T")[0] : "",
      endDate: banner.endDate ? banner.endDate.split("T")[0] : "",
    });
    setImageFile(null);
    setImagePreview(banner.imageUrl || "");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File): Promise<string> {
    const token = getToken();
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Título é obrigatório");
      return;
    }

    try {
      setSaving(true);

      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const payload = {
        restaurantId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        imageUrl: finalImageUrl || null,
        linkUrl: formData.linkUrl.trim() || null,
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
        position: formData.position,
        sortOrder: parseInt(formData.sortOrder || "0", 10),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      const token = getToken();
      const url = editingBanner
        ? `${API_URL}/api/banners/${editingBanner.id}`
        : `${API_URL}/api/banners`;

      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar banner");
      }

      closeModal();
      await loadBanners();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar banner");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(banner: Banner) {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/banners/${banner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status do banner");
      }

      await loadBanners();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar banner");
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir banner");
      }

      await loadBanners();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir banner");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Banners</h1>
            <p className="text-gray-600">Gerencie os banners promocionais do cardápio.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/app/restaurant/${restaurantId}`}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold hover:bg-gray-50"
            >
              Voltar
            </Link>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Novo banner
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 text-gray-600">Carregando...</div>
        ) : banners.length === 0 ? (
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 text-center text-gray-600">
            Nenhum banner cadastrado.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="rounded-2xl border border-gray-200 p-4 shadow-sm"
                style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">{banner.title}</h3>
                  <button
                    onClick={() => toggleActive(banner)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-black/20"
                  >
                    {banner.isActive ? "Ativo" : "Inativo"}
                  </button>
                </div>

                {banner.imageUrl && (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="mb-3 h-44 w-full rounded-xl object-cover"
                  />
                )}

                {banner.description && <p className="text-sm mb-3 opacity-90">{banner.description}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="px-3 py-2 rounded-lg bg-white/20 text-sm font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="px-3 py-2 rounded-lg bg-red-600/90 text-sm font-semibold text-white"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-gray-900 mb-4">
                {editingBanner ? "Editar banner" : "Novo banner"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="Ex: Promoção da semana"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Imagem do banner (PNG, JPG, WEBP - max 5MB)
                  </label>

                  {imagePreview && (
                    <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                          setFormData({ ...formData, imageUrl: "" });
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
                      <p className="text-sm text-gray-500">
                        {imageFile ? imageFile.name : "Clique para selecionar uma imagem"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP ate 5MB</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Link de destino</label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="https://exemplo.com/promo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cor de fundo</label>
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="h-11 w-full rounded-xl border-2 border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cor do texto</label>
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="h-11 w-full rounded-xl border-2 border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Posição</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    >
                      <option value="top">Topo</option>
                      <option value="middle">Meio</option>
                      <option value="bottom">Rodapé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ordem</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Início</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Fim</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saving ? "Salvando..." : editingBanner ? "Atualizar banner" : "Criar banner"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-xl border-2 border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
