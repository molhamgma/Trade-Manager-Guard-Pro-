
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Currency, Language, AppSettings } from '../types';
import { TrendingUp, TrendingDown, X, PlayCircle, Smartphone, GripHorizontal, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { CompactAssetSelector } from './CompactAssetSelector';

interface Props {
  state: AppState;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  currency: Currency;
  lang: Language;
  onWin: () => void;
  onLoss: () => void;
  onNewSession: () => void;
  onClose: () => void;
  isMaxLossReached: boolean;
  forceOverlay?: boolean;
}

export const MiniMode: React.FC<Props> = ({
  state,
  settings,
  setSettings,
  currency,
  lang,
  onWin,
  onLoss,
  onNewSession,
  onClose,
  isMaxLossReached,
  forceOverlay = false
}) => {
  const t = TRANSLATIONS[lang];

  // Dragging state - Use safe initial position (avoid negative X on mobile)
  const [position, setPosition] = useState({
    x: Math.max(20, typeof window !== 'undefined' ? window.innerWidth - 380 : 0),
    y: 100
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showCopied, setShowCopied] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    // Truncate to 2 decimal places without rounding
    const val = Math.floor(state.currentStake * 100) / 100;
    navigator.clipboard.writeText(val.toFixed(2));
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 300);
  };


  // Handle Drag Start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (forceOverlay) return; // Disable drag during tour
    if (windowRef.current) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle Drag Move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // CSS classes based on mode (Overlay vs Floating)
  // When floating (!forceOverlay), wrapper must be inset-0 to define coordinate system, 
  // but pointer-events-none so we can click through it.
  const containerClasses = forceOverlay
    ? "fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
    : "fixed inset-0 z-[100] pointer-events-none";

  // When floating, use absolute positioning with state coords
  const windowStyle = forceOverlay
    ? {}
    : { left: position.x, top: position.y };

  return (
    <div className={containerClasses}>
      <div
        ref={windowRef}
        style={windowStyle}
        className={`
                bg-slate-800 w-full md:max-w-[360px] 
                ${forceOverlay ? 'h-full md:h-auto rounded-none md:rounded-2xl' : 'max-w-[360px] rounded-2xl'}
                shadow-2xl border border-slate-700 overflow-hidden flex flex-col
                ${forceOverlay
            ? 'relative' // No animation in tour mode to prevent distortion
            : 'absolute pointer-events-auto'
          }
            `}
        data-tour="mini-window"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900 ${!forceOverlay ? 'cursor-move' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-white">
            {forceOverlay ? <Smartphone className="w-5 h-5 text-blue-500" /> : <GripHorizontal className="w-5 h-5 text-slate-500" />}
            <span className="font-bold text-sm">{t.miniMode}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-slate-800"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-0 flex-1 flex flex-col justify-between ${forceOverlay ? 'overflow-y-auto' : ''}`}>
          {/* Asset Selector Section */}
          <div className="bg-slate-900/50 border-b border-slate-700 p-2">
            <CompactAssetSelector settings={settings} setSettings={setSettings} variant="mini" />
          </div>

          {/* Main Controls */}
          <div
            className="p-4 flex items-center justify-between gap-3 flex-1"
            data-tour="mini-controls"
          >
            {/* WIN BUTTON */}
            <button
              onClick={onWin}
              onMouseDown={(e) => e.stopPropagation()}
              className="flex-1 h-24 bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 active:scale-[0.97] text-white rounded-xl flex flex-col items-center justify-center transition shadow-lg shadow-green-900/20 border border-green-500/30 group"
            >
              <TrendingUp className="w-6 h-6 mb-2 group-hover:scale-110 transition" />
              <span className="font-bold text-sm tracking-wider">{t.win}</span>
            </button>

            {/* CENTER INFO */}
            <div className="flex flex-col gap-3 items-center justify-center w-24">
              <div
                className="w-full flex flex-col items-center justify-center bg-slate-900 rounded-xl py-3 border border-slate-700 shadow-inner cursor-pointer hover:bg-slate-800 transition relative overflow-hidden"
                onClick={handleCopy}
                title="Click to copy"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {showCopied && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <span className="text-green-400 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Copied!
                    </span>
                  </div>
                )}
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Next</span>
                <div className="text-xl font-bold text-white font-mono leading-none">{state.currentStake.toFixed(2)}</div>
                <span className="text-[10px] text-blue-500 mt-1 font-bold">{currency}</span>
              </div>

              <button
                onClick={onNewSession}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full bg-slate-700 hover:bg-slate-600 text-blue-200 text-[10px] py-2 rounded-lg border border-slate-600 flex items-center justify-center gap-1 transition font-bold"
                title={t.newSession}
              >
                <PlayCircle className="w-3 h-3" />
                <span>Session</span>
              </button>
            </div>

            {/* LOSS BUTTON */}
            <button
              onClick={onLoss}
              onMouseDown={(e) => e.stopPropagation()}
              disabled={isMaxLossReached}
              className={`flex-1 h-24 rounded-xl flex flex-col items-center justify-center transition border group
                            ${isMaxLossReached
                  ? 'bg-slate-700 opacity-50 cursor-not-allowed border-slate-600 shadow-none'
                  : 'bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 active:scale-[0.97] text-white shadow-lg shadow-red-900/20 border-red-500/30'
                }`}
            >
              <TrendingDown className="w-6 h-6 mb-2 group-hover:scale-110 transition" />
              <span className="font-bold text-sm tracking-wider">{t.loss}</span>
            </button>
          </div>

          {/* Footer Info / Opacity Mock */}
          <div
            className="h-8 bg-slate-900 border-t border-slate-700 flex items-center justify-center gap-2"
            data-tour="mini-opacity"
          >
            <span className="text-[10px] text-slate-500 font-bold">Standard Layout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
