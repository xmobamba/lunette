import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  ShoppingBag, 
  Share2
} from 'lucide-react';
import { buildDirectMessageWhatsAppUrl, buildProductWhatsAppUrl } from '../utils/whatsapp';
import { Product } from '../types';

export interface Story {
  id: string;
  title: string;
  tag: string;
  coverImage: string;
  slides: {
    id: string;
    image: string;
    headline: string;
    caption: string;
    location: string;
    productName?: string;
    productPrice?: string;
    whatsappMsg?: string;
  }[];
}

interface SocialStoriesProps {
  customPhone?: string;
  products?: Product[];
  onOpenAdmin?: () => void;
}

export const SocialStories: React.FC<SocialStoriesProps> = ({
  customPhone,
  products = [],
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  // Generate stories dynamically from products that have uploaded images
  const productsWithImages = products.filter((p) => p.images && p.images.length > 0);

  const storiesData: Story[] = productsWithImages.map((prod, idx) => ({
    id: `story-${prod.id}`,
    title: prod.name,
    tag: prod.badge || (idx === 0 ? 'BESTSELLER' : 'TENDANCE'),
    coverImage: prod.images[0],
    slides: prod.images.map((img, sIdx) => ({
      id: `${prod.id}-slide-${sIdx}`,
      image: img,
      headline: prod.name,
      caption: `${prod.subtitle || prod.description} • Verres haute protection UV400.`,
      location: 'Abidjan, Côte d’Ivoire',
      productName: prod.name,
      productPrice: `${prod.price.toLocaleString('fr-FR')} FCFA`,
      whatsappMsg: `Bonjour L’AURA EYEWEAR, j’ai vu la story ${prod.name} (${prod.price.toLocaleString('fr-FR')} FCFA) et je souhaite commander !`,
    })),
  }));

  const currentStory = activeStoryIndex !== null ? storiesData[activeStoryIndex] : null;
  const currentSlide = currentStory ? currentStory.slides[activeSlideIndex] : null;

  // Auto progression timer for stories (4.5 seconds per slide)
  useEffect(() => {
    if (activeStoryIndex === null || isPaused || !currentStory) return;

    const intervalTime = 50; // ms
    const totalDuration = 4500; // ms
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeSlideIndex < currentStory.slides.length - 1) {
            setActiveSlideIndex((s) => s + 1);
            return 0;
          } else if (activeStoryIndex < storiesData.length - 1) {
            setActiveStoryIndex((s) => s + 1);
            setActiveSlideIndex(0);
            return 0;
          } else {
            setActiveStoryIndex(null);
            setActiveSlideIndex(0);
            return 0;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIndex, activeSlideIndex, isPaused, currentStory, storiesData.length]);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setActiveSlideIndex(0);
    setProgress(0);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setActiveSlideIndex(0);
    setProgress(0);
  };

  const nextSlide = () => {
    if (!currentStory) return;
    if (activeSlideIndex < currentStory.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else if (activeStoryIndex !== null && activeStoryIndex < storiesData.length - 1) {
      setActiveStoryIndex((prev) => (prev !== null ? prev + 1 : 0));
      setActiveSlideIndex(0);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (!currentStory) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
      setProgress(0);
    } else if (activeStoryIndex !== null && activeStoryIndex > 0) {
      const prevStoryIdx = activeStoryIndex - 1;
      setActiveStoryIndex(prevStoryIdx);
      setActiveSlideIndex(storiesData[prevStoryIdx].slides.length - 1);
      setProgress(0);
    }
  };

  const toggleLike = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    setLikedStories((prev) => ({ ...prev, [storyId]: !prev[storyId] }));
  };

  return (
    <section id="stories" className="py-6 sm:py-8 bg-[#FAF8F5] border-b border-[#EAE4DB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Mini Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85A17] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C85A17]"></span>
            </span>
            <h2 className="font-serif text-sm sm:text-base font-bold text-[#18261F]">
              Stories & Lookbook Abidjan
            </h2>
            <span className="text-[10px] text-[#B85318] bg-[#FAF0E6] border border-[#E8D4C0] px-2 py-0.5 rounded-full font-bold uppercase">
              24H
            </span>
          </div>

          <span className="text-[11px] text-[#4A5850] font-medium hidden sm:inline">
            Cliquez pour voir les modèles portés
          </span>
        </div>

        {/* Stories Horizontal Carousel */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {storiesData.length > 0 ? (
            storiesData.map((story, index) => (
              <button
                key={story.id}
                onClick={() => openStory(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-hidden"
              >
                {/* Gradient Border Circle Avatar */}
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#C85A17] via-[#F4A261] to-[#1E6B48] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#FAF8F5] bg-[#FAF8F5]">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Micro Tag Badge */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#18261F] text-[#F4A261] text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap border border-white/20">
                    {story.tag}
                  </span>
                </div>

                {/* Story Label */}
                <span className="text-[11px] sm:text-xs font-bold text-[#18261F] group-hover:text-[#C85A17] transition-colors truncate max-w-[76px] sm:max-w-[84px] text-center mt-1">
                  {story.title}
                </span>
              </button>
            ))
          ) : (
            <div className="flex items-center gap-3 py-2 text-xs text-[#4A5850]">
              <span>Importez vos premières photos de lunettes pour créer vos Stories Lookbook interactives.</span>
            </div>
          )}

        </div>

      </div>

      {/* FULLSCREEN STORIES MODAL VIEWER */}
      {activeStoryIndex !== null && currentStory && currentSlide && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
          onClick={closeStory}
        >
          <div 
            className="relative w-full h-full sm:h-[90vh] sm:max-w-md sm:rounded-3xl overflow-hidden bg-[#111] shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Multi-segment Progress Bars */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {currentStory.slides.map((slide, idx) => (
                <div key={slide.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{
                      width:
                        idx < activeSlideIndex
                          ? '100%'
                          : idx === activeSlideIndex
                          ? `${progress}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header: Brand Profile, Location, Close Button */}
            <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40">
                  <img src={currentStory.coverImage} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">L'AURA EYEWEAR</span>
                    <span className="text-[10px] bg-[#C85A17] px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                      {currentStory.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/70 flex items-center gap-1">
                    <span>📍</span> {currentSlide.location}
                  </span>
                </div>
              </div>

              <button
                onClick={closeStory}
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Visual & Navigation Tap Zones */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
              <img
                src={currentSlide.image}
                alt={currentSlide.headline}
                className="w-full h-full object-cover select-none"
              />

              {/* Left Tap Zone (Prev) */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                onClick={prevSlide}
              />

              {/* Right Tap Zone (Next) */}
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                onClick={nextSlide}
              />
            </div>

            {/* Bottom Content Card & Direct WhatsApp Buy CTA */}
            <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white pt-10">
              
              {/* Product details & price pill */}
              <div className="flex items-end justify-between gap-2 mb-2.5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {currentSlide.headline}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                    {currentSlide.caption}
                  </p>
                </div>

                {currentSlide.productPrice && (
                  <span className="px-3 py-1 rounded-full bg-[#C85A17] text-white font-bold text-xs whitespace-nowrap shadow-md">
                    {currentSlide.productPrice}
                  </span>
                )}
              </div>

              {/* Action Bar: WhatsApp Button + Like */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                <a
                  href={buildDirectMessageWhatsAppUrl(
                    currentSlide.whatsappMsg || `Bonjour L'AURA Eyewear, je souhaite commander ${currentSlide.headline}`,
                    customPhone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#1E6B48] hover:bg-[#165236] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Commander ce modèle en 1 clic</span>
                </a>

                <button
                  onClick={(e) => toggleLike(e, currentSlide.id)}
                  className={`p-3 rounded-2xl border border-white/20 backdrop-blur-md transition-all cursor-pointer ${
                    likedStories[currentSlide.id] ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedStories[currentSlide.id] ? 'fill-white' : ''}`} />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};
