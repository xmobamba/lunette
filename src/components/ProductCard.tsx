import React, { useState } from 'react';
import { MessageCircle, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatFCFA, buildProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState(product.images[0] || FALLBACK_IMAGE);

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleColorClick = (e: React.MouseEvent, imageIdx?: number) => {
    e.stopPropagation();
    if (imageIdx !== undefined && product.images[imageIdx]) {
      setActiveImageIndex(imageIdx);
      setImgSrc(product.images[imageIdx]);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-orange-200/90 hover:border-[#FF6E14] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Product Image Stage */}
      <div
        className="relative aspect-square w-full bg-orange-50/50 overflow-hidden cursor-pointer"
        onClick={() => onOpenQuickView(product)}
      >
        <img
          src={imgSrc}
          alt={`${product.name} - Lunettes de soleil`}
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
                product.badge === 'Bestseller'
                  ? 'bg-[#FF6E14] text-white'
                  : product.badge === 'Nouveau'
                  ? 'bg-[#009E60] text-white'
                  : 'bg-orange-100 text-[#FF6E14] border border-orange-300 font-black'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-[9px] sm:text-[10px] font-black text-white bg-[#FF6E14] px-1.5 py-0.5 rounded shadow-xs">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite && onToggleFavorite(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs cursor-pointer ${
            isFavorite
              ? 'bg-[#FF6E14] text-white shadow-sm'
              : 'bg-white/90 hover:bg-white text-[#FF6E14] hover:scale-105'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : 'fill-none'}`} />
        </button>

        {/* Quick View Button Hover Overlay on Desktop */}
        <div className="hidden sm:flex absolute inset-0 bg-[#004D25]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="pointer-events-auto bg-white hover:bg-orange-50 text-[#004D25] hover:text-[#FF6E14] text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-orange-200"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF6E14]" />
            <span>Fiche rapide</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1 mb-1.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => handleColorClick(e, c.imageIndex)}
                  title={c.name}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer ${
                    activeImageIndex === (c.imageIndex ?? 0)
                      ? 'ring-2 ring-offset-1 ring-[#FF6E14] scale-110'
                      : 'border-orange-200 opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-[9px] sm:text-[10px] font-bold text-[#004D25]/60 ml-1">
                {product.colors.length} teintes
              </span>
            </div>
          )}

          {/* Model Name */}
          <h3
            onClick={() => onOpenQuickView(product)}
            className="font-serif text-xs sm:text-base font-black text-[#004D25] group-hover:text-[#FF6E14] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs text-[#004D25]/70 truncate mt-0.5 mb-1.5 font-medium">
            {product.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-[#FF6E14] mb-2">
            <span>{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-[9px] sm:text-[10px] text-[#004D25]/60 font-bold">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & Order Section */}
        <div className="pt-2 border-t border-orange-100 flex flex-col gap-1.5">
          {/* Price + Stock badge */}
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-black text-[#FF6E14] whitespace-nowrap">
                {formatFCFA(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[9px] sm:text-[11px] text-[#004D25]/40 line-through font-medium whitespace-nowrap">
                  {formatFCFA(product.oldPrice)}
                </span>
              )}
            </div>
            <span className="text-[8px] sm:text-[9px] text-[#009E60] font-black bg-green-50 border border-green-200 px-1.5 py-0.5 rounded whitespace-nowrap">
              En stock
            </span>
          </div>

          {/* WhatsApp Action Button */}
          <a
            id={`btn-order-whatsapp-${product.id}`}
            href={buildProductWhatsAppUrl({
              product,
              selectedColor: product.colors[activeImageIndex] || product.colors[0],
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[34px] sm:min-h-[38px] flex items-center justify-center gap-1.5 bg-[#009E60] hover:bg-[#008552] text-white font-black text-[11px] sm:text-xs py-1.5 px-2 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 border border-white/20"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>Commander</span>
          </a>

          {/* Mobile quick link to open modal */}
          <button
            onClick={() => onOpenQuickView(product)}
            className="sm:hidden text-center text-[10px] font-bold text-[#004D25]/70 hover:text-[#FF6E14] py-0.5 cursor-pointer"
          >
            Voir détails & photos
          </button>
        </div>
      </div>
    </div>
  );
};
