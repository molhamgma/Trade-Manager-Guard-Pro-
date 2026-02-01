import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Flag, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  lang: Language;
}

export const WelcomeModal: React.FC<Props> = ({ isOpen, onClose, onStartTour, lang }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [dontShow, setDontShow] = useState(false);

  const handleClose = (start: boolean) => {
    if (dontShow) {
      localStorage.setItem('tg_welcome_seen', 'true');
    }
    if (start) {
      onStartTour();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-8 h-8 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white">{t.welcomeTourTitle}</h2>
          <p className="text-slate-400 leading-relaxed">
            {t.welcomeTourDesc}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <button 
              onClick={() => handleClose(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/20"
            >
              {t.startTour}
            </button>
            <button 
              onClick={() => handleClose(false)}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition"
            >
              {t.skipTour}
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2 cursor-pointer" onClick={() => setDontShow(!dontShow)}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${dontShow ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'}`}>
               {dontShow && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs text-slate-500 select-none">{t.dontShowAgain}</span>
          </div>
        </div>
      </div>
    </div>
  );
};