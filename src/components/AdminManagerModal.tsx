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
} from 'lucide-react';
import { Product, StoreConfig, ProductCategory } from '../types';
import { STORE_CONFIG, FAQ_ITEMS } from '../config/store';
import { PRODUCTS } from '../data/products';
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
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'store' | 'add_product'>('products');
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

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // Save Store Settings
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(localConfig);
    showToast('Coordonnées de la boutique enregistrées avec succès !');
  };

  // Save Product Edit
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    onUpdateProducts(updated);
    setEditingProduct(null);
    showToast(`Le modèle "${editingProduct.name}" a été mis à jour !`);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le modèle "${productName}" ?`)) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      showToast(`Le modèle "${productName}" a été supprimé.`);
    }
  };

  // Toggle Stock Status
  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, available: !p.available } : p
    );
    onUpdateProducts(updated);
    showToast('Statut de disponibilité mis à jour.');
  };

  // Add New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Veuillez saisir au moins le nom et le prix du modèle.');
      return;
    }

    const createdProduct: Product = {
      id: 'prod-' + Date.now(),
      name: newProduct.name || 'Nouveau modèle',
      slug: (newProduct.name || 'nouveau').toLowerCase().replace(/\s+/g, '-'),
      category: (newProduct.category && newProduct.category.length > 0) ? newProduct.category : ['tendance'],
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
      available: newProduct.available ?? true,
      rating: 5.0,
      reviewCount: 1,
      specs: newProduct.specs || {
        uvProtection: 'UV400 Catégorie 3',
        frameMaterial: 'Acétate poli haute qualité',
        lensType: 'Verres anti-reflet UV400',
        fit: 'Taille universelle',
      },
    };

    onUpdateProducts([createdProduct, ...products]);
    showToast(`Le modèle "${createdProduct.name}" a été ajouté au catalogue !`);
    setActiveTab('products');
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
    if (window.confirm('Voulez-vous rétablir le catalogue et la configuration d’origine ?')) {
      onUpdateProducts(PRODUCTS);
      onUpdateStoreConfig(STORE_CONFIG);
      setLocalConfig({ ...STORE_CONFIG });
      showToast('Catalogue réinitialisé aux valeurs d’origine.');
    }
  };

  return (
    <div
      id="admin-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#004D25]/75 backdrop-blur-sm animate-in fade-in duration-200"
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
                  Espace Gestion & Modification
                </h2>
                <span className="text-[10px] bg-[#FF6E14] text-white font-black px-2 py-0.5 rounded-full uppercase">
                  🇨🇮 Manuel
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Modifiez vos prix, ajoutez des lunettes et gérez votre numéro WhatsApp en direct.
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
        <div className="bg-orange-50/90 border-b border-orange-200 px-3 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#FF6E14] text-white shadow-md'
                : 'bg-white text-[#004D25] hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catalogue Lunettes ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('add_product');
              setEditingProduct(null);
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

          <button
            onClick={() => {
              setActiveTab('store');
              setEditingProduct(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-[#FF6E14] text-white shadow-md'
                : 'bg-white text-[#004D25] hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Numéro WhatsApp & Boutique</span>
          </button>
        </div>

        {/* Global Toast / Feedback */}
        {feedbackMsg && (
          <div className="bg-green-600 text-white text-xs font-black px-4 py-2 flex items-center justify-between shadow-inner animate-in fade-in">
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
          {/* ================= TAB 1: PRODUCTS LIST & EDIT ================= */}
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
                      className="text-xs font-bold text-[#004D25]/70 hover:text-[#FF6E14]"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                        Nom du modèle
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
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
                        className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25] bg-white"
                      >
                        <option value="">Aucun badge</option>
                        <option value="Bestseller">Bestseller (Orange)</option>
                        <option value="Nouveau">Nouveau (Vert)</option>
                        <option value="Tendance">Tendance</option>
                        <option value="Offre Spéciale">Offre Spéciale</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                        Prix de vente actuel (FCFA)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-black text-[#FF6E14]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                        Ancien prix barré (FCFA) (Optionnel)
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
                        placeholder="Ex: 20000"
                        className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-medium text-[#004D25]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                        Sous-titre / Caractéristiques clés
                      </label>
                      <input
                        type="text"
                        value={editingProduct.subtitle}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] text-[#004D25]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                        Description du modèle
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] text-[#004D25]"
                      />
                    </div>

                    {/* Image URL & Quick Presets */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-black uppercase text-[#004D25]">
                        Image principale (URL ou Sélection rapide)
                      </label>
                      <input
                        type="url"
                        value={editingProduct.images[0] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            images: [e.target.value, ...editingProduct.images.slice(1)],
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs border-2 border-orange-200 rounded-xl font-mono text-[#004D25]"
                        placeholder="https://..."
                      />

                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-[#004D25]/70">
                          Ou cliquez sur une photo suggérée :
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-1">
                          {PRESET_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setEditingProduct({
                                  ...editingProduct,
                                  images: [preset.url, ...editingProduct.images.slice(1)],
                                })
                              }
                              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                editingProduct.images[0] === preset.url
                                  ? 'border-[#FF6E14] ring-2 ring-orange-300 scale-105'
                                  : 'border-orange-100 hover:border-orange-300 opacity-70 hover:opacity-100'
                              }`}
                              title={preset.label}
                            >
                              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-orange-200">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#004D25] hover:bg-orange-50 border border-orange-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#009E60] hover:bg-[#008552] text-white font-black text-xs shadow-md border-2 border-white cursor-pointer"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              ) : (
                /* Products Table / Cards */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#004D25]/80 font-medium">
                      Cliquez sur <strong>« Modifier »</strong> pour changer le prix ou le texte, ou sur le bouton de stock pour gérer la disponibilité.
                    </p>
                    <button
                      onClick={() => setActiveTab('add_product')}
                      className="text-xs font-black text-[#FF6E14] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une paire</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all justify-between"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-orange-200 shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-[#004D25] truncate">
                              {p.name}
                            </h4>
                            {p.badge && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF6E14] text-white">
                                {p.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-sm font-black text-[#FF6E14]">
                              {formatFCFA(p.price)}
                            </span>
                            {p.oldPrice && (
                              <span className="text-[10px] text-[#004D25]/40 line-through">
                                {formatFCFA(p.oldPrice)}
                              </span>
                            )}
                          </div>

                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p.id)}
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                p.available
                                  ? 'bg-green-100 text-[#009E60] hover:bg-green-200'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              {p.available ? '✓ En stock' : '✕ Rupture'}
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 rounded-xl bg-white hover:bg-orange-100 text-[#FF6E14] border border-orange-200 cursor-pointer transition-colors"
                            title="Modifier ce modèle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-500 border border-red-100 cursor-pointer transition-colors"
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

          {/* ================= TAB 2: ADD NEW PRODUCT ================= */}
          {activeTab === 'add_product' && (
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="pb-2 border-b border-orange-200">
                <h3 className="font-serif text-lg font-black text-[#004D25]">
                  Ajouter une nouvelle paire au catalogue
                </h3>
                <p className="text-xs text-[#004D25]/80 font-medium">
                  Remplissez les informations ci-dessous. Le nouveau modèle apparaîtra immédiatement sur la boutique et sera commandable par WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Nom du modèle *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ex: Abidjan Chic Gold"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Badge
                  </label>
                  <select
                    value={newProduct.badge || 'Nouveau'}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, badge: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25] bg-white"
                  >
                    <option value="Nouveau">Nouveau</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Tendance">Tendance</option>
                    <option value="Offre Spéciale">Offre Spéciale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
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
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Ancien prix barré (FCFA) (Optionnel)
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Sous-titre / Caractéristiques
                  </label>
                  <input
                    type="text"
                    value={newProduct.subtitle}
                    onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    placeholder="Ex: Monture dorée fine • Verres polarisés UV400"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] text-[#004D25]"
                  />
                </div>

                {/* Photo Selection */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-black uppercase text-[#004D25]">
                    Photo principale (Choisissez un modèle ou collez un lien)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, images: [preset.url] })}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          newProduct.images?.[0] === preset.url
                            ? 'border-[#FF6E14] ring-2 ring-orange-300 scale-105'
                            : 'border-orange-100 hover:border-orange-300 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    value={newProduct.images?.[0] || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    placeholder="Ou collez une URL d'image personnalisée (https://...)"
                    className="w-full px-3.5 py-2 text-xs border-2 border-orange-200 rounded-xl font-mono text-[#004D25] mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-orange-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#004D25] hover:bg-orange-50 border border-orange-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#009E60] hover:bg-[#008552] text-white font-black text-xs shadow-md border-2 border-white cursor-pointer"
                >
                  + Ajouter cette paire à la boutique
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 3: STORE INFO & WHATSAPP ================= */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStoreConfig} className="space-y-4">
              <div className="pb-2 border-b border-orange-200">
                <h3 className="font-serif text-lg font-black text-[#004D25]">
                  Coordonnées & Réglages WhatsApp
                </h3>
                <p className="text-xs text-[#004D25]/80 font-medium">
                  Ces informations s'appliquent immédiatement sur tous les boutons de commande et l'en-tête du site.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Numéro WhatsApp récepteur (Format international)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6E14]" />
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

                {/* Display Phone */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Numéro affiché aux clients
                  </label>
                  <input
                    type="text"
                    value={localConfig.phoneDisplay}
                    onChange={(e) => setLocalConfig({ ...localConfig, phoneDisplay: e.target.value })}
                    placeholder="+225 07 01 02 03 04"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                  />
                </div>

                {/* Store Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Nom de la boutique
                  </label>
                  <input
                    type="text"
                    value={localConfig.storeName}
                    onChange={(e) => setLocalConfig({ ...localConfig, storeName: e.target.value })}
                    placeholder="L'AURA EYEWEAR"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                  />
                </div>

                {/* City & Country */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Ville principale
                  </label>
                  <input
                    type="text"
                    value={localConfig.city}
                    onChange={(e) => setLocalConfig({ ...localConfig, city: e.target.value })}
                    placeholder="Abidjan"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] font-bold text-[#004D25]"
                  />
                </div>

                {/* Promotional Banner text */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-[#004D25] mb-1">
                    Texte de l'offre promotionnelle
                  </label>
                  <input
                    type="text"
                    value={localConfig.promoText}
                    onChange={(e) => setLocalConfig({ ...localConfig, promoText: e.target.value })}
                    placeholder="2 paires achetées = livraison offerte à Abidjan"
                    className="w-full px-3.5 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:border-[#FF6E14] text-[#004D25]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-xs font-bold text-[#004D25]/70 hover:text-red-500 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rétablir les valeurs d'origine</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#009E60] hover:bg-[#008552] text-white font-black text-xs shadow-md border-2 border-white cursor-pointer"
                >
                  Enregistrer les coordonnées
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Info Strip */}
        <div className="bg-orange-50 border-t border-orange-200 px-4 py-2.5 flex items-center justify-between text-[11px] text-[#004D25] font-semibold">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#009E60]" />
            <span>Toutes les modifications sont enregistrées sur votre appareil en temps réel.</span>
          </div>
          <button
            onClick={onClose}
            className="font-black text-[#FF6E14] hover:underline cursor-pointer"
          >
            Fermer l'espace gestion
          </button>
        </div>
      </div>
    </div>
  );
};
