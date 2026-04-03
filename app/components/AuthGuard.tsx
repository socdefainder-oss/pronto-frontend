"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken, API_URL } from "../lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isValidated, setIsValidated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function validateAuth() {
      const token = getToken();
      
      if (!token) {
        // Sem token → logout
        clearToken();
        router.replace("/login");
        return;
      }

      // Valida o token com o backend (segunda camada de segurança)
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          // Token inválido ou expirado
          clearToken();
          router.replace("/login");
          return;
        }

        // Token válido
        setIsValidated(true);
      } catch (err) {
        // Erro na validação → logout por segurança
        console.error("[AuthGuard] Validation error:", err);
        clearToken();
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    }

    validateAuth();
  }, [router]);

  // Enquanto valida, mostra loading
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Se validou, renderiza filhos
  if (isValidated) {
    return <>{children}</>;
  }

  // Caso contrário, página em branco (will redirect)
  return null;
}
