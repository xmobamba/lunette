import React from 'react';
import { Home, Glasses, Flame, Heart, MessageCircle } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface MobileSocialNavProps {
  favoritesCount: number;
  customPhone?: string;
}

export const MobileSocialNav: React.FC<MobileSocialNavProps> = ({
  favoritesCount,
  customPhone,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8E1D7] px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <a
          href="#top"
          className="flex flex-col items-center gap-0.5 text-[#4A5850] hover:text-[#C85A17] transition-colors py-1 px-2"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Accueil</span>
        </a>

        {/* Collection */}
        <a
          href="#collection"
          className="flex flex-col items-center gap-0.5 text-[#4A5850] hover:text-[#C85A17] transition-colors py-1 px-2"
        >
          <Glasses className="w-5 h-5" />
          <span className="text-[10px] font-bold">Modèles</span>
        </a>

        {/* Promos */}
        <a
          href="#promo"
          className="flex flex-col items-center gap-0.5 text-[#C85A17] transition-colors py-1 px-2 relative"
        >
          <div className="relative">
            <Flame className="w-5 h-5 fill-[#C85A17] text-[#C85A17]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <span className="text-[10px] font-extrabold text-[#C85A17]">Promos</span>
        </a>

        {/* Favorites */}
        <a
          href="#collection"
          className="flex flex-col items-center gap-0.5 text-[#4A5850] hover:text-[#C85A17] transition-colors py-1 px-2 relative"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C85A17] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Favoris</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          href={buildGeneralWhatsAppUrl('general', customPhone)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-[#1E6B48] transition-colors py-1 px-2"
        >
          <div className="w-6 h-6 rounded-full bg-[#1E6B48] flex items-center justify-center text-white shadow-xs">
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="text-[10px] font-extrabold text-[#1E6B48]">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
