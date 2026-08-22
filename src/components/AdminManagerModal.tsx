import React, { useState, useRef } from 'react';
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
  Camera,
  Upload,
  ArrowRight,
  Star
} from 'lucide-react';
import { Product, StoreConfig, PromoBannerItem, BannerTheme } from '../types';
import { STORE_CONFIG } from '../config/store';
import { PRODUCTS } from '../data/products';
import { DEFAULT_PROMOS, THEME_STYLES } from '../data/promos';
import { formatFCFA } from '../utils/whatsapp';
import { fileToBase64, getStoredHeroImage, setStoredHeroImage } from '../utils/imageUpload';

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

  const [activeTab, setActiveTab] = useState<'photos' | 'products' | 'promos' | 'add_product' | 'store'>('photos');
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
    images: [],
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
    image: '',
    isActive: true,
    position: 'both',
  });

  // Photo Uploader States
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(() => getStoredHeroImage());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const singleProductPhotoInputRef = useRef<HTMLInputElement>(null);
  const targetProductForSingleUpload = useRef<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // Handle Multi-file Upload in Photos Tab
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingPhotos(true);
      const updated = [...products];
      let fileIdx = 0;

      // Assign sequentially to products that lack images
      for (let i = 0; i < updated.length && fileIdx < files.length; i++) {
        if (!updated[i].images || updated[i].images.length === 0) {
          const base64 = await fileToBase64(files[fileIdx]);
          updated[i] = {
            ...updated[i],
            images: [base64],
          };
          fileIdx++;
        }
      }

      // If more files were selected than empty products, prepend as new models
      while (fileIdx < files.length) {
        const base64 = await fileToBase64(files[fileIdx]);
        updated.unshift({
          id: `modele-custom-${Date.now()}-${fileIdx}`,
          name: `Nouveau Modèle Lunettes ${updated.length + 1}`,
          slug: `nouveau-modele-${Date.now()}`,
          category: ['femme', 'tendance', 'nouveautes'],
          subtitle: 'Protection UV400 • Modèle Haute Couture Abidjan',
          description: 'Monture de lunettes de soleil tendance avec verres solaires UV400 haute protection.',
          price: 35000,
          oldPrice: 45000,
          images: [base64],
          colors: [{ name: 'Noir & Or', hex: '#0B0B0B', imageIndex: 0 }],
          badge: 'Nouveau',
          available: true,
          rating: 5.0,
          reviewCount: 1,
          specs: {
            uvProtection: 'UV400 Catégorie 3 (100% UVA/UVB)',
            frameMaterial: 'Structure haute résistance & acétate poli',
            lensType: 'Verres haute définition anti-reflet',
            fit: 'Taille standard universelle',
          },
        });
        fileIdx++;
      }

      onUpdateProducts(updated);
      showToast(`✨ ${files.length} photo(s) importée(s) avec succès !`);
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur lors de l’importation.');
    } finally {
      setIsUploadingPhotos(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // Upload single photo for a specific product
  const handleSingleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = targetProductForSingleUpload.current;
    if (!file || !targetId) return;

    try {
      const base64 = await fileToBase64(file);
      const updated = products.map((p) => {
        if (p.id === targetId) {
          return {
            ...p,
            images: [base64, ...(p.images || []).filter((img) => img !== base64)],
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      showToast('📸 Photo du produit mise à jour !');
    } catch (err) {
      console.error(err);
    } finally {
      if (singleProductPhotoInputRef.current) singleProductPhotoInputRef.current.value = '';
    }
  };

  // Clear ALL images from landing page
  const handleClearAllImages = () => {
    if (window.confirm('Voulez-vous vraiment supprimer TOUTES les photos des produits et de la landing page pour repartir à zéro ?')) {
      const cleared = products.map((p) => ({ ...p, images: [] }));
      onUpdateProducts(cleared);
      setStoredHeroImage(null);
      setHeroImagePreview(null);
      showToast('🧹 Toutes les photos ont été supprimées avec succès !');
    }
  };

  // Set Hero Image
  const handleSetAsHero = (imageUrl: string) => {
    setStoredHeroImage(imageUrl);
    setHeroImagePreview(imageUrl);
    showToast('✨ Définie comme photo d’accueil principale !');
  };

  // Assign image to a product
  const handleAssignToProduct = (productId: string, imageUrl: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          images: [imageUrl, ...(p.images || []).filter((img) => img !== imageUrl)],
        };
      }
      return p;
    });
    onUpdateProducts(updated);
    showToast('✅ Photo attribuée au modèle sélectionné !');
  };

  // Delete an image from a product
  const handleDeleteProductImage = (productId: string, imageIndex: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextImages = [...p.images];
        nextImages.splice(imageIndex, 1);
        return { ...p, images: nextImages };
      }
      return p;
    });
    onUpdateProducts(updated);
    showToast('🗑️ Photo retirée du produit');
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      showToast('🗑️ Modèle supprimé');
    }
  };

  // Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Veuillez renseigner au moins le nom et le prix.');
      return;
    }

    const created: Product = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(newProduct.price),
      oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
      subtitle: newProduct.subtitle || 'Modèle Haute Couture Abidjan',
      description: newProduct.description || '',
      category: newProduct.category || ['femme', 'tendance'],
      badge: newProduct.badge || undefined,
      available: newProduct.available ?? true,
      rating: 5.0,
      reviewCount: 1,
      images: newProduct.images || [],
      colors: newProduct.colors || [{ name: 'Noir & Or', hex: '#0B0B0B' }],
      specs: newProduct.specs || {
        uvProtection: 'UV400 Catégorie 3 (100% UVA/UVB)',
        frameMaterial: 'Acétate de cellulose & structure renforcée',
        lensType: 'Verres haute définition anti-reflet',
        fit: 'Taille standard universelle',
      },
    };

    onUpdateProducts([created, ...products]);
    showToast('✨ Nouveau modèle ajouté au catalogue !');
    setActiveTab('products');
    setNewProduct({
      name: '',
      price: 35000,
      oldPrice: 45000,
      subtitle: 'Protection UV400 • Style chic Abidjan',
      description: 'Modèle de lunettes de soleil tendance sélectionné pour sublimer votre regard avec confort et élégance.',
      category: ['femme', 'tendance'],
      badge: 'Nouveau',
      images: [],
    });
  };

  // Save Edit Product
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    onUpdateProducts(updated);
    setEditingProduct(null);
    showToast('✅ Modèle mis à jour avec succès !');
  };

  // Save Store Settings
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(localConfig);
    showToast('✅ Paramètres de la boutique enregistrés !');
  };

  // Reset to default
  const handleResetCatalog = () => {
    if (window.confirm('Réinitialiser le catalogue par défaut (sans photos) ?')) {
      onUpdateProducts(PRODUCTS);
      showToast('🔄 Catalogue réinitialisé !');
    }
  };

  return (
    <div
      id="admin-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleMultiFileUpload}
        className="hidden"
      />
      <input
        ref={singleProductPhotoInputRef}
        type="file"
        accept="image/*"
        onChange={handleSingleProductUpload}
        className="hidden"
      />

      <div
        id="admin-manager-card"
        className="bg-white rounded-3xl border border-[#E8E1D7] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200 text-[#18261F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#EAE4DB] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C85A17] flex items-center justify-center text-white shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18261F]">
                  Administration & Gestion des Photos
                </h2>
                <span className="text-[10px] bg-[#1E6B48] text-white px-2 py-0.5 rounded-full font-bold">
                  🇨🇮 Abidjan
                </span>
              </div>
              <p className="text-xs text-[#4A5850]">
                Ajoutez vos photos de lunettes, gérez le catalogue et les bannières promo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white hover:bg-[#FAF0E6] text-[#4A5850] hover:text-[#C85A17] transition-colors border border-[#E8E1D7] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Toast */}
        {feedbackMsg && (
          <div className="bg-[#1E6B48] text-white text-xs font-bold px-4 py-2 text-center animate-in slide-in-from-top duration-200 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center gap-1.5 p-2 bg-[#F3EFEA] border-b border-[#EAE4DB] overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('photos'); setEditingProduct(null); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'photos'
                ? 'bg-[#C85A17] text-white shadow-sm'
                : 'text-[#4A5850] hover:text-[#18261F] hover:bg-white/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📸 Mes Photos (Upload)</span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#18261F] text-white shadow-sm'
                : 'text-[#4A5850] hover:text-[#18261F] hover:bg-white/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('add_product'); setEditingProduct(null); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'add_product'
                ? 'bg-[#18261F] text-white shadow-sm'
                : 'text-[#4A5850] hover:text-[#18261F] hover:bg-white/60'
            }`}
          >
            <Plus className="w-4 h-4 text-[#C85A17]" />
            <span>Ajouter un modèle</span>
          </button>

          <button
            onClick={() => { setActiveTab('promos'); setEditingProduct(null); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'promos'
                ? 'bg-[#18261F] text-white shadow-sm'
                : 'text-[#4A5850] hover:text-[#18261F] hover:bg-white/60'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#F4A261]" />
            <span>Bannières & Promos ({promos.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('store'); setEditingProduct(null); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-[#18261F] text-white shadow-sm'
                : 'text-[#4A5850] hover:text-[#18261F] hover:bg-white/60'
            }`}
          >
            <Phone className="w-4 h-4 text-[#1E6B48]" />
            <span>WhatsApp & Boutique</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          
          {/* ========================================================================= */}
          {/* TAB 1: 📸 MES PHOTOS (UPLOAD & ATTRIBUTION) */}
          {/* ========================================================================= */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Top Action Box: Big Drag & Drop / Upload Zone */}
              <div
                onClick={() => photoInputRef.current?.click()}
                className="border-2 border-dashed border-[#C85A17] hover:border-[#A84A12] bg-[#FAF0E6]/50 hover:bg-[#FAF0E6] p-8 rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center group shadow-xs"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] mb-3 group-hover:scale-110 transition-transform shadow-2xs">
                  {isUploadingPhotos ? (
                    <div className="w-8 h-8 border-3 border-[#C85A17] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#18261F] mb-1">
                  Glissez ou sélectionnez vos photos de lunettes ici
                </h3>
                <p className="text-xs text-[#4A5850] max-w-md mb-4">
                  Sélectionnez plusieurs photos à la fois depuis votre téléphone ou ordinateur. Elles seront automatiquement optimisées et attribuées à vos modèles.
                </p>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C85A17] text-white font-bold text-xs shadow-md">
                  <Camera className="w-4 h-4" />
                  <span>Choisir mes fichiers photos</span>
                </div>
              </div>

              {/* General Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D7]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#18261F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E6B48]"></span>
                  <span>
                    <strong>{products.filter((p) => p.images && p.images.length > 0).length}</strong> modèles ont des photos /{' '}
                    <strong>{products.length}</strong> modèles au total
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllImages}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer toutes les photos</span>
                  </button>

                  <button
                    onClick={handleResetCatalog}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3EFEA] text-[#4A5850] font-bold text-xs border border-[#E8E1D7] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser catalogue</span>
                  </button>
                </div>
              </div>

              {/* Photo Attribution Table by Product */}
              <div>
                <h4 className="font-serif text-base font-bold text-[#18261F] mb-3 flex items-center gap-2">
                  <span>Modèles de la boutique & Leurs photos</span>
                  <span className="text-xs font-sans font-normal text-[#4A5850]">
                    (Cliquez sur "Ajouter / Changer" pour attribuer une photo à chaque modèle)
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => {
                    const hasImage = product.images && product.images.length > 0;
                    return (
                      <div
                        key={product.id}
                        className="p-4 rounded-2xl border border-[#E8E1D7] bg-white hover:border-[#C85A17]/50 shadow-2xs transition-all flex items-center justify-between gap-4"
                      >
                        {/* Thumbnail / Upload Box */}
                        <div
                          onClick={() => {
                            targetProductForSingleUpload.current = product.id;
                            singleProductPhotoInputRef.current?.click();
                          }}
                          className="w-20 h-20 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:border-[#C85A17] group relative"
                        >
                          {hasImage ? (
                            <>
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                Modifier
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-[#C85A17] text-center p-1">
                              <Plus className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] font-bold">Ajouter</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-sm font-bold text-[#18261F] truncate">
                            {product.name}
                          </h5>
                          <p className="text-xs text-[#C85A17] font-bold">
                            {formatFCFA(product.price)}
                          </p>
                          <p className="text-[11px] text-[#4A5850] truncate mt-0.5">
                            {product.subtitle}
                          </p>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                            hasImage ? 'bg-[#E8F1EC] text-[#1E6B48]' : 'bg-[#FAF0E6] text-[#B85318]'
                          }`}>
                            {hasImage ? `✓ ${product.images.length} photo(s)` : '⚠️ Aucune photo'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              targetProductForSingleUpload.current = product.id;
                              singleProductPhotoInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E2CF] text-[#B85318] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>{hasImage ? 'Changer' : 'Ajouter'}</span>
                          </button>

                          {hasImage && (
                            <button
                              onClick={() => handleSetAsHero(product.images[0])}
                              className="px-3 py-1 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#18261F] text-[10px] font-bold border border-[#E8E1D7] flex items-center gap-1 cursor-pointer transition-colors"
                              title="Définir comme photo d'en-tête (Hero)"
                            >
                              <Star className="w-3 h-3 text-amber-500" />
                              <span>Mettre en Hero</span>
                            </button>
                          )}

                          {hasImage && (
                            <button
                              onClick={() => handleDeleteProductImage(product.id, 0)}
                              className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 self-end transition-colors cursor-pointer"
                              title="Retirer la photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CATALOGUE PRODUITS (EDIT & LIST) */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div>
              {editingProduct ? (
                /* Edit Product Form */
                <form onSubmit={handleSaveEditProduct} className="space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE4DB]">
                    <h3 className="font-serif text-lg font-bold text-[#18261F]">
                      Modifier : {editingProduct.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-bold text-[#C85A17] hover:underline cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#18261F] mb-1">Nom du modèle</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#18261F] mb-1">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl font-bold text-[#C85A17]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18261F] mb-1">Sous-titre / Slogan</label>
                    <input
                      type="text"
                      value={editingProduct.subtitle}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18261F] mb-1">Description détaillée</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl"
                    />
                  </div>

                  {/* Photo Field for this product */}
                  <div>
                    <label className="block text-xs font-bold text-[#18261F] mb-1">Photo du produit</label>
                    <div className="flex items-center gap-3">
                      {editingProduct.images && editingProduct.images[0] ? (
                        <img src={editingProduct.images[0]} alt="Aperçu" className="w-16 h-16 rounded-xl object-cover border border-[#E8E1D7]" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#FAF8F5] border border-dashed border-[#E8E1D7] flex items-center justify-center text-xs text-[#4A5850]">
                          Sans photo
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          targetProductForSingleUpload.current = editingProduct.id;
                          singleProductPhotoInputRef.current?.click();
                        }}
                        className="px-3 py-2 rounded-xl bg-[#FAF0E6] text-[#B85318] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Changer la photo</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4DB]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#4A5850] hover:bg-[#FAF8F5] cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-[#1E6B48] hover:bg-[#165236] text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              ) : (
                /* Products List */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs text-[#4A5850] font-medium">
                      Total : <strong>{products.length}</strong> modèles dans votre catalogue
                    </span>
                    <button
                      onClick={() => setActiveTab('add_product')}
                      className="px-3 py-1.5 rounded-xl bg-[#C85A17] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un modèle</span>
                    </button>
                  </div>

                  <div className="divide-y divide-[#EAE4DB] border border-[#E8E1D7] rounded-2xl overflow-hidden">
                    {products.map((p) => (
                      <div key={p.id} className="p-3.5 bg-white hover:bg-[#FAF8F5] transition-colors flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-[#E8E1D7] shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] shrink-0">
                              <Camera className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm font-bold text-[#18261F] truncate">{p.name}</h4>
                            <p className="text-xs text-[#C85A17] font-bold">{formatFCFA(p.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF0E6] text-[#18261F] hover:text-[#C85A17] border border-[#E8E1D7] transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                            title="Supprimer"
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

          {/* ========================================================================= */}
          {/* TAB 3: AJOUTER UN NOUVEAU PRODUIT */}
          {/* ========================================================================= */}
          {activeTab === 'add_product' && (
            <form onSubmit={handleCreateProduct} className="space-y-4 max-w-2xl mx-auto">
              <div className="pb-2 border-b border-[#EAE4DB]">
                <h3 className="font-serif text-lg font-bold text-[#18261F]">
                  Ajouter un nouveau modèle de lunettes
                </h3>
                <p className="text-xs text-[#4A5850]">
                  Remplissez les informations du produit pour l'ajouter à votre boutique
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18261F] mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    placeholder="Ex: Chanel Masque Noir"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18261F] mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl font-bold text-[#C85A17]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18261F] mb-1">Sous-titre / Slogan court</label>
                <input
                  type="text"
                  placeholder="Ex: Protection UV400 • Modèle Haute Couture Abidjan"
                  value={newProduct.subtitle}
                  onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18261F] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#EAE4DB] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Créer et publier le modèle
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BANNIÈRES & OFFRES PROMO */}
          {/* ========================================================================= */}
          {activeTab === 'promos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DB]">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#18261F]">Bannières Promotionnelles de l'Entête</h3>
                  <p className="text-xs text-[#4A5850]">Gérez les offres spéciales et codes promos affichés sous la barre de navigation</p>
                </div>
              </div>

              <div className="divide-y divide-[#EAE4DB] border border-[#E8E1D7] rounded-2xl overflow-hidden">
                {promos.map((p) => (
                  <div key={p.id} className="p-4 bg-white hover:bg-[#FAF8F5] transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#C85A17] text-white text-[10px] font-extrabold uppercase">
                          {p.discountTag || 'OFFRE'}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#18261F]">{p.title}</h4>
                      </div>
                      <p className="text-xs text-[#4A5850]">{p.description}</p>
                    </div>

                    <span className="text-xs font-bold text-[#1E6B48] bg-[#E8F1EC] px-2.5 py-1 rounded-full shrink-0">
                      ✓ Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PARAMÈTRES BOUTIQUE & NUMÉRO WHATSAPP */}
          {/* ========================================================================= */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStoreConfig} className="space-y-4 max-w-xl mx-auto">
              <div className="pb-2 border-b border-[#EAE4DB]">
                <h3 className="font-serif text-lg font-bold text-[#18261F]">
                  Coordonnées & WhatsApp de commande
                </h3>
                <p className="text-xs text-[#4A5850]">
                  Les clients seront automatiquement redirigés vers ce numéro WhatsApp pour passer commande.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18261F] mb-1">
                  Numéro WhatsApp de réception des commandes *
                </label>
                <input
                  type="text"
                  placeholder="+225 07 XX XX XX XX"
                  value={localConfig.phoneRaw}
                  onChange={(e) => setLocalConfig({ ...localConfig, phoneRaw: e.target.value, phoneFormatted: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E8E1D7] rounded-xl font-bold text-[#1E6B48]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18261F] mb-1">Compte Instagram (@)</label>
                <input
                  type="text"
                  value={localConfig.instagramHandle}
                  onChange={(e) => setLocalConfig({ ...localConfig, instagramHandle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18261F] mb-1">Ville & Pays</label>
                <input
                  type="text"
                  value={localConfig.address}
                  onChange={(e) => setLocalConfig({ ...localConfig, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E1D7] rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#EAE4DB] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1E6B48] hover:bg-[#165236] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Enregistrer les coordonnées
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
