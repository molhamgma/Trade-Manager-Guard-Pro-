
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, KeyboardShortcuts } from '../types';
import { X, Keyboard, Command } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcuts;
  onSave: (s: KeyboardShortcuts) => void;
  lang: Language;
}

export const HotkeysModal: React.FC<Props> = ({ isOpen, onClose, shortcuts, onSave, lang }) => {
  const [localShortcuts, setLocalShortcuts] = useState(shortcuts);
  const [editingKey, setEditingKey] = useState<keyof KeyboardShortcuts | null>(null);
  
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  useEffect(() => {
      setLocalShortcuts(shortcuts);
  }, [shortcuts, isOpen]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (editingKey) {
              e.preventDefault();
              setLocalShortcuts(prev => ({ ...prev, [editingKey]: e.key.toLowerCase() }));
              setEditingKey(null);
          }
      };

      if (editingKey) {
          window.addEventListener('keydown', handleKeyDown);
      }
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-500" />
            {t.keyboardShortcuts}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
             {[
                 { key: 'win', label: t.winAction },
                 { key: 'loss', label: t.lossAction },
                 { key: 'newSession', label: t.newSession },
                 { key: 'reset', label: t.reset }
             ].map((item) => (
                 <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                     <span className="text-slate-300 font-medium">{item.label}</span>
                     <button 
                        onClick={() => setEditingKey(item.key as keyof KeyboardShortcuts)}
                        className={`min-w-[80px] px-3 py-1.5 rounded text-sm font-mono font-bold transition flex items-center justify-center gap-2
                            ${editingKey === item.key 
                                ? 'bg-blue-600 text-white animate-pulse' 
                                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            }
                        `}
                     >
                         {editingKey === item.key ? (
                             t.pressKey
                         ) : (
                             <>
                                <Command className="w-3 h-3 opacity-50" />
                                {localShortcuts[item.key as keyof KeyboardShortcuts].toUpperCase()}
                             </>
                         )}
                     </button>
                 </div>
             ))}
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-end">
             <button 
                onClick={() => { onSave(localShortcuts); onClose(); }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition"
             >
                 {t.saveChanges}
             </button>
        </div>
      </div>
    </div>
  );
};