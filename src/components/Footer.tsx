import React, { useState } from 'react';
import { StoreConfig } from '../types';
import { STORE_CONFIG } from '../config/store';
import { Instagram, MessageCircle, Share2, MapPin, Heart, SlidersHorizontal } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  storeConfig?: StoreConfig;
  customPhone?: string;
  onOpenAdmin?: () => void;
  isAdminMode?: boolean;
  onSecretAdminUnlock?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeConfig = STORE_CONFIG,
  customPhone,
  onOpenAdmin,
  isAdminMode = false,
  onSecretAdminUnlock,
}) => {
  const displayPhone = customPhone || storeConfig.phoneDisplay;
  const [clickCount, setClickCount] = useState(0);

  const handleSecretTrigger = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 3) {
      setClickCount(0);
      if (onSecretAdminUnlock) {
        onSecretAdminUnlock();
      }
    }

    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <footer id="main-footer" className="bg-[#14221B] text-[#FAF8F5] border-t border-[#C85A17]/40 pt-16 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand & Story */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full border border-[#C85A17] flex items-center justify-center bg-[#FAF8F5] shadow-xs">
                <span className="text-[#C85A17] font-serif font-bold text-base">A</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#FAF8F5]">
                {storeConfig.storeName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-sm mb-6 font-normal">
              Votre destination de lunettes de soleil tendance à Abidjan. Modèles d'exception, verres polarisés UV400 et commande simplifiée via WhatsApp.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
              <MapPin className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span>Abidjan, Côte d'Ivoire • Livraison partout en ville</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C85A17] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/75 font-normal">
              <li>
                <a href="#top" className="hover:text-[#C85A17] transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#C85A17] transition-colors">Collection 2026</a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-[#C85A17] transition-colors">Nos Best-sellers</a>
              </li>
              <li>
                <a href="#pourquoi-nous" className="hover:text-[#C85A17] transition-colors">Pourquoi nous ?</a>
              </li>
              <li>
                <a href="#avis" className="hover:text-[#C85A17] transition-colors">Avis clientes</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C85A17] transition-colors">FAQ & Aide</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Informations & Livraisons */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C85A17] mb-4">
              Livraison & Paiement
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/75 font-normal">
              <li>🚚 Cocody, Marcory, Plateau</li>
              <li>🚚 Riviera, Deux Plateaux, Yopougon</li>
              <li>📦 Expédition intérieur du pays</li>
              <li className="pt-2 text-[#F4A261] font-bold">💵 Paiement à la livraison</li>
              <li className="font-medium text-white/90">📲 Wave, Orange Money, MTN</li>
            </ul>
          </div>

          {/* Col 5: Réseaux Sociaux & Contact WhatsApp */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C85A17] mb-4">
              Commander & Suivre
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={buildGeneralWhatsAppUrl('general', customPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs shadow-xs transition-all border border-white/15"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp : {displayPhone}</span>
              </a>

              {isAdminMode && onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs border border-white/20 transition-all cursor-pointer mt-1 shadow-2xs active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
                  <span>⚙️ Gérer la boutique & Promos</span>
                </button>
              )}

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C85A17] hover:text-white flex items-center justify-center transition-all text-white/90 shadow-2xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C85A17] hover:text-white flex items-center justify-center transition-all text-white/90 shadow-2xs"
                  aria-label="TikTok"
                >
                  <span className="font-bold text-xs">♪</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C85A17] hover:text-white flex items-center justify-center transition-all text-white/90 shadow-2xs"
                  aria-label="Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line with secret admin triple-click trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70 font-normal select-none">
          <p
            onClick={handleSecretTrigger}
            className="cursor-default select-none transition-opacity hover:opacity-100"
            title=""
          >
            © 2026 {storeConfig.storeName} — Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <span>Fait avec passion pour Abidjan 🇨🇮</span>
            <Heart className="w-3.5 h-3.5 text-[#C85A17] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
