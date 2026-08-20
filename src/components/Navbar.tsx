import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Sparkles, Flame, Tag } from 'lucide-react';
import { StoreConfig, PromoBannerItem } from '../types';
import { STORE_CONFIG } from '../config/store';
import { DEFAULT_PROMOS } from '../data/promos';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  favoritesCount?: number;
  storeConfig?: StoreConfig;
  customPhone?: string;
  promos?: PromoBannerItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount = 0,
  storeConfig = STORE_CONFIG,
  customPhone,
  promos = DEFAULT_PROMOS,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topPromoIndex, setTopPromoIndex] = useState(0);

  const activeTopPromos = promos.filter((p) => p.isActive);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate top announcement every 4.5 seconds
  useEffect(() => {
    if (activeTopPromos.length <= 1) return;
    const interval = setInterval(() => {
      setTopPromoIndex((prev) => (prev + 1) % activeTopPromos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTopPromos.length]);

  const currentTopPromo = activeTopPromos[topPromoIndex] || activeTopPromos[0];

  const navLinks = [
    { label: 'Accueil', href: '#top' },
    { label: 'Offres & Promos', href: '#promo', isPromo: true },
    { label: 'Collection', href: '#collection' },
    { label: 'Best-sellers', href: '#bestsellers' },
    { label: 'Pourquoi nous ?', href: '#pourquoi-nous' },
    { label: 'Avis clients', href: '#avis' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md transition-all duration-200 border-b ${
        isScrolled ? 'border-[#E8E1D7] shadow-xs py-2' : 'border-[#EFE9E0] py-2.5'
      }`}
    >
      {/* Delicate Côte d'Ivoire Tricolor Stripe - Subdued luxury */}
      <div className="absolute top-0 left-0 right-0 h-0.5 flex">
        <div className="flex-1 bg-[#C85A17]/80"></div>
        <div className="flex-1 bg-white/70"></div>
        <div className="flex-1 bg-[#1E6B48]/80"></div>
      </div>

      {/* Top desktop micro-announcement banner */}
      <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto px-6 mb-1 text-[11px] text-[#4A5850] border-b border-[#EAE4DB]/70 pb-1.5 pt-0.5">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1E6B48] animate-pulse"></span>
          <span>Boutique en ligne officielle • Abidjan, Côte d'Ivoire</span>
        </div>
        <div className="flex items-center gap-4 font-semibold">
          <a 
            href="#promo" 
            className="text-[#C85A17] hover:underline flex items-center gap-1.5 font-bold transition-all duration-300"
          >
            <span className="bg-[#FAF0E6] text-[#C85A17] border border-[#ECD7C2] text-[9px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 shadow-2xs">
              <Flame className="w-2.5 h-2.5 fill-[#C85A17]" />
              <span>{currentTopPromo?.discountTag || 'PROMO'}</span>
            </span>
            <span className="truncate max-w-[340px] font-bold text-[#18261F] hover:text-[#C85A17]">
              {currentTopPromo?.title || "Offres spéciales Abidjan en cours"}
            </span>
            <span className="text-[10px] text-[#C85A17] font-extrabold">→ Voir l'offre</span>
          </a>
          <span className="text-[#D8CFBF]">•</span>
          <span className="text-[#1E6B48] font-medium">Paiement sécurisé à la livraison (Cash / Wave / OM)</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#top" id="brand-logo" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C85A17]/60 flex items-center justify-center bg-[#FAF0E6] group-hover:scale-105 transition-transform shadow-2xs shrink-0">
            <span className="text-[#C85A17] font-serif font-black text-sm sm:text-base leading-none">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-lg font-black tracking-wide text-[#18261F] leading-tight group-hover:text-[#C85A17] transition-colors">
              {storeConfig.storeName}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-[#1E6B48] leading-none">
              Abidjan • Eyewear
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-xs sm:text-sm font-semibold transition-colors tracking-wide relative group py-1 flex items-center gap-1 ${
                (link as any).isPromo
                  ? 'text-[#C85A17] hover:text-[#A84A12] font-bold'
                  : 'text-[#18261F] hover:text-[#C85A17]'
              }`}
            >
              {(link as any).isPromo && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17] inline-block animate-pulse"></span>
              )}
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C85A17] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Desktop & Mobile WhatsApp CTA */}
          <a
            id="nav-whatsapp-cta"
            href={buildGeneralWhatsAppUrl('general', customPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#1E6B48] hover:bg-[#185539] text-white font-bold text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95 border border-white/15"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
            <span>Commander</span>
          </a>

          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="md:hidden p-2 rounded-xl text-[#18261F] hover:bg-[#F3EFE9] transition-colors cursor-pointer border border-[#E8E1D7]"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C85A17]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#FAF8F5] border-t border-[#E8E1D7] px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          <div className="pb-2 mb-2 border-b border-[#E8E1D7] text-xs font-bold text-[#C85A17] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1E6B48]" />
            <span>🇨🇮 Livraison 24h express partout à Abidjan</span>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold px-3 py-2 rounded-xl transition-all ${
                  (link as any).isPromo
                    ? 'text-[#C85A17] bg-[#FAF0E6] font-black flex items-center justify-between border border-[#ECD7C2]'
                    : 'text-[#18261F] hover:text-[#C85A17] hover:bg-[#F3EFE9]'
                }`}
              >
                <span>{link.label}</span>
                {(link as any).isPromo && (
                  <span className="text-[10px] bg-[#C85A17] text-white px-2 py-0.5 rounded-full uppercase font-bold">
                    Offre
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#E8E1D7]">
            <a
              href={buildGeneralWhatsAppUrl('general', customPhone)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#1E6B48] text-white font-bold text-sm py-2.5 rounded-xl shadow-xs"
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
