import React, { useState } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles, 
  Play,
  Camera,
  Plus
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { Product } from '../types';
import { buildProductWhatsAppUrl, formatFCFA } from '../utils/whatsapp';

interface InstagramFeedProps {
  products?: Product[];
  customPhone?: string;
  onOpenAdmin?: () => void;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  products = [],
  customPhone,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'reels' | 'looks'>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Products with images
  const productsWithImages = products.filter((p) => p.images && p.images.length > 0);

  // Generate dynamic posts from products
  const dynamicPosts = productsWithImages.map((prod, idx) => ({
    id: `post-${prod.id}`,
    type: (idx % 2 === 1 ? 'video' : 'image') as 'video' | 'image',
    image: prod.images[0],
    likes: 800 + (prod.name.charCodeAt(0) % 200),
    commentsCount: 45 + (prod.name.charCodeAt(1) % 40),
    views: `${(25 + idx * 3.5).toFixed(1)}K`,
    caption: `${prod.name} • ${prod.subtitle || prod.description} ✨ Livraison express 24h & paiement sécurisé à la réception à Abidjan.`,
    product: prod,
    productName: prod.name,
    productPrice: formatFCFA(prod.price),
    location: idx % 2 === 0 ? 'Cocody Ambassades' : 'Sofitel Abidjan Ivoire',
    tag: prod.badge || (idx === 0 ? 'Look Bestseller' : 'Look Couture'),
    instagramUrl: 'https://instagram.com',
  }));

  const filteredPosts = dynamicPosts.filter((post) => {
    if (activeTab === 'reels') return post.type === 'video';
    if (activeTab === 'looks') return post.tag.includes('Look') || post.tag.includes('Bestseller');
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#C85A17] via-[#F4A261] to-[#1E6B48] shadow-md shrink-0">
                <div className="w-full h-full rounded-full p-[2px] bg-white overflow-hidden flex items-center justify-center bg-[#FAF8F5]">
                  {productsWithImages.length > 0 ? (
                    <img
                      src={productsWithImages[0].images[0]}
                      alt="L'AURA Eyewear Abidjan"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Instagram className="w-8 h-8 text-[#C85A17]" />
                  )}
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C85A17] to-[#E07A5F] hover:from-[#B85318] hover:to-[#C85A17] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                <span>Nous suivre sur Instagram</span>
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
              🔥 Tout le Feed ({dynamicPosts.length})
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

        {/* Dynamic Social Grid */}
        {filteredPosts.length > 0 ? (
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
                        href={buildProductWhatsAppUrl({ product: post.product, customPhone })}
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
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-[#E8E1D7] mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] flex items-center justify-center text-[#C85A17] mx-auto mb-3">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18261F] mb-1">
              Votre Lookbook Instagram & TikTok
            </h3>
            <p className="text-xs text-[#4A5850] max-w-md mx-auto mb-4">
              Ajoutez vos photos de lunettes dans le catalogue ci-dessus pour alimenter automatiquement votre feed lookbook interactif.
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-5 py-2.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white text-xs font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter des photos</span>
              </button>
            )}
          </div>
        )}

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
            className="px-7 py-3.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/20 cursor-pointer"
          >
            Rejoindre la communauté →
          </a>
        </div>
      </div>
    </section>
  );
};
