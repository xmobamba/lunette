import React, { useState } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  ExternalLink, 
  Share2, 
  Play, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Volume2,
  Tag
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { trackAnalyticsEvent } from '../utils/analytics';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

import imgChanelShield from '../assets/images/chanel_shield_black_1787218034317.jpg';
import imgBvlgariAviator from '../assets/images/bvlgari_aviator_burgundy_1787242471047.jpg';
import imgMiuMiuOval from '../assets/images/miumiu_oval_black_1787218119854.jpg';
import imgCelineHavana from '../assets/images/celine_triomphe_havana_1787218062413.jpg';
import imgBvlgariRimless from '../assets/images/bvlgari_rimless_black_1787218174732.jpg';
import imgCelineBlack from '../assets/images/celine_triomphe_black_1787218159931.jpg';
import imgLvPilot from '../assets/images/lv_pilot_cream_1787218102121.jpg';
import imgBvlgariAmber from '../assets/images/bvlgari_serpenti_amber_1787218074048.jpg';
import imgCartierOval from '../assets/images/cartier_cdecor_oval_1787218049335.jpg';
import imgDiorEmerald from '../assets/images/dior_cd_emerald_1787218090618.jpg';
import imgCelineOvalTortoise from '../assets/images/celine_oval_tortoise_1787242486013.jpg';
import imgFredGold from '../assets/images/fred_cable_gold_1787218135047.jpg';

interface SocialPostItem {
  id: string;
  type: 'image' | 'video';
  image: string;
  likes: number;
  commentsCount: number;
  views?: string;
  caption: string;
  productName: string;
  productPrice: string;
  location: string;
  tag: string;
  instagramUrl: string;
}

const SOCIAL_POSTS: SocialPostItem[] = [
  {
    id: 'post-1',
    type: 'image',
    image: imgChanelShield,
    likes: 842,
    commentsCount: 58,
    caption: 'Chanel Masque Shield CC • Le chic haute couture parisien sous le soleil d’Abidjan ✨ Livrée avec son étui matelassé.',
    productName: 'Chanel Shield CC',
    productPrice: '35 000 FCFA',
    location: 'Cocody Ambassades',
    tag: 'Look Bestseller',
    instagramUrl: 'https://instagram.com',
  },
  {
    id: 'post-2',
    type: 'video',
    image: imgBvlgariAviator,
    likes: 990,
    commentsCount: 84,
    views: '28.4K',
    caption: 'Double pont en or & verres bordeaux dégradés Bvlgari Aviateur 🕶️ Une allure royale.',
    productName: 'Bvlgari Aviateur',
    productPrice: '35 000 FCFA',
    location: 'Sofitel Abidjan Ivoire',
    tag: 'Reel Tendance',
    instagramUrl: 'https://instagram.com',
  },
  {
    id: 'post-3',
    type: 'image',
    image: imgMiuMiuOval,
    likes: 912,
    commentsCount: 62,
    caption: 'Le modèle viral Miu Miu Ovale Couture noire avec sa pochette rose poudré signature 💕',
    productName: 'Miu Miu Ovale',
    productPrice: '35 000 FCFA',
    location: 'Marcory Zone 4',
    tag: 'Look Couture',
    instagramUrl: 'https://instagram.com',
  },
  {
    id: 'post-4',
    type: 'video',
    image: imgCelineHavana,
    likes: 830,
    commentsCount: 61,
    views: '34.1K',
    caption: 'Unboxing Céline Triomphe Écaille avec boîte rigide de protection offerte 🎁',
    productName: 'Céline Triomphe',
    productPrice: '35 000 FCFA',
    location: 'Deux Plateaux Vallon',
    tag: 'Unboxing Abidjan',
    instagramUrl: 'https://instagram.com',
  },
  {
    id: 'post-5',
    type: 'image',
    image: imgCartierOval,
    likes: 878,
    commentsCount: 49,
    caption: 'Cartier C-Décor Ovale • Pureté des verres sans monture et charnières C en or 24K 💎',
    productName: 'Cartier C Décor',
    productPrice: '35 000 FCFA',
    location: 'Plateau Prestige',
    tag: 'Look Joaillerie',
    instagramUrl: 'https://instagram.com',
  },
  {
    id: 'post-6',
    type: 'video',
    image: imgFredGold,
    likes: 944,
    commentsCount: 79,
    views: '39.2K',
    caption: 'Fred Force 10 Câble Or • Livraison 24h & Paiement à la réception à Abidjan 🚚✨',
    productName: 'Fred Force 10 Câble',
    productPrice: '35 000 FCFA',
    location: 'Riviera Golf',
    tag: 'Livraison 24h',
    instagramUrl: 'https://instagram.com',
  },
];

export const InstagramFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'reels' | 'looks'>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = SOCIAL_POSTS.filter((post) => {
    if (activeTab === 'reels') return post.type === 'video';
    if (activeTab === 'looks') return post.tag.includes('Look');
    return true;
  });

  return (
    <section id="instagram-feed" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E8E1D7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Instagram Profile Header (Social-First Aesthetic) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-sm mb-10 sm:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Avatar + Handle + Bio */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#C85A17] via-[#F4A261] to-[#1E6B48] shadow-md">
                <div className="w-full h-full rounded-full p-[2px] bg-white overflow-hidden">
                  <img
                    src={imgChanelShield}
                    alt="L'AURA Eyewear Abidjan"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18261F]">
                    {STORE_CONFIG.instagramHandle}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1E6B48] text-white text-[10px] font-bold">
                    ✓ Officiel Abidjan
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#4A5850] max-w-lg mb-3">
                  ✨ Lunettes de soleil haute qualité & protection UV400 à Abidjan. <br className="hidden sm:inline" />
                  🚚 Livraison express 24h & paiement sécurisé à la réception (Wave / OM / Cash).
                </p>

                {/* Social Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-5 text-xs text-[#18261F]">
                  <div>
                    <strong className="font-bold text-sm">180+</strong>{' '}
                    <span className="text-[#4A5850]">publications</span>
                  </div>
                  <div>
                    <strong className="font-bold text-sm">14.8K</strong>{' '}
                    <span className="text-[#4A5850]">abonnées</span>
                  </div>
                  <div>
                    <strong className="font-bold text-sm">⭐ 4.9</strong>{' '}
                    <span className="text-[#4A5850]">(1.2k avis)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Direct Follow & WhatsApp CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C85A17] to-[#E07A5F] hover:from-[#B85318] hover:to-[#C85A17] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>Nous suivre sur Instagram</span>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#18261F] hover:bg-[#25392F] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <span className="font-black text-sm">♪</span>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Filter Sub-Tabs */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-6 pt-5 border-t border-[#E8E1D7] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#18261F] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A5850] hover:bg-[#F0EBE1]'
              }`}
            >
              🔥 Tout le Feed ({SOCIAL_POSTS.length})
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reels'
                  ? 'bg-[#18261F] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A5850] hover:bg-[#F0EBE1]'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Reels & TikToks Vidéos</span>
            </button>
            <button
              onClick={() => setActiveTab('looks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'looks'
                  ? 'bg-[#18261F] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A5850] hover:bg-[#F0EBE1]'
              }`}
            >
              🕶️ Shopper les Looks Clientes
            </button>
          </div>
        </div>

        {/* 6 Post Interactive Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {filteredPosts.map((post) => {
            const isLiked = likedPosts[post.id];
            const currentLikes = isLiked ? post.likes + 1 : post.likes;

            return (
              <div
                key={post.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[#E8E1D7] hover:border-[#C85A17]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Stage */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                  <img
                    src={post.image}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      {post.tag}
                    </span>
                    {post.type === 'video' && (
                      <span className="bg-[#C85A17] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>{post.views} vues</span>
                      </span>
                    )}
                  </div>

                  {/* Top Right Social Icon */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Instagram className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hotspot Product Tag Pill */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                    <div className="bg-black/75 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#F4A261]" />
                      <div className="text-left">
                        <div className="text-[10px] text-white/70 font-semibold leading-tight">Shoppez ce look</div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {post.productName} • <span className="text-[#F4A261]">{post.productPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick WhatsApp Link */}
                    <a
                      href={`https://wa.me/2250700000000?text=${encodeURIComponent(
                        `Bonjour L'AURA EYEWEAR, je souhaite commander le modèle ${post.productName} (${post.productPrice}) vu sur votre Instagram !`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-2xl bg-[#1E6B48] hover:bg-[#165236] text-white flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 active:scale-95 transition-all"
                      title="Commander ce look sur WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </a>
                  </div>
                </div>

                {/* Post Footer Information */}
                <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    {/* Likes & Comments Bar */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 text-xs font-bold text-[#18261F]">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className="flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isLiked ? 'fill-rose-500 text-rose-500' : 'text-[#18261F]'
                            }`}
                          />
                          <span>{currentLikes}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-[#4A5850]">
                          <MessageCircle className="w-4 h-4 text-[#4A5850]" />
                          <span>{post.commentsCount}</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#C85A17] font-semibold">
                        📍 {post.location}
                      </span>
                    </div>

                    {/* Caption */}
                    <p className="text-xs text-[#18261F]/90 font-normal leading-relaxed line-clamp-2">
                      <strong className="font-bold text-[#18261F] mr-1">lauraeyewear.ci</strong>
                      {post.caption}
                    </p>
                  </div>

                  {/* Direct Link to Insta */}
                  <div className="mt-3 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-[11px]">
                    <a
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C85A17] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Voir sur Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <span className="text-[#4A5850]/70 font-medium">Abidjan, CI</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Social Community Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#18261F] via-[#24382E] to-[#18261F] text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>Hashtag Officiel : #AuraEyewearAbidjan</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Identifiez-nous sur vos stories & posts !
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl font-normal">
              Publiez votre photo avec vos lunettes L'AURA et mentionnez <strong>@lauraeyewear.ci</strong> pour être republiée et recevoir un code promo exclusif de <strong>-5 000 FCFA</strong> sur votre prochaine commande.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            Rejoindre la communauté →
          </a>
        </div>
      </div>
    </section>
  );
};
