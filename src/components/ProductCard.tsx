import React, { useState } from 'react';
import { MessageCircle, Eye, Heart, Share2, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatFCFA, buildProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  customPhone?: string;
  onUpdateProductImage?: (productId: string, newImage: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  isFavorite = false,
  onToggleFavorite,
  customPhone,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [likesCount, setLikesCount] = useState(() => 140 + (product.name.charCodeAt(0) % 80));
  const [hasLiked, setHasLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentImage = product.images && product.images.length > 0 ? product.images[activeImageIndex] || product.images[0] : null;

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleColorClick = (e: React.MouseEvent, imageIdx?: number) => {
    e.stopPropagation();
    if (imageIdx !== undefined && product.images[imageIdx]) {
      setActiveImageIndex(imageIdx);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Regarde ce modèle ${product.name} chez L'AURA Eyewear Abidjan (${formatFCFA(product.price)}) !`;
    const shareUrl = `${window.location.origin}/#collection`;

    if (navigator.share) {
      navigator.share({
        title: `${product.name} - L'AURA Eyewear`,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      try {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-3xl border border-[#E8E1D7] hover:border-[#C85A17]/60 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Stage */}
      <div
        className="relative aspect-4/5 w-full bg-[#FAF8F5] overflow-hidden cursor-pointer"
        onClick={() => onOpenQuickView(product)}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={`${product.name} - Lunettes de soleil Abidjan`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          /* Elegant Minimalist Sunglasses Silhouette */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#FAF8F5] to-[#F5EFE6]">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] mb-3 group-hover:scale-105 transition-transform shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-[#18261F]">
              {product.name}
            </span>
            <p className="text-[10px] text-[#4A5850]/70 mt-1 max-w-[140px]">
              Protection UV400 • Abidjan
            </p>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                product.badge === 'Bestseller'
                  ? 'bg-[#C85A17] text-white'
                  : product.badge === 'Nouveau'
                  ? 'bg-[#1E6B48] text-white'
                  : 'bg-[#FAF0E6] text-[#B85318] border border-[#E8D4C0]'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded-full shadow-sm self-start">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Top Right Actions (Heart & Share) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Wishlist / Like Button */}
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
              hasLiked || isFavorite
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-white/90 hover:bg-white text-[#18261F] hover:text-rose-500'
            }`}
            aria-label="Aimer ce modèle"
            title="Aimer ce modèle"
          >
            <Heart className={`w-4 h-4 ${hasLiked || isFavorite ? 'fill-white' : 'fill-none'}`} />
          </button>

          {/* Social Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#18261F] backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105"
            aria-label="Partager ce modèle"
            title="Partager ce modèle"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick View Button Hover Overlay on Desktop */}
        <div className="hidden sm:flex absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="pointer-events-auto bg-white/95 hover:bg-white text-[#18261F] hover:text-[#C85A17] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg border border-white/40 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-200 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#C85A17]" />
            <span>Fiche & Détails</span>
          </button>
        </div>

        {/* Bottom Social Engagement Pill */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
            <span>{likesCount} likes</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md text-[#1E6B48] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs">
            <span>UV400</span>
          </div>
        </div>
      </div>

      {/* Product Content (Social First Commerce Card) */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => handleColorClick(e, c.imageIndex)}
                  title={c.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                    activeImageIndex === (c.imageIndex ?? 0)
                      ? 'ring-2 ring-offset-1 ring-[#C85A17] scale-110'
                      : 'border-[#E8E1D7] opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-[10px] font-medium text-[#4A5850]/70 ml-1">
                {product.colors.length} teintes
              </span>
            </div>
          )}

          {/* Model Name */}
          <h3
            onClick={() => onOpenQuickView(product)}
            className="font-serif text-sm sm:text-base font-bold text-[#18261F] group-hover:text-[#C85A17] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          {/* Short tagline */}
          <p className="text-[11px] text-[#4A5850] line-clamp-1 mt-0.5 font-normal">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F0EBE1] flex flex-col gap-2.5">
          {/* Price Tag */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm sm:text-base text-[#18261F]">
                {formatFCFA(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] text-[#4A5850]/60 line-through font-normal">
                  {formatFCFA(product.oldPrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] text-[#1E6B48] font-bold bg-[#EAF2ED] px-2 py-0.5 rounded-full">
              Livraison 24h
            </span>
          </div>

          {/* WhatsApp Direct Buy Button (1-Click) */}
          <a
            id={`btn-buy-${product.id}`}
            href={buildProductWhatsAppUrl({ product, customPhone })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#1E6B48] hover:bg-[#165236] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-98"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Commander sur WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
