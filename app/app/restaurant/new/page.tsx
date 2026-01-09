"use client";

import { useState } from "react";
import { api } from "../../../lib/api";

export default function NewRestaurant() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await api("/api/restaurants", {
        method: "POST",
        body: JSON.stringify({ name, slug, phone, description, address })
      });
      window.location.href = "/app";
    } catch (err: any) {
      setMsg(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-bold">Novo restaurante</h1>
      <p className="mt-2 text-zinc-700 text-sm">
        Dica: slug é o link do cardápio (ex: <b>meu-acai</b>).
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="rounded-xl border p-3" placeholder="Nome"
          value={name} onChange={e => setName(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Slug (a-z 0-9 -)"
          value={slug} onChange={e => setSlug(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="WhatsApp (ex: 5511999999999)"
          value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Endereço (opcional)"
          value={address} onChange={e => setAddress(e.target.value)} />
        <textarea className="rounded-xl border p-3" placeholder="Descrição (opcional)"
          value={description} onChange={e => setDescription(e.target.value)} />
        <button className="rounded-xl bg-zinc-900 text-white py-3 font-semibold hover:bg-zinc-800">
          Criar
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </form>
    </main>
  );
}
