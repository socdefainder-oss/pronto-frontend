import "./globals.css";
import Providers from "./components/Providers";

export const metadata = {
  title: "pronto — Cardápio + WhatsApp + Gestão",
  description: "Sistema pronto para seu delivery vender mais com cardápio digital e pedidos no WhatsApp."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
