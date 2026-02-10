"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Pega o access_token do hash da URL
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");

        if (!accessToken) {
          setStatus("error");
          setMessage("Token de verificação não encontrado");
          return;
        }

        // Chama o backend para ativar o usuário
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erro ao verificar email");
        }

        // Salva o token JWT e faz login automático
        if (data.token) {
          localStorage.setItem("pronto_token", data.token);
          localStorage.setItem("pronto_user", JSON.stringify(data.user));
        }

        setStatus("success");
        setMessage(data.message || "Email verificado com sucesso!");

        // Redireciona para o app após 2 segundos
        setTimeout(() => {
          router.push("/app");
        }, 2000);
      } catch (err: any) {
        console.error("Verify error:", err);
        setStatus("error");
        setMessage(err.message || "Erro ao verificar email");
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verificando seu email...
            </h2>
            <p className="text-gray-600">Aguarde um momento</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Email verificado!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-emerald-600 font-medium">
              Redirecionando para o app...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Erro na verificação
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/register"
              className="block w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              Tentar novamente
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
