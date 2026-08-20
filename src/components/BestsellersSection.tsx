import React from 'react';
import { Product } from '../types';
import { MessageCircle, ArrowRight, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { formatFCFA, buildProductWhatsAppUrl } from '../utils/whatsapp';

interface BestsellersSectionProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
  customPhone?: string;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  products,
  onOpenQuickView,
  customPhone,
}) => {
  const bestsellers = products.filter((p) => p.bestseller || p.featured).slice(0, 3);

  return (
    <section id="bestsellers" className="py-16 sm:py-24 bg-gradient-to-br from-[#1B3527] via-[#244533] to-[#162D21] text-[#FAF8F5] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C85A17]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FAF8F5] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>🇨🇮 Coups de cœur de la saison</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              🔥 Nos best-sellers à Abidjan
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2 max-w-xl font-normal">
              Les modèles que nos clientes adorent et recommandent. Des créations au summum du style et de l'élégance.
            </p>
          </div>

          <a
            href="#collection"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#18261F] bg-[#FAF8F5] hover:bg-white px-4 py-2.5 rounded-full shadow-xs transition-all group"
          >
            <span>Voir toute la collection</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3 Featured Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {bestsellers.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Photo Stage */}
              <div
                className="relative aspect-4/3 w-full overflow-hidden cursor-pointer bg-[#FAF8F5]"
                onClick={() => onOpenQuickView(item)}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-[#C85A17] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xs border border-white/30">
                  N° {index + 1} Best-Seller
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#FAF8F5]/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-[#18261F] shadow-xs border border-[#E8E1D7]">
                  <span className="text-[#D97706] font-bold">★</span>
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-[#4A5850] text-[10px] font-medium">({item.reviewCount} avis)</span>
                </div>
              </div>

              {/* Details & Action */}
              <div className="p-6 flex flex-col flex-1 justify-between bg-white text-[#18261F]">
                <div>
                  <h3
                    onClick={() => onOpenQuickView(item)}
                    className="font-serif text-xl font-bold text-[#18261F] group-hover:text-[#C85A17] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#4A5850] mt-1 mb-4 line-clamp-2 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE4DB] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#4A5850]/70 font-bold uppercase tracking-wider">Prix</div>
                    <div className="text-lg sm:text-xl font-bold text-[#C85A17]">
                      {formatFCFA(item.price)}
                    </div>
                  </div>

                  <a
                    href={buildProductWhatsAppUrl({ product: item, customPhone })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1E6B48] hover:bg-[#185539] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 whitespace-nowrap border border-white/15"
                  >
                    <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                    <span>Commander</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
