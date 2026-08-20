import React from 'react';
import { MessageCircle, ArrowUp, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface FinalCTAProps {
  customPhone?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ customPhone }) => {
  return (
    <section id="final-cta" className="py-20 sm:py-28 bg-gradient-to-tr from-[#FF6E14] via-[#E65D07] to-[#009E60] text-white relative overflow-hidden">
      {/* Background luxury lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-white text-xs font-black uppercase tracking-widest mb-6 shadow-sm backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>🇨🇮 ÉLÉGANCE • CONFORT • UV400 • ABIDJAN</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Votre prochaine paire <br />
          vous attend. <span className="inline-block">🕶</span>
        </h2>

        <p className="text-white/95 text-sm sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
          Découvrez nos modèles et commandez votre coup de cœur en quelques secondes sur WhatsApp. Livraison rapide et soignée directement à Abidjan.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <a
            href="#collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-orange-50 text-[#FF6E14] font-black text-sm tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
          >
            <span>Voir la collection</span>
          </a>

          <a
            id="final-cta-whatsapp-btn"
            href={buildGeneralWhatsAppUrl('general', customPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#009E60] hover:bg-[#008552] text-white font-black text-sm tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Commander sur WhatsApp</span>
          </a>
        </div>

        {/* Reassurance pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white font-bold">
          <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
            <Truck className="w-4 h-4 text-white" />
            <span>Livraison Abidjan 24h-48h</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Paiement Wave / Cash / OM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
            <span className="text-white">★</span>
            <span>Boîtier luxe & lingette offerts</span>
          </div>
        </div>
      </div>
    </section>
  );
};
