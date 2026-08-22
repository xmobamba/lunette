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
import { buildDirectMessageWhatsAppUrl } from '../utils/whatsapp';

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
    id: 'story-chanel',
    title: 'Chanel Masque',
    tag: 'BESTSELLER',
    coverImage: imgChanelShield,
    slides: [
      {
        id: 'chanel-1',
        image: imgChanelShield,
        headline: 'Chanel Masque Shield CC',
        caption: 'La pièce maîtresse de la saison. Monoverre noir enveloppant orné du double C doré signature et son étui matelassé.',
        location: 'Cocody Ambassades, Abidjan',
        productName: 'Chanel Shield CC',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, j’ai vu la story Chanel Shield CC (35 000 FCFA) et je souhaite commander !',
      },
    ],
  },
  {
    id: 'story-bvlgari',
    title: 'Bvlgari Joaillerie',
    tag: 'NOUVEAU',
    coverImage: imgBvlgariAviator,
    slides: [
      {
        id: 'bvlgari-1',
        image: imgBvlgariAviator,
        headline: 'Bvlgari Aviateur Bordeaux & Or',
        caption: 'Double pont en or, verres dégradés bordeaux et motif joaillier Serpenti gravé sur les branches.',
        location: 'Sofitel Ivoire, Abidjan',
        productName: 'Bvlgari Aviateur',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite commander la paire Bvlgari Aviateur Bordeaux vue dans votre story.',
      },
      {
        id: 'bvlgari-2',
        image: imgBvlgariAmber,
        headline: 'Bvlgari Serpenti Dégradé Ambre',
        caption: 'Verres festonnés biseautés et détails Serpenti émaillés aux charnières.',
        location: 'Assinie Beach Club',
        productName: 'Bvlgari Serpenti Ambre',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite commander la Bvlgari Serpenti Ambrée.',
      },
    ],
  },
  {
    id: 'story-miumiu',
    title: 'Miu Miu Ovale',
    tag: 'VIRAL',
    coverImage: imgMiuMiuOval,
    slides: [
      {
        id: 'miumiu-1',
        image: imgMiuMiuOval,
        headline: 'Miu Miu Ovale Couture Noire',
        caption: 'Le phénomène mode ultra viral sur TikTok et Instagram. Livrée avec sa pochette signature rose poudré.',
        location: 'Marcory Zone 4, Abidjan',
        productName: 'Miu Miu Ovale',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je veux commander le modèle viral Miu Miu Ovale Noir (35 000 FCFA).',
      },
    ],
  },
  {
    id: 'story-celine',
    title: 'Céline Triomphe',
    tag: 'PARIS',
    coverImage: imgCelineHavana,
    slides: [
      {
        id: 'celine-1',
        image: imgCelineHavana,
        headline: 'Céline Triomphe Carrée Écaille',
        caption: 'La signature parisienne par excellence. Finition écaille noble et grand blason Triomphe doré.',
        location: 'Deux Plateaux Vallon, Abidjan',
        productName: 'Céline Triomphe Écaille',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite commander la Céline Triomphe Carrée Écaille.',
      },
      {
        id: 'celine-2',
        image: imgCelineOvalTortoise,
        headline: 'Céline Triomphe Ovale Vintage',
        caption: 'Format galbé rétro chic avec écusson doré embossé sur branches larges.',
        location: 'Plateau Prestige, Abidjan',
        productName: 'Céline Ovale Vintage',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour, je souhaite commander la Céline Ovale Vintage à 35 000 FCFA.',
      },
    ],
  },
  {
    id: 'story-cartier',
    title: 'Cartier C-Décor',
    tag: 'PRESTIGE',
    coverImage: imgCartierOval,
    slides: [
      {
        id: 'cartier-1',
        image: imgCartierOval,
        headline: 'Cartier C Décor Ovale Sans Monture',
        caption: 'La quintessence de l’élégance intemporelle. Verres biseautés et charnières C emblématiques dorées.',
        location: 'Cocody Riviera Golf, Abidjan',
        productName: 'Cartier C Décor Prestige',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour L’AURA EYEWEAR, je souhaite commander la Cartier C Décor Ovale (35 000 FCFA).',
      },
    ],
  },
  {
    id: 'story-fred-dior',
    title: 'Fred & Dior CD',
    tag: 'ÉDITION OR',
    coverImage: imgFredGold,
    slides: [
      {
        id: 'fred-1',
        image: imgFredGold,
        headline: 'Fred Force 10 Câble Or Ciselé',
        caption: 'Branches torsadées en câble d’or marin et verres biseautés cristal haute résistance.',
        location: 'Abidjan Yacht Club',
        productName: 'Fred Force 10 Câble Or',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour, je souhaite commander la Fred Force 10 Câble Or (35 000 FCFA).',
      },
      {
        id: 'dior-1',
        image: imgDiorEmerald,
        headline: 'Dior CD Aviateur Émeraude',
        caption: 'Verres vert émeraude pastel haute clarté et branches articulées en maillons de chaîne dorée CD.',
        location: 'Abidjan Mall, Riviera',
        productName: 'Dior CD Émeraude',
        productPrice: '35 000 FCFA',
        whatsappMsg: 'Bonjour, je souhaite commander la Dior CD Aviateur Émeraude.',
      },
    ],
  },
];

interface SocialStoriesProps {
  customPhone?: string;
}

export const SocialStories: React.FC<SocialStoriesProps> = ({ customPhone }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  const currentStory = activeStoryIndex !== null ? STORIES_DATA[activeStoryIndex] : null;
  const currentSlide = currentStory ? currentStory.slides[activeSlideIndex] : null;

  // Auto progression timer for stories (4 seconds per slide)
  useEffect(() => {
    if (activeStoryIndex === null || isPaused || !currentStory) return;

    const intervalTime = 50; // ms
    const totalDuration = 4500; // ms
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide or next story
          if (activeSlideIndex < currentStory.slides.length - 1) {
            setActiveSlideIndex((s) => s + 1);
            return 0;
          } else if (activeStoryIndex < STORIES_DATA.length - 1) {
            setActiveStoryIndex((s) => s + 1);
            setActiveSlideIndex(0);
            return 0;
          } else {
            // Close stories viewer when reaching the very end
            setActiveStoryIndex(null);
            setActiveSlideIndex(0);
            return 0;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIndex, activeSlideIndex, isPaused, currentStory]);

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
      setActiveSlideIndex((s) => s + 1);
      setProgress(0);
    } else if (activeStoryIndex !== null && activeStoryIndex < STORIES_DATA.length - 1) {
      setActiveStoryIndex((s) => s + 1);
      setActiveSlideIndex(0);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (!currentStory) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((s) => s - 1);
      setProgress(0);
    } else if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex((s) => s - 1);
      const prevStoryLength = STORIES_DATA[activeStoryIndex - 1].slides.length;
      setActiveSlideIndex(prevStoryLength - 1);
      setProgress(0);
    }
  };

  const toggleLike = (storyId: string) => {
    setLikedStories((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  return (
    <section className="bg-white border-b border-[#E8E1D7] py-3.5 sm:py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Mini Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85A17] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C85A17]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#18261F]">
              Stories & Nouveautés en Direct
            </span>
          </div>
          <span className="text-[11px] text-[#6E7B74] font-medium hidden sm:inline-block">
            Cliquez pour voir les modèles portés
          </span>
        </div>

        {/* Stories Horizontal Scrolling Tray */}
        <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {STORIES_DATA.map((story, index) => (
            <button
              key={story.id}
              onClick={() => openStory(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden cursor-pointer"
            >
              {/* Gradient Border Ring */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-[#C85A17] via-[#F4A261] to-[#E8C5A8] group-hover:scale-105 transition-all duration-300 shadow-sm">
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover group-hover:brightness-105 transition-all"
                  />
                </div>
              </div>

              {/* Title & Tag */}
              <span className="text-xs font-bold text-[#18261F] text-center max-w-[76px] truncate group-hover:text-[#C85A17] transition-colors">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Story Modal (Instagram-style) */}
      {activeStoryIndex !== null && currentStory && currentSlide && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
          <div
            className="relative w-full h-full sm:h-[88vh] sm:max-w-md bg-[#18261F] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Top Progress Bars */}
            <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
              {currentStory.slides.map((slide, sIdx) => {
                let barWidth = '0%';
                if (sIdx < activeSlideIndex) barWidth = '100%';
                else if (sIdx === activeSlideIndex) barWidth = `${progress}%`;

                return (
                  <div key={slide.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                      style={{ width: barWidth }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Header: User avatar + info + close button */}
            <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-white/80 overflow-hidden">
                  <img
                    src={currentStory.coverImage}
                    alt="L’AURA EYEWEAR"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>lauraeyewear.ci</span>
                    <span className="text-white/60">• il y a 2h</span>
                  </div>
                  <div className="text-[10px] text-white/80 font-medium">
                    {currentSlide.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={closeStory}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white backdrop-blur-xs transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Image Background */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={currentSlide.image}
                alt={currentSlide.headline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />

              {/* Tap Left / Right touch handlers */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                onClick={prevSlide}
                title="Précédent"
              ></div>
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                onClick={nextSlide}
                title="Suivant"
              ></div>
            </div>

            {/* Bottom Content & Interactive CTA Card */}
            <div className="absolute bottom-0 inset-x-0 z-30 p-4 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent text-white pt-16">
              <div className="mb-3">
                <span className="inline-block bg-[#C85A17] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5">
                  {currentStory.tag}
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow-xs">
                  {currentSlide.headline}
                </h3>
                <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed drop-shadow-xs">
                  {currentSlide.caption}
                </p>
              </div>

              {/* Direct WhatsApp Order Button */}
              {currentSlide.whatsappMsg && (
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={buildDirectMessageWhatsAppUrl(currentSlide.whatsappMsg, customPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1E6B48] hover:bg-[#155236] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Commander sur WhatsApp • {currentSlide.productPrice || '35 000 FCFA'}</span>
                  </a>

                  <button
                    onClick={() => toggleLike(currentSlide.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      likedStories[currentSlide.id]
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
                    }`}
                    aria-label="Aimer cette story"
                  >
                    <Heart
                      className={`w-4 h-4 ${likedStories[currentSlide.id] ? 'fill-white' : ''}`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
