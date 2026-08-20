import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Sparkles, SlidersHorizontal, Settings } from 'lucide-react';
import { StoreConfig } from '../types';
import { STORE_CONFIG } from '../config/store';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  onOpenSettings?: () => void;
  favoritesCount?: number;
  storeConfig?: StoreConfig;
  customPhone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  favoritesCount = 0,
  storeConfig = STORE_CONFIG,
  customPhone,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '#top' },
    { label: 'Collection', href: '#collection' },
    { label: 'Best-sellers', href: '#bestsellers' },
    { label: 'Pourquoi nous ?', href: '#pourquoi-nous' },
    { label: 'Avis clients', href: '#avis' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md transition-all duration-200 border-b ${
        isScrolled ? 'border-orange-200 shadow-sm py-2' : 'border-orange-100 py-2.5'
      }`}
    >
      {/* Delicate Côte d'Ivoire Tricolor Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#FF6E14]"></div>
        <div className="flex-1 bg-white border-y border-orange-100/40"></div>
        <div className="flex-1 bg-[#009E60]"></div>
      </div>

      {/* Top desktop micro-announcement banner */}
      <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto px-6 mb-1 text-[11px] text-[#004D25] border-b border-orange-100/60 pb-1.5 pt-0.5">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#009E60] animate-pulse"></span>
          <span>Boutique en ligne officielle • Abidjan, Côte d'Ivoire</span>
        </div>
        <div className="flex items-center gap-5 font-semibold">
          <span className="text-[#FF6E14]">🇨🇮 Livraison express 24h à Abidjan</span>
          <span className="text-orange-200">•</span>
          <span className="text-[#009E60]">Paiement sécurisé à la réception (Cash / Wave / OM)</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#top" id="brand-logo" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#FF6E14] flex items-center justify-center bg-orange-50 group-hover:scale-105 transition-transform shadow-xs shrink-0">
            <span className="text-[#FF6E14] font-serif font-black text-sm sm:text-base leading-none">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-lg font-black tracking-wide text-[#FF6E14] leading-tight">
              {storeConfig.storeName}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-[#009E60] leading-none">
              Abidjan • Eyewear
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs sm:text-sm font-bold text-[#004D25] hover:text-[#FF6E14] transition-colors tracking-wide relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6E14] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick config/settings toggle */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              id="settings-trigger-btn"
              title="Modifier les produits, prix et numéro"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#004D25] hover:text-[#FF6E14] hover:bg-orange-50 transition-colors cursor-pointer border border-orange-200 bg-white shadow-2xs active:scale-95 text-xs font-bold"
              aria-label="Modifier la boutique manuellement"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6E14]" />
              <span className="hidden sm:inline">Gérer boutique</span>
            </button>
          )}

          {/* Desktop & Mobile WhatsApp CTA */}
          <a
            id="nav-whatsapp-cta"
            href={buildGeneralWhatsAppUrl('general', customPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#009E60] hover:bg-[#008552] text-white font-black text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-white/20"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
            <span className="font-bold">Commander</span>
          </a>

          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="md:hidden p-2 rounded-xl text-[#004D25] hover:bg-orange-50 transition-colors cursor-pointer border border-orange-100"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF6E14]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-white border-t border-orange-100 px-4 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="pb-2 mb-2 border-b border-orange-100 text-xs font-bold text-[#FF6E14] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#009E60]" />
            <span>🇨🇮 Livraison 24h express partout à Abidjan</span>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-[#004D25] hover:text-[#FF6E14] hover:bg-orange-50/80 px-3 py-2 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}

            {onOpenSettings && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left text-sm font-bold text-[#FF6E14] bg-orange-50/80 hover:bg-orange-100 px-3 py-2 rounded-xl transition-all flex items-center gap-2 mt-1"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#FF6E14]" />
                <span>⚙️ Gérer produits, prix & WhatsApp</span>
              </button>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-orange-100">
            <a
              href={buildGeneralWhatsAppUrl('general', customPhone)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#009E60] text-white font-black text-sm py-2.5 rounded-xl shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Commander sur WhatsApp (24h/24)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
