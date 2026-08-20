import React, { useState } from 'react';
import { X, Phone, Check, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customPhone: string;
  onSavePhone: (phone: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  customPhone,
  onSavePhone,
}) => {
  const [inputPhone, setInputPhone] = useState(customPhone || STORE_CONFIG.phoneRaw);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputPhone.replace(/[^\d]/g, '');
    onSavePhone(cleaned);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setInputPhone(STORE_CONFIG.phoneRaw);
    onSavePhone(STORE_CONFIG.phoneRaw);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004D25]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border-2 border-orange-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#FF6E14] hover:bg-orange-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6E14] border border-orange-300 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-black text-[#004D25]">
            Configuration WhatsApp
          </h3>
        </div>

        <p className="text-xs text-[#004D25]/80 mb-5 font-medium">
          Personnalisez le numéro de téléphone WhatsApp de réception des commandes (ex: avec l'indicatif 225 pour la Côte d'Ivoire).
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#004D25] mb-1.5">
              Numéro WhatsApp récepteur (Format international)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6E14]" />
              <input
                type="text"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                placeholder="2250700000000"
                className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-orange-200 rounded-xl focus:outline-hidden focus:border-[#FF6E14] text-[#004D25] font-mono font-bold"
              />
            </div>
            <p className="text-[11px] text-[#004D25]/70 mt-1 font-semibold">
              Actuel : <span className="font-mono font-black text-[#FF6E14]">{inputPhone}</span>
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-xs space-y-1 text-[#004D25]">
            <div className="font-black text-[#FF6E14] flex items-center gap-1.5">
              <span>🇨🇮 Exemples :</span>
            </div>
            <div className="font-semibold">• Côte d'Ivoire : 2250701020304</div>
            <div className="font-semibold">• France : 33612345678</div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-300 text-[#004D25] text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#009E60]" />
              <span>Numéro WhatsApp mis à jour avec succès !</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-[#004D25]/70 hover:text-[#FF6E14] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#009E60] hover:bg-[#008552] text-white font-black text-xs transition-all cursor-pointer shadow-md border-2 border-white"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
