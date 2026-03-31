type AsaasSealVariant = "positive" | "negative-black" | "negative-white";

interface AsaasSealProps {
  variant?: AsaasSealVariant;
  className?: string;
}

const SEAL_URLS: Record<AsaasSealVariant, string> = {
  positive:
    "https://baas.asaas.com/selos/Servicos_financeiros_Asaas-Reduzida-Positivo.svg?id=8a9a39f5-e266-4459-8ecd-61b9ef86585c",
  "negative-black":
    "https://baas.asaas.com/selos/Servicos_financeiros_Asaas-Reduzida-Negativo-Preto.svg?id=8a9a39f5-e266-4459-8ecd-61b9ef86585c",
  "negative-white":
    "https://baas.asaas.com/selos/Servicos_financeiros_Asaas-Reduzida-Negativo-Branco.svg?id=8a9a39f5-e266-4459-8ecd-61b9ef86585c",
};

export default function AsaasSeal({ variant = "positive", className = "" }: AsaasSealProps) {
  const src = SEAL_URLS[variant];

  return (
    <a
      href="https://www.asaas.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Servicos financeiros Asaas"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={src}
        alt="Servicos financeiros Asaas"
        className="h-12 w-auto"
        loading="lazy"
      />
    </a>
  );
}
