import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  Clock, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag,
  Flame,
  Truck,
  Tag
} from 'lucide-react';
import { PromoBannerItem, StoreConfig, Product } from '../types';
import { STORE_CONFIG } from '../config/store';
import { DEFAULT_PROMOS } from '../data/promos';
import { buildCustomPromoWhatsAppUrl } from '../utils/whatsapp';

interface PromoBannerProps {
  promos?: PromoBannerItem[];
  storeConfig?: StoreConfig;
  customPhone?: string;
  products?: Product[];
}

const TICKER_ITEMS = [
  { icon: '🚚', text: 'Livraison express 24h offerte dès 2 paires à Abidjan' },
  { icon: '🎁', text: 'Écrin rigide haute couture & lingette microfibre offerts' },
  { icon: '🛡️', text: 'Protection solaire 100% UV400 certifiée' },
  { icon: '💳', text: 'Paiement à la réception : Cash, Wave & Orange Money' },
  { icon: '⭐', text: '+1 200 avis clientes vérifiés • Note 4.9/5' },
  { icon: '🇨🇮', text: 'Cocody • Marcory • Plateau • Riviera • Angré • Zone 4' },
];

export const PromoBanner: React.FC<PromoBannerProps> = ({
  promos = DEFAULT_PROMOS,
  storeConfig = STORE_CONFIG,
  customPhone,
  products = [],
}) => {
  const activePromos = promos.filter(
    (p) => p.isActive && (p.position === 'main' || p.position === 'both' || !p.position)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 28, seconds: 45 });

  // Get first product with image if available
  const productsWithImages = products.filter((p) => p.images && p.images.length > 0);
  const leftDisplayImage = productsWithImages.length > 0
    ? productsWithImages[currentIndex % productsWithImages.length].images[0]
    : null;

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle promo headlines every 6 seconds
  useEffect(() => {
    if (activePromos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activePromos.length]);

  if (activePromos.length === 0) return null;

  const currentPromo = activePromos[currentIndex] || activePromos[0];
  const promoCode = currentPromo.id.includes('duo') 
    ? 'AURA-DUO26' 
    : currentPromo.id.includes('pack') 
    ? 'PRESTIGE-10K' 
    : 'VIP-ETUI';

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  return (
    <div id="promo-header-banner" className="relative z-30 pt-[72px] sm:pt-[76px] lg:pt-[84px] bg-[#FAF8F5]">
      {/* BANNIÈRE COMPACTE SITUÉE À L'ENTÊTE */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#0D1511] via-[#14221A] to-[#0A110D] text-white border border-[#2B3E33] shadow-lg">
          
          {/* OPTIONAL LUNETTES À L'EXTRÉMITÉ GAUCHE (SI PHOTOS AJOUTÉES) */}
          {leftDisplayImage && (
            <div className="absolute inset-y-0 left-0 w-28 sm:w-48 md:w-64 lg:w-72 pointer-events-none z-0 overflow-hidden">
              <img
                src={leftDisplayImage}
                alt="Offre spéciale L'AURA Eyewear"
                className="w-full h-full object-cover object-left scale-110 opacity-75 sm:opacity-85 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0D1511]/70 to-[#0D1511] z-10" />
            </div>
          )}

          {/* Luxury subtle ambient glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C85A17]/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* RUBAN D'INFORMATIONS DÉROULANTES EN CONTINU (CONTINUOUS TICKER) */}
          <div className="relative z-20 bg-black/45 border-b border-white/10 py-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-6 text-[10px] sm:text-[11px] font-semibold text-white/90">
              {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 shrink-0">
                  <span>{item.icon}</span>
                  <span className="hover:text-[#F4A261] transition-colors">{item.text}</span>
                  <span className="text-[#C85A17] font-bold mx-1.5">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTENU COMPACT DE L'OFFRE EN COURS & ACTIONS RAPIDES */}
          <div className="relative z-10 px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3.5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Info Principale */}
              <div className={`flex items-center gap-3 text-left w-full md:w-auto ${leftDisplayImage ? 'pl-16 sm:pl-28 md:pl-36 lg:pl-44' : 'pl-2'}`}>
                <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-xl bg-[#C85A17]/25 border border-[#C85A17]/40 items-center justify-center text-[#F4A261]">
                  <Flame className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C85A17] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{currentPromo.discountTag || 'OFFRE 2026'}</span>
                    </span>
                    
                    <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-white truncate">
                      {currentPromo.title}
                    </h3>
                  </div>

                  <p className="text-[11px] sm:text-xs text-white/75 line-clamp-1 mt-0.5">
                    {currentPromo.description || currentPromo.subtext}
                  </p>
                </div>
              </div>

              {/* Bloc Droite : Code Promo, Chrono & Bouton WhatsApp en 1 Clic */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
                
                {/* Code Promo Copiable */}
                <button
                  onClick={(e) => handleCopyCode(e, promoCode)}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] sm:text-[11px] text-white font-mono font-bold transition-all cursor-pointer"
                  title="Copier le code promo"
                >
                  <span className="text-[#F4A261]">{promoCode}</span>
                  {copiedCode === promoCode ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/70" />
                  )}
                </button>

                {/* Micro Timer */}
                <div className="hidden lg:flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10 text-[10px] font-mono text-white/80">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m</span>
                </div>

                {/* Bouton WhatsApp Immédiat */}
                <a
                  href={buildCustomPromoWhatsAppUrl(currentPromo, customPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#1E6B48] hover:bg-[#165236] text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all border border-white/20 whitespace-nowrap cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Commander</span>
                </a>

                {/* Mini Navigation Slides Controls */}
                {activePromos.length > 1 && (
                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + activePromos.length) % activePromos.length)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                      aria-label="Promo précédente"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % activePromos.length)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                      aria-label="Promo suivante"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
