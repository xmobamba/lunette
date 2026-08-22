import React, { useState, useRef, useEffect } from 'react';
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
  Star,
  Maximize2,
  FolderOpen,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Product, StoreConfig, PromoBannerItem, MediaImage } from '../types';
import { STORE_CONFIG } from '../config/store';
import { PRODUCTS } from '../data/products';
import { DEFAULT_PROMOS } from '../data/promos';
import { formatFCFA } from '../utils/whatsapp';
import {
  fileToBase64,
  getStoredHeroImage,
  setStoredHeroImage,
  getStoredMediaLibrary,
  saveStoredMediaLibrary,
  addPhotoToMediaLibrary,
  syncAllPhotosToMediaLibrary
} from '../utils/imageUpload';

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
  const [photoSubView, setPhotoSubView] = useState<'all_media' | 'by_product'>('all_media');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Media Library state
  const [mediaLibrary, setMediaLibrary] = useState<MediaImage[]>(() => {
    return syncAllPhotosToMediaLibrary(products);
  });

  // Modal zoom & assignment states
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null);
  const [assigningMedia, setAssigningMedia] = useState<MediaImage | null>(null);
  const [pickingMediaForProduct, setPickingMediaForProduct] = useState<Product | null>(null);

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
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  // Photo Uploader States
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(() => getStoredHeroImage());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const singleProductPhotoInputRef = useRef<HTMLInputElement>(null);
  const targetProductForSingleUpload = useRef<string | null>(null);

  // Synchronize on modal open or products change
  useEffect(() => {
    const synced = syncAllPhotosToMediaLibrary(products);
    setMediaLibrary(synced);
    setHeroImagePreview(getStoredHeroImage());
  }, [products, isOpen]);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2800);
  };

  const processFilesList = async (filesList: FileList | File[]) => {
    if (!filesList || filesList.length === 0) return;

    try {
      setIsUploadingPhotos(true);
      const newItems: MediaImage[] = [];
      const updatedProducts = [...products];

      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        if (!file.type.startsWith('image/')) continue;

        const base64 = await fileToBase64(file, 900, 900, 0.82);
        
        // Check if there is a product without image to auto-assign
        let targetProduct: Product | undefined;
        for (let pIdx = 0; pIdx < updatedProducts.length; pIdx++) {
          if (!updatedProducts[pIdx].images || updatedProducts[pIdx].images.length === 0) {
            targetProduct = updatedProducts[pIdx];
            updatedProducts[pIdx] = {
              ...updatedProducts[pIdx],
              images: [base64],
            };
            break;
          }
        }

        const mediaItem: MediaImage = {
          id: `media-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: base64,
          name: file.name.replace(/\.[^/.]+$/, '') || `Photo Lunettes ${i + 1}`,
          createdAt: Date.now(),
          assignedProductId: targetProduct?.id,
          assignedProductName: targetProduct?.name,
          isHero: false,
        };
        newItems.push(mediaItem);
      }

      if (newItems.length === 0) {
        showToast('⚠️ Aucun fichier image valide trouvé.');
        return;
      }

      // If no hero image is set, use the first uploaded photo as Hero
      if (!getStoredHeroImage() && newItems.length > 0) {
        newItems[0].isHero = true;
        setStoredHeroImage(newItems[0].url);
        setHeroImagePreview(newItems[0].url);
      }

      const mergedLibrary = [...newItems, ...mediaLibrary];
      saveStoredMediaLibrary(mergedLibrary);
      setMediaLibrary(mergedLibrary);
      onUpdateProducts(updatedProducts);

      showToast(`📸 ${newItems.length} photo(s) ajoutée(s) à votre médiathèque Admin !`);
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur lors de l’importation.');
    } finally {
      setIsUploadingPhotos(false);
      setIsDraggingOver(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // Handle Multi-file Upload in Media Library
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFilesList(files);
    }
  };

  const handleDropFiles = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFilesList(files);
    }
  };

  // Upload single photo for a specific product
  const handleSingleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = targetProductForSingleUpload.current;
    if (!file || !targetId) return;

    try {
      const base64 = await fileToBase64(file);
      const targetProd = products.find((p) => p.id === targetId);

      // Register in Media Library
      const addedMedia = addPhotoToMediaLibrary(
        base64,
        `${targetProd?.name || 'Modèle'} - Photo`,
        targetId,
        targetProd?.name
      );

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
      setMediaLibrary(getStoredMediaLibrary());
      showToast('📸 Photo enregistrée dans la médiathèque & attribuée au modèle !');
    } catch (err) {
      console.error(err);
    } finally {
      if (singleProductPhotoInputRef.current) singleProductPhotoInputRef.current.value = '';
    }
  };

  // Assign an existing Media photo to a product
  const handleAssignMediaToProduct = (mediaItem: MediaImage, productId: string) => {
    const targetProd = products.find((p) => p.id === productId);
    if (!targetProd) return;

    // Update products
    const updated = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          images: [mediaItem.url, ...(p.images || []).filter((img) => img !== mediaItem.url)],
        };
      }
      return p;
    });
    onUpdateProducts(updated);

    // Update Media Library Item
    const updatedLibrary = mediaLibrary.map((m) => {
      if (m.id === mediaItem.id || m.url === mediaItem.url) {
        return {
          ...m,
          assignedProductId: targetProd.id,
          assignedProductName: targetProd.name,
        };
      }
      return m;
    });
    saveStoredMediaLibrary(updatedLibrary);
    setMediaLibrary(updatedLibrary);
    setAssigningMedia(null);
    setPickingMediaForProduct(null);

    showToast(`✅ Photo attribuée au modèle "${targetProd.name}" !`);
  };

  // Set Photo as Hero
  const handleSetAsHero = (imageUrl: string) => {
    setStoredHeroImage(imageUrl);
    setHeroImagePreview(imageUrl);

    const updatedLibrary = mediaLibrary.map((m) => ({
      ...m,
      isHero: m.url === imageUrl,
    }));
    saveStoredMediaLibrary(updatedLibrary);
    setMediaLibrary(updatedLibrary);

    showToast('🌟 Photo définie comme photo d’accueil principale (Hero) !');
  };

  // Delete single photo from Media Library & Products
  const handleDeleteMediaPhoto = (mediaId: string, mediaUrl: string) => {
    if (window.confirm('Voulez-vous supprimer cette photo de la médiathèque et des modèles associés ?')) {
      const updatedLib = mediaLibrary.filter((m) => m.id !== mediaId && m.url !== mediaUrl);
      saveStoredMediaLibrary(updatedLib);
      setMediaLibrary(updatedLib);

      // Remove from products if present
      const updatedProducts = products.map((p) => ({
        ...p,
        images: (p.images || []).filter((img) => img !== mediaUrl),
      }));
      onUpdateProducts(updatedProducts);

      // If it was hero, remove it
      if (heroImagePreview === mediaUrl) {
        setStoredHeroImage(null);
        setHeroImagePreview(null);
      }

      showToast('🗑️ Photo supprimée de la médiathèque');
    }
  };

  // Clear ALL images from store
  const handleClearAllImages = () => {
    if (window.confirm('Voulez-vous vraiment supprimer TOUTES les photos de la médiathèque et de la boutique ?')) {
      const cleared = products.map((p) => ({ ...p, images: [] }));
      onUpdateProducts(cleared);
      setStoredHeroImage(null);
      setHeroImagePreview(null);
      saveStoredMediaLibrary([]);
      setMediaLibrary([]);
      showToast('🧹 Toutes les photos ont été supprimées avec succès !');
    }
  };

  // Delete a specific photo from a product only (not library)
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
    showToast('✅ Coordonnées et WhatsApp enregistrés !');
  };

  // Reset to default
  const handleResetCatalog = () => {
    if (window.confirm('Réinitialiser le catalogue par défaut ?')) {
      onUpdateProducts(PRODUCTS);
      showToast('🔄 Catalogue réinitialisé !');
    }
  };

  return (
    <div
      id="admin-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Fullscreen Zoom Modal */}
      {previewZoomImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPreviewZoomImage(null);
            }
          }}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewZoomImage}
              alt="Aperçu Grand Format"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
            <button
              onClick={() => setPreviewZoomImage(null)}
              className="mt-4 px-6 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black font-bold text-xs transition-all cursor-pointer"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}

      {/* Media Picker Modal (when selecting a photo for a product) */}
      {pickingMediaForProduct && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPickingMediaForProduct(null);
            }
          }}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col border border-[#E8E1D7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4DB]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18261F]">
                  Sélectionner une photo pour : <span className="text-[#C85A17]">{pickingMediaForProduct.name}</span>
                </h3>
                <p className="text-xs text-[#4A5850]">
                  Choisissez une photo dans votre médiathèque Admin
                </p>
              </div>
              <button
                onClick={() => setPickingMediaForProduct(null)}
                className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#4A5850]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {mediaLibrary.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mediaLibrary.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAssignMediaToProduct(item, pickingMediaForProduct.id)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-[#E8E1D7] hover:border-[#C85A17] cursor-pointer transition-all hover:scale-105 shadow-2xs"
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity text-center p-1">
                        Choisir cette photo
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Camera className="w-12 h-12 text-[#C85A17] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#4A5850]">Aucune photo dans la médiathèque.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#EAE4DB] flex justify-between items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  targetProductForSingleUpload.current = pickingMediaForProduct.id;
                  singleProductPhotoInputRef.current?.click();
                  setPickingMediaForProduct(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF0E6] text-[#B85318] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Importer un nouveau fichier</span>
              </button>
              <button
                onClick={() => setPickingMediaForProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#4A5850] hover:bg-[#FAF8F5]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Card */}
      <div
        id="admin-manager-card"
        className="bg-white rounded-3xl border border-[#E8E1D7] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200 text-[#18261F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden file inputs placed safely inside the card with stopPropagation */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          onClick={(e) => e.stopPropagation()}
          onChange={handleMultiFileUpload}
          className="hidden"
        />
        <input
          ref={singleProductPhotoInputRef}
          type="file"
          accept="image/*"
          onClick={(e) => e.stopPropagation()}
          onChange={handleSingleProductUpload}
          className="hidden"
        />
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4DB] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C85A17] flex items-center justify-center text-white shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#18261F]">
                  Espace Administration & Médiathèque Photos
                </h2>
                <span className="text-[10px] bg-[#1E6B48] text-white px-2 py-0.5 rounded-full font-bold">
                  🇨🇮 Abidjan
                </span>
              </div>
              <p className="text-xs text-[#4A5850]">
                Toutes vos photos importées sont centralisées et gérables ici
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
            <span>📸 Médiathèque & Photos ({mediaLibrary.length})</span>
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
          {/* TAB 1: 📸 MÉDIATHÈQUE & GESTION DES PHOTOS (ADMIN MEDIA HUB) */}
          {/* ========================================================================= */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              {/* Top Drag & Drop Batch Upload Zone */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  photoInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingOver(false);
                }}
                onDrop={handleDropFiles}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group shadow-xs ${
                  isDraggingOver
                    ? 'border-[#1E6B48] bg-[#E8F1EC] scale-[1.01]'
                    : 'border-[#C85A17] hover:border-[#A84A12] bg-[#FAF0E6]/60 hover:bg-[#FAF0E6]'
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#E8D4C0] flex items-center justify-center text-[#C85A17] mb-3 group-hover:scale-110 transition-transform shadow-2xs">
                  {isUploadingPhotos ? (
                    <div className="w-8 h-8 border-3 border-[#C85A17] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className={`w-7 h-7 sm:w-8 sm:h-8 ${isDraggingOver ? 'text-[#1E6B48]' : 'text-[#C85A17]'}`} />
                  )}
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#18261F] mb-1">
                  {isDraggingOver ? 'Relâchez vos photos ici !' : 'Glissez ou sélectionnez vos photos de lunettes ici'}
                </h3>
                <p className="text-xs text-[#4A5850] max-w-md mb-4 font-normal">
                  Ajoutez plusieurs photos d'un coup. Elles seront enregistrées dans cette médiathèque et attribuées à vos modèles de lunettes.
                </p>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold text-xs shadow-md transition-transform active:scale-95">
                  <Camera className="w-4 h-4" />
                  <span>{isUploadingPhotos ? 'Importation en cours...' : 'Importer des photos dans la Médiathèque'}</span>
                </div>
              </div>

              {/* Sub-Tabs & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D7]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPhotoSubView('all_media')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      photoSubView === 'all_media'
                        ? 'bg-[#18261F] text-white shadow-xs'
                        : 'bg-white text-[#4A5850] hover:bg-[#F3EFEA] border border-[#E8E1D7]'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#F4A261]" />
                    <span>Toutes mes photos ({mediaLibrary.length})</span>
                  </button>

                  <button
                    onClick={() => setPhotoSubView('by_product')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      photoSubView === 'by_product'
                        ? 'bg-[#18261F] text-white shadow-xs'
                        : 'bg-white text-[#4A5850] hover:bg-[#F3EFEA] border border-[#E8E1D7]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#1E6B48]" />
                    <span>Attribution par modèle ({products.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllImages}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vider toutes les photos</span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: TOUTES LES PHOTOS DE LA MÉDIATHÈQUE */}
              {photoSubView === 'all_media' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif text-base font-bold text-[#18261F] flex items-center gap-2">
                      <span>Photos enregistrées dans l'Admin</span>
                      <span className="text-xs font-sans font-normal text-[#4A5850]">
                        ({mediaLibrary.length} photo(s) au total)
                      </span>
                    </h4>
                  </div>

                  {mediaLibrary.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaLibrary.map((item) => {
                        const isHero = item.isHero || item.url === heroImagePreview;
                        const assignedProd = item.assignedProductId
                          ? products.find((p) => p.id === item.assignedProductId)
                          : undefined;

                        return (
                          <div
                            key={item.id}
                            className="group relative bg-white rounded-2xl border border-[#E8E1D7] hover:border-[#C85A17] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                          >
                            {/* Photo Aspect Stage */}
                            <div className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden">
                              <img
                                src={item.url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Badges on top of image */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                                {isHero && (
                                  <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 fill-white" />
                                    <span>Photo Accueil Hero</span>
                                  </span>
                                )}
                                {assignedProd ? (
                                  <span className="bg-[#1E6B48] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs truncate max-w-[130px]">
                                    ✓ {assignedProd.name}
                                  </span>
                                ) : (
                                  <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md">
                                    Non assignée
                                  </span>
                                )}
                              </div>

                              {/* Zoom button on hover */}
                              <button
                                onClick={() => setPreviewZoomImage(item.url)}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                title="Aperçu Grand Format"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Info & Action Controls */}
                            <div className="p-3 flex flex-col justify-between flex-1 bg-white border-t border-[#F0EBE1]">
                              <div>
                                <p className="text-xs font-bold text-[#18261F] truncate" title={item.name}>
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-[#4A5850] truncate mt-0.5">
                                  {assignedProd ? `Lié à : ${assignedProd.name}` : 'Médiathèque libre'}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="mt-2.5 pt-2 border-t border-[#F3EFEA] flex flex-col gap-1.5">
                                {/* Assign to Product Selector Dropdown */}
                                <select
                                  value={assignedProd?.id || ''}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignMediaToProduct(item, e.target.value);
                                    }
                                  }}
                                  className="w-full text-[10px] font-semibold bg-[#FAF8F5] border border-[#E8E1D7] rounded-lg px-2 py-1 text-[#18261F] cursor-pointer"
                                >
                                  <option value="">Attribuer à un modèle...</option>
                                  {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      🕶️ {p.name} ({formatFCFA(p.price)})
                                    </option>
                                  ))}
                                </select>

                                <div className="flex items-center justify-between gap-1 pt-1">
                                  <button
                                    onClick={() => handleSetAsHero(item.url)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                      isHero
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-[#FAF0E6] hover:bg-[#F3E2CF] text-[#B85318]'
                                    }`}
                                    title="Définir comme photo d'accueil Hero"
                                  >
                                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                                    <span>{isHero ? 'En Hero' : 'Mettre Hero'}</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteMediaPhoto(item.id, item.url)}
                                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                                    title="Supprimer la photo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#E8E1D7]">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] flex items-center justify-center text-[#C85A17] mx-auto mb-3">
                        <Camera className="w-7 h-7" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#18261F] mb-1">
                        Votre Médiathèque est actuellement vide
                      </h4>
                      <p className="text-xs text-[#4A5850] max-w-sm mx-auto mb-4">
                        Importez vos photos de lunettes de soleil en utilisant la zone de dépôt ci-dessus pour les retrouver et les organiser ici.
                      </p>
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="px-5 py-2.5 rounded-full bg-[#C85A17] text-white font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Importer mes premières photos</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: ATTRIBUTION PAR MODÈLE DU CATALOGUE */}
              {photoSubView === 'by_product' && (
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-[#18261F] flex items-center gap-2">
                    <span>Attribution des photos par modèle de lunettes</span>
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
                            onClick={() => setPickingMediaForProduct(product)}
                            className="w-20 h-20 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:border-[#C85A17] group relative"
                            title="Changer la photo depuis la médiathèque"
                          >
                            {hasImage ? (
                              <>
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                  Changer
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-[#C85A17] text-center p-1">
                                <Plus className="w-5 h-5 mb-0.5" />
                                <span className="text-[9px] font-bold">Choisir</span>
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
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                                hasImage ? 'bg-[#E8F1EC] text-[#1E6B48]' : 'bg-[#FAF0E6] text-[#B85318]'
                              }`}
                            >
                              {hasImage ? `✓ Photo assignée` : '⚠️ Sans photo'}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              onClick={() => setPickingMediaForProduct(product)}
                              className="px-3 py-1.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E2CF] text-[#B85318] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{hasImage ? 'Changer' : 'Assigner'}</span>
                            </button>

                            {hasImage && (
                              <button
                                onClick={() => handleDeleteProductImage(product.id, 0)}
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 self-end transition-colors cursor-pointer"
                                title="Retirer la photo du produit"
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
              )}

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
                        onClick={() => setPickingMediaForProduct(editingProduct)}
                        className="px-3 py-2 rounded-xl bg-[#FAF0E6] text-[#B85318] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Choisir dans la médiathèque</span>
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
                    placeholder="Ex: Dior Masque Noir"
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
                  onChange={(e) => setLocalConfig({ ...localConfig, phoneRaw: e.target.value, phoneDisplay: e.target.value })}
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
                  value={localConfig.city}
                  onChange={(e) => setLocalConfig({ ...localConfig, city: e.target.value })}
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
