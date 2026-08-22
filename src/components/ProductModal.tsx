import React, { useState, useRef } from 'react';
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
  Camera,
  Upload
} from 'lucide-react';
import { formatFCFA, buildProductWhatsAppUrl } from '../utils/whatsapp';
import { fileToBase64 } from '../utils/imageUpload';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  customPhone?: string;
  onUpdateProductImage?: (productId: string, newImage: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  customPhone,
  onUpdateProductImage,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0
      ? product.colors[0]
      : { name: 'Défaut', hex: '#FF6E14' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imagesList = product.images || [];
  const hasImages = imagesList.length > 0;
  const currentImage = hasImages ? imagesList[activeImageIndex] || imagesList[0] : null;

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const totalPrice = product.price * quantity;

  const handleColorSelect = (color: typeof product.colors[0]) => {
    setSelectedColor(color);
    if (color.imageIndex !== undefined && imagesList[color.imageIndex]) {
      setActiveImageIndex(color.imageIndex);
    }
  };

  const nextImage = () => {
    if (imagesList.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = () => {
    if (imagesList.length === 0) return;
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file);
      if (onUpdateProductImage) {
        onUpdateProductImage(product.id, base64);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleWhatsAppOrder = () => {
    const url = buildProductWhatsAppUrl({
      product,
      selectedColor,
      quantity,
      customPhone,
    });
    window.open(url, '_blank');
  };

  return (
    <div
      id="product-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#18261F]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div
        id="product-modal-card"
        className="bg-white rounded-t-3xl sm:rounded-3xl border-t-2 sm:border border-[#C85A17] sm:border-[#E8E1D7] shadow-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 text-[#18261F] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden w-full flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[#E8E1D7]"></div>
        </div>

        {/* Close Button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-2.5 rounded-full bg-[#FAF0E6] text-[#B85318] hover:bg-[#C85A17] hover:text-white transition-colors shadow-xs cursor-pointer border border-[#E8D4C0]"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 p-4 sm:p-8 pb-28 sm:pb-8 flex-1">
          {/* Left Column: Image Gallery Slider / Upload Placeholder */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E1D7] shadow-inner flex items-center justify-center">
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={`${product.name} - Vue ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Change photo button on hover */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1 transition-all shadow-md cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-[#F4A261]" />
                    <span>Changer la photo</span>
                  </button>
                </>
              ) : (
                /* Empty Upload Zone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF0E6]/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#FAF0E6] border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] mb-3">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-[#C85A17] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#18261F]">Ajouter une photo pour ce modèle</span>
                  <span className="text-xs text-[#4A5850] mt-1">Cliquez pour importer depuis votre appareil</span>
                  <button
                    type="button"
                    className="mt-3 px-4 py-1.5 rounded-full bg-[#C85A17] text-white text-xs font-bold shadow-xs flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer photo</span>
                  </button>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-[#C85A17] text-white shadow-xs border border-white/30">
                    {product.badge}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="text-xs font-bold text-white bg-[#C85A17] px-2 py-0.5 rounded shadow-2xs">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Slider Arrows if multiple images */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-[#18261F] hover:bg-[#C85A17] hover:text-white transition-colors shadow-xs cursor-pointer active:scale-90"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-[#18261F] hover:bg-[#C85A17] hover:text-white transition-colors shadow-xs cursor-pointer active:scale-90"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#C85A17] ring-2 ring-[#C85A17]/30 scale-105'
                        : 'border-[#E8E1D7] opacity-60 hover:opacity-100'
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
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C85A17]">
                  🇨🇮 Collection Abidjan 2026
                </span>
                <div className="flex items-center gap-1 text-xs text-[#D97706]">
                  {'★'.repeat(Math.round(product.rating))}
                  <span className="text-xs font-medium text-[#4A5850] ml-1">
                    ({product.reviewCount} avis)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#18261F] mb-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#4A5850] font-medium mb-3">
                {product.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline justify-between p-3 sm:p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D7] mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-3xl font-bold text-[#C85A17]">
                    {formatFCFA(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs sm:text-sm text-[#4A5850]/50 line-through font-medium">
                      {formatFCFA(product.oldPrice)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#1E6B48] bg-[#E8F1EC] border border-[#C8DEC5] px-2.5 py-1 rounded-full">
                  ✓ En stock à Abidjan
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A5850] leading-relaxed mb-4 font-normal">
                {product.description}
              </p>

              {/* Color Choice with Big Mobile Touch Targets */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-xs font-medium">
                    <span className="text-[#18261F]">
                      Couleur choisie : <strong className="text-[#C85A17]">{selectedColor.name}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => handleColorSelect(color)}
                          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'border-[#C85A17] bg-[#FAF0E6] text-[#B85318] ring-2 ring-[#C85A17]/20'
                              : 'border-[#E8E1D7] bg-white text-[#18261F] hover:border-[#E8D4C0]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
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
              <div className="mb-4 flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D7]">
                <span className="text-xs font-bold text-[#18261F]">
                  Quantité :
                </span>
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-[#E8E1D7]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#18261F] font-bold flex items-center justify-center hover:bg-[#F0EBE1] cursor-pointer active:scale-90"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-[#C85A17] min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#18261F] font-bold flex items-center justify-center hover:bg-[#F0EBE1] cursor-pointer active:scale-90"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Key Features & Specs */}
              <div className="space-y-2 mb-4 pt-3 border-t border-[#EAE4DB]">
                {product.specs?.uvProtection && (
                  <div className="flex items-center gap-2 text-xs text-[#18261F] font-medium">
                    <Check className="w-3.5 h-3.5 text-[#1E6B48] shrink-0" />
                    <span>Protection : {product.specs.uvProtection}</span>
                  </div>
                )}
                {product.specs?.frameMaterial && (
                  <div className="flex items-center gap-2 text-xs text-[#18261F] font-medium">
                    <Check className="w-3.5 h-3.5 text-[#1E6B48] shrink-0" />
                    <span>Monture : {product.specs.frameMaterial}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[#18261F] font-medium">
                  <Check className="w-3.5 h-3.5 text-[#1E6B48] shrink-0" />
                  <span>Livré avec étui de luxe et lingette microfibre</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Order Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/98 backdrop-blur-md border-t border-[#E8E1D7] p-3 sm:p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between sm:hidden px-1">
            <span className="text-xs text-[#4A5850] font-medium">
              Total ({quantity} {quantity > 1 ? 'paires' : 'paire'}) :
            </span>
            <span className="text-base font-bold text-[#C85A17]">
              {formatFCFA(totalPrice)}
            </span>
          </div>

          <button
            id="modal-order-whatsapp-btn"
            onClick={handleWhatsAppOrder}
            className="w-full min-h-[50px] flex items-center justify-center gap-2.5 bg-[#1E6B48] hover:bg-[#185539] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xs active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0" />
            <span>Commander sur WhatsApp ({formatFCFA(totalPrice)})</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-[#4A5850] font-medium px-1">
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>Livraison 24h Abidjan</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E6B48]" />
              <span>Paiement à la réception</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
