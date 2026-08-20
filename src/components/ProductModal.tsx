import React, { useState } from 'react';
import { Product } from '../types';
import {
  X,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Minus,
} from 'lucide-react';
import { formatFCFA, buildProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Défaut', hex: '#FF6E14' });
  const [quantity, setQuantity] = useState(1);

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const totalPrice = product.price * quantity;

  const handleColorSelect = (color: typeof product.colors[0]) => {
    setSelectedColor(color);
    if (color.imageIndex !== undefined && product.images[color.imageIndex]) {
      setActiveImageIndex(color.imageIndex);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleWhatsAppOrder = () => {
    const url = buildProductWhatsAppUrl({
      product,
      selectedColor,
      quantity,
    });
    window.open(url, '_blank');
  };

  return (
    <div
      id="product-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#004D25]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="product-modal-card"
        className="bg-white rounded-t-3xl sm:rounded-3xl border-t-4 sm:border-2 border-[#FF6E14] sm:border-orange-200 shadow-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 text-[#004D25] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden w-full flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-orange-200"></div>
        </div>

        {/* Close Button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-2.5 rounded-full bg-orange-100 text-[#FF6E14] hover:bg-[#FF6E14] hover:text-white transition-colors shadow-md cursor-pointer border border-orange-200"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 p-4 sm:p-8 pb-28 sm:pb-8 flex-1">
          {/* Left Column: Image Gallery Slider */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-orange-50 border-2 border-orange-100 shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} - Vue ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md bg-[#FF6E14] text-white shadow-md border border-white/40">
                    {product.badge}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="text-xs font-black text-white bg-[#FF6E14] px-2 py-0.5 rounded shadow-xs">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Slider Arrows if multiple images */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-[#004D25] hover:bg-[#FF6E14] hover:text-white transition-colors shadow-md cursor-pointer active:scale-90"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-[#004D25] hover:bg-[#FF6E14] hover:text-white transition-colors shadow-md cursor-pointer active:scale-90"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Mobile swipe indicator dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        activeImageIndex === i ? 'w-5 bg-[#FF6E14]' : 'w-2 bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#FF6E14] ring-2 ring-orange-200 scale-105'
                        : 'border-orange-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniature" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Options */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#FF6E14]">
                  🇨🇮 Collection Abidjan 2026
                </span>
                <div className="flex items-center gap-1 text-xs text-[#FF6E14]">
                  {'★'.repeat(Math.round(product.rating))}
                  <span className="text-xs font-bold text-[#004D25]/70 ml-1">
                    ({product.reviewCount} avis)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-3xl font-black text-[#004D25] mb-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#004D25]/75 font-semibold mb-3">
                {product.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline justify-between p-3 sm:p-3.5 bg-orange-50/80 rounded-2xl border-2 border-orange-100 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-3xl font-black text-[#FF6E14]">
                    {formatFCFA(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs sm:text-sm text-[#004D25]/40 line-through font-semibold">
                      {formatFCFA(product.oldPrice)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-black text-[#009E60] bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                  ✓ En stock à Abidjan
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#004D25]/85 leading-relaxed mb-4 font-medium">
                {product.description}
              </p>

              {/* Color Choice with Big Mobile Touch Targets */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-xs font-bold">
                    <span className="text-[#004D25]">
                      Couleur choisie : <strong className="text-[#FF6E14]">{selectedColor.name}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => handleColorSelect(color)}
                          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'border-[#FF6E14] bg-orange-50 text-[#FF6E14] ring-2 ring-orange-200'
                              : 'border-orange-100 bg-white text-[#004D25] hover:border-orange-300'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector for Mobile */}
              <div className="mb-4 flex items-center justify-between p-3 bg-orange-50/50 rounded-2xl border border-orange-100">
                <span className="text-xs font-bold text-[#004D25]">
                  Quantité :
                </span>
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-orange-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-orange-50 text-[#004D25] font-black flex items-center justify-center hover:bg-orange-100 cursor-pointer active:scale-90"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-[#FF6E14] min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-orange-50 text-[#004D25] font-black flex items-center justify-center hover:bg-orange-100 cursor-pointer active:scale-90"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-1.5 mb-4 pt-2 border-t border-orange-100">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#004D25] font-semibold">
                    <Check className="w-3.5 h-3.5 text-[#009E60] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Order Bar (Optimized for Mobile Thumb & Instant Conversion) */}
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/98 backdrop-blur-md border-t-2 border-orange-200 p-3 sm:p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex flex-col gap-2">
          <div className="flex items-center justify-between sm:hidden px-1">
            <span className="text-xs text-[#004D25]/75 font-semibold">
              Total ({quantity} {quantity > 1 ? 'paires' : 'paire'}) :
            </span>
            <span className="text-base font-black text-[#FF6E14]">
              {formatFCFA(totalPrice)}
            </span>
          </div>

          <button
            id="modal-order-whatsapp-btn"
            onClick={handleWhatsAppOrder}
            className="w-full min-h-[50px] flex items-center justify-center gap-2.5 bg-[#009E60] hover:bg-[#008552] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-green-600/30 active:scale-95 transition-all cursor-pointer border-2 border-white"
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0" />
            <span>Commander sur WhatsApp ({formatFCFA(totalPrice)})</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-[#004D25]/80 font-bold px-1">
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#FF6E14]" />
              <span>Livraison 24h Abidjan</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009E60]" />
              <span>Paiement à la réception</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
