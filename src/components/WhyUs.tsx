import React from 'react';
import { Glasses, Sparkles, Truck, MessageCircle, ShieldCheck } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const features = [
    {
      icon: Glasses,
      title: '🕶 Modèles tendance',
      description: 'Une sélection régulièrement renouvelée pour refléter les styles les plus recherchés du moment à Abidjan.',
    },
    {
      icon: Sparkles,
      title: '✨ Qualité sélectionnée',
      description: 'Des lunettes choisies avec attention : verres haute protection UV400, montures robustes et finitions soignées.',
    },
    {
      icon: Truck,
      title: '🚚 Livraison express',
      description: 'Livraison rapide partout à Abidjan (Cocody, Marcory, Plateau, Riviera, Yopougon...) et dans toute la Côte d’Ivoire.',
    },
    {
      icon: MessageCircle,
      title: '💬 Commande WhatsApp',
      description: 'Commandez directement via WhatsApp en quelques clics avec confirmation instantanée par notre équipe.',
    },
  ];

  return (
    <section id="pourquoi-nous" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C85A17] block mb-2">
            🇨🇮 L’ENGAGEMENT AURA ABIDJAN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#18261F] tracking-tight">
            Votre style, notre priorité.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5850] mt-3 font-normal">
            Nous combinons des lunettes de soleil d’exception et une expérience d’achat sur mesure pensée pour vous faciliter la vie.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white hover:bg-[#F8F5F0] p-6 sm:p-7 rounded-3xl border border-[#E8E1D7] hover:border-[#C85A17]/60 transition-all duration-300 flex flex-col items-start group shadow-2xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] shadow-2xs mb-5 group-hover:scale-105 group-hover:bg-[#1E6B48] group-hover:text-white group-hover:border-[#1E6B48] transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#18261F] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5850] leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
