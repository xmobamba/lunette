import React from 'react';
import { STORE_CONFIG } from '../config/store';
import { Instagram, MessageCircle, Share2, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-[#004D25] text-white border-t-4 border-[#FF6E14] pt-16 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/15">
          {/* Col 1 & 2: Brand & Story */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#FF6E14] flex items-center justify-center bg-white shadow-md">
                <span className="text-[#FF6E14] font-serif font-black text-base">A</span>
              </div>
              <span className="font-serif text-2xl font-black tracking-[0.2em] text-white">
                {STORE_CONFIG.storeName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-sm mb-6 font-medium">
              Votre destination de lunettes de soleil tendance à Abidjan. Modèles d'exception, verres polarisés UV400 et commande simplifiée via WhatsApp.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/95 font-bold">
              <MapPin className="w-4 h-4 text-[#FF6E14] shrink-0" />
              <span>Abidjan, Côte d'Ivoire • Livraison partout en ville</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FF6E14] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/85 font-medium">
              <li>
                <a href="#top" className="hover:text-[#FF6E14] transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#FF6E14] transition-colors">Collection 2026</a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-[#FF6E14] transition-colors">Nos Best-sellers</a>
              </li>
              <li>
                <a href="#pourquoi-nous" className="hover:text-[#FF6E14] transition-colors">Pourquoi nous ?</a>
              </li>
              <li>
                <a href="#avis" className="hover:text-[#FF6E14] transition-colors">Avis clientes</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#FF6E14] transition-colors">FAQ & Aide</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Informations & Livraisons */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FF6E14] mb-4">
              Livraison & Paiement
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/85 font-medium">
              <li>🚚 Cocody, Marcory, Plateau</li>
              <li>🚚 Riviera, Deux Plateaux, Yopougon</li>
              <li>📦 Expédition intérieur du pays</li>
              <li className="pt-2 text-[#FF6E14] font-black">💵 Paiement à la livraison</li>
              <li className="font-bold">📲 Wave, Orange Money, MTN</li>
            </ul>
          </div>

          {/* Col 5: Réseaux Sociaux & Contact WhatsApp */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FF6E14] mb-4">
              Commander & Suivre
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={buildGeneralWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6E14] hover:bg-[#E05300] text-white font-black text-xs shadow-md transition-all border border-white/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp : {STORE_CONFIG.phoneDisplay}</span>
              </a>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#FF6E14] hover:text-white flex items-center justify-center transition-all text-white shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#FF6E14] hover:text-white flex items-center justify-center transition-all text-white shadow-xs"
                  aria-label="TikTok"
                >
                  <span className="font-bold text-xs">♪</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#FF6E14] hover:text-white flex items-center justify-center transition-all text-white shadow-xs"
                  aria-label="Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80 font-medium">
          <p>© 2026 {STORE_CONFIG.storeName} — Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span>Fait avec amour pour Abidjan 🇨🇮</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6E14] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
