"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, clearToken } from "../lib/api";

type Restaurant = { id: string; name: string; slug: string; phone: string };

export default function AppHome() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await api("/api/restaurants/mine");
      setRestaurants(data.restaurants);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

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

      {err && <div className="mt-4 text-sm text-red-600">{err}</div>}

      <section className="mt-6 grid gap-3">
        {restaurants.map(r => (
          <div key={r.id} className="rounded-2xl border bg-white p-5 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-zinc-600">slug: {r.slug} • WhatsApp: {r.phone}</div>
            </div>
            <div className="flex gap-2">
              <Link className="px-4 py-2 rounded-xl border hover:bg-zinc-50" href={`/r/${r.slug}`} target="_blank">
                Ver cardápio
              </Link>
              <Link className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800" href={`/app/restaurant/${r.id}`}>
                Gerenciar
              </Link>
            </div>
          </div>
        ))}
        {restaurants.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-zinc-700">
            Você ainda não cadastrou nenhum restaurante.
          </div>
        )}
      </section>
    </main>
  );
}
