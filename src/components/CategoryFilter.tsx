import React from 'react';
import { CATEGORIES_LIST } from '../config/store';
import { ProductCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  countByCategory?: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  countByCategory = {},
}) => {
  return (
    <div id="category-filter-section" className="w-full py-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-[#004D25] tracking-tight">
          Trouvez votre style
        </h2>
        <p className="text-xs sm:text-sm text-[#FF6E14] font-bold mt-1.5 uppercase tracking-[0.2em]">
          Filtrez selon vos envies et vos looks à Abidjan
        </p>
      </div>

      {/* Horizontal scrollable category chips */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 pt-1 px-4 max-w-full no-scrollbar">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = countByCategory[cat.id];

            return (
              <button
                key={cat.id}
                id={`filter-chip-${cat.id}`}
                onClick={() => onSelectCategory(cat.id as ProductCategory)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border shadow-xs ${
                  isActive
                    ? 'bg-[#FF6E14] text-white border-[#FF6E14] shadow-md scale-105'
                    : 'bg-orange-50/80 hover:bg-orange-100/80 text-[#004D25] border-orange-200 hover:border-orange-300'
                }`}
              >
                <span>{cat.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-[#FF6E14]' : 'bg-white text-[#009E60] border border-green-200'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
