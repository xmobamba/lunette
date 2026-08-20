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
    <section id="faq" className="py-16 sm:py-24 bg-orange-50/30 border-t-2 border-orange-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-[#FF6E14] border-2 border-orange-200 text-xs font-black uppercase tracking-widest mb-3 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#009E60]" />
            <span>Foire aux questions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#004D25] tracking-tight">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-sm sm:text-base text-[#004D25]/80 mt-2 font-medium">
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
                className="bg-white rounded-2xl border-2 border-orange-100/80 hover:border-[#FF6E14] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-orange-50/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-black text-sm sm:text-base text-[#004D25]">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6E14] shrink-0 transition-transform duration-300 border border-orange-200 ${
                      isOpen ? 'rotate-180 bg-[#FF6E14] text-white border-[#FF6E14]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#004D25]/80 leading-relaxed border-t border-orange-50 font-medium">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Footer */}
        <div className="text-center mt-10 pt-6 border-t border-orange-200">
          <p className="text-xs sm:text-sm text-[#004D25] mb-2 font-bold">
            Vous avez une autre question sur nos lunettes ou la livraison ?
          </p>
          <a
            href={buildGeneralWhatsAppUrl('general')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#009E60] hover:text-[#FF6E14] transition-colors underline"
          >
            <MessageCircle className="w-4 h-4 text-[#009E60]" />
            <span>Contactez directement notre conseillère sur WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
