import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Instagram, 
  Heart, 
  Flame, 
  ShoppingBag,
  Eye
} from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  customPhone?: string;
}

export const Hero: React.FC<HeroProps> = ({ customPhone }) => {
  const [liveViewers, setLiveViewers] = useState(19);

  // Subtle live viewer simulation for social buzz
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 14 && next <= 32 ? next : 21;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="relative min-h-[82vh] lg:min-h-[90vh] bg-gradient-to-b from-[#F7F3EC] via-[#FAF8F5] to-[#F3EFEA] text-[#18261F] flex items-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Soft Ambient Luxury Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-[#E8C5A8]/25 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#C8DEC5]/25 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Social Commerce Copy & Conversion CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Social Trust Pills Header */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5 sm:mb-4">
              <div
                id="hero-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#E8D4C0] text-[#B85318] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E6B48]" />
                <span>🇨🇮 Collection 2026 • Abidjan</span>
              </div>

              {/* Live social browsing urgency */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8E1D7] text-[#18261F] text-[11px] sm:text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>🔥 {liveViewers} personnes regardent en ce moment</span>
              </div>
            </div>

            {/* Main Headline with High-Fashion Editorial Typography */}
            <h1
              id="hero-title"
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#18261F] leading-[1.14] mb-3.5 sm:mb-5"
            >
              Le style commence <br className="hidden sm:inline" />
              par le <span className="italic font-serif text-[#C85A17] underline decoration-[#1E6B48]/30 decoration-wavy">regard.</span>
            </h1>

            {/* Subtitle with Social Proof Focus */}
            <p
              id="hero-subtitle"
              className="text-[#4A5850] sm:text-lg text-sm max-w-xl leading-relaxed mb-5 sm:mb-6 font-normal"
            >
              La marque de lunettes de soleil la plus plébiscitée à Abidjan sur Instagram & TikTok. Finitions haute couture, verres solaires UV400 et commande directe sur WhatsApp en 1 clic.
            </p>

            {/* Reassurance Tag for Abidjan */}
            <div
              id="hero-reassurance-tag"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-[#E8E1D7] text-xs sm:text-sm text-[#18261F] mb-6 font-medium shadow-2xs backdrop-blur-xs"
            >
              <span className="text-base">🚚</span>
              <span>
                <strong className="text-[#C85A17] font-bold">Livraison express 24h partout à Abidjan</strong> (Cocody, Marcory, Plateau, Riviera, Angré...)
              </span>
            </div>

            {/* Dual CTAs (Social-First Buttons) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8">
              {/* Primary Collection Button */}
              <a
                id="hero-cta-collection"
                href="#collection"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
              >
                <span>Shopper la collection</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              {/* Secondary WhatsApp CTA */}
              <a
                id="hero-cta-whatsapp"
                href={buildGeneralWhatsAppUrl('general', customPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1E6B48] hover:bg-[#185539] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all border border-white/15"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-[#EAE4DB] w-full text-xs text-[#4A5850]">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500 text-xs">
                  {'★'.repeat(5)}
                </div>
                <span className="font-bold text-[#18261F]">4.9/5</span>
                <span className="text-[#4A5850]">(+1 200 avis vérifiés)</span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-[#18261F]">
                <Instagram className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>@lauraeyewear.ci</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#1E6B48] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-fashion Lifestyle Image with Interactive Lookbook Tag */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#E8C5A8]/40 via-white/50 to-[#C8DEC5]/40 blur-md"></div>

              {/* Image Card */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E8E1D7] shadow-xl bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80"
                  alt="Lunettes de soleil tendance AURA Eyewear Abidjan"
                  referrerPolicy="no-referrer"
                  className="w-full h-[340px] sm:h-[480px] object-cover object-center transform group-hover:scale-104 transition-transform duration-700"
                  loading="eager"
                />

                {/* Floating UV400 Badge Top Right */}
                <div className="absolute top-3 right-3 bg-[#FAF8F5]/95 backdrop-blur-md border border-[#C8DEC5] px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-[#1E6B48] font-bold shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E6B48]" />
                  <span>100% Protection UV400</span>
                </div>

                {/* Social Lookbook Hotspot Tag over sunglasses */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <a
                    href="#collection"
                    className="inline-flex items-center gap-2 bg-[#18261F]/90 hover:bg-[#18261F] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border border-white/30 backdrop-blur-md transition-all hover:scale-105"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-ping"></span>
                    <span>Modèle Luna Black • 35 000 F</span>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#F4A261]" />
                  </a>
                </div>

                {/* Bottom Social Proof User Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#18261F]/90 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl border border-white/15 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1.5">
                      <img
                        className="w-7 h-7 rounded-full border border-white/60 object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="Avis cliente"
                      />
                      <img
                        className="w-7 h-7 rounded-full border border-white/60 object-cover"
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                        alt="Avis cliente"
                      />
                      <img
                        className="w-7 h-7 rounded-full border border-white/60 object-cover"
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80"
                        alt="Avis cliente"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                        <span>★★★★★</span>
                        <span className="text-white text-[10px] font-semibold">(1 200+ avis)</span>
                      </div>
                      <div className="text-[10px] text-white/80 font-medium">
                        Adoré par les fashionistas d'Abidjan
                      </div>
                    </div>
                  </div>

                  <a
                    href="#avis"
                    className="text-[11px] font-bold text-[#F4A261] hover:underline whitespace-nowrap"
                  >
                    Voir avis →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
