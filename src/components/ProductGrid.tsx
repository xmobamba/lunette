import React, { useState, useMemo, useRef } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { Search, Sparkles, Camera, Upload, Plus } from 'lucide-react';
import { fileToBase64, addPhotoToMediaLibrary } from '../utils/imageUpload';

interface ProductGridProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  customPhone?: string;
  onUpdateProductImage?: (productId: string, newImage: string) => void;
  onOpenAdmin?: () => void;
  onUpdateProducts?: (newProducts: Product[]) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenQuickView,
  favorites,
  onToggleFavorite,
  customPhone,
  onUpdateProductImage,
  onOpenAdmin,
  onUpdateProducts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Counts by category
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      p.category.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category.includes(selectedCategory);

      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Count products with images vs without images
  const productsWithImagesCount = useMemo(() => {
    return products.filter((p) => p.images && p.images.length > 0).length;
  }, [products]);

  // Handle multi-upload to assign photos sequentially to products without images
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUpdateProducts) return;

    try {
      setIsBatchUploading(true);
      const updated = [...products];
      let fileIdx = 0;

      for (let i = 0; i < updated.length && fileIdx < files.length; i++) {
        // If product has no image or we are filling from start
        if (!updated[i].images || updated[i].images.length === 0) {
          const base64 = await fileToBase64(files[fileIdx]);
          addPhotoToMediaLibrary(base64, `${updated[i].name} (Photo)`, updated[i].id, updated[i].name);
          updated[i] = {
            ...updated[i],
            images: [base64],
          };
          fileIdx++;
        }
      }

      // If there are still remaining uploaded files, create new products or assign to products
      while (fileIdx < files.length) {
        const base64 = await fileToBase64(files[fileIdx]);
        const newProdId = `custom-eyewear-${Date.now()}-${fileIdx}`;
        const newProdName = `Nouveau Modèle Lunettes ${updated.length + 1}`;
        addPhotoToMediaLibrary(base64, `${newProdName} (Photo)`, newProdId, newProdName);
        updated.unshift({
          id: newProdId,
          name: newProdName,
          slug: `nouveau-modele-lunettes-${Date.now()}`,
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
    } catch (err) {
      console.error('Batch upload error:', err);
    } finally {
      setIsBatchUploading(false);
      if (multiFileInputRef.current) {
        multiFileInputRef.current.value = '';
      }
    }
  };

  return (
    <section id="collection" className="py-12 sm:py-16 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hidden batch file input */}
        <input
          ref={multiFileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleBatchUpload}
          className="hidden"
        />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E8D4C0] text-[#B85318] text-xs font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1E6B48]" />
            <span>Collection Abidjan 2026</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#18261F] tracking-tight">
            Nos lunettes du moment
          </h2>
          <p className="text-sm sm:text-base text-[#4A5850] mt-2 font-normal">
            Des modèles sélectionnés pour sublimer votre regard avec confort et élégance.
          </p>

          {/* Quick Photo Upload Callout */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 p-2 px-3 rounded-2xl bg-white border border-[#E8E1D7] shadow-2xs text-xs">
            <Camera className="w-4 h-4 text-[#C85A17]" />
            <span className="text-[#18261F] font-medium">
              {productsWithImagesCount} sur {products.length} modèles avec photos
            </span>
            <button
              onClick={() => multiFileInputRef.current?.click()}
              disabled={isBatchUploading}
              className="ml-2 px-3 py-1 rounded-xl bg-[#C85A17] hover:bg-[#A84A12] text-white font-bold flex items-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer"
            >
              {isBatchUploading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Importer mes photos en 1 clic</span>
            </button>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E2CF] text-[#B85318] font-bold text-[11px] transition-colors cursor-pointer"
              >
                Gérer le catalogue
              </button>
            )}
          </div>
        </div>

        {/* Categories chips */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          countByCategory={countByCategory}
        />

        {/* Search & Results counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 pt-2 pb-4 border-b border-[#EAE4DB]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C85A17]" />
            <input
              type="text"
              placeholder="Rechercher un modèle (Luna, Gold, Noir...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#E8E1D7] rounded-full focus:outline-hidden focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17]/30 transition-all text-[#18261F] font-medium placeholder:text-[#4A5850]/50 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#18261F] font-medium w-full sm:w-auto justify-between sm:justify-end">
            <span>
              Affichage de <strong className="text-[#C85A17] font-bold">{filteredProducts.length}</strong> modèle{filteredProducts.length > 1 ? 's' : ''}
            </span>
            <span className="hidden sm:inline text-[#D8CFBF]">•</span>
            <span className="text-[#1E6B48] font-bold bg-[#E8F1EC] border border-[#C8DEC5] px-3 py-1 rounded-full shadow-2xs">
              🚚 En stock à Abidjan
            </span>
          </div>
        </div>

        {/* Responsive Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {filteredProducts.length > 0 ? (
          <div
            id="products-grid-container"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={onOpenQuickView}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                customPhone={customPhone}
                onUpdateProductImage={onUpdateProductImage}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#F3EFE9] rounded-3xl border border-dashed border-[#E8E1D7]">
            <p className="text-[#18261F] font-bold text-base mb-2">
              Aucun modèle trouvé pour « {searchQuery} » dans cette catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-[#C85A17] underline hover:text-[#1E6B48] cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
