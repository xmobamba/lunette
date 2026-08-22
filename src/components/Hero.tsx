import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Instagram, 
  Heart, 
  Flame, 
  ShoppingBag, 
  Camera, 
  Upload, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { getStoredHeroImage, setStoredHeroImage, fileToBase64 } from '../utils/imageUpload';
import { Product } from '../types';

interface HeroProps {
  customPhone?: string;
  products?: Product[];
}

export const Hero: React.FC<HeroProps> = ({ customPhone, products = [] }) => {
  const [liveViewers, setLiveViewers] = useState(19);
  const [customHeroImg, setCustomHeroImg] = useState<string | null>(() => getStoredHeroImage());
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback to first available product with image if no custom hero image
  const productWithImage = products.find((p) => p.images && p.images.length > 0);
  const activeDisplayImage = customHeroImg || (productWithImage ? productWithImage.images[0] : null);

  // Subtle live viewer simulation for social buzz
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 14 && next <= 32 ? next : 21;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file, 1200, 1200, 0.88);
      setCustomHeroImg(base64);
      setStoredHeroImage(base64);
    } catch (err) {
      console.error('Failed to upload hero image:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file, 1200, 1200, 0.88);
      setCustomHeroImg(base64);
      setStoredHeroImage(base64);
    } catch (err) {
      console.error('Failed to drop hero image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveHeroImage = () => {
    setCustomHeroImg(null);
    setStoredHeroImage(null);
  };

  return (
    <section id="top" className="relative min-h-[75vh] lg:min-h-[82vh] bg-gradient-to-b from-[#F7F3EC] via-[#FAF8F5] to-[#F3EFEA] text-[#18261F] flex items-center pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Background Soft Ambient Luxury Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-[#E8C5A8]/25 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#C8DEC5]/25 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Social Commerce Copy & Conversion CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Social Trust Pills Header */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5 sm:mb-4">
              <div
                id="hero-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#E8D4C0] text-[#B85318] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E6B48]" />
                <span>🇨🇮 Collection 2026 • Abidjan</span>
              </div>

              {/* Live social browsing urgency */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8E1D7] text-[#18261F] text-[11px] sm:text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>🔥 {liveViewers} personnes regardent en ce moment</span>
              </div>
            </div>

            {/* Main Headline with High-Fashion Editorial Typography */}
            <h1
              id="hero-title"
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#18261F] leading-[1.14] mb-3.5 sm:mb-5"
            >
              Le style commence <br className="hidden sm:inline" />
              par le <span className="italic font-serif text-[#C85A17] underline decoration-[#1E6B48]/30 decoration-wavy">regard.</span>
            </h1>

            {/* Subtitle with Social Proof Focus */}
            <p
              id="hero-subtitle"
              className="text-[#4A5850] sm:text-lg text-sm max-w-xl leading-relaxed mb-5 sm:mb-6 font-normal"
            >
              La marque de lunettes de soleil la plus plébiscitée à Abidjan sur Instagram & TikTok. Finitions haute couture, verres solaires UV400 et commande directe sur WhatsApp en 1 clic.
            </p>

            {/* Reassurance Tag for Abidjan */}
            <div
              id="hero-reassurance-tag"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-[#E8E1D7] text-xs sm:text-sm text-[#18261F] mb-6 font-medium shadow-2xs backdrop-blur-xs"
            >
              <span className="text-base">🚚</span>
              <span>
                <strong className="text-[#C85A17] font-bold">Livraison express 24h partout à Abidjan</strong> (Cocody, Marcory, Plateau, Riviera, Angré...)
              </span>
            </div>

            {/* Dual CTAs (Social-First Buttons) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8">
              {/* Primary Collection Button */}
              <a
                id="hero-cta-collection"
                href="#collection"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Shopper la collection</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              {/* Secondary WhatsApp CTA */}
              <a
                id="hero-cta-whatsapp"
                href={buildGeneralWhatsAppUrl('general', customPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1E6B48] hover:bg-[#185539] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all border border-white/15 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-[#EAE4DB] w-full text-xs text-[#4A5850]">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500 text-xs">
                  {'★'.repeat(5)}
                </div>
                <span className="font-bold text-[#18261F]">4.9/5</span>
                <span className="text-[#4A5850]">(+1 200 avis vérifiés)</span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-[#18261F]">
                <Instagram className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>@lauraeyewear.ci</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#1E6B48] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Photo Stage & Custom Uploader */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#E8C5A8]/40 via-white/50 to-[#C8DEC5]/40 blur-md pointer-events-none"></div>

              {/* Image / Upload Stage Card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-3xl overflow-hidden border border-[#E8E1D7] shadow-xl bg-white group min-h-[360px] sm:min-h-[480px] flex flex-col items-center justify-center transition-all ${
                  isDragging ? 'bg-[#FAF0E6] border-2 border-dashed border-[#C85A17]' : ''
                }`}
              >
                {activeDisplayImage ? (
                  <>
                    <img
                      src={activeDisplayImage}
                      alt="L'AURA Eyewear - Collection Abidjan"
                      referrerPolicy="no-referrer"
                      className="w-full h-[360px] sm:h-[480px] object-cover object-center transform group-hover:scale-104 transition-all duration-700"
                      loading="eager"
                    />

                    {/* Floating UV400 Badge Top Right */}
                    <div className="absolute top-3 right-3 bg-[#FAF8F5]/95 backdrop-blur-md border border-[#C8DEC5] px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-[#1E6B48] font-bold shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1E6B48]" />
                      <span>100% Protection UV400</span>
                    </div>

                    {/* Badge top left */}
                    <div className="absolute top-3 left-3 bg-[#18261F]/90 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-[#F4A261] font-bold shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Haute Couture</span>
                    </div>

                    {/* Floating Image Actions (Changer / Supprimer) */}
                    <div className="absolute top-12 left-3 flex items-center gap-1.5 z-20">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-full bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1 shadow-md transition-all cursor-pointer"
                        title="Remplacer cette photo d'accueil"
                      >
                        <Camera className="w-3 h-3 text-[#F4A261]" />
                        <span>Changer photo</span>
                      </button>
                      {customHeroImg && (
                        <button
                          onClick={handleRemoveHeroImage}
                          className="p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white shadow-md transition-all cursor-pointer"
                          title="Supprimer la photo personnalisée"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Lookbook Callout */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <a
                        href="#collection"
                        className="inline-flex items-center gap-2 bg-[#18261F]/90 hover:bg-[#18261F] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-white/30 backdrop-blur-md transition-all hover:scale-105"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-ping"></span>
                        <span>Découvrir la collection</span>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#F4A261]" />
                      </a>
                    </div>
                  </>
                ) : (
                  /* Clean interactive upload state when no image */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF0E6]/40 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-[#FAF0E6] border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] mb-4 shadow-sm group-hover:scale-105 transition-transform">
                      {isUploading ? (
                        <div className="w-8 h-8 border-3 border-[#C85A17] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-10 h-10" />
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#18261F] mb-1">
                      Ajoutez votre photo d'en-tête
                    </h3>
                    <p className="text-xs text-[#4A5850] max-w-xs mb-4">
                      Glissez votre photo ici ou cliquez pour choisir une image de lunettes depuis votre appareil.
                    </p>

                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Importer une image</span>
                    </button>
                  </div>
                )}

                {/* Bottom Social Proof User Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#18261F]/90 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl border border-white/15 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#C85A17]/30 border border-[#C85A17] flex items-center justify-center text-[#F4A261] font-bold text-xs">
                      ★
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                        <span>★★★★★</span>
                        <span className="text-white text-[10px] font-semibold">(1 200+ avis vérifiés)</span>
                      </div>
                      <div className="text-[10px] text-white/80 font-medium">
                        Livraison 24h & Paiement à la réception à Abidjan
                      </div>
                    </div>
                  </div>

                  <a
                    href="#collection"
                    className="text-[11px] font-bold text-[#F4A261] hover:underline whitespace-nowrap ml-2"
                  >
                    Voir tout →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
