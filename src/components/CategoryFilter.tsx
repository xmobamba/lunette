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
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18261F] tracking-tight">
          Trouvez votre style
        </h2>
        <p className="text-xs sm:text-sm text-[#C85A17] font-bold mt-1.5 uppercase tracking-[0.2em]">
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
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border shadow-2xs ${
                  isActive
                    ? 'bg-[#C85A17] text-white border-[#C85A17] shadow-sm scale-105'
                    : 'bg-white hover:bg-[#FAF0E6] text-[#18261F] border-[#E8E1D7] hover:border-[#E8D4C0]'
                }`}
              >
                <span>{cat.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#C85A17]' : 'bg-[#E8F1EC] text-[#1E6B48] border border-[#C8DEC5]'
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
