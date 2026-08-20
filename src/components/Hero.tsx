import React from 'react';
import { MessageCircle, ArrowDown, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  customPhone?: string;
}

export const Hero: React.FC<HeroProps> = ({ customPhone }) => {
  return (
    <section id="top" className="relative min-h-[85vh] lg:min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-green-50/30 text-[#004D25] flex items-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      {/* Background soft ambient luxury glow (Orange & Green) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-orange-200/30 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-green-200/25 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Copy & Conversion CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Badge */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#FF6E14] text-[11px] sm:text-xs font-black uppercase tracking-wider mb-4 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#009E60]" />
              <span>🇨🇮 Nouvelle Collection Abidjan 2026</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="font-serif text-2xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#004D25] leading-[1.15] mb-3.5 sm:mb-5"
            >
              Le style commence <br className="hidden sm:inline" />
              par le <span className="italic font-serif text-[#FF6E14] underline decoration-[#009E60]/40 decoration-wavy">regard.</span>
            </h1>

            {/* Subtitle */}
            <p
              id="hero-subtitle"
              className="text-[#004D25]/80 sm:text-lg text-sm max-w-xl leading-relaxed mb-5 sm:mb-6 font-medium"
            >
              Découvrez notre sélection exclusive de lunettes de soleil tendance pour sublimer votre allure à Abidjan. Finitions soignées, protection UV400 et commande directe sur WhatsApp.
            </p>

            {/* Reassurance Tag */}
            <div
              id="hero-reassurance-tag"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-orange-200 text-xs sm:text-sm text-[#004D25] mb-6 font-semibold shadow-xs"
            >
              <span className="text-base">🚚</span>
              <span>
                <strong className="text-[#FF6E14]">Livraison express 24h à Abidjan</strong> (Cocody, Marcory, Plateau, Riviera...)
              </span>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8">
              {/* Primary Collection Button */}
              <a
                id="hero-cta-collection"
                href="#collection"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FF6E14] hover:bg-[#E05300] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-orange-500/30 active:scale-[0.98] transition-all"
              >
                <span>Découvrir la collection</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              {/* Secondary WhatsApp CTA */}
              <a
                id="hero-cta-whatsapp"
                href={buildGeneralWhatsAppUrl('general', customPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#009E60] hover:bg-[#008552] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-green-600/30 active:scale-[0.98] transition-all border border-white"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>

            {/* 3 Reassurance Checkmarks */}
            <div id="hero-checkmarks" className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 w-full pt-3 sm:pt-4 border-t border-orange-100 text-xs sm:text-sm text-[#004D25] font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#009E60] shrink-0" />
                <span>Commande express WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6E14] shrink-0" />
                <span>Paiement Wave / OM / Cash</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#009E60] shrink-0" />
                <span>Livraison 24h Abidjan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-fashion Lifestyle Image */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#FF6E14]/20 via-white to-[#009E60]/20 blur-sm"></div>

              {/* Image Card */}
              <div className="relative rounded-2xl overflow-hidden border border-orange-200 shadow-xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80"
                  alt="Lunettes de soleil tendance AURA Eyewear Abidjan"
                  referrerPolicy="no-referrer"
                  className="w-full h-[320px] sm:h-[450px] object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />

                {/* Floating pill badge top right */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-[#009E60] px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-[#009E60] font-black shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#009E60]" />
                  <span>100% Protection UV400</span>
                </div>

                {/* Floating bottom review preview */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-orange-200 p-2.5 sm:p-3 rounded-xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <img className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Cliente" referrerPolicy="no-referrer" />
                      <img className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Cliente" referrerPolicy="no-referrer" />
                      <img className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80" alt="Cliente" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="flex text-[#FF6E14] text-[10px] sm:text-xs">
                        {'★'.repeat(5)}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#004D25] font-bold">
                        +1 200 clientes à Abidjan
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase bg-[#FF6E14] text-white px-2 py-0.5 rounded-full shadow-xs">
                    Qualité Top
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
