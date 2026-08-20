import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenQuickView,
  favorites,
  onToggleFavorite,
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
    <section id="collection" className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-[#FF6E14] text-xs font-black uppercase tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#009E60]" />
            <span>Collection Abidjan 2026</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#004D25] tracking-tight">
            Nos lunettes du moment
          </h2>
          <p className="text-sm sm:text-base text-[#004D25]/80 mt-2 font-medium">
            Des modèles sélectionnés pour compléter votre style. Finitions haut de gamme et verres haute protection solaire.
          </p>
        </div>

        {/* Categories chips */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          countByCategory={countByCategory}
        />

        {/* Search & Results counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 pt-2 pb-4 border-b border-orange-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6E14]" />
            <input
              type="text"
              placeholder="Rechercher un modèle (Luna, Gold, Noir...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-orange-50/50 border-2 border-orange-200 rounded-full focus:outline-hidden focus:border-[#FF6E14] focus:bg-white transition-all text-[#004D25] font-semibold placeholder:text-[#004D25]/40"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#004D25] font-bold w-full sm:w-auto justify-between sm:justify-end">
            <span>
              Affichage de <strong className="text-[#FF6E14] font-black">{filteredProducts.length}</strong> modèle{filteredProducts.length > 1 ? 's' : ''}
            </span>
            <span className="hidden sm:inline text-orange-300">•</span>
            <span className="text-[#009E60] font-black bg-green-50 border border-green-200 px-3 py-1 rounded-full shadow-xs">
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
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-orange-50/40 rounded-3xl border-2 border-dashed border-orange-200">
            <p className="text-[#004D25] font-bold text-base mb-2">
              Aucun modèle trouvé pour « {searchQuery} » dans cette catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-black text-[#FF6E14] underline hover:text-[#009E60] cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
