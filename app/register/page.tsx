"use client";

import Link from "next/link";
import { useState } from "react";
import { api, setToken } from "../lib/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });
      setToken(data.token);
      window.location.href = "/app";
    } catch (err: any) {
      setMsg(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="rounded-xl border p-3" placeholder="Nome"
          value={name} onChange={e => setName(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="E-mail"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Senha (mín. 6)"
          type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="rounded-xl bg-zinc-900 text-white py-3 font-semibold hover:bg-zinc-800">
          Criar e entrar
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </form>
      <div className="mt-4 text-sm text-zinc-600">
        Já tem conta? <Link className="underline" href="/login">Entrar</Link>
      </div>
    </main>
  );
}
