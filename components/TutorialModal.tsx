import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { X, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TutorialModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [step, setStep] = useState(0);

  const STEPS = [
    { title: t.step1Title, desc: t.step1Desc, highlight: 'none' },
    { title: t.step2Title, desc: t.step2Desc, highlight: 'dashboard' },
    { title: t.step3Title, desc: t.step3Desc, highlight: 'actions' },
    { title: t.step4Title, desc: t.step4Desc, highlight: 'session' },
    { title: t.step5Title, desc: t.step5Desc, highlight: 'settings' },
  ];

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
      if (isLast) onClose();
      else setStep(s => s + 1);
  };

  const handlePrev = () => {
      if (step > 0) setStep(s => s - 1);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-800 w-full max-w-4xl h-[500px] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Text Content */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-slate-900 relative">
            <button onClick={onClose} className="absolute top-4 left-4 text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
            </button>

            <div className="space-y-4">
                <span className="text-blue-500 font-bold tracking-wider text-xs uppercase">{t.tutorialTitle}</span>
                <h2 className="text-3xl font-bold text-white">{current.title}</h2>
                <p className="text-slate-400 text-lg leading-relaxed">{current.desc}</p>
            </div>

            <div className="mt-12 flex items-center gap-4">
                <button 
                    onClick={handlePrev} 
                    disabled={step === 0}
                    className="p-3 rounded-full border border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-30 transition"
                >
                    {lang === 'ar' ? <ChevronRight /> : <ChevronLeft />}
                </button>

                <div className="flex gap-2">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`} />
                    ))}
                </div>

                <button 
                    onClick={handleNext}
                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition shadow-lg shadow-blue-900/20"
                >
                    {isLast ? <X /> : (lang === 'ar' ? <ChevronLeft /> : <ChevronRight />)}
                </button>
            </div>
        </div>

        {/* Right: Visualizer (Wireframe) */}
        <div className="flex-1 bg-slate-800 p-8 flex items-center justify-center border-l border-slate-700 relative overflow-hidden">
             
             {/* The "Phone/App" Wireframe */}
             <div className="w-[240px] h-[420px] bg-slate-900 rounded-[2rem] border-[6px] border-slate-700 shadow-2xl relative flex flex-col p-3 gap-2 overflow-hidden transform transition-transform duration-500 hover:scale-105">
                {/* Header */}
                <div className="h-8 bg-slate-800 rounded-lg w-full flex items-center justify-between px-2">
                    <div className="w-10 h-2 bg-slate-700 rounded-full" />
                    <div className="w-4 h-4 rounded-full bg-slate-700" />
                </div>

                {/* Dashboard (Balance) */}
                <div className={`h-24 bg-slate-800 rounded-xl w-full border border-slate-700 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${current.highlight === 'dashboard' ? 'ring-2 ring-blue-500 bg-slate-800/80' : ''}`}>
                    <div className="w-16 h-3 bg-slate-700 rounded-full" />
                    <div className="w-24 h-6 bg-slate-600 rounded-lg" />
                </div>

                {/* Main Action Buttons */}
                <div className={`flex gap-2 h-20 transition-all duration-300 ${current.highlight === 'actions' ? 'ring-2 ring-blue-500 rounded-xl p-1' : ''}`}>
                    <div className="flex-1 bg-green-900/30 border border-green-800 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-green-700 rounded-full opacity-50" />
                    </div>
                    <div className="flex-1 bg-red-900/30 border border-red-800 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-700 rounded-full opacity-50" />
                    </div>
                </div>

                {/* Session Buttons */}
                <div className={`flex gap-2 h-10 transition-all duration-300 ${current.highlight === 'session' ? 'ring-2 ring-blue-500 rounded-lg p-1' : ''}`}>
                    <div className="flex-1 bg-slate-800 rounded border border-slate-700" />
                    <div className="flex-1 bg-slate-800 rounded border border-slate-700" />
                </div>

                {/* Settings Area */}
                <div className={`flex-1 bg-slate-800/50 rounded-xl border border-slate-700/50 p-2 gap-2 grid grid-cols-2 transition-all duration-300 ${current.highlight === 'settings' ? 'ring-2 ring-blue-500 bg-slate-800' : ''}`}>
                    <div className="bg-slate-700/50 h-6 rounded" />
                    <div className="bg-slate-700/50 h-6 rounded" />
                    <div className="bg-slate-700/50 h-6 rounded col-span-2" />
                    <div className="bg-slate-700/50 h-6 rounded col-span-2" />
                </div>

                {/* Pulsing Marker */}
                {current.highlight !== 'none' && (
                    <div className={`absolute z-10 transition-all duration-500 ease-in-out
                        ${current.highlight === 'dashboard' ? 'top-[70px] left-1/2 -translate-x-1/2' : ''}
                        ${current.highlight === 'actions' ? 'top-[180px] left-1/2 -translate-x-1/2' : ''}
                        ${current.highlight === 'session' ? 'top-[250px] left-1/2 -translate-x-1/2' : ''}
                        ${current.highlight === 'settings' ? 'bottom-[40px] left-1/2 -translate-x-1/2' : ''}
                    `}>
                        <div className="relative">
                            <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-white" />
                            <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0 left-0 animate-ping opacity-75" />
                            <div className="absolute top-0 left-6 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap backdrop-blur">
                                {lang === 'ar' ? 'هنا' : 'Look here'}
                            </div>
                        </div>
                    </div>
                )}
             </div>

        </div>
      </div>
    </div>
  );
};