import React, { useState, useEffect } from 'react';
import { MessageCircle, Gift, Truck, Tag, ChevronLeft, ChevronRight, Sparkles, Clock, Flame } from 'lucide-react';
import { PromoBannerItem, StoreConfig } from '../types';
import { STORE_CONFIG } from '../config/store';
import { THEME_STYLES, DEFAULT_PROMOS } from '../data/promos';
import { buildCustomPromoWhatsAppUrl } from '../utils/whatsapp';

interface PromoBannerProps {
  promos?: PromoBannerItem[];
  storeConfig?: StoreConfig;
  customPhone?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  promos = DEFAULT_PROMOS,
  storeConfig = STORE_CONFIG,
  customPhone,
}) => {
  // Filter active banners meant for main section or both
  const activePromos = promos.filter(
    (p) => p.isActive && (p.position === 'main' || p.position === 'both' || !p.position)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate if multiple active promos
  useEffect(() => {
    if (activePromos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activePromos.length]);

  // If no promo is active
  if (activePromos.length === 0) {
    if (!storeConfig.isPromoActive) return null;
    // Fallback single default
    return null;
  }

  const currentPromo = activePromos[currentIndex] || activePromos[0];
  const theme = THEME_STYLES[currentPromo.theme] || THEME_STYLES.orange;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromos.length) % activePromos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromos.length);
  };

  return (
    <section id="promo" className="py-10 bg-orange-50/60 border-y-2 border-orange-200/80 relative overflow-hidden">
      {/* Decorative subtle background glows */}
      <div className="absolute -left-16 -top-16 w-56 h-56 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Banner Carousel Card */}
        <div
          className={`bg-gradient-to-r ${theme.bgGradient} text-white rounded-3xl p-6 sm:p-9 shadow-2xl relative border-2 ${theme.border} transition-all duration-500 overflow-hidden`}
        >
          {/* Subtle patterned overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left Column: Offer Content */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${theme.badgeBg} text-xs font-black uppercase tracking-widest shadow-md`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{currentPromo.badge || 'OFFRE SPÉCIALE'}</span>
                </div>

                {currentPromo.discountTag && (
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${theme.tagBg} text-xs font-black uppercase tracking-wider shadow-sm`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{currentPromo.discountTag}</span>
                  </div>
                )}

                {currentPromo.countdownText && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-xs text-white text-[11px] font-semibold">
                    <Clock className="w-3 h-3 text-white/90" />
                    <span>{currentPromo.countdownText}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight max-w-2xl">
                {currentPromo.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/95 mt-2.5 max-w-xl font-medium leading-relaxed">
                {currentPromo.description}
              </p>

              {/* Subtext */}
              {currentPromo.subtext && (
                <span className="text-[11px] text-white/80 mt-1.5 font-semibold">
                  {currentPromo.subtext}
                </span>
              )}
            </div>

            {/* Middle (Optional Promo Image Preview) */}
            {currentPromo.image && (
              <div className="hidden md:flex shrink-0 items-center justify-center">
                <div className="relative w-36 h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl bg-black/20 group">
                  <img
                    src={currentPromo.image}
                    alt={currentPromo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-white uppercase tracking-wider bg-black/60 backdrop-blur-xs py-0.5 rounded">
                    L'Aura Abidjan
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: High-conversion Action */}
            <div className="shrink-0 flex flex-col items-center gap-3 w-full sm:w-auto">
              <a
                id={`promo-cta-${currentPromo.id}`}
                href={buildCustomPromoWhatsAppUrl(currentPromo, customPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full ${theme.btnBg} font-black text-sm sm:text-base tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white`}
              >
                <MessageCircle className={`w-5 h-5 ${theme.btnIcon}`} />
                <span>{currentPromo.ctaText || "J'en profite sur WhatsApp"}</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-white font-bold">
                <Truck className="w-4 h-4 text-white" />
                <span>🇨🇮 Livraison express à domicile (Abidjan)</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls (If multiple active promotions) */}
          {activePromos.length > 1 && (
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {activePromos.map((promo, idx) => (
                  <button
                    key={promo.id}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Afficher la promo ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
                <span className="text-[11px] text-white/80 font-bold ml-2">
                  Promo {currentIndex + 1} / {activePromos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Promotion précédente"
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center border border-white/30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Promotion suivante"
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center border border-white/30 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
