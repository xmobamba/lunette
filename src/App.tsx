import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { STORE_CONFIG } from './config/store';
import { DEFAULT_PROMOS } from './data/promos';
import { Product, StoreConfig, PromoBannerItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { BestsellersSection } from './components/BestsellersSection';
import { PromoBanner } from './components/PromoBanner';
import { WhyUs } from './components/WhyUs';
import { SocialProof } from './components/SocialProof';
import { InstagramFeed } from './components/InstagramFeed';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProductModal } from './components/ProductModal';
import { AdminManagerModal } from './components/AdminManagerModal';

export default function App() {
  // 1. Dynamic Products State with localStorage persistence (v2 catalog with updated 35000 FCFA price)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_products_v2');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // 2. Dynamic Store Config State with localStorage persistence (v2 with phone +225 08 48 10 12)
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('aura_store_config_v2');
      if (saved) return JSON.parse(saved);
      return STORE_CONFIG;
    } catch {
      return STORE_CONFIG;
    }
  });

  // 3. Dynamic Promotional Banners State with localStorage persistence
  const [promos, setPromos] = useState<PromoBannerItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_promos_v1');
      if (saved) return JSON.parse(saved);
      return DEFAULT_PROMOS;
    } catch {
      return DEFAULT_PROMOS;
    }
  });

  // 4. Selection, Favorites, and Secret Admin Mode
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hasAdminParam = urlParams.get('admin') === 'true' || urlParams.get('admin') === '1' || urlParams.get('mode') === 'admin';
      const hasAdminHash = window.location.hash === '#admin';
      const hasAdminSession = sessionStorage.getItem('aura_admin_mode') === 'true';
      return hasAdminParam || hasAdminHash || hasAdminSession;
    } catch {
      return false;
    }
  });

  // Check URL on load to auto-open if specifically requested via URL
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || urlParams.get('admin') === '1' || window.location.hash === '#admin') {
        setIsAdminMode(true);
        setIsAdminOpen(true);
        sessionStorage.setItem('aura_admin_mode', 'true');
      }

      const handleHashChange = () => {
        if (window.location.hash === '#admin') {
          setIsAdminMode(true);
          setIsAdminOpen(true);
          sessionStorage.setItem('aura_admin_mode', 'true');
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    } catch {
      // ignore
    }
  }, []);

  const handleActivateAdmin = () => {
    setIsAdminMode(true);
    setIsAdminOpen(true);
    try {
      sessionStorage.setItem('aura_admin_mode', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem('aura_admin_mode');
      if (window.location.search.includes('admin') || window.location.hash === '#admin') {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronize favorites with localStorage
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('aura_favorites', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Synchronize products updates
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('aura_products_v2', JSON.stringify(newProducts));
    } catch (err) {
      console.error(err);
    }
  };

  // Synchronize store configuration updates
  const handleUpdateStoreConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    try {
      localStorage.setItem('aura_store_config_v2', JSON.stringify(newConfig));
      localStorage.setItem('aura_custom_phone', newConfig.phoneRaw);
    } catch (err) {
      console.error(err);
    }
  };

  // Synchronize promotional banners updates
  const handleUpdatePromos = (newPromos: PromoBannerItem[]) => {
    setPromos(newPromos);
    try {
      localStorage.setItem('aura_promos_v1', JSON.stringify(newPromos));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#004D25] font-sans antialiased selection:bg-[#FF6E14] selection:text-white">
      {/* Admin Mode Bar Indicator (visible only to admin) */}
      {isAdminMode && (
        <div className="bg-[#00381B] text-white text-xs py-1.5 px-4 sticky top-0 z-50 flex items-center justify-between border-b border-[#FF6E14]">
          <div className="flex items-center gap-2 font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🔐 Mode Administrateur Actif</span>
            <span className="hidden sm:inline text-white/70 font-normal">• Les clients ne voient pas ce panneau</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-[#FF6E14] hover:bg-[#E05300] text-white px-2.5 py-0.5 rounded text-[11px] font-black cursor-pointer shadow-xs"
            >
              Gérer la boutique
            </button>
            <button
              onClick={handleExitAdmin}
              className="text-white/80 hover:text-white hover:bg-white/10 px-2 py-0.5 rounded text-[11px] font-medium"
            >
              Quitter
            </button>
          </div>
        </div>
      )}

      {/* 1. Header / Navbar */}
      <Navbar
        onOpenSettings={() => setIsAdminOpen(true)}
        onExitAdmin={handleExitAdmin}
        favoritesCount={favorites.length}
        storeConfig={storeConfig}
        customPhone={storeConfig.phoneRaw}
        isAdminMode={isAdminMode}
      />

      <main className="pb-20 sm:pb-0">
        {/* 2. Hero Section */}
        <Hero customPhone={storeConfig.phoneRaw} />

        {/* 3. Products Collection & Categories Grid */}
        <ProductGrid
          products={products}
          onOpenQuickView={(p) => setSelectedProduct(p)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          customPhone={storeConfig.phoneRaw}
        />

        {/* 4. Best-sellers Highlight */}
        <BestsellersSection
          products={products}
          onOpenQuickView={(p) => setSelectedProduct(p)}
          customPhone={storeConfig.phoneRaw}
        />

        {/* 5. Special Promotional Banner */}
        <PromoBanner
          promos={promos}
          storeConfig={storeConfig}
          customPhone={storeConfig.phoneRaw}
        />

        {/* 6. Why Choose Us (Pourquoi nous ?) */}
        <WhyUs />

        {/* 7. Social Proof & Customer Reviews */}
        <SocialProof />

        {/* 8. Instagram & Social Community Feed */}
        <InstagramFeed />

        {/* 9. FAQ Accordion */}
        <FAQ />

        {/* 10. Final Conversion CTA */}
        <FinalCTA customPhone={storeConfig.phoneRaw} />
      </main>

      {/* 11. Footer */}
      <Footer
        storeConfig={storeConfig}
        customPhone={storeConfig.phoneRaw}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminMode={isAdminMode}
        onSecretAdminUnlock={handleActivateAdmin}
      />

      {/* 12. Floating Desktop & Sticky Mobile WhatsApp Triggers */}
      <FloatingWhatsApp
        favoriteCount={favorites.length}
        customPhone={storeConfig.phoneRaw}
      />

      {/* Floating Store & Promo Manager Trigger (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
        <button
          onClick={() => setIsAdminOpen(true)}
          id="floating-admin-btn"
          className="flex items-center gap-2 bg-[#004D25] hover:bg-[#00381B] text-white px-3.5 py-2.5 rounded-2xl shadow-xl border-2 border-orange-300 transition-all hover:scale-105 active:scale-95 text-xs font-black cursor-pointer group"
          title="Ouvrir la gestion des bannières, promotions, catalogue et coordonnées"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6E14] animate-ping group-hover:scale-125"></span>
          <span>⚙️ Gérer Boutique & Promos</span>
        </button>
      </div>

      {/* 13. Product Quick-View Modal (Fiche Rapide) */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        customPhone={storeConfig.phoneRaw}
      />

      {/* 14. Full Manual Store & Product Management Dashboard */}
      <AdminManagerModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        storeConfig={storeConfig}
        onUpdateStoreConfig={handleUpdateStoreConfig}
        promos={promos}
        onUpdatePromos={handleUpdatePromos}
      />
    </div>
  );
}
