import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Gift, 
  Truck, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  ShieldCheck, 
  Tag, 
  ArrowRight,
  Zap,
  ShoppingBag
} from 'lucide-react';
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
  // Filter active banners
  const activePromos = promos.filter(
    (p) => p.isActive && (p.position === 'main' || p.position === 'both' || !p.position)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 45 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Live countdown effect (simulated dynamic countdown for urgency)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate with smooth progress bar
  useEffect(() => {
    if (activePromos.length <= 1 || isPaused) return;
    
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePromos.length, isPaused, currentIndex]);

  if (activePromos.length === 0) {
    if (!storeConfig.isPromoActive) return null;
    return null;
  }

  const currentPromo = activePromos[currentIndex] || activePromos[0];
  const theme = THEME_STYLES[currentPromo.theme] || THEME_STYLES.orange;

  // Generate dynamic promo code for the offer
  const promoCode = currentPromo.id.includes('duo') ? 'AURA-DUO26' : currentPromo.id.includes('pack') ? 'PRESTIGE-10K' : 'VIP-ETUI';

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromos.length) % activePromos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromos.length);
  };

  return (
    <section 
      id="promo" 
      className="py-10 sm:py-14 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] border-y border-[#E8E1D7] relative overflow-hidden"
    >
      {/* Dynamic Ambient Luxury Lighting Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E8C5A8]/30 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C8DEC5]/30 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Next-Gen Section Eyebrow & Navigation Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#E8D4C0] text-[#B85318] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-[#C85A17] fill-[#C85A17]" />
              <span>Offres Spéciales • Abidjan</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18261F] tracking-tight">
              Bannières & Privilèges Exclusifs
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5850] mt-1 max-w-xl font-normal">
              Profitez de nos offres limitées avec livraison express 24h et paiement sécurisé à la réception partout à Abidjan.
            </p>
          </div>

          {/* Interactive Promo Tabs (Pills) for direct switching */}
          {activePromos.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {activePromos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                    idx === currentIndex
                      ? 'bg-[#18261F] text-[#FAF8F5] border-[#18261F] shadow-sm scale-102'
                      : 'bg-white text-[#4A5850] hover:bg-[#FAF8F5] border-[#E8E1D7]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-[#C85A17] animate-pulse' : 'bg-stone-300'}`}></span>
                  <span>{p.badge.replace(/^[^a-zA-Z0-9]+/, '') || `Offre ${idx + 1}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Next-Gen Heroic Promo Banner Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`bg-gradient-to-r ${theme.bgGradient} text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative border ${theme.border} transition-all duration-700 overflow-hidden group`}
        >
          {/* Glassmorphism subtle reflections and patterned highlights */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/30 pointer-events-none"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top urgency strip inside the banner */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-white/15">
            {/* Badges & Live Urgency */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.badgeBg} text-xs font-black uppercase tracking-wider shadow-sm`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentPromo.badge || 'OFFRE LIMITÉE'}</span>
              </div>

              {currentPromo.discountTag && (
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${theme.tagBg} text-xs font-black uppercase tracking-wider shadow-xs border border-white/20`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>{currentPromo.discountTag}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>🇨🇮 En stock à Abidjan</span>
              </div>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-white/80 font-medium">Fin dans :</span>
              <div className="flex items-center gap-1 font-mono font-bold text-amber-200">
                <span className="bg-black/50 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-black/50 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-black/50 px-1.5 py-0.5 rounded text-white">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          {/* Main Card Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] mb-3.5 drop-shadow-xs">
                {currentPromo.title}
              </h3>

              <p className="text-xs sm:text-base text-white/90 font-normal leading-relaxed mb-4 max-w-xl">
                {currentPromo.description}
              </p>

              {/* Subtext and Delivery Info */}
              {currentPromo.subtext && (
                <div className="text-[11px] sm:text-xs text-white/75 font-medium bg-black/20 backdrop-blur-xs px-3.5 py-1.5 rounded-xl mb-5 border border-white/10">
                  {currentPromo.subtext}
                </div>
              )}

              {/* Promo Code Copy Box */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2">
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-xs text-white/80 font-medium">Code promo :</span>
                  <span className="font-mono font-bold text-white text-xs sm:text-sm tracking-wider">{promoCode}</span>
                  <button
                    onClick={() => handleCopyCode(promoCode)}
                    className="ml-2 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    title="Copier le code promo"
                  >
                    {copiedCode === promoCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span className="text-emerald-300">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-white/70 italic hidden sm:inline">
                  (À mentionner lors de votre commande WhatsApp)
                </span>
              </div>

              {/* Conversion Buttons & Delivery Assurance */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  id={`promo-cta-${currentPromo.id}`}
                  href={buildCustomPromoWhatsAppUrl(currentPromo, customPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full ${theme.btnBg} font-black text-sm sm:text-base tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white`}
                >
                  <MessageCircle className={`w-5 h-5 ${theme.btnIcon}`} />
                  <span>{currentPromo.ctaText || "Profiter de l'offre sur WhatsApp"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#collection"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition-all border border-white/25 backdrop-blur-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Voir les modèles</span>
                </a>
              </div>
            </div>

            {/* Right Product Spotlight Visual */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl bg-black/30 backdrop-blur-xs group/img">
                {currentPromo.image ? (
                  <img
                    src={currentPromo.image}
                    alt={currentPromo.title}
                    className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-black/60 to-black/20 text-white font-serif text-lg">
                    L'AURA Eyewear
                  </div>
                )}

                {/* Visual Glass Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>

                {/* Floating Micro-Pill Top Right */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UV400 Certifié</span>
                </div>

                {/* Bottom Card Caption */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md text-[#18261F] p-3 rounded-2xl shadow-lg border border-white flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#C85A17] font-extrabold">
                      L'AURA EYEWEAR ABIDJAN
                    </div>
                    <div className="text-xs font-bold text-[#18261F]">
                      Finitions Métal & Acétate Luxe
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#18261F] text-white">
                    ⭐ 4.9/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls & Auto-rotate Progress Line */}
          {activePromos.length > 1 && (
            <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between">
              {/* Dots & Active Indicator */}
              <div className="flex items-center gap-2">
                {activePromos.map((promo, idx) => (
                  <button
                    key={promo.id}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Afficher la promo ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-10 bg-white shadow-md' : 'w-2.5 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                ))}
                <span className="text-[11px] text-white/80 font-bold ml-2 hidden sm:inline">
                  Offre {currentIndex + 1} sur {activePromos.length}
                </span>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Promotion précédente"
                  className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Promotion suivante"
                  className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Reassurance Pills beneath the banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/80 border border-[#E8E1D7] p-3 rounded-2xl flex items-center gap-3 shadow-2xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#C85A17] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#18261F]">Livraison 24h Abidjan</div>
              <div className="text-[11px] text-[#4A5850]">Directement à votre porte</div>
            </div>
          </div>

          <div className="bg-white/80 border border-[#E8E1D7] p-3 rounded-2xl flex items-center gap-3 shadow-2xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2ED] text-[#1E6B48] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#18261F]">Verres UV400 Filtre</div>
              <div className="text-[11px] text-[#4A5850]">Protection solaire 100%</div>
            </div>
          </div>

          <div className="bg-white/80 border border-[#E8E1D7] p-3 rounded-2xl flex items-center gap-3 shadow-2xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#C85A17] flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#18261F]">Étui Rigide Offert</div>
              <div className="text-[11px] text-[#4A5850]">+ Lingette nettoyante</div>
            </div>
          </div>

          <div className="bg-white/80 border border-[#E8E1D7] p-3 rounded-2xl flex items-center gap-3 shadow-2xs backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2ED] text-[#1E6B48] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#18261F]">Paiement à la Livraison</div>
              <div className="text-[11px] text-[#4A5850]">Cash, Wave ou OM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
