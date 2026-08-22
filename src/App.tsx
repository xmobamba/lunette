import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { 
  addPhotoToMediaLibrary, 
  syncAllPhotosToMediaLibrary, 
  saveStoredMediaLibrary, 
  getStoredMediaLibrary,
  getStoredHeroImage,
  setStoredHeroImage 
} from './utils/imageUpload';
import { fetchServerSyncData, pushServerSyncData } from './utils/syncApi';

export default function App() {
  // 1. Dynamic Products State with localStorage persistence (v4 catalog - authentic luxury images)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_products_v4') || localStorage.getItem('aura_products_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            // If images are missing or contains old Unsplash stock placeholder, replace with curated luxury asset
            const hasUnsplash = p.images?.some((img: string) => typeof img === 'string' && img.includes('images.unsplash.com'));
            if (!p.images || p.images.length === 0 || hasUnsplash) {
              const defaultMatch = PRODUCTS.find((dp) => dp.id === p.id);
              if (defaultMatch && defaultMatch.images && defaultMatch.images.length > 0) {
                return { ...p, images: defaultMatch.images };
              }
            }
            return p;
          });
        }
      }
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

  // 4. Hero Image State
  const [heroImage, setHeroImage] = useState<string | null>(() => getStoredHeroImage());

  // 5. Selection and Favorites
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const lastSyncTimestampRef = useRef<number>(0);

  // Core synchronization method across all connected devices
  const performServerSync = useCallback(async (pushIfEmpty = false) => {
    try {
      const cloudData = await fetchServerSyncData();
      if (cloudData && cloudData.products && Array.isArray(cloudData.products) && cloudData.products.length > 0) {
        // If server has newer data, apply it
        if (cloudData.lastUpdated && cloudData.lastUpdated <= lastSyncTimestampRef.current) {
          return;
        }
        lastSyncTimestampRef.current = cloudData.lastUpdated || Date.now();

        const sanitized = cloudData.products.map((p) => {
          const hasUnsplash = p.images?.some((img: string) => typeof img === 'string' && img.includes('images.unsplash.com'));
          if (!p.images || p.images.length === 0 || hasUnsplash) {
            const defaultMatch = PRODUCTS.find((dp) => dp.id === p.id);
            if (defaultMatch && defaultMatch.images && defaultMatch.images.length > 0) {
              return { ...p, images: defaultMatch.images };
            }
          }
          return p;
        });

        setProducts(sanitized);
        try {
          localStorage.setItem('aura_products_v4', JSON.stringify(sanitized));
        } catch {}

        if (cloudData.mediaLibrary && Array.isArray(cloudData.mediaLibrary)) {
          saveStoredMediaLibrary(cloudData.mediaLibrary);
        }
        if (cloudData.heroImage !== undefined) {
          setStoredHeroImage(cloudData.heroImage);
          setHeroImage(cloudData.heroImage);
        }
        if (cloudData.customPhone) {
          setStoreConfig((prev) => {
            const updated = {
              ...prev,
              phoneRaw: cloudData.customPhone || prev.phoneRaw,
              phoneDisplay: `+225 ${cloudData.customPhone || prev.phoneRaw}`,
            };
            try {
              localStorage.setItem('aura_store_config_v2', JSON.stringify(updated));
              localStorage.setItem('aura_custom_phone', updated.phoneRaw);
            } catch {}
            return updated;
          });
        }
      } else if (pushIfEmpty) {
        // Server store is empty, push our current rich catalog so all devices can sync
        const currentHero = getStoredHeroImage();
        const currentLib = getStoredMediaLibrary();
        await pushServerSyncData({
          products,
          mediaLibrary: currentLib,
          heroImage: currentHero,
          customPhone: storeConfig.phoneRaw,
        });
        lastSyncTimestampRef.current = Date.now();
      }
    } catch (err) {
      console.debug('Cloud sync error:', err);
    }
  }, [products, storeConfig.phoneRaw]);

  // Real-Time Background Sync & Device Handshake
  useEffect(() => {
    // Initial sync on mount
    performServerSync(true);

    // Continuous polling every 4 seconds to catch edits from other tabs/devices
    const syncInterval = setInterval(() => {
      performServerSync(false);
    }, 4000);

    // Instant sync when switching back to this app (e.g. mobile tab wake-up)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        performServerSync(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [performServerSync]);

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
      localStorage.setItem('aura_products_v4', JSON.stringify(newProducts));
    } catch (err) {
      console.error(err);
    }
    lastSyncTimestampRef.current = Date.now();
    // Asynchronously push to server for multi-device sync
    pushServerSyncData({ 
      products: newProducts,
      mediaLibrary: getStoredMediaLibrary(),
      heroImage: getStoredHeroImage(),
      customPhone: storeConfig.phoneRaw,
    });
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
    lastSyncTimestampRef.current = Date.now();
    pushServerSyncData({ 
      customPhone: newConfig.phoneRaw,
      products,
      mediaLibrary: getStoredMediaLibrary(),
      heroImage: getStoredHeroImage(),
    });
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
        <Hero 
          customPhone={storeConfig.phoneRaw} 
          products={products}
          heroImage={heroImage}
        />

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
