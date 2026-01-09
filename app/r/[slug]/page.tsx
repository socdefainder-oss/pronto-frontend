import Link from "next/link";

export const dynamic = "force-dynamic";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
}

async function getRestaurant(slug: string) {
  const API = apiBase();
  const res = await fetch(`${API}/api/public/restaurants/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const restaurant = await getRestaurant(params.slug);

  if (!restaurant) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold">Cardápio não encontrado</h1>
        <p className="mt-2 text-zinc-600">
          O restaurante <span className="font-mono">{params.slug}</span> não existe.
        </p>
        <Link className="mt-6 inline-block rounded-xl bg-zinc-900 px-4 py-2 text-white" href="/">
          Voltar
        </Link>
      </main>
    );
  }

  const phone = String(restaurant.phone || "").replace(/\D/g, "");
  const waText = encodeURIComponent(`Olá! Quero fazer um pedido no cardápio de ${restaurant.name}.`);
  const waLink = phone ? `https://wa.me/${phone}?text=${waText}` : "";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>

        {restaurant.description ? <p className="mt-2 text-zinc-700">{restaurant.description}</p> : null}
        {restaurant.address ? <p className="mt-2 text-sm text-zinc-500">{restaurant.address}</p> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          {waLink ? (
            <a
              className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              href={waLink}
              target="_blank"
              rel="noreferrer"
            >
              Pedir no WhatsApp
            </a>
          ) : (
            <span className="text-sm text-zinc-500">WhatsApp não configurado.</span>
          )}

          <Link className="rounded-xl border border-zinc-300 px-4 py-2 hover:bg-zinc-50" href="/">
            Voltar ao site
          </Link>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Produtos</h2>
        <p className="mt-2 text-zinc-600">Em breve: listagem de produtos.</p>
      </section>
    </main>
  );
}
