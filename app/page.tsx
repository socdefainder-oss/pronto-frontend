import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div className="font-bold text-xl">pronto</div>
        <nav className="flex gap-3">
          <Link
            className="px-3 py-2 rounded-lg hover:bg-zinc-100"
            href="/login"
          >
            Entrar
          </Link>
          <Link
            className="px-3 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800"
            href="/register"
          >
            Começar
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mt-14 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Seu delivery vendendo no{" "}
            <span className="underline">automático</span>, com cardápio digital e
            WhatsApp.
          </h1>

          <p className="mt-4 text-lg text-zinc-700">
            O <b>pronto</b> junta o básico que funciona:{" "}
            <b>site do cardápio</b>, <b>cadastro de produtos</b> e{" "}
            <b>pedido pronto para enviar no WhatsApp</b>. É o arroz com feijão
            bem feito para vender mais, reduzir atrito e organizar a operação.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              className="px-5 py-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
              href="/register"
            >
              Criar minha conta
            </Link>
            <Link
              className="px-5 py-3 rounded-xl border border-zinc-300 hover:bg-white"
              href="#como-funciona"
            >
              Ver como funciona
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-zinc-700">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Cardápio Online</b>
              <div className="mt-1">
                Link por slug para compartilhar ou usar em QR Code
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Pedidos no WhatsApp</b>
              <div className="mt-1">
                O cliente monta o pedido e envia com 1 clique
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Gestão simples</b>
              <div className="mt-1">
                Produtos, categorias, ativar ou pausar itens
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <b>Feito para crescer</b>
              <div className="mt-1">
                Backend no Render e frontend na Vercel
              </div>
            </div>
          </div>
        </div>

        {/* MOCK CARDÁPIO */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-zinc-500">Prévia do cardápio</div>

          <div className="mt-2 text-2xl font-bold">
            Restaurante Exemplo
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Hambúrguer Artesanal</div>
              <div className="text-sm text-zinc-600">
                Pão brioche, carne, queijo e molho especial
              </div>
              <div className="mt-2 font-bold">R$ 29,90</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Açaí 500ml</div>
              <div className="text-sm text-zinc-600">
                Açaí cremoso com granola
              </div>
              <div className="mt-2 font-bold">R$ 19,90</div>
            </div>
          </div>

          <div className="mt-5 text-xs text-zinc-500">
            Pedido finalizado direto no WhatsApp do restaurante
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mt-16">
        <h2 className="text-2xl font-bold">Como funciona</h2>

        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          <li className="rounded-2xl border border-zinc-200 bg-white p-5">
            <b>1) Crie sua conta</b>
            <div className="mt-1 text-zinc-700">
              Cadastro rápido e acesso ao painel
            </div>
          </li>

          <li className="rounded-2xl border border-zinc-200 bg-white p-5">
            <b>2) Cadastre o restaurante</b>
            <div className="mt-1 text-zinc-700">
              Inclua produtos, preços e categorias
            </div>
          </li>

          <li className="rounded-2xl border border-zinc-200 bg-white p-5">
            <b>3) Compartilhe o link</b>
            <div className="mt-1 text-zinc-700">
              O cliente pede e envia direto no WhatsApp
            </div>
          </li>
        </ol>
      </section>

      {/* FOOTER */}
      <footer className="mt-16 text-sm text-zinc-500">
        pronto © {new Date().getFullYear()} — simples, direto e funcional
      </footer>
    </main>
  );
}
