"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { isValidSlug, slugify } from "../../../lib/slug";

type FieldErrors = Record<string, string[]>;

function getApiBase() {
  const v = process.env.NEXT_PUBLIC_API_URL;
  if (!v) return "";
  return v.replace(/\/+$/, ""); // remove barra final
}

function normalizePhoneBR(input: string) {
  // deixa só números
  const digits = (input || "").replace(/\D/g, "");
  // se já começa com 55, mantém
  if (digits.startsWith("55")) return digits;
  // se for número BR sem DDI (ex: 11999999999), adiciona 55
  if (digits.length >= 10 && digits.length <= 13) return `55${digits}`;
  return digits;
}

function getToken() {
  // tente os nomes mais comuns
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("pronto_token") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const API = useMemo(() => getApiBase(), []);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [okMsg, setOkMsg] = useState("");

  // auto-slug quando o usuário digita o nome (se ele ainda não mexeu no slug)
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const slugOk = slug.length === 0 ? false : isValidSlug(slug);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setOkMsg("");
    setFieldErrors({});

    if (!API) {
      setFormError("NEXT_PUBLIC_API_URL não está configurada na Vercel.");
      return;
    }

    const token = getToken();
    if (!token) {
      setFormError("Você não está autenticado. Faça login novamente.");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slugify(slug), // força slug limpo
      phone: normalizePhoneBR(phone),
      description: description.trim(),
      address: address.trim(),
    };

    if (!payload.name) {
      setFieldErrors((p) => ({ ...p, name: ["Obrigatório"] }));
      return;
    }

    if (!isValidSlug(payload.slug)) {
      setFieldErrors((p) => ({
        ...p,
        slug: ["Slug inválido. Use minúsculo, números e hífen (ex: acai-da-ju)."],
      }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        // tenta mapear erro padrão do backend (zod)
        const fe: FieldErrors = data?.error?.fieldErrors || {};
        const formErrors: string[] = data?.error?.formErrors || [];
        if (Object.keys(fe).length > 0) setFieldErrors(fe);
        if (formErrors.length > 0) setFormError(formErrors.join(" | "));

        if (!Object.keys(fe).length && !formErrors.length) {
          setFormError(
            typeof data === "string"
              ? data
              : data?.message || data?.error || `Erro ao criar restaurante (HTTP ${res.status})`
          );
        }
        return;
      }

      setOkMsg("✅ Restaurante criado com sucesso!");
      
      // Redireciona para a p�gina de gerenciamento do restaurante
      if (data?.restaurant?.id) {
        setTimeout(() => {
          router.push(`/app/restaurant/${data.restaurant.id}`);
        }, 1000);
      }
      setAddress("");
    } catch (err: any) {
      setFormError("Falha de rede ao chamar a API. Verifique o backend/ENV.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Novo restaurante</h1>
          <p className="text-zinc-600 mt-1">
            Crie seu restaurante e depois cadastre os produtos.
          </p>
        </div>

        <Link className="rounded-lg px-3 py-2 hover:bg-zinc-100" href="/app">
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        {formError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {formError}
          </div>
        ) : null}

        {okMsg ? (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            {okMsg}
          </div>
        ) : null}

        {/* Nome */}
        <label className="block">
          <span className="text-sm font-medium">Nome</span>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Açai da Ju"
            autoComplete="off"
          />
          {fieldErrors?.name?.length ? (
            <div className="mt-2 text-sm text-red-700">{fieldErrors.name.join(" | ")}</div>
          ) : null}
        </label>

        {/* Slug */}
        <label className="mt-5 block">
          <span className="text-sm font-medium">Slug (link do cardápio)</span>
          <input
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-zinc-800
              border-zinc-300"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="Ex: acai-da-ju"
            autoComplete="off"
          />
          <div className="mt-2 text-sm text-zinc-600">
            Seu cardápio ficará em: <span className="font-mono">/r/{slug || "seu-slug"}</span>
          </div>

          {slug.length > 0 && !slugOk ? (
            <div className="mt-2 text-sm text-red-700">
              Slug inválido. Use minúsculo, números e hífen. Ex: <b>acai-da-ju</b>
            </div>
          ) : null}

          {fieldErrors?.slug?.length ? (
            <div className="mt-2 text-sm text-red-700">{fieldErrors.slug.join(" | ")}</div>
          ) : null}
        </label>

        {/* Telefone */}
        <label className="mt-5 block">
          <span className="text-sm font-medium">WhatsApp / Telefone</span>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: 11 91628-7735 (vamos salvar como 55...)"
            autoComplete="off"
          />
          <div className="mt-2 text-sm text-zinc-600">
            Vamos normalizar para: <span className="font-mono">{normalizePhoneBR(phone) || "55..."}</span>
          </div>

          {fieldErrors?.phone?.length ? (
            <div className="mt-2 text-sm text-red-700">{fieldErrors.phone.join(" | ")}</div>
          ) : null}
        </label>

        {/* Descrição */}
        <label className="mt-5 block">
          <span className="text-sm font-medium">Descrição</span>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Venda de açaí, sobremesas e complementos"
            autoComplete="off"
          />
          {fieldErrors?.description?.length ? (
            <div className="mt-2 text-sm text-red-700">{fieldErrors.description.join(" | ")}</div>
          ) : null}
        </label>

        {/* Endereço */}
        <label className="mt-5 block">
          <span className="text-sm font-medium">Endereço (opcional)</span>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Alameda das Sempre-Vivas, 876 - Alphaville"
            autoComplete="off"
          />
          {fieldErrors?.address?.length ? (
            <div className="mt-2 text-sm text-red-700">{fieldErrors.address.join(" | ")}</div>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar restaurante"}
        </button>

        <div className="mt-4 text-xs text-zinc-500">
          Dica: se você digitar “Açai da Ju”, o slug vira automaticamente <b>acai-da-ju</b>.
        </div>
      </form>
    </main>
  );
}


