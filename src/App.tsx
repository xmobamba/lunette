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
import { SocialStories } from './components/SocialStories';
import { MobileSocialNav } from './components/MobileSocialNav';
import { addPhotoToMediaLibrary, syncAllPhotosToMediaLibrary } from './utils/imageUpload';

export default function App() {
  // 1. Dynamic Products State with localStorage persistence (v3 catalog - user custom images)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_products_v3');
      if (saved) return JSON.parse(saved);
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // 2. Dynamic Store Config State with localStorage persistence
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

  // 4. Selection and Favorites
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check URL on load or keyboard shortcut to open Admin Panel (e.g. #admin or Ctrl+Shift+A)
  useEffect(() => {
    try {
      const checkAdminInUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true' || urlParams.get('admin') === '1' || window.location.hash === '#admin') {
          setIsAdminOpen(true);
        }
      };

      checkAdminInUrl();
      window.addEventListener('hashchange', checkAdminInUrl);

      // Shortcut: Ctrl+Shift+A or Cmd+Shift+A to open Admin Manager
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          setIsAdminOpen(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('hashchange', checkAdminInUrl);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } catch {
      // ignore
    }
  }, []);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initial sync of all photos to Admin Media Library
  useEffect(() => {
    syncAllPhotosToMediaLibrary(products);
  }, []);

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
      localStorage.setItem('aura_products_v3', JSON.stringify(newProducts));
    } catch (err) {
      console.error(err);
    }
  };

  // Single Product Image Update
  const handleUpdateProductImage = (productId: string, newImage: string) => {
    const targetProd = products.find((p) => p.id === productId);
    addPhotoToMediaLibrary(newImage, targetProd?.name ? `${targetProd.name} (Photo)` : 'Photo Lunettes', productId, targetProd?.name);

    const updated = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          images: [newImage, ...(p.images || []).filter((img) => img !== newImage)],
        };
      }
      return p;
    });
    handleUpdateProducts(updated);
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#18261F] font-sans antialiased selection:bg-[#C85A17] selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar
        favoritesCount={favorites.length}
        storeConfig={storeConfig}
        customPhone={storeConfig.phoneRaw}
        promos={promos}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="pb-24 sm:pb-0">
        {/* 1.5 Header Level Compact Promo Banner with Glasses Fade & Rolling Info */}
        <PromoBanner
          promos={promos}
          storeConfig={storeConfig}
          customPhone={storeConfig.phoneRaw}
          products={products}
        />

        {/* 2. Hero Section with Custom Upload */}
        <Hero customPhone={storeConfig.phoneRaw} />

        {/* 3. Instagram & TikTok Interactive Stories Reel */}
        <SocialStories
          customPhone={storeConfig.phoneRaw}
          products={products}
        />

        {/* 4. Products Collection & Categories Grid with direct photo dropzone */}
        <ProductGrid
          products={products}
          onOpenQuickView={(p) => setSelectedProduct(p)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          customPhone={storeConfig.phoneRaw}
          onUpdateProducts={handleUpdateProducts}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 6. Best-sellers Highlight */}
        <BestsellersSection
          products={products}
          onOpenQuickView={(p) => setSelectedProduct(p)}
          customPhone={storeConfig.phoneRaw}
        />

        {/* 7. Why Choose Us (Pourquoi nous ?) */}
        <WhyUs />

        {/* 8. Social Proof & Customer Reviews */}
        <SocialProof />

        {/* 9. Instagram & Social Community Feed */}
        <InstagramFeed
          products={products}
          customPhone={storeConfig.phoneRaw}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 10. FAQ Accordion */}
        <FAQ />

        {/* 11. Final Conversion CTA */}
        <FinalCTA customPhone={storeConfig.phoneRaw} />
      </main>

      {/* 12. Footer with Secret 3-Click Admin Trigger */}
      <Footer
        storeConfig={storeConfig}
        customPhone={storeConfig.phoneRaw}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 13. Mobile Instagram-Style Sticky Bottom Nav */}
      <MobileSocialNav
        favoritesCount={favorites.length}
        customPhone={storeConfig.phoneRaw}
      />

      {/* 14. Floating Desktop & Sticky Mobile WhatsApp Triggers */}
      <FloatingWhatsApp
        favoriteCount={favorites.length}
        customPhone={storeConfig.phoneRaw}
      />

      {/* 15. Product Quick-View Modal (Fiche Rapide) */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        customPhone={storeConfig.phoneRaw}
        onUpdateProductImage={handleUpdateProductImage}
      />

      {/* 16. Full Manual Store & Photo Management Dashboard */}
      <AdminManagerModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
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
