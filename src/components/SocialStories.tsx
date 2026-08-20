import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Sparkles, 
  Heart, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Flame, 
  ShoppingBag,
  Share2
} from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

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

const STORIES_DATA: Story[] = [
  {
    id: 'story-trends',
    title: 'Tendances 2026',
    tag: 'NOUVEAU',
    coverImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
    slides: [
      {
        id: 'trend-1',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
        headline: 'Luna Black • L’intemporelle',
        caption: 'La paire la plus demandée sur Instagram cette semaine. Finitions or mat et verres noirs UV400.',
        location: 'Cocody Ambassades, Abidjan',
        productName: 'Luna Black',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, j’ai vu la story Luna Black (35 000 FCFA) et je souhaite commander !',
      },
      {
        id: 'trend-2',
        image: 'https://images.unsplash.com/photo-1509695503492-4122d64f0b2f?auto=format&fit=crop&w=900&q=80',
        headline: 'Riviera Gold • Allure Solaire',
        caption: 'Idéale pour vos déjeuners au Plateau et week-ends à Assinie. Verres polarisés haute clarté.',
        location: 'Assinie Beach Club',
        productName: 'Riviera Gold',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite commander la paire Riviera Gold vue dans votre story.',
      },
    ],
  },
  {
    id: 'story-duo',
    title: 'Pack Duo -10K',
    tag: 'PROMO',
    coverImage: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=300&q=80',
    slides: [
      {
        id: 'duo-1',
        image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80',
        headline: '2 Paires = 60 000 FCFA au lieu de 70 000F',
        caption: 'Offre exclusive Abidjan : composez votre duo préféré avec 2 étuis rigides de luxe offerts.',
        location: 'Boutique Officielle Abidjan',
        productName: 'Pack Duo Prestige',
        productPrice: '60 000 FCFA (-10 000F)',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je veux profiter du Pack Duo 2 paires à 60 000 FCFA.',
      },
    ],
  },
  {
    id: 'story-unboxing',
    title: 'Unboxing Luxe',
    tag: 'ÉCRIN',
    coverImage: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=300&q=80',
    slides: [
      {
        id: 'unbox-1',
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80',
        headline: 'Étui rigide + Lingette offerts',
        caption: 'Chaque commande est préparée avec le plus grand soin dans son packaging prestigieux prêt à offrir.',
        location: 'Marcory Zone 4, Abidjan',
        productName: 'Écrin & Accessoires Inclus',
        productPrice: 'Inclus (0 FCFA)',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite passer commande d’une paire avec son écrin cadeau.',
      },
    ],
  },
  {
    id: 'story-reviews',
    title: 'Avis Clientes',
    tag: '★ 4.9/5',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    slides: [
      {
        id: 'rev-1',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
        headline: '« Reçue en 4h à Cocody Angré ! »',
        caption: '« Les finitions sont impeccables et la monture ne glisse pas du tout. Merci pour la réactivité sur WhatsApp ! » - Sarah K.',
        location: 'Cocody Angré 8e Tranche',
        productName: 'Luna Black',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, pouvez-vous me conseiller sur le modèle Luna Black ?',
      },
      {
        id: 'rev-2',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        headline: '« Qualité incroyable & style chic »',
        caption: '« J’ai pris le pack 2 paires avec ma sœur, on valide totalement ! » - Cynthia & Grace',
        location: 'Deux Plateaux Vallon',
        productName: 'Pack Duo Abidjan',
        productPrice: '60 000 FCFA',
        whatsappMsg: 'Bonjour, je souhaite commander 2 paires comme vu dans les avis de vos clientes.',
      },
    ],
  },
  {
    id: 'story-lookbook',
    title: 'Lookbook Babi',
    tag: 'LOOKS',
    coverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80',
    slides: [
      {
        id: 'look-1',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
        headline: 'Velvet Cat-Eye • Audace Féminine',
        caption: 'Sublimez vos tenues de soirée et vos sorties du weekend avec un regard étiré captivant.',
        location: 'Sofitel Abidjan Hôtel Ivoire',
        productName: 'Velvet Cat-Eye',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite commander le modèle Velvet Cat-Eye (35 000 FCFA).',
      },
    ],
  },
  {
    id: 'story-delivery',
    title: 'Livraison 24h',
    tag: 'EXPRESS',
    coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    slides: [
      {
        id: 'del-1',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        headline: 'Partout à Abidjan sous 24h chrono',
        caption: 'Livraison à domicile ou au bureau. Vous vérifiez le colis avant de régler par Cash, Wave ou Orange Money.',
        location: 'Toutes communes d’Abidjan',
        productName: 'Livraison Sécurisée',
        productPrice: 'Paiement à la livraison',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, comment se passe la livraison à domicile à Abidjan ?',
      },
    ],
  },
];

interface SocialStoriesProps {
  customPhone?: string;
}

export const SocialStories: React.FC<SocialStoriesProps> = ({ customPhone }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewedStories, setViewedStories] = useState<Record<string, boolean>>({});

  const activeStory = activeStoryIndex !== null ? STORIES_DATA[activeStoryIndex] : null;
  const currentSlide = activeStory ? activeStory.slides[activeSlideIndex] : null;

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  // Story progress timer
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = 50;
    const step = (interval / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeStoryIndex, activeSlideIndex, isPaused]);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setActiveSlideIndex(0);
    setProgress(0);
    setViewedStories((prev) => ({ ...prev, [STORIES_DATA[index].id]: true }));
  };

  const handleCloseStory = () => {
    setActiveStoryIndex(null);
    setActiveSlideIndex(0);
    setProgress(0);
  };

  const handleNextSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex < activeStory.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else if (activeStoryIndex < STORIES_DATA.length - 1) {
      // Go to next story
      setActiveStoryIndex((prev) => (prev !== null ? prev + 1 : null));
      setActiveSlideIndex(0);
      setProgress(0);
      setViewedStories((prev) => ({ ...prev, [STORIES_DATA[activeStoryIndex + 1].id]: true }));
    } else {
      handleCloseStory();
    }
  };

  const handlePrevSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
      setProgress(0);
    } else if (activeStoryIndex > 0) {
      // Go to prev story
      const prevStoryIdx = activeStoryIndex - 1;
      setActiveStoryIndex(prevStoryIdx);
      setActiveSlideIndex(STORIES_DATA[prevStoryIdx].slides.length - 1);
      setProgress(0);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] border-b border-[#E8E1D7] py-3 sm:py-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Stories Horizontal Reel */}
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-1">
          {STORIES_DATA.map((story, index) => {
            const isViewed = viewedStories[story.id];
            return (
              <button
                key={story.id}
                onClick={() => handleOpenStory(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer text-left focus:outline-hidden"
              >
                {/* Story Gradient Ring */}
                <div
                  className={`w-15 h-15 sm:w-17 sm:h-17 rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 ${
                    isViewed
                      ? 'bg-stone-300'
                      : 'bg-gradient-to-tr from-[#C85A17] via-[#F4A261] to-[#1E6B48] shadow-sm'
                  }`}
                >
                  <div className="w-full h-full rounded-full p-[2px] bg-[#FAF8F5]">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full rounded-full object-cover group-hover:brightness-105 transition-all"
                    />
                  </div>
                </div>

                {/* Story Title & Badge */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] sm:text-xs font-bold text-[#18261F] tracking-tight truncate max-w-[76px] sm:max-w-[84px] text-center">
                    {story.title}
                  </span>
                  <span className="text-[9px] font-black text-[#C85A17] tracking-wider uppercase">
                    {story.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Instagram / TikTok Style Story Modal */}
      {activeStory && currentSlide && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCloseStory();
            if (e.key === 'ArrowRight') handleNextSlide();
            if (e.key === 'ArrowLeft') handlePrevSlide();
          }}
        >
          {/* Main Story Phone Aspect Container */}
          <div 
            className="relative w-full h-full sm:h-[88vh] sm:max-w-[420px] bg-black sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Story Background Image */}
            <img
              src={currentSlide.image}
              alt={currentSlide.headline}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none"></div>

            {/* Top Bar: Progress Bars & Header */}
            <div className="relative z-20 p-4 pt-3 sm:pt-4">
              {/* Progress Segment Bars */}
              <div className="flex items-center gap-1.5 mb-3">
                {activeStory.slides.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx === activeSlideIndex
                            ? `${progress}%`
                            : idx < activeSlideIndex
                            ? '100%'
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Author & Close button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-white/40 overflow-hidden bg-black/40">
                    <img
                      src={activeStory.coverImage}
                      alt="L'AURA"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">
                        lauraeyewear.ci
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="text-[10px] text-white/75 font-medium">
                      {currentSlide.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCloseStory}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                  aria-label="Fermer la story"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tap Left / Right Zones to Navigate */}
            <div className="absolute inset-y-20 inset-x-0 z-10 grid grid-cols-2">
              <div 
                className="h-full cursor-pointer" 
                onClick={handlePrevSlide} 
                aria-label="Slide précédente" 
              />
              <div 
                className="h-full cursor-pointer" 
                onClick={handleNextSlide} 
                aria-label="Slide suivante" 
              />
            </div>

            {/* Bottom Story Content & Instant WhatsApp Action */}
            <div className="relative z-20 p-4 sm:p-5 flex flex-col gap-3">
              {/* Product Badge Pill */}
              {currentSlide.productName && (
                <div className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#F4A261]" />
                  <span>{currentSlide.productName}</span>
                  {currentSlide.productPrice && (
                    <span className="text-[#F4A261] font-mono">• {currentSlide.productPrice}</span>
                  )}
                </div>
              )}

              {/* Headline & Caption */}
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-tight mb-1 drop-shadow-md">
                  {currentSlide.headline}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed drop-shadow-sm">
                  {currentSlide.caption}
                </p>
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href={`https://wa.me/${customPhone || '2250700000000'}?text=${encodeURIComponent(
                  currentSlide.whatsappMsg || 'Bonjour L’AURA EYEWEAR, je vous contacte depuis votre story Instagram/TikTok !'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1E6B48] hover:bg-[#165236] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl border border-white/20 transition-all hover:scale-102 active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
