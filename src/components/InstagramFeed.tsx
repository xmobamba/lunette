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
    <section id="instagram-feed" className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 border-2 border-orange-200 text-[#FF6E14] text-xs font-black uppercase tracking-widest mb-3 shadow-xs">
            <Instagram className="w-3.5 h-3.5 text-[#009E60]" />
            <span>{STORE_CONFIG.instagramHandle}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#004D25] tracking-tight">
            Rejoignez la communauté
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#FF6E14] uppercase mt-2">
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
              className="group relative aspect-square rounded-2xl overflow-hidden bg-orange-50 block shadow-sm hover:shadow-xl transition-all border-2 border-orange-100 hover:border-[#FF6E14]"
            >
              <img
                src={post.image}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#004D25]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                <div className="self-end">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-black text-[#FF6E14] mb-1">
                    <Heart className="w-3.5 h-3.5 fill-[#FF6E14]" />
                    <span>{post.likes}</span>
                  </div>
                  <p className="text-[10px] text-white font-medium line-clamp-2 leading-tight">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6E14] hover:bg-[#E05300] text-white text-xs sm:text-sm font-black transition-all hover:scale-105 shadow-md border-2 border-white"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span>Instagram</span>
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick('TikTok')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#009E60] hover:bg-[#008552] text-white text-xs sm:text-sm font-black transition-all hover:scale-105 shadow-md border-2 border-white"
          >
            <span className="font-bold text-xs">♪</span>
            <span>TikTok</span>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick('Facebook')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6E14] hover:bg-[#E05300] text-white text-xs sm:text-sm font-black transition-all hover:scale-105 shadow-md border-2 border-white"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </section>
  );
};
