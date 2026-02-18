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
  const [showSidebar, setShowSidebar] = useState(false);

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
      setShowSidebar(false); // Fecha o sidebar ao clicar em categoria
    }
  };

  // Função para scroll horizontal nas categorias
  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
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
            {/* Menu Hambúrguer */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{restaurant?.name}</h1>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
            onClick={() => setShowSidebar(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl animate-in slide-in-from-left">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-teal-600">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="w-10 h-10 rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Categorias</h3>
                <nav className="space-y-2">
                  {restaurant?.categories?.map((category: any) => (
                    category.products?.length > 0 && (
                      <button
                        key={category.id}
                        onClick={() => scrollToCategory(category.id)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition flex items-center justify-between group"
                      >
                        <span className="font-semibold text-gray-700 group-hover:text-emerald-600">
                          {category.name}
                        </span>
                        <span className="text-xs bg-gray-100 group-hover:bg-emerald-100 group-hover:text-emerald-700 text-gray-600 px-2 py-1 rounded-full">
                          {category.products.length}
                        </span>
                      </button>
                    )
                  ))}
                  {restaurant?.productsWithoutCategory?.length > 0 && (
                    <button
                      onClick={() => scrollToCategory('outros')}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition flex items-center justify-between group"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-emerald-600">
                        Outros itens
                      </span>
                      <span className="text-xs bg-gray-100 group-hover:bg-emerald-100 group-hover:text-emerald-700 text-gray-600 px-2 py-1 rounded-full">
                        {restaurant.productsWithoutCategory.length}
                      </span>
                    </button>
                  )}
                </nav>

                {/* Restaurant Info in Sidebar */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Informações</h3>
                  {restaurant?.address && (
                    <div className="flex items-start gap-3 mb-4">
                      <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm text-gray-700">{restaurant.address}</p>
                    </div>
                  )}
                  {phone && (
                    <a
                      href={`https://wa.me/${phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-sm font-semibold text-green-700">Falar no WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Category Navigation Bar - Sticky com Setas */}
      {showCategoryBar && hasProducts && (
        <div className="sticky top-[73px] z-30 bg-white border-b border-gray-200 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
            {/* Seta Esquerda */}
            <button
              onClick={() => scrollCategories('left')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 flex items-center justify-center transition shadow-sm hover:shadow-md"
              aria-label="Rolar para esquerda"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Container de Categorias com Scroll */}
            <div id="category-scroll-container" className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {restaurant?.categories?.map((category: any) => (
                  category.products?.length > 0 && (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                        activeCategory === category.id
                          ? 'bg-emerald-600 text-white shadow-md'
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
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    Outros itens
                  </button>
                )}
              </div>
            </div>

            {/* Seta Direita */}
            <button
              onClick={() => scrollCategories('right')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 flex items-center justify-center transition shadow-sm hover:shadow-md"
              aria-label="Rolar para direita"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
