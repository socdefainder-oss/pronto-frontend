"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, clearToken } from "../lib/api";

type Restaurant = { id: string; name: string; slug: string; phone: string };

export default function AppHome() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await api("/api/restaurants/mine");
      console.log("DEBUG - Dados recebidos:", data);
      console.log("DEBUG - Restaurantes:", data?.restaurants);
      
      if (data?.restaurants && data.restaurants.length > 0) {
        console.log("DEBUG - Primeiro restaurante:", data.restaurants[0]);
        console.log("DEBUG - ID do primeiro:", data.restaurants[0].id);
        console.log("DEBUG - Slug do primeiro:", data.restaurants[0].slug);
      }
      
      setRestaurants(data?.restaurants || []);
    } catch (e: any) {
      console.error("DEBUG - Erro ao carregar:", e);
      setErr(e.message || "Erro ao carregar restaurantes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Painel — pronto</h1>
        <div className="flex gap-2">
          <Link className="px-4 py-2 rounded-xl border hover:bg-white" href="/app/restaurant/new">
            + Novo restaurante
          </Link>
          <button
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
            onClick={() => { clearToken(); window.location.href = "/"; }}
          >
            Sair
          </button>
        </div>
      </header>

      {loading && (
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-zinc-300 border-t-zinc-900"></div>
          <span className="ml-3 text-zinc-600">Carregando restaurantes...</span>
        </div>
      )}

      {err && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">Erro</p>
          <p className="mt-1 text-sm text-red-700">{err}</p>
          <button
            onClick={load}
            className="mt-3 rounded-lg bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <section className="mt-6 grid gap-3">
        {restaurants.map(r => (
          <div key={r.id} className="rounded-2xl border bg-white p-5 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-zinc-600">
                slug: <span className="font-mono">{r.slug}</span> • 
                WhatsApp: <span className="font-mono">{r.phone}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                ID: <span className="font-mono">{r.id}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link 
                className="px-4 py-2 rounded-xl border hover:bg-zinc-50" 
                href={`/r/${r.slug}`} 
                target="_blank"
              >
                Ver cardápio
              </Link>
              <Link 
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800" 
                href={`/app/restaurant/${r.id}`}
              >
                Gerenciar
              </Link>
            </div>
          </div>
        ))}
        
        {!loading && restaurants.length === 0 && !err && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold">Nenhum restaurante cadastrado</h3>
            <p className="mt-1 text-zinc-600">Crie seu primeiro restaurante para começar a vender.</p>
            <Link 
              className="mt-4 inline-block rounded-xl bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-800"
              href="/app/restaurant/new"
            >
              Criar primeiro restaurante
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}