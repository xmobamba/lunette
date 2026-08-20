import React from 'react';
import { MessageCircle, ArrowUp, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface FinalCTAProps {
  customPhone?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ customPhone }) => {
  return (
    <section id="final-cta" className="py-20 sm:py-28 bg-gradient-to-tr from-[#1B3527] via-[#244533] to-[#162D21] text-white relative overflow-hidden">
      {/* Background luxury lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C85A17]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FAF8F5] text-xs font-bold uppercase tracking-widest mb-6 shadow-2xs backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>🇨🇮 ÉLÉGANCE • CONFORT • UV400 • ABIDJAN</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15] mb-6">
          Votre prochaine paire <br />
          vous attend. <span className="inline-block">🕶</span>
        </h2>

        <p className="text-white/85 text-sm sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Découvrez nos modèles et commandez votre coup de cœur en quelques secondes sur WhatsApp. Livraison rapide et soignée directement à Abidjan.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <a
            href="#collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FAF8F5] hover:bg-white text-[#18261F] font-bold text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            <span>Voir la collection</span>
          </a>

          <a
            id="final-cta-whatsapp-btn"
            href={buildGeneralWhatsAppUrl('general', customPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Commander sur WhatsApp</span>
          </a>
        </div>

        {/* Reassurance pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/90 font-medium">
          <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
            <Truck className="w-4 h-4 text-[#C85A17]" />
            <span>Livraison Abidjan 24h-48h</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#C85A17]" />
            <span>Paiement Wave / Cash / OM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
            <span className="text-[#D97706]">★</span>
            <span>Boîtier luxe & lingette offerts</span>
          </div>
        </div>
      </div>
    </section>
  );
};
