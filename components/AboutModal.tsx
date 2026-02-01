import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { X, BookOpen, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200 h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            {t.strategyGuide}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-slate-300">
            
            <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-2xl">
                <p className="font-medium text-lg text-blue-200 leading-relaxed">
                    {t.guideIntro}
                </p>
            </div>

            <div className="space-y-6">
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6" />
                        {t.guideRule1}
                    </h3>
                    <p className="text-slate-300 leading-7 text-justify">
                        {t.guideRule1Desc}
                    </p>
                </section>

                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        {t.guideRule2}
                    </h3>
                    <p className="text-slate-300 leading-7 text-justify">
                        {t.guideRule2Desc}
                    </p>
                </section>

                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 rotate-180" />
                        {t.guideRule3}
                    </h3>
                    <p className="text-slate-300 leading-7 text-justify">
                        {t.guideRule3Desc}
                    </p>
                </section>

                <section className="bg-amber-900/10 p-6 rounded-xl border border-amber-500/20">
                    <h3 className="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        {t.guideRule4}
                    </h3>
                    <p className="text-slate-300 leading-7 text-justify">
                        {t.guideRule4Desc}
                    </p>
                </section>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-center">
             <button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-full font-bold transition shadow-lg"
            >
                {lang === 'ar' ? 'فهمت، لنبدأ' : 'Got it, Let\'s Start'}
            </button>
        </div>
      </div>
    </div>
  );
};