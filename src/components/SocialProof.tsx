import React from 'react';
import { Star, ShieldCheck, Heart, MessageCircle, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/reviews';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const SocialProof: React.FC = () => {
  return (
    <section id="avis" className="py-16 sm:py-24 bg-[#F5F2EC] border-t border-[#E8E1D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#C85A17] text-xs font-bold uppercase tracking-widest mb-3 border border-[#E8D4C0] shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#C85A17] text-[#C85A17]" />
            <span>Témoignages authentiques</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#18261F] tracking-tight">
            Elles ont trouvé leur paire ❤️
          </h2>
          <p className="text-sm sm:text-base text-[#4A5850] mt-2 font-normal">
            Rejoignez plus d'un millier de clientes comblées à Abidjan et partout en Côte d'Ivoire.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-3xl border border-[#E8E1D7] hover:border-[#C85A17]/60 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#D97706] text-sm">
                    {'★'.repeat(review.rating)}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#1E6B48] bg-[#E8F1EC] px-2.5 py-0.5 rounded-full font-bold border border-[#C8DEC5]">
                    <ShieldCheck className="w-3 h-3 text-[#1E6B48]" />
                    <span>Achat vérifié</span>
                  </div>
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-[#18261F]/90 italic leading-relaxed mb-4 font-normal">
                  « {review.comment} »
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE4DB] flex items-center gap-3">
                {review.avatar && (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#C85A17]/50"
                  />
                )}
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#18261F]">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-[#4A5850] font-normal">
                    {review.location}
                  </p>
                  {review.productBought && (
                    <p className="text-[10px] text-[#C85A17] font-bold mt-0.5">
                      Modèle : {review.productBought}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#1B3527] text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0 border border-white/20">
              <MessageCircle className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                Une question avant de commander ?
              </h4>
              <p className="text-xs text-white/80 font-normal">
                Notre équipe vous répond en direct sur WhatsApp pour vous guider.
              </p>
            </div>
          </div>
          <a
            href={buildGeneralWhatsAppUrl('help')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-xs border border-white/15"
          >
            <span>Poser une question</span>
          </a>
        </div>
      </div>
    </section>
  );
};
