
import React from 'react';
import { AppSettings } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  variant?: 'default' | 'mini';
}

export const CompactAssetSelector: React.FC<Props> = ({ settings, setSettings, variant = 'default' }) => {
  const handleSelect = (index: number) => {
    const selectedAsset = settings.availableAssets[index];
    const newProfitPct = selectedAsset.defaultPayout !== '' 
        ? selectedAsset.defaultPayout 
        : settings.profitPercentage;

    setSettings({ 
        ...settings, 
        selectedAssetIndex: index,
        profitPercentage: newProfitPct
    });
  };

  const handlePayoutChange = (index: number, val: string, e: React.MouseEvent | React.ChangeEvent) => {
      // Prevent button click triggering
      e.stopPropagation();
      const newAssets = [...settings.availableAssets];
      const num = val === '' ? '' : parseFloat(val);
      newAssets[index] = { ...newAssets[index], defaultPayout: num };
      
      // If currently selected, update main profit % too
      if (index === settings.selectedAssetIndex && num !== '') {
          setSettings({ ...settings, availableAssets: newAssets, profitPercentage: num });
      } else {
          setSettings({ ...settings, availableAssets: newAssets });
      }
  };

  return (
    <div className={`grid grid-cols-5 gap-2 w-full h-full ${variant === 'mini' ? 'p-1' : 'px-2 py-2'}`}>
      {settings.availableAssets.map((asset, idx) => {
        const isSelected = settings.selectedAssetIndex === idx;
        const name = asset.name || `Asset ${idx + 1}`;
        const payout = asset.defaultPayout || '';
        
        // Add tour hook to the first item for tutorial
        const tourAttr = idx === 0 ? { "data-tour": "tour-asset-item-0" } : {};

        return (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            {...tourAttr}
            className={`
              relative flex flex-col items-center justify-center rounded-lg transition border overflow-hidden h-full
              ${variant === 'mini' 
                ? 'min-h-[35px] p-0.5' 
                : 'min-h-[60px] p-1'
              }
              ${isSelected 
                ? 'bg-blue-600 text-white border-blue-500 shadow-md transform scale-[1.02] z-10' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
              }
            `}
          >
            <span className={`font-bold truncate w-full text-center ${variant === 'mini' ? 'text-[7px]' : 'text-xs uppercase tracking-wide'}`}>{name}</span>
            <div className={`flex items-center justify-center ${variant === 'mini' ? 'mt-0' : 'mt-1'}`}>
                <input 
                    type="number"
                    value={payout}
                    placeholder="--"
                    onChange={(e) => handlePayoutChange(idx, e.target.value, e)}
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        text-center bg-transparent outline-none font-mono font-bold p-0 border-b border-transparent focus:border-white/50 transition
                        ${variant === 'mini' ? 'text-[10px] w-7 h-4' : 'text-sm w-10 h-5'}
                        ${isSelected ? 'text-green-200 placeholder-green-200/50' : 'text-green-500 placeholder-slate-600'}
                    `}
                />
                <span className={`${variant === 'mini' ? 'text-[9px]' : 'text-xs'} opacity-70`}>%</span>
            </div>
            
            {isSelected && variant !== 'mini' && (
                <div className="absolute top-0.5 right-0.5">
                    <CheckCircle2 className="w-2 h-2 text-white opacity-50" />
                </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
