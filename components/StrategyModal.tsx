
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Activity, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { Language } from '../types';

interface StrategyModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    t: any;
}

// Strategy Types
type StrategyType = 'ronald' | 'ema_sar' | null;

// Ronald Types
type EnvStatus = 'top' | 'bottom' | 'mid' | null;
type AroonStatus = 'up' | 'down' | 'weak' | null;
type AcStatus = 'green' | 'red' | 'weak' | null;

// EMA+SAR Types
type EmaStatus = 'buy' | 'sell' | 'flat' | null;
type SarStatus = 'below' | 'above' | null;
type FilterStatus = 'buy' | 'sell' | 'none' | null;

export const StrategyModal: React.FC<StrategyModalProps> = ({ isOpen, onClose, lang, t }) => {

    // View State
    const [activeStrategy, setActiveStrategy] = useState<StrategyType>(null);


    // Ronald State
    const [env, setEnv] = useState<EnvStatus>(null);
    const [aroon, setAroon] = useState<AroonStatus>(null);
    const [ac, setAc] = useState<AcStatus>(null);
    const [adx, setAdx] = useState<'strong' | 'weak' | null>(null);

    // Ronald Toggles
    const [useEnv, setUseEnv] = useState(true);
    const [useAroon, setUseAroon] = useState(true);
    const [useAc, setUseAc] = useState(true);
    const [useAdx, setUseAdx] = useState(true);

    // EMA+SAR State
    const [ema, setEma] = useState<EmaStatus>(null);
    const [sar, setSar] = useState<SarStatus>(null);
    const [filter, setFilter] = useState<FilterStatus>(null);

    // EMA+SAR Toggles
    const [useEma, setUseEma] = useState(true);
    const [useSar, setUseSar] = useState(true);
    const [useFilter, setUseFilter] = useState(true);

    // Result State
    const [result, setResult] = useState<'buy' | 'sell' | 'wait' | 'partial' | null>(null);

    useEffect(() => {
        if (!isOpen) {
            resetAll();
        }
    }, [isOpen]);

    useEffect(() => {
        analyze();
    }, [env, aroon, ac, adx, ema, sar, filter, activeStrategy, useEnv, useAroon, useAc, useAdx, useEma, useSar, useFilter]);

    const resetAll = () => {
        setActiveStrategy(null);
        resetSelection();
    };

    const resetSelection = () => {
        setEnv(null);
        setAroon(null);
        setAc(null);
        setAdx(null);
        setEma(null);
        setSar(null);
        setFilter(null);
        setResult(null);
        // Reset toggles to true
        setUseEnv(true);
        setUseAroon(true);
        setUseAc(true);
        setUseAdx(true);
        setUseEma(true);
        setUseSar(true);
        setUseFilter(true);
    };

    const analyze = () => {
        if (!activeStrategy) {
            setResult(null);
            return;
        }

        if (activeStrategy === 'ronald') {

            // Define Buy/Sell conditions for each indicator
            const envBuy = !useEnv || (env === 'top');
            const envSell = !useEnv || (env === 'bottom');

            const aroonBuy = !useAroon || (aroon === 'up');
            const aroonSell = !useAroon || (aroon === 'down');

            const acBuy = !useAc || (ac === 'green');
            const acSell = !useAc || (ac === 'red');

            // ADX: Strong (>20) supports both Buy and Sell trends. Weak (<20) supports neither.
            const adxValid = !useAdx || (adx === 'strong');

            // Check for Missing inputs (only if enabled)
            if ((useEnv && !env) || (useAroon && !aroon) || (useAc && !ac) || (useAdx && !adx)) {
                setResult(null);
                return;
            }

            // Logic
            if (envBuy && aroonBuy && acBuy && adxValid) setResult('buy');
            else if (envSell && aroonSell && acSell && adxValid) setResult('sell');
            else setResult('wait');

        } else if (activeStrategy === 'ema_sar') {

            // Conditions
            const emaBuy = !useEma || (ema === 'buy');
            const emaSell = !useEma || (ema === 'sell');

            const sarBuy = !useSar || (sar === 'below');
            const sarSell = !useSar || (sar === 'above');

            const filterBuy = !useFilter || (filter === 'buy');
            const filterSell = !useFilter || (filter === 'sell');

            if ((useEma && !ema) || (useSar && !sar) || (useFilter && !filter)) {
                setResult(null);
                return;
            }

            if (emaBuy && sarBuy && filterBuy) setResult('buy');
            else if (emaSell && sarSell && filterSell) setResult('sell');
            else setResult('wait');
        }
    };

    const isRTL = lang === 'ar';

    if (!isOpen) return null;

    // Reusable 0/1 Control Component
    const FilterControl = ({ active, onToggle }: { active: boolean, onToggle: (val: boolean) => void }) => (
        <div className="flex items-center bg-gray-800 rounded-lg p-0.5 border border-gray-700">
            <button
                onClick={() => onToggle(false)}
                className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all ${!active ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}
            >
                0
            </button>
            <button
                onClick={() => onToggle(true)}
                className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all ${active ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}
            >
                1
            </button>
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className={`bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{ height: '600px', maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="relative z-20 p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight">
                                {activeStrategy ? (activeStrategy === 'ronald' ? t.ronaldTitle : t.emaSarTitle) : t.stratTitle}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {activeStrategy ? (activeStrategy === 'ronald' ? t.ronaldDesc : t.emaSarDesc) : t.stratDesc}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeStrategy && (
                            <button
                                onClick={() => resetAll()}
                                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {t.stratMenuTitle}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative z-50 cursor-pointer"
                            type="button"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Initial Menu: Select Strategy */}
                    {!activeStrategy && (
                        <div className="w-full p-6 space-y-4 overflow-y-auto">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.stratMenuTitle}</h3>

                            {/* Strategy 1 Card */}
                            <button
                                onClick={() => setActiveStrategy('ronald')}
                                className="w-full p-4 rounded-xl bg-gray-800/50 hover:bg-indigo-900/20 border border-gray-700 hover:border-indigo-500/50 transition-all group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                                        1
                                    </div>
                                    <div className="text-start">
                                        <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{t.stratRonald}</h4>
                                        <p className="text-sm text-gray-400">High Win Rate • 30s Expiry</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-gray-500 group-hover:text-indigo-400 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Strategy 2 Card */}
                            <button
                                onClick={() => setActiveStrategy('ema_sar')}
                                className="w-full p-4 rounded-xl bg-gray-800/50 hover:bg-emerald-900/20 border border-gray-700 hover:border-emerald-500/50 transition-all group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                                        2
                                    </div>
                                    <div className="text-start">
                                        <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors">{t.stratEmaSar}</h4>
                                        <p className="text-sm text-gray-400">Trend Following • Pink Filter</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-gray-500 group-hover:text-emerald-400 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    )}

                    {/* Active Strategy View */}
                    {activeStrategy && (
                        <div className="flex flex-col md:flex-row w-full h-full">

                            {/* Input Column */}
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-900/50">

                                {/* ---------------- RONALD PRO INPUTS ---------------- */}
                                {activeStrategy === 'ronald' && (
                                    <>
                                        {/* 1. Envelopes */}
                                        <div className={`space-y-3 transition-opacity ${useEnv ? '' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.checkEnvelopes}</h3>
                                                    <FilterControl active={useEnv} onToggle={setUseEnv} />
                                                </div>
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{t.valEnvelopes}</span>
                                            </div>
                                            <div className="space-y-2 relative">
                                                {!useEnv && <div className="absolute inset-0 z-10 bg-gray-900/50 cursor-not-allowed"></div>}
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${env === 'top' ? 'bg-indigo-500/20 border-indigo-500 shadow-sm' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="env" value="top" checked={env === 'top'} onChange={() => setEnv('top')} className="w-5 h-5 accent-indigo-500" disabled={!useEnv} />
                                                    <span className="text-gray-300 font-medium">{t.optEnvTop}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${env === 'bottom' ? 'bg-indigo-500/20 border-indigo-500 shadow-sm' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="env" value="bottom" checked={env === 'bottom'} onChange={() => setEnv('bottom')} className="w-5 h-5 accent-indigo-500" disabled={!useEnv} />
                                                    <span className="text-gray-300 font-medium">{t.optEnvBottom}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${env === 'mid' ? 'bg-gray-700/50 border-gray-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="env" value="mid" checked={env === 'mid'} onChange={() => setEnv('mid')} className="w-5 h-5 accent-gray-500" disabled={!useEnv} />
                                                    <span className="text-gray-400 text-sm">{t.optEnvMid}</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* 2. Aroon */}
                                        <div className={`space-y-3 transition-opacity ${useAroon ? '' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.checkAroon}</h3>
                                                    <FilterControl active={useAroon} onToggle={setUseAroon} />
                                                </div>
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{t.valAroon}</span>
                                            </div>
                                            <div className="space-y-2 relative">
                                                {!useAroon && <div className="absolute inset-0 z-10 bg-gray-900/50 cursor-not-allowed"></div>}
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${aroon === 'up' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="aroon" value="up" checked={aroon === 'up'} onChange={() => setAroon('up')} className="w-5 h-5 accent-green-500" disabled={!useAroon} />
                                                    <span className="text-gray-300 font-medium">{t.optAroonUp}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${aroon === 'down' ? 'bg-red-500/10 border-red-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="aroon" value="down" checked={aroon === 'down'} onChange={() => setAroon('down')} className="w-5 h-5 accent-red-500" disabled={!useAroon} />
                                                    <span className="text-gray-300 font-medium">{t.optAroonDown}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${aroon === 'weak' ? 'bg-gray-700/50 border-gray-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="aroon" value="weak" checked={aroon === 'weak'} onChange={() => setAroon('weak')} className="w-5 h-5 accent-gray-500" disabled={!useAroon} />
                                                    <span className="text-gray-400 text-sm">{t.optAroonWeak}</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* 3. Accelerator */}
                                        <div className={`space-y-3 transition-opacity ${useAc ? '' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.checkAC}</h3>
                                                    <FilterControl active={useAc} onToggle={setUseAc} />
                                                </div>
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{t.valAC}</span>
                                            </div>
                                            <div className="flex gap-3 relative">
                                                {!useAc && <div className="absolute inset-0 z-10 bg-gray-900/50 cursor-not-allowed"></div>}
                                                <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${ac === 'green' ? 'bg-green-500/20 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                                                    <input type="radio" name="ac" value="green" checked={ac === 'green'} onChange={() => setAc('green')} className="hidden" disabled={!useAc} />
                                                    <span className="text-xs font-bold text-green-300">{t.optAcGreen}</span>
                                                </label>
                                                <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${ac === 'red' ? 'bg-red-500/20 border-red-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                                                    <input type="radio" name="ac" value="red" checked={ac === 'red'} onChange={() => setAc('red')} className="hidden" disabled={!useAc} />
                                                    <span className="text-xs font-bold text-red-300">{t.optAcRed}</span>
                                                </label>
                                                <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${ac === 'weak' ? 'bg-gray-700/50 border-gray-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                                                    <input type="radio" name="ac" value="weak" checked={ac === 'weak'} onChange={() => setAc('weak')} className="hidden" disabled={!useAc} />
                                                    <span className="text-xs font-bold text-gray-400">{t.optAcWeak}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ---------------- EMA + SAR INPUTS ---------------- */}
                                {activeStrategy === 'ema_sar' && (
                                    <>
                                        {/* 1. EMA */}
                                        <div className={`space-y-3 transition-opacity ${useEma ? '' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.checkEma}</h3>
                                                    <FilterControl active={useEma} onToggle={setUseEma} />
                                                </div>
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{t.valEma}</span>
                                            </div>
                                            <div className="space-y-2 relative">
                                                {!useEma && <div className="absolute inset-0 z-10 bg-gray-900/50 cursor-not-allowed"></div>}
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${ema === 'buy' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="ema" value="buy" checked={ema === 'buy'} onChange={() => setEma('buy')} className="w-5 h-5 accent-green-500" disabled={!useEma} />
                                                    <span className="text-gray-300 font-medium">{t.optEmaBuy}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${ema === 'sell' ? 'bg-red-500/10 border-red-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="ema" value="sell" checked={ema === 'sell'} onChange={() => setEma('sell')} className="w-5 h-5 accent-red-500" disabled={!useEma} />
                                                    <span className="text-gray-300 font-medium">{t.optEmaSell}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${ema === 'flat' ? 'bg-gray-700/50 border-gray-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="ema" value="flat" checked={ema === 'flat'} onChange={() => setEma('flat')} className="w-5 h-5 accent-gray-500" disabled={!useEma} />
                                                    <span className="text-gray-400 text-sm">{t.optEmaFlat}</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* 2. SAR */}
                                        <div className={`space-y-3 transition-opacity ${useSar ? '' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.checkSar}</h3>
                                                    <FilterControl active={useSar} onToggle={setUseSar} />
                                                </div>
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{t.valSar}</span>
                                            </div>
                                            <div className="space-y-2 relative">
                                                {!useSar && <div className="absolute inset-0 z-10 bg-gray-900/50 cursor-not-allowed"></div>}
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${sar === 'below' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="sar" value="below" checked={sar === 'below'} onChange={() => setSar('below')} className="w-5 h-5 accent-green-500" disabled={!useSar} />
                                                    <span className="text-gray-300 font-medium">{t.optSarBelow}</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${sar === 'above' ? 'bg-red-500/10 border-red-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <input type="radio" name="sar" value="above" checked={sar === 'above'} onChange={() => setSar('above')} className="w-5 h-5 accent-red-500" disabled={!useSar} />
                                                    <span className="text-gray-300 font-medium">{t.optSarAbove}</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* 3. Filter */}
                                        <div className={`space-y-3 transition-opacity ${useFilter ? '' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.checkFilter}</h3>
                                                    <FilterControl active={useFilter} onToggle={setUseFilter} />
                                                </div>
                                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{t.valFilter}</span>
                                            </div>
                                            <div className="flex gap-3 relative">
                                                {!useFilter && <div className="absolute inset-0 z-10 bg-gray-900/50 cursor-not-allowed"></div>}
                                                <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${filter === 'buy' ? 'bg-green-500/20 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                                                    <input type="radio" name="filter" value="buy" checked={filter === 'buy'} onChange={() => setFilter('buy')} className="hidden" disabled={!useFilter} />
                                                    <span className="text-xs font-bold text-green-300">{t.optFilterBuy}</span>
                                                </label>
                                                <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${filter === 'sell' ? 'bg-red-500/20 border-red-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                                                    <input type="radio" name="filter" value="sell" checked={filter === 'sell'} onChange={() => setFilter('sell')} className="hidden" disabled={!useFilter} />
                                                    <span className="text-xs font-bold text-red-300">{t.optFilterSell}</span>
                                                </label>
                                                <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${filter === 'none' ? 'bg-gray-700/50 border-gray-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                                                    <input type="radio" name="filter" value="none" checked={filter === 'none'} onChange={() => setFilter('none')} className="hidden" disabled={!useFilter} />
                                                    <span className="text-xs font-bold text-gray-400">{t.optFilterNone}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={resetSelection}
                                    className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition flex items-center justify-center gap-2 text-sm"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {t.resetChecklist}
                                </button>
                            </div>

                            {/* Right Column: Result */}
                            <div className="md:w-[280px] bg-slate-900 border-t md:border-t-0 md:border-l border-gray-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                                {!result && (
                                    <div className="text-gray-500 flex flex-col items-center gap-3">
                                        <Activity className="w-12 h-12 opacity-20" />
                                        <p className="text-sm font-medium opacity-50">{t.resultAnalyzing}</p>
                                    </div>
                                )}

                                {result === 'buy' && (
                                    <div className="animate-in zoom-in duration-300 flex flex-col items-center gap-4 relative z-10">
                                        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-pulse">
                                            <CheckCircle2 className="w-12 h-12 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-green-400 mb-2 leading-none">CALL</h2>
                                            <p className="text-white font-bold">{t.resultBuy}</p>
                                        </div>
                                        <div className="mt-4 px-4 py-2 bg-green-900/30 rounded-lg border border-green-500/30 text-green-300 text-xs">
                                            Strong Momentum detected. <br /> Entry Valid.
                                        </div>
                                    </div>
                                )}

                                {result === 'sell' && (
                                    <div className="animate-in zoom-in duration-300 flex flex-col items-center gap-4 relative z-10">
                                        <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-pulse">
                                            <CheckCircle2 className="w-12 h-12 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-red-500 mb-2 leading-none">PUT</h2>
                                            <p className="text-white font-bold">{t.resultSell}</p>
                                        </div>
                                        <div className="mt-4 px-4 py-2 bg-red-900/30 rounded-lg border border-red-500/30 text-red-300 text-xs">
                                            Strong Downward Trend. <br /> Entry Valid.
                                        </div>
                                    </div>
                                )}

                                {result === 'wait' && (
                                    <div className="animate-in fade-in duration-300 flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                                            <AlertCircle className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-300 mb-1">WAIT</h2>
                                            <p className="text-gray-400 text-sm">{t.resultWait}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

