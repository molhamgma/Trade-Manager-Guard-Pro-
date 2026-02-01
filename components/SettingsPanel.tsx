import React from 'react';
import { AppSettings, Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';
import { Settings, RefreshCw, CheckCircle2, X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  lang: Language;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onReset: () => void;
  profitInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SettingsPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  lang,
  currency,
  setCurrency,
  onReset,
  profitInputRef
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const handleChange = (key: keyof AppSettings, value: string) => {
    if (key === 'strategyName') {
      setSettings({ ...settings, [key]: value });
      return;
    }
    if (value === '') {
      if (key === 'profitPercentage') {
        setSettings({ ...settings, [key]: '' });
      }
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setSettings({ ...settings, [key]: num });
    }
  };

  const handleAssetChange = (index: number, field: 'name' | 'defaultPayout', val: string) => {
    const newAssets = [...settings.availableAssets];

    if (field === 'name') {
      newAssets[index] = { ...newAssets[index], name: val };
    } else {
      const num = val === '' ? '' : parseFloat(val);
      newAssets[index] = { ...newAssets[index], defaultPayout: num };

      if (index === settings.selectedAssetIndex && num !== '') {
        setSettings({ ...settings, availableAssets: newAssets, profitPercentage: num });
        return;
      }
    }
    setSettings({ ...settings, availableAssets: newAssets });
  };

  const handleAssetSelect = (index: number) => {
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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 dark:bg-slate-800 bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-700 border-gray-200 overflow-hidden flex flex-col ma[...]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 dark:border-slate-700 border-gray-200 bg-slate-900 dark:bg-slate-900 bg-gray-50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-500">
            <Settings className="w-5 h-5" />
            {t.settings}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="text-xs bg-red-500/10 text-red-500 px-3 py-1.5 rounded hover:bg-red-500/20 transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> {t.reset}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body - Added extra padding bottom for tour visibility */}
        <div className="flex-1 overflow-y-auto p-6 pb-48 bg-slate-800 dark:bg-slate-800 bg-white text-slate-200 dark:text-slate-200 text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Strategy Name - Full Width */}
            <div className="col-span-full space-y-2 mb-2" data-tour="setting-strategy-name">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.strategyName}</label>
              <div className="text-[12px] text-slate-500 mb-1">{t.strategyPlaceholder}</div>
              <input
                type="text"
                value={settings.strategyName || ''}
                onChange={(e) => handleChange('strategyName', e.target.value)}
                placeholder={t.strategyPlaceholder}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-600"
              />
            </div>

            {/* Capital */}
            <div className="space-y-2" data-tour="setting-capital">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.initialCapital}</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.initialCapital}
                  onChange={(e) => handleChange('initialCapital', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <span className="absolute end-3 top-3 text-slate-500 text-sm">{currency}</span>
              </div>
            </div>

            {/* Initial Stake */}
            <div className="space-y-2" data-tour="setting-stake">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.initialStake}</label>
              <input
                type="number"
                value={settings.initialStake}
                onChange={(e) => handleChange('initialStake', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Currency Selector */}
            <div className="space-y-2" data-tour="setting-currency">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.currency}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                {['USD', 'EUR', 'GBP', 'SAR', 'AED', 'USDT'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Profit % */}
            <div className="space-y-2" data-tour="setting-payout">
              <label className="text-xs font-bold text-green-500 uppercase tracking-wide">{t.profitPct}</label>
              <input
                ref={profitInputRef}
                type="number"
                value={settings.profitPercentage}
                onChange={(e) => handleChange('profitPercentage', e.target.value)}
                placeholder="85"
                className="w-full bg-slate-900 border border-green-500/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none placeholder-slate-600 shadow-[0_0_10px_rgb..."
              />
            </div>

            <div className="col-span-full h-px bg-slate-700 my-2 opacity-50"></div>

            {/* Strategy Multipliers */}
            <div className="contents" data-tour="setting-strategy">
              {/* Win Increase % */}
              <div className="space-y-2" data-tour="setting-win-inc">
                <label className="text-xs font-bold text-green-500 uppercase tracking-wide">{t.winIncPct}</label>
                <input
                  type="number"
                  value={settings.winIncreasePercentage}
                  onChange={(e) => handleChange('winIncreasePercentage', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
                />
              </div>

              {/* Loss Multiplier */}
              <div className="space-y-2" data-tour="setting-loss-mult">
                <label className="text-xs font-bold text-red-500 uppercase tracking-wide">{t.lossMult}</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.lossIncreaseMultiplier}
                  onChange={(e) => handleChange('lossIncreaseMultiplier', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none transition"
                />
              </div>
            </div>

            {/* Max Losses */}
            <div className="space-y-2" data-tour="setting-limits">
              <label className="text-xs font-bold text-red-500 uppercase tracking-wide">{t.maxLosses}</label>
              <input
                type="number"
                value={settings.maxConsecutiveLosses}
                onChange={(e) => handleChange('maxConsecutiveLosses', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none transition"
              />
            </div>

            <div className="col-span-full h-px bg-slate-700 my-2 opacity-50"></div>

            {/* Assets Selection (10 items) */}
            <div className="col-span-full space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">{t.assetsTitle}</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {settings.availableAssets.map((asset, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-3 border transition-all flex flex-col gap-2 cursor-pointer group ${settings.selectedAssetIndex === idx
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                      }`
                    onClick={() => handleAssetSelect(idx)}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {settings.selectedAssetIndex === idx && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    {/* Name Input */}
                    <input
                      type="text"
                      value={asset.name}
                      onChange={(e) => handleAssetChange(idx, 'name', e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-slate-200 outline-none border-b border-transparent hover:border-slate-600 focus:border-blue-500 pb-1 transition-color[...]"
                      placeholder={`Asset ${idx + 1}`}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={() => handleAssetSelect(idx)}
                    />
                    {/* Payout Input */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase">Payout</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={asset.defaultPayout}
                          onChange={(e) => handleAssetChange(idx, 'defaultPayout', e.target.value)}
                          className="w-12 text-right bg-transparent text-sm font-mono font-bold text-green-400 outline-none"
                          placeholder="--"
                          onClick={(e) => e.stopPropagation()}
                          onFocus={() => handleAssetSelect(idx)}
                        />
                        <span className="text-[10px] text-green-600">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 dark:border-slate-700 border-gray-200 bg-slate-900 dark:bg-slate-900 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-900/20"
          >
            <Save className="w-5 h-5" />
            {t.saveAndReturn}
          </button>
        </div>
      </div>
    </div>
  );
};