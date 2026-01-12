"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PublicRestaurantPage({ params }: { params: { slug: string } }) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

  useEffect(() => {
    async function loadRestaurant() {
      try {
        console.log(`🔄 Buscando restaurante: ${params.slug}`);
        
        const response = await fetch(
          `${API_URL}/api/public/restaurants/${encodeURIComponent(params.slug)}`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`📊 Status: ${response.status}, OK: ${response.ok}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Restaurante não encontrado");
          } else {
            setError(`Erro ${response.status} ao carregar o cardápio`);
          }
          return;
        }

        const data = await response.json();
        console.log("✅ Dados recebidos:", data);
        
        // Armazena no localStorage para debug (opcional)
        localStorage.setItem(`restaurant_${params.slug}`, JSON.stringify(data));
        
        setRestaurant(data);
        setError(null);
        
      } catch (err: any) {
        console.error("💥 Erro na requisição:", err);
        setError("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [params.slug, API_URL]);

  // Estado de carregamento
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando cardápio...</p>
          <p className="mt-1 text-sm text-gray-500">Restaurante: {params.slug}</p>
        </div>
      </main>
    );
  }

  // Estado de erro (restaurante não encontrado)
  if (error && !restaurant) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cardápio não encontrado</h1>
          <p className="text-gray-600 mb-4">
            O restaurante <span className="font-semibold">{params.slug}</span> não foi encontrado.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Detalhes:</strong> {error}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Voltar para página inicial
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block w-full px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Estado de sucesso (restaurante encontrado)
  const phone = String(restaurant?.phone || "").replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    `Olá ${restaurant?.name}! Gostaria de fazer um pedido.`
  );
  const whatsappLink = phone ? `https://wa.me/${phone}?text=${whatsappText}` : null;

  // Verifica se há produtos
  const hasCategoriesWithProducts = restaurant?.categories?.some(
    (cat: any) => cat.products && cat.products.length > 0
  );
  const hasProductsWithoutCategory = restaurant?.productsWithoutCategory?.length > 0;
  const hasProducts = hasCategoriesWithProducts || hasProductsWithoutCategory;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cabeçalho fixo */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-black"
              >
                <span className="text-2xl">←</span>
                <span className="font-medium">Voltar</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold truncate">{restaurant?.name}</h1>
            </div>
            
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
              >
                <span className="text-lg">💬</span>
                <span>Pedir no WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Informações do restaurante */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{restaurant?.name}</h1>
              
              {restaurant?.description && (
                <p className="mt-3 text-gray-600 text-lg">{restaurant.description}</p>
              )}
              
              {restaurant?.address && (
                <div className="mt-4 flex items-start space-x-2">
                  <span className="text-gray-500 mt-1">📍</span>
                  <p className="text-gray-700">{restaurant.address}</p>
                </div>
              )}
            </div>
            
            <div className="md:text-right">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-xl transition shadow-md"
                >
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <div className="font-bold">Fazer pedido</div>
                    <div className="text-sm opacity-90">Via WhatsApp</div>
                  </div>
                </a>
              ) : (
                <div className="px-6 py-4 border border-gray-300 rounded-xl text-gray-600">
                  <div className="font-medium">WhatsApp não configurado</div>
                  <div className="text-sm mt-1">Entre em contato com o restaurante</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cardápio */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Cardápio</h2>
            
            {!hasProducts && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Em construção
              </span>
            )}
          </div>

          {!hasProducts ? (
            <div className="py-12 text-center">
              <div className="text-6xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Cardápio em preparação
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto mb-8">
                O restaurante está organizando seus produtos para oferecer a melhor experiência.
                Volte em breve para conferir o cardápio completo!
              </p>
              
              {whatsappLink && (
                <div className="inline-block p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">
                    Enquanto isso, você pode entrar em contato diretamente:
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 font-medium hover:text-green-700"
                  >
                    <span>💬</span>
                    <span>Falar com {restaurant?.name} no WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Produtos por categoria */}
              {restaurant?.categories?.map((category: any) => (
                category.products?.length > 0 && (
                  <div key={category.id} className="mb-10 last:mb-0">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b">
                      {category.name}
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {category.products.map((product: any) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          restaurantName={restaurant.name}
                          phone={phone}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Produtos sem categoria */}
              {restaurant?.productsWithoutCategory?.length > 0 && (
                <div className="mb-10 last:mb-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b">
                    Outros itens
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {restaurant.productsWithoutCategory.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        restaurantName={restaurant.name}
                        phone={phone}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé informativo */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🚀 Cardápio digital por <span className="font-semibold">pronto</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Compartilhe este cardápio:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">
              pronto.com/r/{restaurant?.slug}
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}

// Componente de produto (reutilizável)
function ProductCard({ product, restaurantName, phone }: { 
  product: any; 
  restaurantName: string;
  phone: string;
}) {
  const priceInReais = (product.priceCents / 100).toFixed(2).replace('.', ',');
  
  const handleOrderClick = () => {
    if (!phone) return;
    
    const message = encodeURIComponent(
      `Olá ${restaurantName}! Gostaria de pedir:\n\n` +
      `• ${product.name}\n` +
      `• Quantidade: 1\n` +
      `• Total: R$ ${priceInReais}\n\n` +
      `Valor: R$ ${priceInReais}`
    );
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h4>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          )}
          
          <div className="mt-auto">
            <div className="text-2xl font-bold text-gray-900">
              R$ {priceInReais}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          {phone ? (
            <button
              onClick={handleOrderClick}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition"
            >
              Pedir este item
            </button>
          ) : (
            <div className="text-center text-gray-500 text-sm py-3">
              WhatsApp não disponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
}