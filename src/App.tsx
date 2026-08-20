import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { STORE_CONFIG } from './config/store';
import { Product, StoreConfig } from './types';
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

  // 3. Selection, Favorites and Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-white text-[#004D25] font-sans antialiased selection:bg-[#FF6E14] selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar
        onOpenSettings={() => setIsAdminOpen(true)}
        favoritesCount={favorites.length}
        storeConfig={storeConfig}
        customPhone={storeConfig.phoneRaw}
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
      />

      {/* 12. Floating Desktop & Sticky Mobile WhatsApp Triggers */}
      <FloatingWhatsApp
        favoriteCount={favorites.length}
        customPhone={storeConfig.phoneRaw}
      />

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
      />
    </div>
  );
}
