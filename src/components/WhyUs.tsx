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
    <section id="pourquoi-nous" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FF6E14] block mb-2">
            🇨🇮 L’ENGAGEMENT AURA ABIDJAN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#004D25] tracking-tight">
            Votre style, notre priorité.
          </h2>
          <p className="text-sm sm:text-base text-[#004D25]/80 mt-3 font-medium">
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
                className="bg-orange-50/50 hover:bg-orange-50 p-6 sm:p-7 rounded-3xl border-2 border-orange-100/80 hover:border-[#FF6E14] transition-all duration-300 flex flex-col items-start group shadow-xs hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-orange-200 flex items-center justify-center text-[#FF6E14] shadow-sm mb-5 group-hover:scale-110 group-hover:bg-[#009E60] group-hover:text-white group-hover:border-[#009E60] transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-black text-[#004D25] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#004D25]/75 leading-relaxed font-medium">
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
