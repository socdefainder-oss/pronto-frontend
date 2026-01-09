"use client";

import Link from "next/link";

export default function ProductsPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <p className="mt-2 text-zinc-600">
        Restaurante: <span className="font-mono">{params.id}</span>
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-zinc-700">
        Próximo passo: criar/listar/editar produtos e refletir no cardápio público.
      </div>

      <Link
        className="mt-6 inline-block rounded-xl bg-zinc-900 px-4 py-2 text-white"
        href={`/app/restaurant/${params.id}`}
      >
        Voltar
      </Link>
    </main>
  );
}
