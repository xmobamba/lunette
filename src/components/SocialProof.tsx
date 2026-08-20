import React from 'react';
import { Star, ShieldCheck, Heart, MessageCircle, Quote, CheckCheck, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/reviews';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const SocialProof: React.FC = () => {
  return (
    <section id="avis" className="py-16 sm:py-24 bg-[#F5F2EC] border-t border-[#E8E1D7] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#E8C5A8]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#C85A17] text-xs font-bold uppercase tracking-widest mb-3 border border-[#E8D4C0] shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#C85A17] text-[#C85A17]" />
            <span>Retours Clientes & DMs WhatsApp</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#18261F] tracking-tight">
            Elles ont trouvé leur paire ❤️
          </h2>
          <p className="text-sm sm:text-base text-[#4A5850] mt-2 font-normal">
            Plus de 1 200 clientes comblées à Abidjan (Cocody, Marcory, Plateau, Riviera, Angré...). Découvrez leurs messages authentiques.
          </p>
        </div>

        {/* Testimonials Grid Formatted like Social DMs & Chat Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E1D7] hover:border-[#C85A17]/60 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with avatar & verified badge */}
                <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2.5">
                    {review.avatar && (
                      <div className="relative">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#C85A17]/30"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#18261F]">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-[#4A5850] font-medium">
                        {review.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-amber-500 text-xs">
                    {'★'.repeat(review.rating)}
                  </div>
                </div>

                {/* WhatsApp Chat Message Bubble Styling */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE4DB] mb-3 relative">
                  <p className="text-xs sm:text-sm text-[#18261F] leading-relaxed font-normal">
                    « {review.comment} »
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-[#4A5850]/70">
                    <span>Aujourd’hui</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Footer with Purchased Product Tag */}
              <div className="pt-2 flex items-center justify-between">
                {review.productBought && (
                  <span className="text-[10px] text-[#C85A17] font-bold bg-[#FAF0E6] border border-[#ECD7C2] px-2.5 py-1 rounded-full truncate max-w-[170px]">
                    🕶️ {review.productBought}
                  </span>
                )}
                <div className="flex items-center gap-1 text-[10px] text-[#1E6B48] font-bold">
                  <ShieldCheck className="w-3 h-3 text-[#1E6B48]" />
                  <span>Achat Vérifié</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live WhatsApp Direct Help Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#1B3527] text-white flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-xl border border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0 border border-white/20">
              <MessageCircle className="w-7 h-7 fill-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Conseillère en ligne sur WhatsApp</span>
              </div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                Besoin d'un conseil pour choisir votre modèle ?
              </h4>
              <p className="text-xs text-white/80 font-normal">
                Envoyez-nous une photo de votre visage ou de votre tenue, nous vous recommandons la forme idéale en direct.
              </p>
            </div>
          </div>

          <a
            href={buildGeneralWhatsAppUrl('help')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-md border border-white/20"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Discuter avec nous</span>
          </a>
        </div>
      </div>
    </section>
  );
};
