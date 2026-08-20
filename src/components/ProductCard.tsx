import React, { useState } from 'react';
import { MessageCircle, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatFCFA, buildProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  customPhone?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  isFavorite = false,
  onToggleFavorite,
  customPhone,
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
      className="group relative flex flex-col bg-white rounded-2xl border border-[#E8E1D7] hover:border-[#C85A17]/60 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Product Image Stage */}
      <div
        className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden cursor-pointer"
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
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs ${
                product.badge === 'Bestseller'
                  ? 'bg-[#C85A17] text-white'
                  : product.badge === 'Nouveau'
                  ? 'bg-[#1E6B48] text-white'
                  : 'bg-[#FAF0E6] text-[#B85318] border border-[#E8D4C0] font-bold'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-[9px] sm:text-[10px] font-bold text-white bg-[#C85A17] px-1.5 py-0.5 rounded shadow-2xs">
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
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-2xs cursor-pointer ${
            isFavorite
              ? 'bg-[#C85A17] text-white shadow-2xs'
              : 'bg-white/90 hover:bg-white text-[#C85A17] hover:scale-105'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : 'fill-none'}`} />
        </button>

        {/* Quick View Button Hover Overlay on Desktop */}
        <div className="hidden sm:flex absolute inset-0 bg-[#18261F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="pointer-events-auto bg-[#FAF8F5] hover:bg-white text-[#18261F] hover:text-[#C85A17] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-[#E8E1D7]"
          >
            <Eye className="w-3.5 h-3.5 text-[#C85A17]" />
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
                      ? 'ring-2 ring-offset-1 ring-[#C85A17] scale-110'
                      : 'border-[#E8E1D7] opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-[9px] sm:text-[10px] font-medium text-[#4A5850]/70 ml-1">
                {product.colors.length} teintes
              </span>
            </div>
          )}

          {/* Model Name */}
          <h3
            onClick={() => onOpenQuickView(product)}
            className="font-serif text-xs sm:text-base font-bold text-[#18261F] group-hover:text-[#C85A17] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs text-[#4A5850] truncate mt-0.5 mb-1.5 font-normal">
            {product.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-[#D97706] mb-2">
            <span>{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-[9px] sm:text-[10px] text-[#4A5850]/70 font-medium">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & Order Section */}
        <div className="pt-2 border-t border-[#EAE4DB] flex flex-col gap-1.5">
          {/* Price + Stock badge */}
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-bold text-[#C85A17] whitespace-nowrap">
                {formatFCFA(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[9px] sm:text-[11px] text-[#4A5850]/50 line-through font-medium whitespace-nowrap">
                  {formatFCFA(product.oldPrice)}
                </span>
              )}
            </div>
            <span className="text-[8px] sm:text-[9px] text-[#1E6B48] font-bold bg-[#E8F1EC] border border-[#C8DEC5] px-1.5 py-0.5 rounded whitespace-nowrap">
              En stock
            </span>
          </div>

          {/* WhatsApp Action Button */}
          <a
            id={`btn-order-whatsapp-${product.id}`}
            href={buildProductWhatsAppUrl({
              product,
              selectedColor: product.colors[activeImageIndex] || product.colors[0],
              customPhone,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[34px] sm:min-h-[38px] flex items-center justify-center gap-1.5 bg-[#1E6B48] hover:bg-[#185539] text-white font-bold text-[11px] sm:text-xs py-1.5 px-2 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95 border border-white/15"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>Commander</span>
          </a>

          {/* Mobile quick link to open modal */}
          <button
            onClick={() => onOpenQuickView(product)}
            className="sm:hidden text-center text-[10px] font-medium text-[#4A5850] hover:text-[#C85A17] py-0.5 cursor-pointer"
          >
            Voir détails & photos
          </button>
        </div>
      </div>
    </div>
  );
};
