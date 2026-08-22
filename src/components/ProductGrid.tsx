import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { Search, Sparkles } from 'lucide-react';

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
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <section id="collection" className="py-12 sm:py-16 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
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
