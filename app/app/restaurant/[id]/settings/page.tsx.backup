"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "../../../../lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [slogan, setSlogan] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [acceptsCard, setAcceptsCard] = useState(false);
  const [acceptsPix, setAcceptsPix] = useState(false);
  const [acceptsCash, setAcceptsCash] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    loadRestaurant();
  }, [restaurantId]);

  async function loadRestaurant() {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao carregar restaurante");

      const data = await res.json();
      setName(data.name || "");
      setSlug(data.slug || "");
      setPhone(data.phone || "");
      setDescription(data.description || "");
      setSlogan(data.slogan || "");
      setAddress(data.address || "");
      setLogoUrl(data.logoUrl || "");
      setCnpj(data.cnpj || "");
      setEmail(data.email || "");
      setOpeningHours(data.openingHours || "");
      setDeliveryFee(data.deliveryFee ? (data.deliveryFee / 100).toString() : "");
      setMinimumOrder(data.minimumOrder ? (data.minimumOrder / 100).toString() : "");
      setEstimatedDeliveryTime(data.estimatedDeliveryTime || "");
      setAcceptsCard(data.acceptsCard || false);
      setAcceptsPix(data.acceptsPix || false);
      setAcceptsCash(data.acceptsCash !== undefined ? data.acceptsCash : true);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      console.log('[Settings] Saving restaurant:', { restaurantId, logoUrl, hasLogoUrl: !!logoUrl.trim(), logoUrlLength: logoUrl.trim().length });
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          phone: phone.trim(),
          description: description.trim() || null,
          slogan: slogan.trim() || null,
          address: address.trim() || null,
          logoUrl: logoUrl.trim() || null,
          cnpj: cnpj.trim() || null,
          email: email.trim() || null,
          openingHours: openingHours.trim() || null,
          deliveryFee: deliveryFee ? Math.round(parseFloat(deliveryFee) * 100) : null,
          minimumOrder: minimumOrder ? Math.round(parseFloat(minimumOrder) * 100) : null,
          estimatedDeliveryTime: estimatedDeliveryTime.trim() || null,
          acceptsCard,
          acceptsPix,
          acceptsCash,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('[Settings] Save failed:', data);
        
        let errorMessage = "Erro ao salvar";
        if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (typeof data.error === 'object') {
          errorMessage = JSON.stringify(data.error);
        }
        
        throw new Error(errorMessage);
      }

      const savedData = await res.json();
      console.log('[Settings] Restaurant saved successfully:', {
        id: savedData.id,
        name: savedData.name,
        logoUrl: savedData.logoUrl,
        hasLogoUrl: !!savedData.logoUrl
      });
      setSuccess("Configurações salvas com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Painel
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Configurações do Restaurante</h1>
        <p className="text-gray-600">Edite as informações básicas do seu estabelecimento</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome do Restaurante *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                placeholder="Ex: Açaí da Ju"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug (URL amigável) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition font-mono"
                placeholder="acai-da-ju"
              />
              <p className="mt-2 text-sm text-gray-500">
                Seu cardápio: <span className="font-mono font-semibold text-emerald-600">/r/{slug || "seu-slug"}</span>
              </p>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp (com código do país) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              placeholder="5511999999999"
            />
            <p className="mt-2 text-sm text-gray-500">
              Formato: 55 + DDD + número (sem espaços ou caracteres especiais)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition resize-none"
              placeholder="Descreva seu restaurante..."
              rows={3}
            />
          </div>

          {/* SLOGAN - CAMPO PRINCIPAL */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              ✨ Slogan / Frase Motivadora
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full rounded-xl border-2 border-emerald-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition text-lg font-medium"
              placeholder='"Sabor que conquista!" ou "A melhor pizza da cidade"'
              maxLength={100}
            />
            <p className="mt-3 text-sm text-gray-700 flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Frase curta e impactante que aparecerá em <strong>destaque no topo do seu cardápio público</strong>, 
                logo abaixo do nome do restaurante. Use para transmitir a essência do seu negócio!
              </span>
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              placeholder="Rua, Número, Bairro, Cidade - Estado"
            />
          </div>

          {/* SEÇàO: IDENTIDADE VISUAL */}
          <div className="col-span-full pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Identidade Visual
            </h3>
            <p className="text-sm text-gray-600 mb-4">Logo e imagens do seu restaurante</p>
          </div>

          {/* Logo URL */}
          <div className="col-span-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo do Restaurante (URL)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              placeholder="https://exemplo.com/minha-logo.png"
            />
            <p className="mt-2 text-sm text-gray-500">
              Cole a URL de uma imagem hospedada (recomendado: formato quadrado, mín. 200x200px)
            </p>
            {logoUrl && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Prévia:</p>
                <img src={logoUrl} alt="Logo" className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* SEÇàO: DADOS LEGAIS */}
          <div className="col-span-full pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Dados Legais e Contato
            </h3>
            <p className="text-sm text-gray-600 mb-4">Informações oficiais do estabelecimento</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* CNPJ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value.replace(/\D/g, '').substring(0, 14))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition font-mono"
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
              <p className="mt-2 text-sm text-gray-500">
                {cnpj && cnpj.length === 14 ? `Formatado: ${cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}` : 'Apenas números (14 dígitos)'}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                placeholder="contato@seurestaurante.com"
              />
            </div>
          </div>

          {/* SEÇàO: FUNCIONAMENTO */}
          <div className="col-span-full pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Horário de Funcionamento
            </h3>
            <p className="text-sm text-gray-600 mb-4">Quando seu estabelecimento está aberto</p>
          </div>

          {/* Opening Hours */}
          <div className="col-span-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horário de Funcionamento
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              placeholder="Ex: Seg-Sex: 10h-22h | Sáb-Dom: 10h-23h"
            />
          </div>

          {/* SEÇàO: DELIVERY */}
          <div className="col-span-full pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              Informações de Entrega
            </h3>
            <p className="text-sm text-gray-600 mb-4">Configurações de delivery e pedidos</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Delivery Fee */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Taxa de Entrega (R$)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Deixe vazio para grátis
              </p>
            </div>

            {/* Minimum Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pedido Mínimo (R$)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Deixe vazio para sem mínimo
              </p>
            </div>

            {/* Estimated Delivery Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tempo de Entrega
              </label>
              <input
                type="text"
                value={estimatedDeliveryTime}
                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                placeholder="Ex: 30-45 min"
              />
            </div>
          </div>

          {/* SEÇàO: FORMAS DE PAGAMENTO */}
          <div className="col-span-full pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Formas de Pagamento
            </h3>
            <p className="text-sm text-gray-600 mb-4">Métodos aceitos pelo estabelecimento</p>
          </div>

          {/* Payment Methods */}
          <div className="col-span-full">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Card */}
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition">
                <input
                  type="checkbox"
                  checked={acceptsCard}
                  onChange={(e) => setAcceptsCard(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Cartão
                  </div>
                  <p className="text-sm text-gray-600">Débito e Crédito</p>
                </div>
              </label>

              {/* PIX */}
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition">
                <input
                  type="checkbox"
                  checked={acceptsPix}
                  onChange={(e) => setAcceptsPix(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                    PIX
                  </div>
                  <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                </div>
              </label>

              {/* Cash */}
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition">
                <input
                  type="checkbox"
                  checked={acceptsCash}
                  onChange={(e) => setAcceptsCash(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Dinheiro
                  </div>
                  <p className="text-sm text-gray-600">Pagamento em espécie</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Salvando..." : "💾 Salvar Configurações"}
            </button>
            <Link
              href="/app"
              className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Preview Info */}
      {slug && (
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualize seu cardápio
          </h3>
          <p className="text-blue-800 mb-3">
            Veja como suas alterações aparecerão para os clientes:
          </p>
          <Link
            href={`/r/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir Cardápio Público
          </Link>
        </div>
      )}
    </main>
  );
}
