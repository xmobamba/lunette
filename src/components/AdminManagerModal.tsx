import React, { useState } from 'react';
import {
  X,
  Phone,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  ShoppingBag,
  Info,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Gift,
  Flame,
  Clock,
  Eye,
  Megaphone,
  Palette,
  MessageCircle,
  Copy,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Product, StoreConfig, PromoBannerItem, BannerTheme } from '../types';
import { STORE_CONFIG } from '../config/store';
import { PRODUCTS } from '../data/products';
import { DEFAULT_PROMOS, THEME_STYLES } from '../data/promos';
import { formatFCFA } from '../utils/whatsapp';

import imgChanelShield from '../assets/images/chanel_shield_black_1787218034317.jpg';
import imgCartierOval from '../assets/images/cartier_cdecor_oval_1787218049335.jpg';
import imgCelineHavana from '../assets/images/celine_triomphe_havana_1787218062413.jpg';
import imgCelineBlack from '../assets/images/celine_triomphe_black_1787218159931.jpg';
import imgBvlgariAmber from '../assets/images/bvlgari_serpenti_amber_1787218074048.jpg';
import imgBvlgariRimless from '../assets/images/bvlgari_rimless_black_1787218174732.jpg';
import imgDiorEmerald from '../assets/images/dior_cd_emerald_1787218090618.jpg';
import imgLvPilot from '../assets/images/lv_pilot_cream_1787218102121.jpg';
import imgMiuMiuOval from '../assets/images/miumiu_oval_black_1787218119854.jpg';
import imgFredCable from '../assets/images/fred_cable_gold_1787218135047.jpg';

interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
  promos?: PromoBannerItem[];
  onUpdatePromos?: (newPromos: PromoBannerItem[]) => void;
}

// Preset luxury sunglasses images for quick selection without searching URLs
const PRESET_IMAGES = [
  { label: 'Chanel Masque Shield CC (Noir & Or)', url: imgChanelShield },
  { label: 'Cartier C Décor Ovale (Sans monture)', url: imgCartierOval },
  { label: 'Céline Triomphe (Carrée Écaille)', url: imgCelineHavana },
  { label: 'Céline Triomphe (Carrée Noire)', url: imgCelineBlack },
  { label: 'Bvlgari Serpenti (Aviateur Ambre)', url: imgBvlgariAmber },
  { label: 'Bvlgari Serpenti (Sans Monture Noire)', url: imgBvlgariRimless },
  { label: 'Dior CD Chain (Aviateur Émeraude)', url: imgDiorEmerald },
  { label: 'Louis Vuitton Pilot (Nude & Gold)', url: imgLvPilot },
  { label: 'Miu Miu Ovale Couture (Noire & Or)', url: imgMiuMiuOval },
  { label: 'Fred Force 10 (Câble Or)', url: imgFredCable },
];

export const AdminManagerModal: React.FC<AdminManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  storeConfig,
  onUpdateStoreConfig,
  promos = DEFAULT_PROMOS,
  onUpdatePromos,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'store' | 'add_product' | 'promos'>('promos');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 35000,
    oldPrice: 45000,
    subtitle: 'Protection UV400 • Style chic Abidjan',
    description: 'Modèle de lunettes de soleil tendance sélectionné pour sublimer votre regard avec confort et élégance.',
    category: ['femme', 'tendance'],
    badge: 'Nouveau',
    available: true,
    rating: 5.0,
    reviewCount: 12,
    images: [PRESET_IMAGES[0].url],
    colors: [
      { name: 'Noir & Or', hex: '#0B0B0B' },
      { name: 'Doré Ambre', hex: '#C6A15B' },
    ],
    specs: {
      uvProtection: 'UV400 Catégorie 3 (100% UVA/UVB)',
      frameMaterial: 'Acétate poli & structure haute résistance',
      lensType: 'Verres haute définition anti-reflet',
      fit: 'Taille standard universelle',
    },
  });

  // Store Settings Form State
  const [localConfig, setLocalConfig] = useState<StoreConfig>({ ...storeConfig });

  // Promotional Banner Form & Edit State
  const [editingPromo, setEditingPromo] = useState<PromoBannerItem | null>(null);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<PromoBannerItem>>({
    title: '2 paires achetées = Livraison offerte partout à Abidjan !',
    badge: 'OFFRE SPÉCIALE ABIDJAN',
    description: 'Faites-vous plaisir ou offrez une paire à un proche. Commandez dès maintenant pour bénéficier de la livraison gratuite express.',
    subtext: '*Valable sur toutes les communes d’Abidjan : Cocody, Marcory, Plateau, Yopougon...',
    ctaText: 'J’en profite sur WhatsApp',
    whatsappMessage: 'Bonjour L’AURA EYEWEAR, je souhaite profiter de votre promotion spéciale !',
    theme: 'orange',
    discountTag: 'LIVRAISON 0 FCFA',
    countdownText: 'Offre limitée cette semaine',
    image: PRESET_IMAGES[0].url,
    isActive: true,
    position: 'both',
  });

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // ================= PROMOTIONAL BANNERS HANDLERS =================
  const handleTogglePromoStatus = (promoId: string) => {
    if (!onUpdatePromos) return;
    const updated = promos.map((p) => (p.id === promoId ? { ...p, isActive: !p.isActive } : p));
    onUpdatePromos(updated);
    const target = updated.find((p) => p.id === promoId);
    showToast(target?.isActive ? `Bannière "${target.badge}" activée !` : `Bannière "${target?.badge}" mise en pause.`);
  };

  const handleDeletePromo = (promoId: string, badge: string) => {
    if (!onUpdatePromos) return;
    if (window.confirm(`Voulez-vous vraiment supprimer la bannière promotionnelle "${badge}" ?`)) {
      const updated = promos.filter((p) => p.id !== promoId);
      onUpdatePromos(updated);
      showToast(`Bannière "${badge}" supprimée.`);
    }
  };

  const handleSavePromoEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo || !onUpdatePromos) return;

    const updated = promos.map((p) => (p.id === editingPromo.id ? editingPromo : p));
    onUpdatePromos(updated);
    setEditingPromo(null);
    showToast(`Bannière "${editingPromo.badge}" mise à jour avec succès !`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdatePromos) return;

    if (!newPromo.title || !newPromo.badge) {
      alert('Veuillez remplir au moins le titre et le badge de la promotion.');
      return;
    }

    const createdPromo: PromoBannerItem = {
      id: `promo-${Date.now()}`,
      badge: newPromo.badge || 'PROMO EXCLUSIVE',
      title: newPromo.title,
      description: newPromo.description || 'Offre spéciale sur la collection de lunettes L’AURA Eyewear.',
      subtext: newPromo.subtext,
      ctaText: newPromo.ctaText || 'J’en profite sur WhatsApp',
      whatsappMessage: newPromo.whatsappMessage || `Bonjour, je souhaite profiter de l’offre : ${newPromo.title}`,
      theme: (newPromo.theme as BannerTheme) || 'orange',
      discountTag: newPromo.discountTag,
      countdownText: newPromo.countdownText,
      image: newPromo.image,
      isActive: newPromo.isActive !== undefined ? newPromo.isActive : true,
      position: newPromo.position || 'both',
    };

    const updated = [createdPromo, ...promos];
    onUpdatePromos(updated);
    setIsCreatingPromo(false);

    // Reset new promo form
    setNewPromo({
      title: '',
      badge: 'OFFRE FLASH',
      description: 'Profitez d’une remise exclusive dès aujourd’hui sur vos paires de lunettes préférées.',
      subtext: '*Dans la limite des stocks disponibles à Abidjan.',
      ctaText: 'Commander sur WhatsApp',
      whatsappMessage: 'Bonjour, je souhaite profiter de l’offre flash !',
      theme: 'orange',
      discountTag: '-20%',
      countdownText: 'Offre 48h',
      image: PRESET_IMAGES[0].url,
      isActive: true,
      position: 'both',
    });

    showToast(`Nouvelle bannière "${createdPromo.badge}" créée et publiée !`);
  };

  // Quick Preset Banner Generator
  const handleApplyPresetPromo = (presetType: 'livraison' | 'discount' | 'duo' | 'etui') => {
    let preset: Partial<PromoBannerItem> = {};

    if (presetType === 'livraison') {
      preset = {
        badge: 'OFFRE SPÉCIALE ABIDJAN',
        title: '2 paires achetées = Livraison offerte partout à Abidjan !',
        description: 'Commandez 2 paires pour vous ou vos proches et bénéficiez de la livraison express gratuite à domicile.',
        subtext: '*Valable à Cocody, Marcory, Plateau, Riviera, Yopougon, Angré...',
        ctaText: 'J’en profite sur WhatsApp',
        whatsappMessage: 'Bonjour L’AURA EYEWEAR, je souhaite profiter de l’offre 2 paires achetées = livraison offerte à Abidjan !',
        theme: 'orange',
        discountTag: 'LIVRAISON 0 FCFA',
        countdownText: 'Offre cette semaine',
        image: PRESET_IMAGES[0].url,
        isActive: true,
        position: 'both',
      };
    } else if (presetType === 'discount') {
      preset = {
        badge: 'VENTE FLASH DU MOIS',
        title: 'Bénéficiez de -20% sur la 2ème paire de lunettes commandée',
        description: 'Sublimez vos tenues avec deux styles complémentaires haute couture à prix irrésistible.',
        subtext: '*Remise appliquée immédiatement lors de la confirmation WhatsApp.',
        ctaText: 'Activer mes -20% sur WhatsApp',
        whatsappMessage: 'Bonjour, je souhaite profiter des -20% sur ma deuxième paire de lunettes !',
        theme: 'green',
        discountTag: '-20% IMMÉDIAT',
        countdownText: 'Durée limitée',
        image: PRESET_IMAGES[1].url,
        isActive: true,
        position: 'both',
      };
    } else if (presetType === 'duo') {
      preset = {
        badge: 'PACK DUO PRESTIGE',
        title: 'Le Coffret 2 Paires à 60 000 FCFA au lieu de 70 000 FCFA',
        description: 'Économisez 10 000 FCFA en sélectionnant 2 modèles de prestige avec 2 étuis rigides inclus.',
        subtext: '*Stocks limités à Abidjan.',
        ctaText: 'Commander le Pack Duo (-10 000 FCFA)',
        whatsappMessage: 'Bonjour, je souhaite commander le Pack Duo 2 paires à 60 000 FCFA.',
        theme: 'gold',
        discountTag: '-10 000 FCFA',
        countdownText: 'Best-seller',
        image: PRESET_IMAGES[2].url,
        isActive: true,
        position: 'both',
      };
    } else if (presetType === 'etui') {
      preset = {
        badge: 'CADEAU VIP EXCLUSIF',
        title: 'Étui de protection cuir haute couture + lingette offerts',
        description: 'Chaque paire commandée est livrée dans son coffret et étui de protection haute qualité.',
        subtext: '*Inclus gratuitement dans votre colis.',
        ctaText: 'Commander avec Étui Offert',
        whatsappMessage: 'Bonjour, je souhaite commander des lunettes avec étui de luxe offert.',
        theme: 'dark',
        discountTag: 'CADEAU OFFERT',
        countdownText: '100% Qualité',
        image: PRESET_IMAGES[0].url,
        isActive: true,
        position: 'main',
      };
    }

    setNewPromo({ ...newPromo, ...preset });
    setIsCreatingPromo(true);
    showToast(`Modèle "${preset.badge}" chargé dans le formulaire !`);
  };

  // ================= STORE SETTINGS HANDLERS =================
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(localConfig);
    showToast('Coordonnées de la boutique enregistrées avec succès !');
  };

  // ================= PRODUCTS HANDLERS =================
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    onUpdateProducts(updated);
    setEditingProduct(null);
    showToast(`Le modèle "${editingProduct.name}" a été mis à jour !`);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le modèle "${productName}" ?`)) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      showToast(`Le modèle "${productName}" a été supprimé.`);
    }
  };

  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, available: !p.available } : p
    );
    onUpdateProducts(updated);
    const target = updated.find((p) => p.id === productId);
    showToast(target?.available ? `"${target.name}" est remis En Stock.` : `"${target?.name}" est marqué Épuisé.`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Veuillez entrer au moins un nom et un prix.');
      return;
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: (newProduct.category as any) || ['femme', 'tendance'],
      subtitle: newProduct.subtitle || 'Modèle tendance Abidjan',
      description: newProduct.description || 'Lunettes de soleil haute qualité UV400.',
      longDescription: newProduct.description,
      price: Number(newProduct.price) || 35000,
      oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
      images: newProduct.images && newProduct.images.length > 0 ? newProduct.images : [PRESET_IMAGES[0].url],
      colors: newProduct.colors && newProduct.colors.length > 0 ? newProduct.colors : [{ name: 'Noir & Or', hex: '#000000' }],
      badge: newProduct.badge,
      featured: true,
      bestseller: newProduct.badge === 'Bestseller',
      available: newProduct.available !== undefined ? newProduct.available : true,
      rating: 5.0,
      reviewCount: 15,
      specs: {
        uvProtection: newProduct.specs?.uvProtection || 'Protection UV400 Catégorie 3',
        frameMaterial: newProduct.specs?.frameMaterial || 'Acétate & alliage inoxydable de luxe',
        lensType: newProduct.specs?.lensType || 'Verres haute définition traités anti-reflet',
        fit: newProduct.specs?.fit || 'Coupe universelle confortable',
      },
    };

    const updated = [created, ...products];
    onUpdateProducts(updated);
    setActiveTab('products');
    showToast(`La paire "${created.name}" a été ajoutée au catalogue !`);

    // Reset new product form
    setNewProduct({
      name: '',
      price: 35000,
      oldPrice: 45000,
      subtitle: 'Protection UV400 • Style chic Abidjan',
      description: 'Lunettes de soleil élégantes pour illuminer votre regard.',
      category: ['femme', 'tendance'],
      badge: 'Nouveau',
      available: true,
      images: [PRESET_IMAGES[0].url],
      colors: [{ name: 'Noir & Or', hex: '#0B0B0B' }],
    });
  };

  // Reset to original default data
  const handleResetDefaults = () => {
    if (window.confirm('Voulez-vous rétablir le catalogue, les bannières et la configuration d’origine ?')) {
      onUpdateProducts(PRODUCTS);
      onUpdateStoreConfig(STORE_CONFIG);
      if (onUpdatePromos) onUpdatePromos(DEFAULT_PROMOS);
      setLocalConfig({ ...STORE_CONFIG });
      showToast('Données réinitialisées aux valeurs d’origine.');
    }
  };

  const activePromosCount = promos.filter((p) => p.isActive).length;

  return (
    <div
      id="admin-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#004D25]/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="admin-manager-container"
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-orange-200 overflow-hidden flex flex-col text-[#004D25]"
      >
        {/* Header Bar */}
        <div className="bg-[#004D25] text-white p-4 sm:p-5 flex items-center justify-between border-b-4 border-[#FF6E14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6E14] text-white flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-black text-white">
                  Gestion de la Boutique L’AURA
                </h2>
                <span className="text-[10px] bg-[#FF6E14] text-white font-black px-2 py-0.5 rounded-full uppercase">
                  🇨🇮 Admin
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Gérez vos bannières de promotion, votre catalogue de lunettes, prix et numéro WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-[#FF6E14] text-white transition-colors cursor-pointer"
            aria-label="Fermer le panneau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-orange-50/90 border-b border-orange-200 px-3 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Tab 1: Bannières & Promos (Requested by user) */}
          <button
            onClick={() => {
              setActiveTab('promos');
              setEditingProduct(null);
              setEditingPromo(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'promos'
                ? 'bg-[#FF6E14] text-white shadow-md ring-2 ring-orange-300'
                : 'bg-white text-[#004D25] hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-300" />
            <span>Bannières & Promos ({activePromosCount} active{activePromosCount > 1 ? 's' : ''})</span>
          </button>

          {/* Tab 2: Catalogue Lunettes */}
          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
              setEditingPromo(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#004D25] text-white shadow-md'
                : 'bg-white text-[#004D25] hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Catalogue ({products.length})</span>
          </button>

          {/* Tab 3: Ajouter une paire */}
          <button
            onClick={() => {
              setActiveTab('add_product');
              setEditingProduct(null);
              setEditingPromo(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add_product'
                ? 'bg-[#009E60] text-white shadow-md'
                : 'bg-white text-[#004D25] hover:bg-green-50 border border-orange-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Ajouter une paire</span>
          </button>

          {/* Tab 4: Numéro WhatsApp & Boutique */}
          <button
            onClick={() => {
              setActiveTab('store');
              setEditingProduct(null);
              setEditingPromo(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-[#FF6E14] text-white shadow-md'
                : 'bg-white text-[#004D25] hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp & Infos</span>
          </button>
        </div>

        {/* Global Toast / Feedback */}
        {feedbackMsg && (
          <div className="bg-emerald-600 text-white text-xs font-black px-4 py-2 flex items-center justify-between shadow-inner animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white space-y-6">
          {/* ================= TAB: BANNIÈRES & PROMOTIONS ================= */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              {/* If editing an existing promo */}
              {editingPromo ? (
                <form onSubmit={handleSavePromoEdit} className="space-y-4 bg-orange-50/50 p-5 rounded-2xl border-2 border-[#FF6E14]">
                  <div className="flex items-center justify-between pb-3 border-b border-orange-200">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-[#FF6E14]" />
                      <h3 className="font-serif text-lg font-black text-[#004D25]">
                        Modifier la bannière : {editingPromo.badge}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPromo(null)}
                      className="text-xs font-bold text-gray-500 hover:text-red-500 underline"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Badge d'accroche (Ex: OFFRE SPÉCIALE ABIDJAN, VENTE FLASH) *
                      </label>
                      <input
                        type="text"
                        value={editingPromo.badge}
                        onChange={(e) => setEditingPromo({ ...editingPromo, badge: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Pastille de réduction (Ex: LIVRAISON 0 FCFA, -20%, ÉTUI OFFERT)
                      </label>
                      <input
                        type="text"
                        value={editingPromo.discountTag || ''}
                        onChange={(e) => setEditingPromo({ ...editingPromo, discountTag: e.target.value })}
                        placeholder="Ex: LIVRAISON 0 FCFA"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#FF6E14]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Titre principal de la promotion *
                      </label>
                      <input
                        type="text"
                        value={editingPromo.title}
                        onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#004D25]"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Description / Texte explicatif
                      </label>
                      <textarea
                        rows={2}
                        value={editingPromo.description}
                        onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Conditions / Petits caractères (Ex: *À Abidjan)
                      </label>
                      <input
                        type="text"
                        value={editingPromo.subtext || ''}
                        onChange={(e) => setEditingPromo({ ...editingPromo, subtext: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Mention d'urgence / Compte à rebours
                      </label>
                      <input
                        type="text"
                        value={editingPromo.countdownText || ''}
                        onChange={(e) => setEditingPromo({ ...editingPromo, countdownText: e.target.value })}
                        placeholder="Ex: Valable cette semaine"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Thème visuel & Couleurs
                      </label>
                      <select
                        value={editingPromo.theme}
                        onChange={(e) => setEditingPromo({ ...editingPromo, theme: e.target.value as BannerTheme })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold"
                      >
                        {Object.entries(THEME_STYLES).map(([key, style]) => (
                          <option key={key} value={key}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Texte du bouton WhatsApp
                      </label>
                      <input
                        type="text"
                        value={editingPromo.ctaText}
                        onChange={(e) => setEditingPromo({ ...editingPromo, ctaText: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Message WhatsApp pré-rempli envoyé par le client
                      </label>
                      <textarea
                        rows={2}
                        value={editingPromo.whatsappMessage || ''}
                        onChange={(e) => setEditingPromo({ ...editingPromo, whatsappMessage: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-mono text-xs"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-black text-[#004D25]">
                        <input
                          type="checkbox"
                          checked={editingPromo.isActive}
                          onChange={(e) => setEditingPromo({ ...editingPromo, isActive: e.target.checked })}
                          className="w-4 h-4 text-[#FF6E14] rounded"
                        />
                        <span>Bannière active et visible sur le site</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingPromo(null)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-black text-white bg-[#009E60] hover:bg-[#00804e] rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Enregistrer les modifications</span>
                    </button>
                  </div>
                </form>
              ) : isCreatingPromo ? (
                /* Form to create a brand new banner */
                <form onSubmit={handleCreatePromo} className="space-y-4 bg-orange-50/70 p-5 rounded-2xl border-2 border-[#FF6E14]">
                  <div className="flex items-center justify-between pb-3 border-b border-orange-200">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#FF6E14]" />
                      <h3 className="font-serif text-lg font-black text-[#004D25]">
                        Créer une nouvelle bannière promotionnelle
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreatingPromo(false)}
                      className="text-xs font-bold text-gray-500 hover:text-red-500 underline cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>

                  {/* Fast Preset Templates Bar */}
                  <div className="bg-white p-3 rounded-xl border border-orange-200">
                    <span className="text-[11px] font-black uppercase text-[#FF6E14] tracking-wider block mb-2">
                      ⚡ Remplir en 1 clic avec un modèle prédéfini :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPresetPromo('livraison')}
                        className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-[#FF6E14] text-xs font-bold transition-all"
                      >
                        🚚 2 paires = Livraison Offerte
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPresetPromo('discount')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[#009E60] text-xs font-bold transition-all"
                      >
                        🔥 -20% sur la 2ème paire
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPresetPromo('duo')}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all"
                      >
                        ✨ Pack Duo 60 000 FCFA
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPresetPromo('etui')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all"
                      >
                        🎁 Étui Cuir + Lingette Offerts
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Badge d'accroche (Ex: OFFRE SPÉCIALE ABIDJAN, VENTE FLASH) *
                      </label>
                      <input
                        type="text"
                        value={newPromo.badge || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, badge: e.target.value })}
                        placeholder="Ex: OFFRE SPÉCIALE ABIDJAN"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Pastille de réduction (Ex: LIVRAISON 0 FCFA, -20%, ÉTUI OFFERT)
                      </label>
                      <input
                        type="text"
                        value={newPromo.discountTag || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, discountTag: e.target.value })}
                        placeholder="Ex: LIVRAISON 0 FCFA"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#FF6E14]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Titre principal de la promotion *
                      </label>
                      <input
                        type="text"
                        value={newPromo.title || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                        placeholder="Ex: 2 paires achetées = Livraison offerte partout à Abidjan !"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#004D25]"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Description / Texte explicatif
                      </label>
                      <textarea
                        rows={2}
                        value={newPromo.description || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                        placeholder="Expliquez les détails de l'offre pour vos clients..."
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Conditions (Petits caractères)
                      </label>
                      <input
                        type="text"
                        value={newPromo.subtext || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, subtext: e.target.value })}
                        placeholder="*Selon zone de livraison à Abidjan"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Mention d'urgence / Compte à rebours
                      </label>
                      <input
                        type="text"
                        value={newPromo.countdownText || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, countdownText: e.target.value })}
                        placeholder="Ex: Offre valable cette semaine"
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Thème visuel & Couleurs
                      </label>
                      <select
                        value={newPromo.theme || 'orange'}
                        onChange={(e) => setNewPromo({ ...newPromo, theme: e.target.value as BannerTheme })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold"
                      >
                        {Object.entries(THEME_STYLES).map(([key, style]) => (
                          <option key={key} value={key}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Texte du bouton d'action
                      </label>
                      <input
                        type="text"
                        value={newPromo.ctaText || 'J’en profite sur WhatsApp'}
                        onChange={(e) => setNewPromo({ ...newPromo, ctaText: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Message WhatsApp pré-rempli envoyé par le client
                      </label>
                      <textarea
                        rows={2}
                        value={newPromo.whatsappMessage || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, whatsappMessage: e.target.value })}
                        placeholder="Bonjour L'AURA Eyewear, je souhaite profiter de la promotion..."
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-mono text-xs"
                      />
                    </div>

                    {/* Image Selector */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Image de mise en valeur (Optionnel)
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {PRESET_IMAGES.slice(0, 5).map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewPromo({ ...newPromo, image: preset.url })}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                              newPromo.image === preset.url
                                ? 'border-[#FF6E14] ring-2 ring-orange-300 scale-105'
                                : 'border-gray-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-black text-[#004D25]">
                        <input
                          type="checkbox"
                          checked={newPromo.isActive}
                          onChange={(e) => setNewPromo({ ...newPromo, isActive: e.target.checked })}
                          className="w-4 h-4 text-[#FF6E14] rounded"
                        />
                        <span>Activer et afficher cette bannière immédiatement sur le site</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPromo(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-black text-white bg-[#FF6E14] hover:bg-[#E05300] rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter et Publier la Bannière</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Top actions bar when not in form mode */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-orange-50/60 p-4 rounded-2xl border border-orange-200">
                  <div>
                    <h3 className="font-serif text-base font-black text-[#004D25]">
                      Vos Bannières & Offres Promotionnelles
                    </h3>
                    <p className="text-xs text-[#004D25]/80 font-medium">
                      Activez, modifiez ou ajoutez des offres spéciales pour booster vos commandes WhatsApp.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreatingPromo(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6E14] hover:bg-[#E05300] text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Ajouter une bannière</span>
                  </button>
                </div>
              )}

              {/* List of existing promo banners */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-black text-[#004D25] uppercase tracking-wider">
                  <span>Bannières enregistrées ({promos.length})</span>
                  <span className="text-gray-500 font-medium">
                    {activePromosCount} active{activePromosCount > 1 ? 's' : ''} sur le site
                  </span>
                </div>

                {promos.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-orange-200 rounded-2xl">
                    <Megaphone className="w-10 h-10 text-orange-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#004D25]">Aucune bannière promotionnelle</p>
                    <p className="text-xs text-gray-500 mt-1">Créez votre première offre pour attirer vos clients !</p>
                    <button
                      onClick={() => setIsCreatingPromo(true)}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#FF6E14] text-white font-bold text-xs"
                    >
                      + Créer une bannière
                    </button>
                  </div>
                ) : (
                  promos.map((promo) => {
                    const theme = THEME_STYLES[promo.theme] || THEME_STYLES.orange;
                    return (
                      <div
                        key={promo.id}
                        className={`rounded-2xl border-2 transition-all p-4 relative ${
                          promo.isActive
                            ? 'border-[#FF6E14] bg-white shadow-md'
                            : 'border-gray-200 bg-gray-50/80 opacity-70'
                        }`}
                      >
                        {/* Live Mini Preview Ribbon */}
                        <div
                          className={`bg-gradient-to-r ${theme.bgGradient} text-white p-3.5 rounded-xl mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner`}
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${theme.badgeBg}`}>
                                {promo.badge}
                              </span>
                              {promo.discountTag && (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${theme.tagBg}`}>
                                  {promo.discountTag}
                                </span>
                              )}
                              {promo.countdownText && (
                                <span className="text-[10px] text-white/90 bg-black/30 px-2 py-0.5 rounded font-semibold">
                                  ⏱ {promo.countdownText}
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-black text-sm text-white">{promo.title}</h4>
                            <p className="text-xs text-white/90 mt-0.5 line-clamp-1">{promo.description}</p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-black ${theme.btnBg} shadow-xs`}>
                              💬 {promo.ctaText}
                            </span>
                          </div>
                        </div>

                        {/* Banner Management Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100 text-xs">
                          {/* Active Switch */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleTogglePromoStatus(promo.id)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs cursor-pointer transition-all ${
                                promo.isActive
                                  ? 'bg-emerald-100 text-[#009E60] hover:bg-emerald-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {promo.isActive ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Active sur le site</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-3.5 h-3.5" />
                                  <span>En pause</span>
                                </>
                              )}
                            </button>

                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-medium">Thème : {theme.name}</span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPromo(promo);
                                setIsCreatingPromo(false);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF6E14] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Modifier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePromo(promo.id, promo.badge)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Supprimer la bannière"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: PRODUCTS LIST & EDIT ================= */}
          {activeTab === 'products' && (
            <div>
              {/* If currently editing a single product */}
              {editingProduct ? (
                <form onSubmit={handleSaveProductEdit} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-orange-200">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-[#FF6E14]" />
                      <h3 className="font-serif text-lg font-black text-[#004D25]">
                        Modifier : {editingProduct.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-bold text-gray-500 hover:text-red-500 underline"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Nom du modèle de lunettes *
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Sous-titre / Caractéristique clé *
                      </label>
                      <input
                        type="text"
                        value={editingProduct.subtitle}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Prix actuel (FCFA) *
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#FF6E14]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Ancien prix barré (FCFA)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.oldPrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            oldPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Description courte
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Badge promotionnel
                      </label>
                      <select
                        value={editingProduct.badge || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            badge: (e.target.value as any) || undefined,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14]"
                      >
                        <option value="">Aucun badge</option>
                        <option value="Bestseller">Bestseller (Recommandé)</option>
                        <option value="Nouveau">Nouveau</option>
                        <option value="Tendance">Tendance</option>
                        <option value="Offre Spéciale">Offre Spéciale</option>
                        <option value="-20%">-20%</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#004D25] mb-1">
                        Statut du stock
                      </label>
                      <select
                        value={editingProduct.available ? 'in_stock' : 'out_of_stock'}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            available: e.target.value === 'in_stock',
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold"
                      >
                        <option value="in_stock">✅ En Stock (Disponible)</option>
                        <option value="out_of_stock">❌ Épuisé (Rupture)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-orange-200">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-black text-white bg-[#009E60] hover:bg-[#00804e] rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Enregistrer les modifications</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-base font-black text-[#004D25]">
                        Modèles actuels sur la boutique
                      </h3>
                      <p className="text-xs text-[#004D25]/70">
                        Cliquez sur « Modifier » pour changer le prix ou sur le bouton de stock pour gérer la disponibilité.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border-2 border-orange-100 hover:border-orange-300 bg-orange-50/30 gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-orange-200 shrink-0 bg-white"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-black text-sm text-[#004D25]">
                                {product.name}
                              </h4>
                              {product.badge && (
                                <span className="text-[10px] bg-[#FF6E14] text-white px-2 py-0.5 rounded-full font-black uppercase">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1">{product.subtitle}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-black text-[#FF6E14]">
                                {formatFCFA(product.price)}
                              </span>
                              {product.oldPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatFCFA(product.oldPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(product.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              product.available
                                ? 'bg-green-100 text-[#004D25] hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {product.available ? '✅ En Stock' : '❌ Épuisé'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF6E14] text-white hover:bg-[#E05300] flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modifier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Supprimer ce modèle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: ADD NEW PRODUCT ================= */}
          {activeTab === 'add_product' && (
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="pb-2 border-b border-orange-200">
                <h3 className="font-serif text-lg font-black text-[#004D25]">
                  Ajouter une nouvelle paire au catalogue
                </h3>
                <p className="text-xs text-[#004D25]/70">
                  Remplissez les informations ci-dessous. Le nouveau modèle apparaîtra immédiatement sur le site.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Nom du modèle *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ex: Dior Signature Ovale"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Sous-titre / Caractéristique *
                  </label>
                  <input
                    type="text"
                    value={newProduct.subtitle}
                    onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    placeholder="Ex: Monture dorée • Verres UV400"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] text-[#004D25]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    placeholder="35000"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#FF6E14]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Ancien prix barré (FCFA, optionnel)
                  </label>
                  <input
                    type="number"
                    value={newProduct.oldPrice || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Ex: 45000"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-medium text-[#004D25]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Photo du modèle (Sélectionnez parmi nos photos haute couture) :
                  </label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, images: [preset.url] })}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                          newProduct.images?.[0] === preset.url
                            ? 'border-[#FF6E14] ring-2 ring-[#FF6E14] scale-105'
                            : 'border-orange-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-orange-200">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#009E60] hover:bg-[#00804e] text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier sur la boutique</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB: STORE SETTINGS ================= */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStoreConfig} className="space-y-4">
              <div className="pb-2 border-b border-orange-200">
                <h3 className="font-serif text-lg font-black text-[#004D25]">
                  Coordonnées & Réglages WhatsApp
                </h3>
                <p className="text-xs text-[#004D25]/70">
                  Tous les boutons de commande du site redirigent vers ce numéro WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Numéro WhatsApp (sans espaces ni signe +) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#FF6E14] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={localConfig.phoneRaw}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^\d]/g, '');
                        setLocalConfig({ ...localConfig, phoneRaw: cleaned });
                      }}
                      placeholder="22508481012"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-mono font-bold text-[#004D25]"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#004D25]/70 mt-1 font-semibold">
                    Exemple Côte d'Ivoire : <span className="font-mono text-[#FF6E14]">22508481012</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Nom de la boutique
                  </label>
                  <input
                    type="text"
                    value={localConfig.storeName}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, storeName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#004D25] mb-1">
                    Ville & Pays
                  </label>
                  <input
                    type="text"
                    value={`${localConfig.city}, ${localConfig.country}`}
                    disabled
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-xs font-bold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rétablir les données d'origine</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FF6E14] hover:bg-[#E05300] text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer les coordonnées</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
