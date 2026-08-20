import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Home, Glasses, Flame, Star, Heart, SlidersHorizontal } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { STORE_CONFIG } from '../config/store';

interface FloatingWhatsAppProps {
  favoriteCount?: number;
  customPhone?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ favoriteCount = 0, customPhone }) => {
  const [showBubble, setShowBubble] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'collection' | 'bestsellers' | 'reviews'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 400) {
        setActiveTab('home');
      } else if (scrollY < 1200) {
        setActiveTab('collection');
      } else if (scrollY < 2200) {
        setActiveTab('bestsellers');
      } else {
        setActiveTab('reviews');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, tab: 'home' | 'collection' | 'bestsellers' | 'reviews') => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Desktop Floating WhatsApp Button & Proactive Bubble */}
      <div id="desktop-whatsapp-float" className="hidden sm:flex fixed bottom-8 right-8 z-40 flex-col items-end">
        {/* Proactive Help Bubble */}
        {showBubble && (
          <div
            id="desktop-whatsapp-bubble"
            className="mb-3 max-w-[270px] bg-white border border-[#E8E1D7] p-3.5 rounded-2xl shadow-xl text-xs text-[#18261F] animate-in fade-in slide-in-from-bottom-2 duration-300 relative"
          >
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-[#C85A17] text-white rounded-full flex items-center justify-center text-xs hover:bg-[#A84A12] shadow-xs cursor-pointer border border-white"
              aria-label="Fermer le message"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C85A17] mb-1 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1E6B48] animate-ping"></span>
              <span>Besoin d'un conseil ?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#4A5850] font-normal">
              Bonjour ! Posez vos questions ou passez commande directement sur WhatsApp 🇨🇮
            </p>
          </div>
        )}

        {/* Desktop Round Floating Button */}
        <a
          id="desktop-whatsapp-btn"
          href={buildGeneralWhatsAppUrl('general', customPhone)}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group flex items-center gap-2.5 bg-[#1E6B48] hover:bg-[#185539] text-white font-bold px-5 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/20"
          aria-label="Commander sur WhatsApp"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C85A17] rounded-full border-2 border-white"></span>
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="text-sm font-bold tracking-wide">
            Commander WhatsApp
          </span>
        </a>
      </div>

      {/* 2. Mobile Native-App-Like Bottom Navigation Bar (Thumb Friendly) */}
      <nav
        id="mobile-bottom-nav"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-[#E8E1D7] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around safe-bottom"
        aria-label="Navigation mobile"
      >
        {/* Tab 1: Accueil */}
        <button
          onClick={() => scrollToSection('top', 'home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-[#C85A17] font-bold' : 'text-[#4A5850] font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#C85A17] stroke-[2.2]' : 'text-[#4A5850]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Accueil</span>
        </button>

        {/* Tab 2: Lunettes / Collection */}
        <button
          onClick={() => scrollToSection('collection', 'collection')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'collection' ? 'text-[#C85A17] font-bold' : 'text-[#4A5850] font-medium'
          }`}
        >
          <Glasses className={`w-5 h-5 ${activeTab === 'collection' ? 'text-[#C85A17] stroke-[2.2]' : 'text-[#4A5850]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Lunettes</span>
        </button>

        {/* Center Prominent WhatsApp Button with Pulse */}
        <div className="relative -top-3.5">
          <a
            id="mobile-center-whatsapp-btn"
            href={buildGeneralWhatsAppUrl('general', customPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#1E6B48] hover:bg-[#185539] text-white shadow-lg shadow-[#1E6B48]/30 border-4 border-[#FAF8F5] active:scale-90 transition-transform cursor-pointer"
            aria-label="Commander directement sur WhatsApp"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
          </a>
          <span className="block text-center text-[9px] font-bold text-[#1E6B48] -mt-0.5">
            WhatsApp
          </span>
        </div>

        {/* Tab 3: Bestsellers */}
        <button
          onClick={() => scrollToSection('bestsellers', 'bestsellers')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'bestsellers' ? 'text-[#C85A17] font-bold' : 'text-[#4A5850] font-medium'
          }`}
        >
          <Flame className={`w-5 h-5 ${activeTab === 'bestsellers' ? 'text-[#C85A17] stroke-[2.2]' : 'text-[#4A5850]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Best-sellers</span>
        </button>

        {/* Tab 4: Avis / Témoignages */}
        <button
          onClick={() => scrollToSection('avis', 'reviews')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'reviews' ? 'text-[#C85A17] font-bold' : 'text-[#4A5850] font-medium'
          }`}
        >
          <Star className={`w-5 h-5 ${activeTab === 'reviews' ? 'text-[#C85A17] stroke-[2.2]' : 'text-[#4A5850]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Avis</span>
        </button>
      </nav>
    </>
  );
};
