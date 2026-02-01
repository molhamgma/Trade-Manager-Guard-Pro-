import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  isActive: boolean;
  onClose: () => void;
  lang: Language;
  onSetSettingsOpen: (isOpen: boolean) => void;
  onSetMiniMode: (isOpen: boolean) => void;
}

export const OnboardingTour: React.FC<Props> = ({ isActive, onClose, lang, onSetSettingsOpen, onSetMiniMode }) => {
  if (!isActive) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [subTargetRects, setSubTargetRects] = useState<{win: DOMRect, loss: DOMRect} | null>(null);
  
  const STEPS = [
    { targetId: 'tour-balance', title: t.tourBalanceTitle, desc: t.tourBalanceDesc },
    { targetId: 'tour-stake', title: t.tourStakeTitle, desc: t.tourStakeDesc },
    { targetId: 'tour-win-loss-buttons', title: t.tourActionsTitle, desc: t.tourActionsDesc },
    { targetId: 'tour-session', title: t.tourSessionTitle, desc: t.tourSessionDesc },
    { targetId: 'tour-assets', title: t.tourAssetsTitle, desc: t.tourAssetsEditDesc },
    { targetId: 'tour-asset-item-0', title: t.tourAssetEditTitle, desc: t.tourAssetEditDesc }, // Step 6
    { targetId: 'tour-chart', title: t.tourChartTitle, desc: t.tourChartDesc },
    { targetId: 'tour-history', title: t.tourHistoryTitle, desc: t.tourHistoryDesc }, // Step 8
    { targetId: 'tour-archive', title: t.tourArchiveTitle, desc: t.tourArchiveDesc + ' ' + t.tourArchiveActionsDesc },
    // Mini Mode Section
    { targetId: 'tour-mini-mode', title: t.tourMiniModeTitle, desc: t.tourMiniModeDesc },
    { targetId: 'mini-window', title: t.tourMiniWindowTitle, desc: t.tourMiniWindowDesc },
    { targetId: 'mini-controls', title: t.tourMiniControlsTitle, desc: t.tourMiniControlsDesc },
    { targetId: 'mini-opacity', title: t.tourMiniOpacityTitle, desc: t.tourMiniOpacityDesc },
    
    { targetId: 'tour-menu-btn', title: t.tourMenuTitle, desc: t.tourMenuDesc },
    { targetId: 'tour-config-btn', title: t.tourConfigTitle, desc: t.tourConfigDesc },
    // Settings Modal Steps
    { targetId: 'setting-capital', title: t.tourCapitalTitle, desc: t.tourCapitalDesc },
    { targetId: 'setting-stake', title: t.tourInitStakeTitle, desc: t.tourInitStakeDesc },
    { targetId: 'setting-currency', title: t.tourCurrencyTitle, desc: t.tourCurrencyDesc },
    { targetId: 'setting-payout', title: t.tourPayoutTitle, desc: t.tourPayoutDesc },
    { targetId: 'setting-win-inc', title: t.tourWinIncTitle, desc: t.tourWinIncDesc },
    { targetId: 'setting-loss-mult', title: t.tourLossMultTitle, desc: t.tourLossMultDesc },
    { targetId: 'setting-limits', title: t.tourLimitsTitle, desc: t.tourLimitsDesc },
  ];

  const currentStepData = STEPS[step];
  
  // Color Cycling for Border/Arrow
  const colors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#ec4899'];
  const currentColor = colors[step % colors.length];

  // Logic to open/close Settings & Mini Mode based on step
  useEffect(() => {
    const target = currentStepData.targetId;
    
    // Check Settings
    const isSettingStep = target.startsWith('setting-');
    if (isSettingStep) {
      onSetSettingsOpen(true);
      onSetMiniMode(false); 
    } else {
      onSetSettingsOpen(false);
    }

    // Check Mini Mode
    const isMiniModeStep = target.startsWith('mini-'); 
    if (isMiniModeStep) {
        onSetMiniMode(true);
        onSetSettingsOpen(false); 
    } else {
        if (target !== 'tour-mini-mode') {
            onSetMiniMode(false);
        }
    }

  }, [step, currentStepData.targetId]); 

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let secondPassId: ReturnType<typeof setTimeout>;

    const calculatePositions = () => {
      let currentTargetBounds: DOMRect | null = null;
      let visibleEl: Element | null = null;

      // Special handling for Win/Loss buttons group
      if (currentStepData.targetId === 'tour-win-loss-buttons') {
          const winBtn = document.querySelector(`[data-tour="tour-win-button"]`);
          const lossBtn = document.querySelector(`[data-tour="tour-loss-button"]`);
          
          if (winBtn && lossBtn) {
              const wRect = winBtn.getBoundingClientRect();
              const lRect = lossBtn.getBoundingClientRect();
              
              if (wRect.width > 0 && wRect.height > 0 && lRect.width > 0 && lRect.height > 0) {
                  setSubTargetRects({ win: wRect, loss: lRect });
                  setTargetRect(null); 

                  winBtn.scrollIntoView({ behavior: 'auto', block: 'center' });
                  return; 
              } else {
                  setSubTargetRects(null);
                  setTargetRect(null); 
              }
          } else {
              setSubTargetRects(null);
              setTargetRect(null);
          }
      } else {
          // Standard selector
          const elements = document.querySelectorAll(`[data-tour="${currentStepData.targetId}"]`);
          // Use loop to find visible element if multiple exist
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const rect = el.getBoundingClientRect();
            // Check if element is visible and has dimension
            if (rect.width > 0 && rect.height > 0) {
              visibleEl = el;
              currentTargetBounds = rect;
              break;
            }
          }

          if (visibleEl && currentTargetBounds) {
              setTargetRect(currentTargetBounds);
              setSubTargetRects(null);
          } else {
              setTargetRect(null);
              setSubTargetRects(null);
          }
      }

      // Scroll into view logic (using auto/instant to prevent smooth scroll timing issues)
      if (visibleEl) {
        visibleEl.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    };

    // Calculate immediately
    calculatePositions();

    // And calculate again after a small delay to catch any layout shifts
    timeoutId = setTimeout(calculatePositions, 100);
    
    // For heavy transitions (like modal opening), check again later
    secondPassId = setTimeout(calculatePositions, 400);

    const handleResizeOrScroll = () => {
        calculatePositions();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll); 
    
    return () => {
        window.removeEventListener('resize', handleResizeOrScroll);
        window.removeEventListener('scroll', handleResizeOrScroll);
        clearTimeout(timeoutId);
        clearTimeout(secondPassId);
    };
  }, [step, currentStepData.targetId]); 

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };
  
  // --- Render Highlight Frame ---
  const renderHighlight = (rect: DOMRect) => (
      <div 
        className="absolute transition-all duration-300 ease-in-out border-4 rounded-xl pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.5)] z-[131]"
        style={{
            top: rect.top - 4, 
            left: rect.left - 4, 
            width: rect.width + 8,
            height: rect.height + 8,
            borderColor: currentColor
        }}
    />
  );

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[130]">
      
      {targetRect && !subTargetRects && renderHighlight(targetRect)}

      {subTargetRects && (
          <>
            {renderHighlight(subTargetRects.win)}
            {renderHighlight(subTargetRects.loss)}
          </>
      )}

      {/* Fixed Bottom Hint Box Explanation */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700 pointer-events-auto z-[132] animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-lg"
      >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: currentColor }}>
                      STEP {step + 1} / {STEPS.length}
                  </span>
                  <h3 className="text-lg font-bold text-white">{currentStepData.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mt-1">
                      {currentStepData.desc}
                  </p>
              </div>
              
              <div className="flex-shrink-0 flex items-center gap-2">
                  <button 
                      onClick={handlePrev}
                      disabled={step === 0}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition font-medium text-sm"
                  >
                      {lang === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                      {t.prevHint}
                  </button>
                  
                  <button 
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl text-white font-bold transition flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 text-sm"
                      style={{ backgroundColor: currentColor }}
                  >
                      {step === STEPS.length - 1 ? t.finishHint : t.nextHint}
                      {step !== STEPS.length - 1 && (lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};