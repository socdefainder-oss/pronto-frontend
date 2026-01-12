import Link from "next/link";

export const dynamic = "force-dynamic";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
}

async function getRestaurant(slug: string) {
  const API = apiBase();
  // CORREÇÃO: URL correta é /api/public/restaurants/:slug
  const res = await fetch(`${API}/api/public/restaurants/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro ${res.status} ao buscar restaurante: ${slug}`);
    return null;
  }
  
  return await res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getRestaurant(params.slug);

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold">Cardápio não encontrado</h1>
        <p className="mt-2 text-zinc-600">
          O restaurante <span className="font-mono">{params.slug}</span> não existe ou está inativo.
        </p>
        <Link className="mt-6 inline-block rounded-xl bg-zinc-900 px-4 py-2 text-white" href="/">
          Voltar ao início
        </Link>
      </main>
    );
  }

  const phone = String(data.phone || "").replace(/\D/g, "");
  const waText = encodeURIComponent(`Olá! Gostaria de fazer um pedido no ${data.name}.`);
  const waLink = phone ? `https://wa.me/${phone}?text=${waText}` : "";

  const hasProducts = 
    (data.categories && data.categories.some((cat: any) => cat.products.length > 0)) ||
    (data.productsWithoutCategory && data.productsWithoutCategory.length > 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      {/* HEADER */}
      <header className="rounded-2xl border border-zinc-200 bg-white p-6 mb-8">
        <h1 className="text-3xl font-bold">{data.name}</h1>

        {data.description && (
          <p className="mt-3 text-zinc-700">{data.description}</p>
        )}
        
        {data.address && (
          <p className="mt-2 text-sm text-zinc-500">
            📍 {data.address}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {waLink ? (
            <a
              className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 transition"
              href={waLink}
              target="_blank"
              rel="noreferrer"
            >
              📱 Pedir no WhatsApp
            </a>
          ) : (
            <span className="text-sm text-zinc-500">WhatsApp não configurado.</span>
          )}

          <Link 
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50 transition"
            href="/"
          >
            ← Voltar ao site
          </Link>
        </div>
      </header>

      {/* PRODUTOS */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Cardápio</h2>
        
        {!hasProducts ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Cardápio em construção</h3>
            <p className="text-zinc-600">
              Este restaurante ainda está preparando seu cardápio. Volte em breve!
            </p>
          </div>
        ) : (
          <>
            {/* Produtos por categoria */}
            {data.categories && data.categories.map((category: any) => (
              category.products.length > 0 && (
                <div key={category.id} className="mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b border-zinc-200 pb-2">
                    {category.name}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {category.products.map((product: any) => (
                      <div 
                        key={product.id} 
                        className="rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{product.name}</h4>
                            {product.description && (
                              <p className="mt-2 text-zinc-600 text-sm">{product.description}</p>
                            )}
                          </div>
                          <div className="ml-4 font-bold text-lg whitespace-nowrap">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (waLink) {
                              const message = encodeURIComponent(
                                `Olá! Gostaria de pedir: ${product.name} - R$ ${product.price.toFixed(2)}`
                              );
                              window.open(`${waLink.split('?')[0]}?text=${message}`, '_blank');
                            }
                          }}
                          className="mt-4 w-full rounded-lg bg-zinc-900 text-white py-2 hover:bg-zinc-800 transition"
                        >
                          Pedir este item
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}

            {/* Produtos sem categoria */}
            {data.productsWithoutCategory && data.productsWithoutCategory.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 border-b border-zinc-200 pb-2">
                  Outros itens
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.productsWithoutCategory.map((product: any) => (
                    <div 
                      key={product.id} 
                      className="rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{product.name}</h4>
                          {product.description && (
                            <p className="mt-2 text-zinc-600 text-sm">{product.description}</p>
                          )}
                        </div>
                        <div className="ml-4 font-bold text-lg whitespace-nowrap">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (waLink) {
                            const message = encodeURIComponent(
                              `Olá! Gostaria de pedir: ${product.name} - R$ ${product.price.toFixed(2)}`
                            );
                            window.open(`${waLink.split('?')[0]}?text=${message}`, '_blank');
                          }
                        }}
                        className="mt-4 w-full rounded-lg bg-zinc-900 text-white py-2 hover:bg-zinc-800 transition"
                      >
                        Pedir este item
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer className="pt-8 border-t border-zinc-200 text-center text-sm text-zinc-500">
        <p>
          🚀 Cardápio digital por <span className="font-semibold">pronto</span> • 
          Compartilhe este link: <span className="font-mono bg-zinc-100 px-2 py-1 rounded">
            pronto.com/r/{data.slug}
          </span>
        </p>
      </footer>
    </main>
  );
}