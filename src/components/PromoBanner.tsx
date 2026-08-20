import React from 'react';
import { MessageCircle, Sparkles, Gift, Clock, Truck } from 'lucide-react';
import { StoreConfig } from '../types';
import { STORE_CONFIG } from '../config/store';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface PromoBannerProps {
  storeConfig?: StoreConfig;
  customPhone?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ storeConfig = STORE_CONFIG, customPhone }) => {
  if (!storeConfig.isPromoActive) return null;

  return (
    <section id="promo" className="py-10 bg-orange-50/70 border-y-2 border-orange-200 relative overflow-hidden">
      {/* Decorative subtle background shapes */}
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-orange-200/50 rounded-full blur-2xl"></div>
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-green-200/50 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-gradient-to-r from-[#FF6E14] via-[#E55C08] to-[#FF6E14] text-white rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-white">
          {/* Left: Offer text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#FF6E14] text-xs font-black uppercase tracking-widest mb-3 shadow-md">
              <Gift className="w-3.5 h-3.5 text-[#009E60]" />
              <span>OFFRE SPÉCIALE ABIDJAN</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {storeConfig.promoText || "2 paires achetées = livraison offerte"}
            </h3>

            <p className="text-xs sm:text-sm text-white/95 mt-2 max-w-md font-medium">
              Faites-vous plaisir ou offrez une paire à un proche. Commandez dès maintenant pour bénéficier de la livraison gratuite partout à Abidjan.
            </p>

            <span className="text-[11px] text-white/80 mt-1 font-semibold">
              {storeConfig.promoSubtext || "*Selon zone de livraison à Abidjan."}
            </span>
          </div>

          {/* Right: CTA Button */}
          <div className="shrink-0 flex flex-col items-center gap-2.5">
            <a
              id="promo-cta-whatsapp"
              href={buildGeneralWhatsAppUrl('promo', customPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-green-50 text-[#009E60] font-black text-sm sm:text-base tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
            >
              <MessageCircle className="w-5 h-5 fill-[#009E60]" />
              <span>J'en profite sur WhatsApp</span>
            </a>
            <div className="flex items-center gap-1.5 text-xs text-white font-bold">
              <Truck className="w-4 h-4 text-white" />
              <span>🇨🇮 Livraison express à domicile</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
