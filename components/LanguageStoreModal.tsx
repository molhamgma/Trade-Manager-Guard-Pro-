import React from 'react';
import { TRANSLATIONS, DOWNLOADABLE_LANGUAGES } from '../constants';
import { Language } from '../types';
import { X, CloudDownload, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInstall: (code: string, name: string) => void;
  installedCodes: string[];
  lang: Language;
}

export const LanguageStoreModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onInstall, 
  installedCodes,
  lang 
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CloudDownload className="w-5 h-5 text-blue-500" />
            {t.languageStore}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-wider">
            {t.availableLangs}
          </p>
          
          <div className="space-y-2">
            {DOWNLOADABLE_LANGUAGES.map((item) => {
              const isInstalled = installedCodes.includes(item.code);
              
              return (
                <div 
                  key={item.code}
                  className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">
                        {item.code}
                      </div>
                    </div>
                  </div>

                  {isInstalled ? (
                    <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-500/20">
                      <Check className="w-3 h-3" />
                      {t.installed}
                    </div>
                  ) : (
                    <button
                      onClick={() => onInstall(item.code, item.name)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-lg shadow-blue-900/20"
                    >
                      <CloudDownload className="w-3 h-3" />
                      {t.install}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};