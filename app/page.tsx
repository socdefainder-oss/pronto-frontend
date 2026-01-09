import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <header className="flex items-center justify-between">
        <div className="font-bold text-xl">pronto</div>
        <nav className="flex gap-3">
          <Link className="px-3 py-2 rounded-lg hover:bg-zinc-100" href="/login">Entrar</Link>
          <Link className="px-3 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800" href="/register">
            Começar
          </Link>
        </nav>
      </header>

      <section className="mt-14 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Seu delivery vendendo no <span className="underline">automático</span>, com cardápio digital e WhatsApp.
          </h1>
          <p className="mt-4 text-lg text-zinc-700">
            O <b>pronto</b> junta o básico que funciona: <b>site do cardápio</b>, <b>cadastro de produtos</b> e
            <b> pedido pronto para enviar no WhatsApp</b>. (O “arroz com feijão” que Brendi/Saipos exploram: vender mais,
            reduzir atrito e organizar a operação). :contentReference[oaicite:2]{index=2}
          </p>

          <div className="mt-6 flex gap-3">
            <Link className="px-5 py-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800" href="/register">
              Criar minha conta
            </Link>
            <Link className="px-5 py-3 rounded-xl border border-zinc-300 hover:bg-white" href="#como-funciona">
              Ver como funciona
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-zinc-700">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Cardápio Online</b>
              <div className="mt-1">Link por slug + QR Code depois</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>WhatsApp</b>
              <div className="mt-1">Pedido vira mensagem pronta</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Gestão simples</b>
              <div className="mt-1">Produtos, categorias, ativar/pausar</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Escalável</b>
              <div className="mt-1">Render (API) + Vercel (site)</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-zinc-500">Prévia</div>
          <div className="mt-2 text-2xl font-bold">Cardápio do Restaurante</div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Hambúrguer X</div>
              <div className="text-sm text-zinc-600">Pão, carne, queijo, molho</div>
              <div className="mt-2 font-bold">R$ 29,90</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Açaí 500ml</div>
              <div className="text-sm text-zinc-600">Granola + leite em pó</div>
              <div className="mt-2 font-bold">R$ 19,90</div>
            </div>
          </div>
          <div className="mt-5 text-xs text-zinc-500">
            Depois a gente pluga IA, tráfego, integrações… mas primeiro: vender e organizar.
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mt-16">
        <h2 className="text-2xl font-bold">Como funciona</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          <li className="rounded-2xl border border-zinc-200 bg-white p-5">
            <b>1) Cria conta</b>
            <div className="mt-1 text-zinc-700">Login e painel do dono.</div>
          </li>
          <li className="rounded-2xl border border-zinc-200 bg-white p-5">
            <b>2) Cadastra restaurante e produtos</b>
            <div className="mt-1 text-zinc-700">Categorias, preço, ativar/pausar.</div>
          </li>
          <li className="rounded-2xl border border-zinc-200 bg-white p-5">
            <b>3) Compartilha o link do cardápio</b>
            <div className="mt-1 text-zinc-700">Cliente monta carrinho e finaliza no WhatsApp.</div>
          </li>
        </ol>
      </section>

      <footer className="mt-16 text-sm text-zinc-500">
        pronto © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
