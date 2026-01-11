"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { slugify, isValidSlug } from "../../lib/slug.tsx";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
}

function token() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("pronto_token") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function normalizePhoneBR(input: string) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  if (digits.length >= 10 && digits.length <= 13) return `55${digits}`;
  return digits;
}

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  description?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function RestaurantManagePage({ params }: { params: { id: string } }) {
  console.log("DEBUG - Params ID:", params.id);
  
  const API = useMemo(() => apiBase(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  // carregar restaurante
  useEffect(() => {
    async function run() {
      console.log("DEBUG - Carregando restaurante ID:", params.id);
      setErr("");
      setOk("");
      setLoading(true);

      const t = token();
      if (!t) {
        setErr("Você não está logado. Faça login novamente.");
        setLoading(false);
        return;
      }

      try {
        const url = `${API}/api/restaurants/${params.id}`;
        console.log("DEBUG - URL:", url);
        
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${t}`,
            'Content-Type': 'application/json'
          },
        });

        console.log("DEBUG - Status:", res.status);
        
        if (!res.ok) {
          if (res.status === 404) {
            setErr("Restaurante não encontrado ou você não tem acesso.");
          } else {
            const text = await res.text();
            const data = text ? JSON.parse(text) : null;
            setErr(data?.error || data?.message || `Erro ${res.status}`);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("DEBUG - Dados:", data);
        
        setRestaurant(data);
        setName(data.name || "");
        setSlug(data.slug || "");
        setPhone(data.phone || "");
        setDescription(data.description || "");
        setAddress(data.address || "");
        
      } catch (error: any) {
        console.error("DEBUG - Erro:", error);
        setErr("Falha de rede ao carregar restaurante.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [API, params.id]);

  // auto-slug
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const publicUrl = restaurant?.slug ? `/r/${restaurant.slug}` : slug ? `/r/${slug}` : "/r/seu-slug";

  async function handleSave() {
    setErr("");
    setOk("");

    const t = token();
    if (!t) {
      setErr("Você não está logado. Faça login novamente.");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slugify(slug),
      phone: normalizePhoneBR(phone),
      description: description.trim(),
      address: address.trim(),
    };

    if (!payload.name) {
      setErr("Nome é obrigatório.");
      return;
    }

    if (!isValidSlug(payload.slug)) {
      setErr("Slug inválido. Use minúsculo, números e hífen. Ex: acai-da-ju");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/restaurants/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        setErr(data?.error || data?.message || `Erro ${res.status}`);
        return;
      }

      const data = await res.json();
      setRestaurant(data);
      setOk("✅ Restaurante atualizado com sucesso!");
      setSlugTouched(false);
    } catch {
      setErr("Falha de rede ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
          <span className="ml-3">Carregando restaurante...</span>
        </div>
      </main>
    );
  }

  if (err && !restaurant) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold">Gerenciar restaurante</h1>
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Erro</p>
          <p className="mt-1">{err}</p>
        </div>
        <Link className="mt-6 inline-block rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800" href="/app">
          Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar restaurante</h1>
          <p className="mt-1 text-zinc-600">Edite as informações e acesse o cardápio público.</p>
        </div>

        <Link className="rounded-lg px-3 py-2 hover:bg-zinc-100" href="/app">
          Voltar
        </Link>
      </div>

      {err ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{err}</div>
      ) : null}

      {ok ? (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">{ok}</div>
      ) : null}

      {restaurant && (
        <>
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-600">Cardápio público</div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-zinc-100 px-3 py-1 font-mono">{publicUrl}</span>
              <Link 
                className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800" 
                href={publicUrl}
                target="_blank"
              >
                Ver cardápio
              </Link>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="block">
                <span className="text-sm font-medium">Nome</span>
                <input
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Açai da Ju"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Slug (link)</span>
                <input
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800 font-mono"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="ex: acai-da-ju"
                />
                <div className="mt-2 text-sm text-zinc-600">
                  Use minúsculo, números e hífen. Ex: <b>acai-da-ju</b>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium">WhatsApp</span>
                <input
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800 font-mono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 11 91628-7735 (vamos salvar como 55...)"
                />
                <div className="mt-2 text-sm text-zinc-600">
                  Salvo como: <span className="font-mono">{normalizePhoneBR(phone) || "55..."}</span>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Descrição</span>
                <input
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Venda de Açaí"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Endereço</span>
                <input
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro..."
                />
              </label>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>

              <Link
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
                href={`/app/restaurant/${params.id}/products`}
              >
                Gerenciar produtos
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}