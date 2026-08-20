import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../config/store';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E8E1D7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF0E6] text-[#B85318] border border-[#E8D4C0] text-xs font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#1E6B48]" />
            <span>Foire aux questions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#18261F] tracking-tight">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-sm sm:text-base text-[#4A5850] mt-2 font-normal">
            Des réponses claires pour une commande en toute sérénité à Abidjan.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E1D7] hover:border-[#C85A17]/60 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#18261F]">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C85A17] shrink-0 transition-transform duration-300 border border-[#E8D4C0] ${
                      isOpen ? 'rotate-180 bg-[#C85A17] text-white border-[#C85A17]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4A5850] leading-relaxed border-t border-[#EAE4DB] font-normal">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Footer */}
        <div className="text-center mt-10 pt-6 border-t border-[#E8E1D7]">
          <p className="text-xs sm:text-sm text-[#18261F] mb-2 font-medium">
            Vous avez une autre question sur nos lunettes ou la livraison ?
          </p>
          <a
            href={buildGeneralWhatsAppUrl('general')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E6B48] hover:text-[#C85A17] transition-colors underline"
          >
            <MessageCircle className="w-4 h-4 text-[#1E6B48]" />
            <span>Contactez directement notre conseillère sur WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
