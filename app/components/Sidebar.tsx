"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { clearToken, getToken } from "../lib/api";

export default function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const restaurantId = params?.id as string;
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    "Administrar Loja": true,
  });
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Array<{ id: string; name: string }>>([]);
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantName();
      loadAllRestaurants();
    }
  }, [restaurantId]);

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (showRestaurantDropdown && !target.closest('.relative')) {
        setShowRestaurantDropdown(false);
      }
    }

    if (showRestaurantDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showRestaurantDropdown]);

  async function loadRestaurantName() {
    const token = getToken();
    if (!token || !restaurantId) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";
      const res = await fetch(`${API_URL}/api/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRestaurantName(data.name || "");
      }
    } catch (err) {
      console.error("Erro ao carregar nome do restaurante:", err);
    }
  }

  async function loadAllRestaurants() {
    const token = getToken();
    if (!token) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pronto-backend-j48e.onrender.com";
      const res = await fetch(`${API_URL}/api/restaurants/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data.restaurants || []);
      }
    } catch (err) {
      console.error("Erro ao carregar restaurantes:", err);
    }
  }

  const menuItems = [
    {
      label: "Gestor de Pedidos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/orders`,
    },
    {
      label: "Cozinha",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/kitchen`,
    },
    {
      label: "Gestor de Produtos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}`,
      subItems: [
        { label: "Produtos", href: `/app/restaurant/${restaurantId}/products` },
        { label: "Categorias", href: `/app/restaurant/${restaurantId}/categories` },
      ],
    },
    {
      label: "Relatórios",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/reports`,
    },
    {
      label: "Cupons",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/coupons`,
    },
    {
      label: "Banners",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/banners`,
    },
    {
      label: "Administrar Loja",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/settings`,
      hasDropdown: true,
      subItems: [
        { label: "Dados da loja", href: `/app/restaurant/${restaurantId}/settings?tab=dados` },
        { label: "Horários", href: `/app/restaurant/${restaurantId}/settings?tab=horarios` },
        { label: "Entrega", href: `/app/restaurant/${restaurantId}/settings?tab=entrega` },
        { label: "Pagamento", href: `/app/restaurant/${restaurantId}/settings?tab=pagamento` },
        { label: "Motoboys", href: `/app/restaurant/${restaurantId}/settings?tab=motoboys` },
        { label: "Impressão", href: `/app/restaurant/${restaurantId}/settings?tab=impressao` },
        { label: "Usuários", href: `/app/restaurant/${restaurantId}/settings?tab=usuarios` },
      ],
    },
    {
      label: "Financeiro",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/financeiro`,
      subItems: [
        { label: "Extrato", href: `/app/restaurant/${restaurantId}/financeiro/extrato` },
        { label: "Relatório", href: `/app/restaurant/${restaurantId}/financeiro/relatorio` },
        { label: "Mensalidade", href: `/app/restaurant/${restaurantId}/financeiro/mensalidade` },
        { label: "Configurações", href: `/app/restaurant/${restaurantId}/financeiro/configuracoes` },
      ],
    },
    {
      label: "Delivery",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2m6 2a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/delivery`,
      subItems: [
        { label: "Entregas", href: `/app/restaurant/${restaurantId}/delivery/entregas` },
        { label: "Motoboys", href: `/app/restaurant/${restaurantId}/delivery/motoboys` },
        { label: "Histórico", href: `/app/restaurant/${restaurantId}/delivery/historico` },
        { label: "Configurações", href: `/app/restaurant/${restaurantId}/delivery/configuracoes` },
      ],
    },
    {
      label: "Integrações",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      href: `/app/restaurant/${restaurantId}/integracoes`,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  const hasActiveSubItem = (subItems?: Array<{ label: string; href: string }>) => {
    return subItems?.some(item => pathname === item.href);
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/app" className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">pronto</span>
          </Link>
          {restaurantName && (
            <div className="relative mt-2">
              <button
                onClick={() => setShowRestaurantDropdown(!showRestaurantDropdown)}
                className="w-full px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:border-emerald-300 transition-colors group"
              >
                <p className="text-xs text-emerald-600 font-medium mb-0.5">Gerenciando:</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900 truncate" title={restaurantName}>
                    {restaurantName}
                  </p>
                  <svg 
                    className={`w-4 h-4 text-emerald-600 transition-transform flex-shrink-0 ${showRestaurantDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Dropdown */}
              {showRestaurantDropdown && restaurants.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  <div className="py-1">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Trocar para:
                    </p>
                    {restaurants.filter(r => r.id !== restaurantId).map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/app/restaurant/${restaurant.id}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        onClick={() => setShowRestaurantDropdown(false)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          {restaurant.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 py-1">
                    <Link
                      href="/app"
                      className="block px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowRestaurantDropdown(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Ver todas as lojas
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href) || hasActiveSubItem(item.subItems);
              const isExpanded = expandedMenus[item.label];

              return (
                <li key={item.href}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                          active
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={active ? "text-emerald-600" : "text-gray-500"}>
                            {item.icon}
                          </span>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && item.subItems && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                  pathname.includes('settings')
                                    ? "text-emerald-700 hover:bg-emerald-50"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          active
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className={active ? "text-emerald-600" : "text-gray-500"}>
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </Link>
                      {item.subItems && hasActiveSubItem(item.subItems) && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                  isActive(subItem.href)
                                    ? "bg-emerald-50 text-emerald-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/app"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-2"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">Meus Restaurantes</span>
          </Link>
          <button
            onClick={() => {
              clearToken();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
