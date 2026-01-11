import Link from "next/link";

export const dynamic = "force-dynamic";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
}

async function getRestaurant(slug: string) {
  const API = apiBase();
  // CORREÇÃO: URL correta é /api/restaurants/public/:slug
  const res = await fetch(`${API}/api/restaurants/public/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  
  const data = await res.json();
  return data.restaurant; // Extrai o restaurante do objeto { restaurant: ... }
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
        
        {restaurant.products && restaurant.products.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {restaurant.products.map((product: any) => (
              <div key={product.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.description && (
                      <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
                    )}
                  </div>
                  <div className="font-bold text-lg">
                    R$ {Number(product.price).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
            <p className="text-zinc-600">Nenhum produto cadastrado ainda.</p>
          </div>
        )}
      </section>
      
      <footer className="mt-10 pt-6 border-t border-zinc-200 text-center text-sm text-zinc-500">
        <p>Cardápio gerado por <span className="font-semibold">pronto</span></p>
      </footer>
    </main>
  );
}