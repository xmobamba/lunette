import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { Product } from './types';
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
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customPhone, setCustomPhone] = useState<string>(() => {
    try {
      return localStorage.getItem('aura_custom_phone') || '';
    } catch {
      return '';
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const handleSavePhone = (newPhone: string) => {
    setCustomPhone(newPhone);
    try {
      localStorage.setItem('aura_custom_phone', newPhone);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#004D25] font-sans antialiased selection:bg-[#FF6E14] selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        favoritesCount={favorites.length}
      />

      <main className="pb-20 sm:pb-0">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Products Collection & Categories Grid */}
        <ProductGrid
          products={PRODUCTS}
          onOpenQuickView={(p) => setSelectedProduct(p)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* 4. Best-sellers Highlight */}
        <BestsellersSection
          products={PRODUCTS}
          onOpenQuickView={(p) => setSelectedProduct(p)}
        />

        {/* 5. Special Promotional Banner */}
        <PromoBanner />

        {/* 6. Why Choose Us (Pourquoi nous ?) */}
        <WhyUs />

        {/* 7. Social Proof & Customer Reviews */}
        <SocialProof />

        {/* 8. Instagram & Social Community Feed */}
        <InstagramFeed />

        {/* 9. FAQ Accordion */}
        <FAQ />

        {/* 10. Final Conversion CTA */}
        <FinalCTA />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* 12. Floating Desktop & Sticky Mobile WhatsApp Triggers */}
      <FloatingWhatsApp favoriteCount={favorites.length} />

      {/* 13. Product Quick-View Modal (Fiche Rapide) */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 14. Store Owner Quick WhatsApp Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customPhone={customPhone}
        onSavePhone={handleSavePhone}
      />
    </div>
  );
}
