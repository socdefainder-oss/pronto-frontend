"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/lib/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";

export default function PublicRestaurantPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { addToCart, cart, cartTotal, cartCount } = useCart();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategoryBar, setShowCategoryBar] = useState(false);

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const url = `${API_URL}/api/public/restaurants/${encodeURIComponent(slug)}`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          setError("Restaurante não encontrado");
          return;
        }

        const data = await response.json();
        setRestaurant(data);
        setError(null);
      } catch (err: any) {
        setError("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [slug]);

  useEffect(() => {
    async function loadBanners() {
      if (!restaurant?.id) return;

      try {
        const response = await fetch(`${API_URL}/api/banners/public/${restaurant.id}/active`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setBanners(data);
        }
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      }
    }

    loadBanners();
  }, [restaurant?.id]);

  // Controla visibilidade da barra de categorias baseado no scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowCategoryBar(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para scroll suave até categoria
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 140; // Header + category bar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveCategory(categoryId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Cardápio não encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition">
            Voltar para página inicial
          </Link>
        </div>
      </div>
    );
  }

  const phone = String(restaurant?.phone || "").replace(/\D/g, "");
  const hasCategoriesWithProducts = restaurant?.categories?.some((cat: any) => cat.products?.length > 0);
  const hasProductsWithoutCategory = restaurant?.productsWithoutCategory?.length > 0;
  const hasProducts = hasCategoriesWithProducts || hasProductsWithoutCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{restaurant?.name}</h1>
          </div>
        </div>
      </header>

      {/* Category Navigation Bar - Sticky */}
      {showCategoryBar && hasProducts && (
        <div className="sticky top-[73px] z-30 bg-white border-b border-gray-200 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {restaurant?.categories?.map((category: any) => (
                category.products?.length > 0 && (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {category.name}
                  </button>
                )
              ))}
              {restaurant?.productsWithoutCategory?.length > 0 && (
                <button
                  onClick={() => scrollToCategory('outros')}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                    activeCategory === 'outros'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  Outros itens
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Restaurant Info */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            {restaurant?.logoUrl ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-200">
                <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{restaurant?.name}</h1>

              {/* Slogan motivador do restaurante */}
              {restaurant?.slogan && (
                <div className="mt-3 mb-2">
                  <p className="text-2xl font-semibold text-emerald-600 italic">
                    "{restaurant.slogan}"
                  </p>
                </div>
              )}

              {restaurant?.description && <p className="text-gray-600 mt-1">{restaurant.description}</p>}
            </div>
          </div>
          {restaurant?.address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-700">{restaurant.address}</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-8">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Cardápio
          </h2>

          {!hasProducts ? (
            <div className="py-16 text-center">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Cardápio em preparação</h3>
              <p className="text-gray-600">O restaurante está organizando seus produtos.</p>
            </div>
          ) : (
            <>
              {/* Banners promocionais */}
              {banners.length > 0 && (
                <div className="mb-8 space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition cursor-pointer transform hover:scale-[1.02] duration-200"
                      onClick={() => banner.linkUrl && window.open(banner.linkUrl, '_blank')}
                    >
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                        <h3 className="text-white font-bold text-xl">{banner.title}</h3>
                        {banner.description && (
                          <p className="text-emerald-50 text-sm mt-1">{banner.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {restaurant?.categories?.map((category: any) => (
                category.products?.length > 0 && (
                  <div key={category.id} id={`category-${category.id}`} className="mb-12 last:mb-0 scroll-mt-36">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                      {category.name}
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {category.products.map((product: any) => (
                        <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
                      ))}
                    </div>
                  </div>
                )
              ))}

              {restaurant?.productsWithoutCategory?.length > 0 && (
                <div id="category-outros" className="mb-12 last:mb-0 scroll-mt-36">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                    Outros itens
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {restaurant.productsWithoutCategory.map((product: any) => (
                      <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <Link
          href={`/r/${slug}/checkout`}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-emerald-600/50 transition-all hover:scale-105 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <div className="font-bold text-lg">{cartCount} {cartCount === 1 ? 'item' : 'itens'}</div>
            <div className="text-sm">R$ {(cartTotal / 100).toFixed(2).replace('.', ',')}</div>
          </div>
        </Link>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: any; onAdd: () => void }) {
  const priceInReais = (product.priceCents / 100).toFixed(2).replace('.', ',');

  return (
    <div className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition bg-white flex flex-col">
      {/* Imagem do produto */}
      {product.imageUrl && (
        <div className="relative w-full h-48 bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Se a imagem falhar ao carregar, esconde o elemento
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.display = 'none';
              }
            }}
          />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <h4 className="font-bold text-xl text-gray-900 mb-3">{product.name}</h4>
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        )}
        <div className="text-3xl font-bold text-emerald-600 mb-4 mt-auto">
          R$ {priceInReais}
        </div>
      </div>
      <button
        onClick={onAdd}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Adicionar
      </button>
    </div>
  );
}
