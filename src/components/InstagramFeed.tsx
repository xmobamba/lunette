import React from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink, Share2 } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { trackAnalyticsEvent } from '../utils/analytics';

const SOCIAL_POSTS = [
  {
    id: 'post-1',
    image: 'https://images.unsplash.com/photo-1509695503492-4122d64f0b2f?auto=format&fit=crop&w=600&q=80',
    likes: 428,
    caption: 'Golden hour à Assinie avec le modèle Riviera Gold ✨ #AuraEyewear #AbidjanStyle',
    link: 'https://instagram.com',
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    likes: 382,
    caption: 'Classique & intemporelle : la Luna Black ne quitte plus nos clientes de Cocody.',
    link: 'https://instagram.com',
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80',
    likes: 512,
    caption: 'Détails haute couture & finition soignée. Nouvelle collection disponible !',
    link: 'https://instagram.com',
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80',
    likes: 649,
    caption: 'Brunch chic au Plateau avec la Saint-Tropez Square 🕶️ Commandez sur WhatsApp.',
    link: 'https://instagram.com',
  },
  {
    id: 'post-5',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    likes: 290,
    caption: 'La Velvet Cat-Eye pour un regard affirmé et irrésistible ❤️',
    link: 'https://instagram.com',
  },
  {
    id: 'post-6',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    likes: 476,
    caption: 'Livraison express reçue en moins de 24h à Marcory Zone 4 🚚✨',
    link: 'https://instagram.com',
  },
];

export const InstagramFeed: React.FC = () => {
  const handleSocialClick = (network: string) => {
    trackAnalyticsEvent('social_click', { network });
  };

  return (
    <section id="instagram-feed" className="py-16 sm:py-20 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E8D4C0] text-[#B85318] text-xs font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <Instagram className="w-3.5 h-3.5 text-[#1E6B48]" />
            <span>{STORE_CONFIG.instagramHandle}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#18261F] tracking-tight">
            Rejoignez la communauté
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#C85A17] uppercase mt-2">
            Nouveautés • Looks Abidjan • Arrivages • Promotions
          </p>
        </div>

        {/* 6 Post Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {SOCIAL_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick('Instagram')}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white block shadow-2xs hover:shadow-md transition-all border border-[#E8E1D7] hover:border-[#C85A17]/60"
            >
              <img
                src={post.image}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#18261F]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                <div className="self-end">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#F4A261] mb-1">
                    <Heart className="w-3.5 h-3.5 fill-[#F4A261]" />
                    <span>{post.likes}</span>
                  </div>
                  <p className="text-[10px] text-white/95 font-normal line-clamp-2 leading-tight">
                    {post.caption}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Direct Social Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick('Instagram')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-2xs border border-white/20"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span>Instagram</span>
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick('TikTok')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E6B48] hover:bg-[#185539] text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-2xs border border-white/20"
          >
            <span className="font-bold text-xs">♪</span>
            <span>TikTok</span>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick('Facebook')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3B5998] hover:bg-[#2D4373] text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 shadow-2xs border border-white/20"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </section>
  );
};
