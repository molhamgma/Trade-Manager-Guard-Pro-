
# Trade Manager Guard Pro V1.1 - Comprehensive Technical Documentation
**Date:** 2026-01-31
**Author:** Antigravity (Assistant)

---

## 📘 1. Introduction & Overview
**Trade Manager Guard Pro** is not just a trading journal; it is a sophisticated **Money Management System** designed to protect capital and optimize profits using mathematical probability models.

### Core Philosophy
1.  **Capital Protection**: The system enforces a strict **2% Initial Stake** rule.
2.  **Profit Maximization**: Uses a **Compound Interest** model on wins (increasing stake by a set %).
3.  **Loss Recovery**: Implements a calculated **Martingale-like Multiplier (2.84x)** to recover losses + profit in a single win.
4.  **Anti-Blowout**: Hard limit on consecutive losses (Max 3-5) to prevent emotional trading (Revenge Trading).

---

## 🛠 2. Technical Architecture

### Tech Stack
-   **Frontend Framework**: React 18 (Functional Components + Hooks)
-   **Language**: TypeScript (Strict Typing)
-   **Build Tool**: Vite (Fast HMR & Bundling)
-   **Styling**: TailwindCSS (Utility-first CSS)
-   **Icons**: Lucide-React
-   **Charts**: Recharts (for Performance Graph)
-   **State Persistence**: LocalStorage (Data survives refresh)

### Key Components Structure
*   **App.tsx**: The "Brain" of the application. Handles the main state machine (Idle -> Trade -> Win/Loss -> Calculation).
*   **SessionManager**: Manages the lifecycle of a trading session (Start -> Trade Loop -> Reset/Archive).
*   **SettingsPanel**: Controls the mathematical variables (Risk %, Multipliers, Assets).
*   **StrategyModal**: A decision-support tool that provides checklists for common strategies (Ronald PRO, EMA+SAR).
*   **SessionReportModal**: Generates PDF reports and visualizes session performance.

---

## 💻 3. Source Code
The following is the complete source code for the project.

---
### 📄 File: App.tsx
```typescript

import React, { useState, useEffect, useRef } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { TradeHistory } from './components/TradeHistory';
import { PerformanceChart } from './components/PerformanceChart';
import { ArchiveChart } from './components/ArchiveChart';
import { SessionManager } from './components/SessionManager';
import { MiniMode } from './components/MiniMode';
import { Auth } from './components/Auth';
import { CompactAssetSelector } from './components/CompactAssetSelector';
import { LanguageStoreModal } from './components/LanguageStoreModal';
import { AboutModal } from './components/AboutModal';
import { TutorialModal } from './components/TutorialModal';
import { WelcomeModal } from './components/WelcomeModal';
import { StrategyModal } from './components/StrategyModal';
import { OnboardingTour } from './components/OnboardingTour';
import { ProfileModal } from './components/ProfileModal';
import { HotkeysModal } from './components/HotkeysModal';
import { SessionReportModal } from './components/SessionReportModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AppState, AppSettings, Trade, Session, INITIAL_SETTINGS, Language, Currency, User, KeyboardShortcuts, DEFAULT_SHORTCUTS } from './types';
import { TRANSLATIONS, DOWNLOADABLE_LANGUAGES, BASE_LANGUAGES } from './constants';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Activity,
    Globe,
    PlayCircle,
    RefreshCw,
    LogOut,
    User as UserIcon,
    Loader2,
    Menu,
    BookOpen,
    HelpCircle,
    Settings,
    Moon,
    Sun,
    Layers,
    Smartphone,
    Keyboard,
    ChevronDown,
    Maximize2,
    AlertTriangle,
    Info
} from 'lucide-react';

// --- Shared Components ---

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute inset-0 bg-green-500 blur-lg opacity-20 dark:opacity-40 rounded-full"></div>
        <svg viewBox="0 0 24 24" fill="none" className="relative z-10 w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
            </defs>
            <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    colorClass: string;
    subValue?: string;
    onEdit?: (val: string) => void;
    isEditable?: boolean;
    onMax?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, colorClass, subValue, onEdit, isEditable, onMax }) => (
    <div className="bg-slate-800 dark:bg-slate-800 bg-white p-4 rounded-xl shadow border border-slate-700 dark:border-slate-700 border-gray-200 flex flex-col justify-between relative overflow-hidden group h-full">
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition"></div>
        <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-slate-400 dark:text-slate-500 text-gray-600 font-medium text-sm">{label}</span>
            <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <div className="relative z-10">
            <div className="flex items-baseline gap-2">
                {isEditable && onEdit ? (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onEdit(e.target.value)}
                        className={`text-2xl font-bold bg-transparent border-b border-dashed border-slate-600 w-full outline-none focus:border-blue-500 font-mono ${colorClass}`}
                    />
                ) : (
                    <div className={`text-2xl font-bold font-mono ${colorClass.includes('text-white') ? 'text-white dark:text-white text-black' : 'text-white dark:text-white text-black'}`}>{value}</div>
                )}

                {onMax && (
                    <button
                        onClick={onMax}
                        className="px-1.5 py-0.5 bg-slate-700 hover:bg-blue-600 text-[10px] font-bold text-slate-300 hover:text-white rounded transition uppercase tracking-wide"
                        title="Max (All In)"
                    >
                        MAX
                    </button>
                )}
            </div>
            {subValue && <div className="text-xs text-slate-500 dark:text-slate-500 text-gray-600 mt-1">{subValue}</div>}
        </div>
    </div>
);

interface UserMenuProps {
    user: User;
    t: any;
    onClose: () => void;
    onLogout: () => void;
    onContact: () => void;
    onTutorial: () => void;
    onAbout: () => void;
    onExportPDF: () => void;
    onEditProfile: () => void;
    onHotkeys: () => void;
    lang: Language;
    availableLanguages: { code: string, name: string }[];
    onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isDownloading: boolean;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
    user,
    t,
    onLogout,
    onContact,
    onTutorial,
    onAbout,
    onEditProfile,
    onHotkeys,
    lang,
    availableLanguages,
    onLanguageChange,
    isDownloading,
    theme,
    onToggleTheme
}) => {
    return (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 dark:bg-slate-800 bg-white rounded-xl shadow-2xl border border-slate-700 dark:border-slate-700 border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
            <div className="p-4 border-b border-slate-700 dark:border-slate-700 border-gray-100 bg-slate-900/50 dark:bg-slate-900/50 bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white border-2 border-slate-700 overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-white dark:text-slate-200 text-black truncate">{user.name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-400 text-gray-500 truncate">{user.email}</div>
                    </div>
                </div>
            </div>

            <div className="p-2 space-y-1 text-slate-300 dark:text-slate-300 text-black">

                {/* Theme Toggle */}
                <button onClick={onToggleTheme} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 dark:hover:bg-slate-700 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                        {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                        <span>{theme === 'dark' ? t.darkMode : t.lightMode}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'left-4' : 'left-0.5'}`} />
                    </div>
                </button>

                {/* Language Section */}
                <div className="px-2 py-2 mb-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold mb-2 px-1">
                        <Globe className="w-3 h-3" /> Language
                    </div>
                    <div className="relative">
                        {isDownloading ? (
                            <div className="flex items-center gap-2 bg-slate-900 text-slate-400 px-3 py-2 rounded-lg border border-slate-700">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span className="text-xs">{t.downloading}</span>
                            </div>
                        ) : (
                            <select
                                value={lang}
                                onChange={onLanguageChange}
                                className="w-full appearance-none bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-sm pl-8 pr-4 py-2 rounded-lg border border-slate-700 outline-none focus:ring-1 focus:ring-blue-500 transition shadow-lg"
                            >
                                {availableLanguages.map(l => (
                                    <option key={l.code} value={l.code}>{l.name}</option>
                                ))}
                                <option disabled>──────────</option>
                                <option value="add_new">+ {t.addLanguage}</option>
                            </select>
                        )}
                        {!isDownloading && <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />}
                    </div>
                </div>

                <div className="h-px bg-slate-700 my-1 mx-2"></div>

                <button onClick={onEditProfile} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition">
                    <UserIcon className="w-4 h-4" /> {t.profile}
                </button>
                <button onClick={onHotkeys} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition">
                    <Keyboard className="w-4 h-4" /> {t.keyboardShortcuts}
                </button>
                <button onClick={onAbout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition">
                    <BookOpen className="w-4 h-4" /> {t.strategyGuide}
                </button>
                <button onClick={onTutorial} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition">
                    <PlayCircle className="w-4 h-4" /> {t.appTutorial}
                </button>
                <button onClick={onContact} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition">
                    <HelpCircle className="w-4 h-4" /> {t.contactSupport}
                </button>

                <div className="h-px bg-slate-700 my-1 mx-2"></div>

                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-bold">
                    <LogOut className="w-4 h-4" /> {t.signOut}
                </button>
            </div>
        </div>
    );
};

export const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [lang, setLang] = useState<Language>('en');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [installedLanguages, setInstalledLanguages] = useState<string[]>(['en', 'ar']);
    const [isDownloading, setIsDownloading] = useState(false);

    const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
    const [state, setState] = useState<AppState>({
        currentBalance: INITIAL_SETTINGS.initialCapital,
        currentStake: INITIAL_SETTINGS.initialStake,
        nextStake: INITIAL_SETTINGS.initialStake,
        lastWinningStake: INITIAL_SETTINGS.initialStake,
        consecutiveLosses: 0,
        trades: [],
        sessions: []
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMiniMode, setIsMiniMode] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLangStoreOpen, setIsLangStoreOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [tourActive, setTourActive] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'error' | 'info' } | null>(null);

    const [reportSession, setReportSession] = useState<Session | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const [shortcuts, setShortcuts] = useState<KeyboardShortcuts>(DEFAULT_SHORTCUTS);

    const profitInputRef = useRef<HTMLInputElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    // Detect Mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768; // Standard mobile/tablet breakpoint
            setIsMobile(mobile);
            if (mobile) setIsMiniMode(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem('tg_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedSettings = localStorage.getItem('tg_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));

        const savedState = localStorage.getItem('tg_state');
        if (savedState) setState(JSON.parse(savedState));

        const savedLang = localStorage.getItem('tg_lang') as Language;
        if (savedLang) setLang(savedLang);

        const savedCurrency = localStorage.getItem('tg_currency') as Currency;
        if (savedCurrency) setCurrency(savedCurrency);

        const savedShortcuts = localStorage.getItem('tg_shortcuts');
        if (savedShortcuts) setShortcuts(JSON.parse(savedShortcuts));

        const welcomeSeen = localStorage.getItem('tg_welcome_seen');
        if (!welcomeSeen && savedUser) setIsWelcomeOpen(true);

        const savedTheme = localStorage.getItem('tg_theme') as 'dark' | 'light';
        if (savedTheme) setTheme(savedTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem('tg_settings', JSON.stringify(settings));
        localStorage.setItem('tg_state', JSON.stringify(state));
        localStorage.setItem('tg_lang', lang);
        localStorage.setItem('tg_currency', currency);
        localStorage.setItem('tg_shortcuts', JSON.stringify(shortcuts));
        if (user) localStorage.setItem('tg_user', JSON.stringify(user));
        localStorage.setItem('tg_theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings, state, lang, currency, shortcuts, user, theme]);

    // Toast timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Click outside listener for User Menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

    // Sync settings with dashboard when settings change (only if fresh session)
    useEffect(() => {
        const safeInitialStake = Math.max(1, settings.initialStake);

        if (state.trades.length === 0) {
            setState(prev => ({
                ...prev,
                currentBalance: settings.initialCapital,
                currentStake: safeInitialStake,
                nextStake: safeInitialStake,
                lastWinningStake: safeInitialStake
            }));
        }
    }, [settings.initialCapital, settings.initialStake]);

    const isBankrupt = state.nextStake > state.currentBalance;

    const handleWin = () => {
        if (state.currentBalance < 1) {
            setToast({ message: t.balanceCritical, type: 'error' });
            return;
        }
        if (isBankrupt) {
            setToast({ message: t.balanceLow, type: 'error' });
            return;
        }

        const profitPercentage = typeof settings.profitPercentage === 'number' ? settings.profitPercentage : 85;
        const profit = state.currentStake * (profitPercentage / 100);
        const newBalance = state.currentBalance + profit;

        const newTrade: Trade = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            asset: settings.availableAssets[settings.selectedAssetIndex].name || 'Unknown',
            stake: state.currentStake,
            outcome: 'WIN',
            profit: profit,
            balanceAfter: newBalance,
        };

        let nextStake: number;
        let currentBaseline = state.lastWinningStake || settings.initialStake;

        if (state.consecutiveLosses > 0) {
            // Recovery Win
            nextStake = currentBaseline;
        } else {
            // Normal Win
            nextStake = state.currentStake * (1 + settings.winIncreasePercentage / 100);
            currentBaseline = nextStake;
        }

        nextStake = Math.max(1, nextStake);
        currentBaseline = Math.max(1, currentBaseline);

        setState(prev => ({
            ...prev,
            currentBalance: newBalance,
            currentStake: nextStake,
            nextStake: nextStake,
            lastWinningStake: currentBaseline,
            consecutiveLosses: 0,
            trades: [newTrade, ...prev.trades]
        }));
    };

    const handleLoss = () => {
        if (state.currentBalance < 1) {
            setToast({ message: t.balanceCritical, type: 'error' });
            return;
        }
        if (state.consecutiveLosses >= settings.maxConsecutiveLosses) {
            setToast({ message: t.maxLossHit, type: 'error' });
            return;
        }
        if (isBankrupt) {
            setToast({ message: t.balanceLow, type: 'error' });
            return;
        }

        const loss = state.currentStake;
        const newBalance = state.currentBalance - loss;

        const newTrade: Trade = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            asset: settings.availableAssets[settings.selectedAssetIndex].name || 'Unknown',
            stake: loss,
            outcome: 'LOSS',
            profit: -loss,
            balanceAfter: newBalance,
        };

        let nextStake = state.currentStake * settings.lossIncreaseMultiplier;
        nextStake = Math.max(1, nextStake);

        const nextConsecutiveLosses = state.consecutiveLosses + 1;

        setState(prev => ({
            ...prev,
            currentBalance: newBalance,
            currentStake: nextStake,
            nextStake: nextStake,
            consecutiveLosses: nextConsecutiveLosses,
            trades: [newTrade, ...prev.trades]
        }));
    };

    const handleNewSession = () => {
        const wins = state.trades.filter(t => t.outcome === 'WIN');
        const losses = state.trades.filter(t => t.outcome === 'LOSS');

        const netProfit = state.trades.reduce((acc, t) => acc + t.profit, 0);

        if (state.trades.length > 0) {
            const newSession: Session = {
                id: Date.now().toString(),
                startTime: state.trades[state.trades.length - 1].timestamp,
                endTime: Date.now(),
                startBalance: state.currentBalance - netProfit,
                endBalance: state.currentBalance,
                netProfit: netProfit,
                tradeCount: state.trades.length,
                winCount: wins.length,
                lossCount: losses.length,
                trades: state.trades,
                strategyName: settings.strategyName
            };

            setState(prev => ({
                ...prev,
                sessions: [newSession, ...prev.sessions]
            }));
        }

        let safeStake = state.currentBalance > 0 ? state.currentBalance * 0.02 : settings.initialStake;
        safeStake = Math.max(1, safeStake);

        setState(prev => ({
            ...prev,
            currentStake: safeStake,
            nextStake: safeStake,
            lastWinningStake: safeStake,
            consecutiveLosses: 0,
            trades: []
        }));
    };

    const executeReset = () => {
        setState(prev => {
            let newSessions = prev.sessions;
            if (prev.trades.length > 0) {
                const wins = prev.trades.filter(t => t.outcome === 'WIN');
                const losses = prev.trades.filter(t => t.outcome === 'LOSS');
                const netProfit = prev.trades.reduce((acc, t) => acc + t.profit, 0);

                const newSession: Session = {
                    id: Date.now().toString(),
                    startTime: prev.trades[prev.trades.length - 1].timestamp,
                    endTime: Date.now(),
                    startBalance: prev.currentBalance - netProfit,
                    endBalance: prev.currentBalance,
                    netProfit: netProfit,
                    tradeCount: prev.trades.length,
                    winCount: wins.length,
                    lossCount: losses.length,
                    trades: prev.trades,
                    strategyName: settings.strategyName
                };
                newSessions = [newSession, ...prev.sessions];
            }

            const safeInitialStake = Math.max(1, settings.initialStake);

            return {
                ...prev,
                currentBalance: settings.initialCapital,
                currentStake: safeInitialStake,
                nextStake: safeInitialStake,
                lastWinningStake: safeInitialStake,
                consecutiveLosses: 0,
                trades: [],
                sessions: newSessions
            };
        });
        setIsSettingsOpen(false);
    };

    const handleResetClick = () => {
        setShowResetConfirm(true);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('tg_user');
        setIsUserMenuOpen(false);
    };

    // Helper to view current session report using the unified modal
    const handleViewCurrentReport = () => {
        const wins = state.trades.filter(t => t.outcome === 'WIN');
        const losses = state.trades.filter(t => t.outcome === 'LOSS');
        const netProfit = state.trades.reduce((acc, t) => acc + t.profit, 0);

        // Calculate estimated start balance for current session view
        const currentSessionStartBalance = state.currentBalance - netProfit;

        const tempSession: Session = {
            id: `CURRENT-${Date.now()}`,
            startTime: state.trades.length > 0 ? state.trades[state.trades.length - 1].timestamp : Date.now(),
            endTime: Date.now(),
            startBalance: currentSessionStartBalance,
            endBalance: state.currentBalance,
            netProfit: netProfit,
            tradeCount: state.trades.length,
            winCount: wins.length,
            lossCount: losses.length,
            trades: state.trades,
            strategyName: settings.strategyName
        };
        setReportSession(tempSession);
    };

    // Helper to view ALL sessions summary report
    const handleViewArchiveReport = () => {
        if (state.sessions.length === 0) return;

        // Aggregate all data
        // sessions are ordered Newest First in state.sessions
        // So sessions[length-1] is the oldest session (Start)
        // sessions[0] is the newest session (End)

        const oldestSession = state.sessions[state.sessions.length - 1];
        const newestSession = state.sessions[0];

        // Collect all trades flattened
        // IMPORTANT: The ReportModal reverses the trades given to it.
        // So we must pass them in "Newest -> Oldest" order to be consistent with state.trades
        // so that ReportModal's reverse() produces "Oldest -> Newest" for the table.
        const allTrades = state.sessions.flatMap(s => s.trades).sort((a, b) => b.timestamp - a.timestamp);

        const wins = allTrades.filter(t => t.outcome === 'WIN');
        const losses = allTrades.filter(t => t.outcome === 'LOSS');

        const totalNetProfit = state.sessions.reduce((acc, s) => acc + s.netProfit, 0);

        const archiveSession: Session = {
            id: `ARCHIVE-FULL-REPORT`,
            startTime: oldestSession.startTime,
            endTime: newestSession.endTime,
            startBalance: oldestSession.startBalance,
            endBalance: newestSession.endBalance,
            netProfit: totalNetProfit,
            tradeCount: allTrades.length,
            winCount: wins.length,
            lossCount: losses.length,
            trades: allTrades,
            strategyName: settings.strategyName
        };
        setReportSession(archiveSession);
    };

    const handleManualStakeChange = (val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 1 && num <= state.currentBalance) {
            setState(prev => ({
                ...prev,
                currentStake: num,
                nextStake: num
            }));
        }
    };

    const handleMaxStake = () => {
        setState(prev => ({
            ...prev,
            currentStake: prev.currentBalance,
            nextStake: prev.currentBalance
        }));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (isSettingsOpen || isMiniMode || isAboutOpen || isTutorialOpen) return;

            if (e.key.toLowerCase() === shortcuts.win) handleWin();
            if (e.key.toLowerCase() === shortcuts.loss && state.consecutiveLosses < settings.maxConsecutiveLosses && !isBankrupt) handleLoss();
            if (e.key.toLowerCase() === shortcuts.newSession) handleNewSession();
            if (e.key.toLowerCase() === shortcuts.reset) handleResetClick();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, state, settings, isSettingsOpen, isMiniMode, isBankrupt]);

    const handleLanguageInstall = (code: string) => {
        setIsDownloading(true);
        setTimeout(() => {
            setInstalledLanguages(prev => [...prev, code]);
            setLang(code);
            setIsDownloading(false);
            setIsLangStoreOpen(false);
        }, 1500);
    };

    const availableLanguagesList = [
        ...BASE_LANGUAGES,
        ...DOWNLOADABLE_LANGUAGES.filter(l => installedLanguages.includes(l.code))
    ];

    if (!user) {
        return (
            <Auth
                onLogin={(u) => { setUser(u); setIsWelcomeOpen(true); }}
                lang={lang}
                availableLanguages={availableLanguagesList}
                onLanguageChange={(e) => {
                    if (e.target.value === 'add_new') setIsLangStoreOpen(true);
                    else setLang(e.target.value);
                }}
                isDownloading={isDownloading}
            />
        );
    }

    const isMaxLossReached = state.consecutiveLosses >= settings.maxConsecutiveLosses;

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans transition-colors duration-300`}>
            {/* Top Navigation */}
            <nav className="bg-slate-800 dark:bg-slate-800 bg-white border-b border-slate-700 dark:border-slate-700 border-gray-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hidden sm:block">
                            Trade Manager Guard Pro V1.1
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 mr-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">{t.currentBalance}</span>
                                <span className={`font-mono font-bold ${state.currentBalance < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                                    {state.currentBalance.toFixed(2)} {currency}
                                </span>
                            </div>
                        </div>

                        <div data-tour="tour-config-btn">
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex items-center gap-2 p-2 px-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title={t.settings}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-bold text-sm hidden md:inline">{t.settings}</span>
                            </button>
                        </div>

                        <div data-tour="tour-mini-mode">
                            <button
                                onClick={() => setIsMiniMode(true)}
                                className="flex items-center gap-2 p-2 px-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title={t.miniMode}
                            >
                                <Smartphone className="w-5 h-5" />
                                <span className="font-bold text-sm hidden md:inline">{t.miniMode}</span>
                            </button>
                        </div>

                        <div data-tour="tour-strategy">
                            <button
                                onClick={() => setShowStrategyModal(true)}
                                className="flex items-center gap-2 p-2 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition border border-indigo-500/20"
                                title={t.strategyGuide}
                            >
                                <Activity className="w-5 h-5" />
                                <span className="font-bold text-sm hidden md:inline">{t.strategyGuide}</span>
                            </button>
                        </div>

                        <div className="relative" data-tour="tour-menu-btn" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 hover:bg-slate-700/50 p-1.5 rounded-lg transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {user.avatar ? <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                                </div>
                                <Menu className="w-5 h-5 text-slate-400" />
                            </button>
                            {isUserMenuOpen && (
                                <UserMenu
                                    user={user}
                                    t={t}
                                    onClose={() => setIsUserMenuOpen(false)}
                                    onLogout={handleLogout}
                                    onContact={() => window.location.href = `mailto:support@tradeguard.com?subject=${t.contactSubject}&body=${t.contactBody}`}
                                    onTutorial={() => { setIsTutorialOpen(true); setIsUserMenuOpen(false); }}
                                    onAbout={() => { setIsAboutOpen(true); setIsUserMenuOpen(false); }}
                                    onExportPDF={() => { }}
                                    onEditProfile={() => { setIsProfileOpen(true); setIsUserMenuOpen(false); }}
                                    onHotkeys={() => { setIsHotkeysOpen(true); setIsUserMenuOpen(false); }}
                                    lang={lang}
                                    availableLanguages={availableLanguagesList}
                                    onLanguageChange={(e) => {
                                        if (e.target.value === 'add_new') setIsLangStoreOpen(true);
                                        else setLang(e.target.value);
                                    }}
                                    isDownloading={isDownloading}
                                    theme={theme}
                                    onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-4 space-y-6">

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-tour="tour-balance">
                    <StatCard
                        label={t.currentBalance}
                        value={`${state.currentBalance.toFixed(2)} ${currency}`}
                        icon={Wallet}
                        colorClass={state.currentBalance < 0 ? "text-red-500" : "text-emerald-400"}
                        subValue={`${t.initialCapital}: ${settings.initialCapital} ${currency}`}
                    />
                    <StatCard
                        label={t.totalProfit}
                        value={`${(state.currentBalance - settings.initialCapital).toFixed(2)}`}
                        icon={Activity}
                        colorClass={(state.currentBalance - settings.initialCapital) >= 0 ? "text-green-400" : "text-red-400"}
                    />
                    <div data-tour="tour-stake" className="h-full">
                        <StatCard
                            label={t.nextStake}
                            value={state.nextStake.toFixed(2)}
                            icon={TrendingUp}
                            colorClass="text-blue-400"
                            subValue={state.consecutiveLosses > 0 ? `${t.consLosses}: ${state.consecutiveLosses}` : undefined}
                            isEditable={true}
                            onEdit={handleManualStakeChange}
                            onMax={handleMaxStake}
                        />
                    </div>
                    <StatCard
                        label={t.winRate}
                        value={`${state.trades.length > 0 ? ((state.trades.filter(t => t.outcome === 'WIN').length / state.trades.length) * 100).toFixed(1) : 0}%`}
                        icon={Layers}
                        colorClass="text-purple-400"
                        subValue={`${t.tradesCount}: ${state.trades.length}`}
                    />
                </div>

                {/* Layout Grid */}
                <div className="flex flex-col gap-6">

                    {/* --- Row 1: Controls & Assets (Side-by-Side Compact) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {/* Controls (Win/Loss) - Increased Height (~160px) */}
                        <div className="lg:col-span-1 bg-slate-800 dark:bg-slate-800 bg-white p-2 rounded-xl shadow-lg border border-slate-700 dark:border-slate-700 border-gray-200 flex flex-col justify-center gap-2 h-[160px]" data-tour="tour-win-loss-buttons">
                            <div className="flex-1 grid grid-cols-2 gap-3 w-full h-full">
                                <button
                                    onClick={handleWin}
                                    data-tour="tour-win-button"
                                    className={`
                                    bg-gradient-to-br from-green-600 to-green-800 text-white rounded-lg shadow-[0_3px_0_rgb(21,128,61)] transition-all flex flex-col items-center justify-center gap-0.5 group border-t border-green-400/20 h-full
                                    ${isBankrupt
                                            ? 'opacity-50 cursor-not-allowed grayscale shadow-none'
                                            : 'hover:from-green-500 hover:to-green-700 hover:translate-y-[1px] active:shadow-none active:translate-y-[3px]'
                                        }
                                `}
                                >
                                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition" />
                                    <span className="text-lg font-black tracking-wider">{t.win}</span>
                                    <span className="text-xs font-bold text-green-200 font-mono opacity-80 mt-1 bg-green-900/40 px-2 py-0.5 rounded">
                                        {settings.profitPercentage || 85}% Payout
                                    </span>
                                </button>

                                <button
                                    onClick={handleLoss}
                                    data-tour="tour-loss-button"
                                    title={isMaxLossReached ? t.maxLossHit : ''}
                                    className={`
                                    bg-gradient-to-br from-red-600 to-red-800 text-white rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 group border-t border-red-400/20 h-full
                                    ${isMaxLossReached || isBankrupt
                                            ? 'opacity-50 cursor-not-allowed grayscale shadow-none'
                                            : 'hover:from-red-500 hover:to-red-700 shadow-[0_3px_0_rgb(185,28,28)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px]'
                                        }
                                `}
                                >
                                    <TrendingDown className="w-4 h-4 group-hover:scale-110 transition" />
                                    <span className="text-lg font-black tracking-wider">{t.loss}</span>
                                </button>
                            </div>
                        </div>

                        {/* Assets - Increased Height (~160px) */}
                        <div className="lg:col-span-2 bg-slate-800 dark:bg-slate-800 bg-white p-1.5 rounded-xl shadow-lg border border-slate-700 dark:border-slate-700 border-gray-200 h-[160px]" data-tour="tour-assets">
                            <CompactAssetSelector settings={settings} setSettings={setSettings} />
                        </div>
                    </div>

                    {/* --- Row 2: Actions Bar (New Session + Reset Side-by-Side) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <button
                            onClick={handleNewSession}
                            className="w-full bg-blue-700 hover:bg-blue-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20"
                        >
                            <PlayCircle className="w-5 h-5" />
                            {t.newSession}
                        </button>

                        <div data-tour="tour-session">
                            <button
                                onClick={handleResetClick}
                                className="w-full bg-slate-700 dark:bg-slate-700 bg-gray-200 hover:bg-slate-600 dark:hover:bg-slate-600 hover:bg-gray-300 text-white dark:text-white text-gray-900 p-3 rounded-xl font-bold flex items-center justify-center gap-3 transition group"
                            >
                                <RefreshCw className="w-5 h-5 text-red-400 group-hover:rotate-180 transition-transform duration-500" />
                                <span>{t.reset}</span>
                            </button>
                        </div>
                    </div>

                    {/* --- Row 3: Charts vs History --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* Left: Current Chart */}
                        <div data-tour="tour-chart">
                            <PerformanceChart trades={state.trades} initialBalance={settings.initialCapital} lang={lang} />
                        </div>

                        {/* Right: History */}
                        <TradeHistory
                            trades={state.trades}
                            lang={lang}
                            currency={currency}
                            onViewReport={handleViewCurrentReport}
                        />
                    </div>

                    {/* --- Row 4: Archive Chart vs Session Manager --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* Left: Archive Chart */}
                        <div className="h-full">
                            <ArchiveChart
                                sessions={state.sessions}
                                currentBalance={state.currentBalance}
                                initialCapital={settings.initialCapital}
                                lang={lang}
                            />
                        </div>

                        {/* Right: Archive Manager */}
                        <div className="flex-1 min-h-[300px] h-full" data-tour="tour-archive">
                            <SessionManager
                                sessions={state.sessions}
                                lang={lang}
                                currency={currency}
                                onClearAll={() => setState(prev => ({ ...prev, sessions: [] }))}
                                onViewReport={(session) => setReportSession(session)}
                                onViewArchiveReport={handleViewArchiveReport}
                            />
                        </div>
                    </div>
                </div>

            </main>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-5">
                    <div className={`px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 'bg-slate-800/90 border-slate-600 text-white'
                        }`}>
                        {toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                        <span className="font-bold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Modals */}
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                setSettings={setSettings}
                lang={lang}
                currency={currency}
                setCurrency={setCurrency}
                onReset={handleResetClick}
                profitInputRef={profitInputRef}
            />

            {isMiniMode && (
                <MiniMode
                    state={state}
                    settings={settings}
                    setSettings={setSettings}
                    currency={currency}
                    lang={lang}
                    onWin={handleWin}
                    onLoss={handleLoss}
                    onNewSession={handleNewSession}
                    onClose={() => setIsMiniMode(false)}
                    isMaxLossReached={isMaxLossReached}
                    forceOverlay={tourActive || isMobile} // Force overlay mode if tour is active or on mobile
                />
            )}

            <LanguageStoreModal
                isOpen={isLangStoreOpen}
                onClose={() => setIsLangStoreOpen(false)}
                onInstall={handleLanguageInstall}
                installedCodes={installedLanguages}
                lang={lang}
            />

            <SessionReportModal
                isOpen={!!reportSession}
                onClose={() => setReportSession(null)}
                session={reportSession}
                lang={lang}
                currency={currency}
            />

            <ConfirmationModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={executeReset}
                title={t.confirmResetTitle}
                message={t.confirmResetBody}
                confirmLabel={t.confirmAction}
                cancelLabel={t.cancelAction}
                isDanger={true}
            />

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} lang={lang} />
            <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} lang={lang} />
            <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} onStartTour={() => setTourActive(true)} lang={lang} />

            <OnboardingTour
                isActive={tourActive}
                onClose={() => setTourActive(false)}
                lang={lang}
                onSetSettingsOpen={setIsSettingsOpen}
                onSetMiniMode={setIsMiniMode}
            />

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onSave={(n, a) => { setUser({ ...user, name: n, avatar: a }); setIsProfileOpen(false); }} lang={lang} />
            <HotkeysModal isOpen={isHotkeysOpen} onClose={() => setIsHotkeysOpen(false)} shortcuts={shortcuts} onSave={setShortcuts} lang={lang} />
            <StrategyModal isOpen={showStrategyModal} onClose={() => setShowStrategyModal(false)} lang={lang} t={t} />
        </div>
    );
};

```

---
### 📄 File: build_mobile_app.bat
```bat
@echo off
chcp 65001
cd /d "%~dp0"
echo جاري تحضير تطبيق الجوال...
echo Preparing Mobile App...

:: --- SETUP PORTABLE NODE (From Run Project script) ---
set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [DEBUG] Checking Node paths...
if exist "%NODE_EXE%" (
    echo [OK] Using Portable Node: %NODE_EXE%
    set "PATH=%NODE_DIR%;%PATH%"
) else (
    echo [WARN] Portable Node not found. Trying global Node...
    set "NPM_CMD=npm"
)
:: ---------------------------

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js first.
    pause
    exit /b
)

:: Install Dependencies
echo [1/5] Installing Dependencies...
call npm install

:: Build Web App
echo [2/5] Building Web App...
call npm run build

:: Initialize Capacitor (if needed)
if not exist "capacitor.config.json" (
    echo [INFO] capacitor.config.json missing, recreating...
    call npx cap init "TradeGuard" "com.trademanager.guardpro" --web-dir dist --npm-client npm
)

:: Add Android Platform
if not exist "android" (
    echo [3/5] Adding Android Platform...
    call npx cap add android
)

:: Sync
echo [4/5] Syncing with Android...
call npx cap sync

:: Open Android Studio
echo [5/5] Opening Android Studio...
echo Please wait for Android Studio to open, then click the "Run" (Play) button to launch on your emulator or connected device.
call npx cap open android

pause

```

---
### 📄 File: capacitor.config.json
```javascripton
{
  "appId": "com.trademanager.guardpro",
  "appName": "Trade Manager Guard Pro",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "launchAutoHide": true,
      "backgroundColor": "#0f172a",
      "androidSplashResourceName": "splash",
      "showSpinner": false
    }
  }
}

```

---
### 📄 File: components\AboutModal.tsx
```typescript
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
```

---
### 📄 File: components\ArchiveChart.tsx
```typescript

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Session, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  sessions: Session[];
  currentBalance: number;
  initialCapital: number;
  lang: Language;
}

export const ArchiveChart: React.FC<Props> = ({ sessions, currentBalance, initialCapital, lang }) => {
  const t = TRANSLATIONS[lang];

  // Prepare data: Cumulative balance over sessions
  const data = React.useMemo(() => {
    // Start with initial capital
    const points = [{
        name: 'Start',
        balance: initialCapital,
        sessionIndex: 0
    }];

    // Add each session's end balance
    // We reverse sessions because they are stored Newest First in App state, but chart needs Oldest First
    [...sessions].reverse().forEach((session, i) => {
        points.push({
            name: `S${i + 1}`,
            balance: session.endBalance,
            sessionIndex: i + 1
        });
    });

    // Add current live balance as the final point
    points.push({
        name: 'Now',
        balance: currentBalance,
        sessionIndex: points.length
    });

    return points;
  }, [sessions, currentBalance, initialCapital]);

  const isPositive = currentBalance >= initialCapital;

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-4 h-[400px]">
      <h3 className="font-bold text-slate-200 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        {lang === 'ar' ? 'نمو المحفظة (الكل)' : 'Portfolio Growth (All Time)'}
      </h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorArchive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                tick={{fontSize: 10}}
                tickLine={false}
                axisLine={false}
            />
            <YAxis 
                stroke="#64748b" 
                tick={{fontSize: 10}} 
                domain={['auto', 'auto']}
                tickFormatter={(val) => val.toFixed(0)}
                tickLine={false}
                axisLine={false}
                orientation={lang === 'ar' ? 'right' : 'left'}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [value.toFixed(2), t.balance]}
                labelStyle={{ color: '#94a3b8' }}
            />
            <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorArchive)" 
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

```

---
### 📄 File: components\Auth.tsx
```typescript

import React, { useState } from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Lock, Mail, Github, Globe, Loader2 } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
  lang: Language;
  availableLanguages: {code: string, name: string}[];
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isDownloading: boolean;
}

export const Auth: React.FC<Props> = ({ 
  onLogin, 
  lang, 
  availableLanguages, 
  onLanguageChange, 
  isDownloading 
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
        onLogin({
            id: '1',
            name: email.split('@')[0],
            email: email,
        });
    }
  };

  const handleSocialLogin = (provider: string) => {
      // Simulate social login
      onLogin({
          id: '2',
          name: `${provider} User`,
          email: `user@${provider.toLowerCase()}.com`
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative">
      
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
         <div className="relative">
             {isDownloading ? (
                 <div className="flex items-center gap-2 bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-xs hidden sm:inline">{t.downloading}</span>
                 </div>
             ) : (
                 <>
                    <Globe className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        value={lang}
                        onChange={onLanguageChange}
                        className="appearance-none bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-sm pl-8 pr-4 py-2 rounded-lg border border-slate-700 outline-none focus:ring-1 focus:ring-blue-500 transition shadow-lg"
                    >
                        {availableLanguages.map(l => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                        <option disabled>──────────</option>
                        <option value="add_new">+ {t.addLanguage}</option>
                    </select>
                 </>
             )}
         </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Trade Manager Guard Pro V1.1</h1>
            <p className="text-slate-400">{isRegister ? t.registerTitle : t.loginTitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm text-slate-400 mb-1">{t.email}</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="name@example.com"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">{t.password}</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
            >
                {isRegister ? t.registerBtn : t.loginBtn}
            </button>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="px-3 text-sm text-slate-500">{t.continueWith}</span>
            <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 bg-white text-slate-900 font-medium py-2 rounded-lg hover:bg-slate-100 transition"
            >
                <Globe className="w-5 h-5 text-red-500" />
                {t.google}
            </button>
            <button 
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center gap-2 bg-[#24292e] text-white font-medium py-2 rounded-lg hover:bg-[#2f363d] transition"
            >
                <Github className="w-5 h-5" />
                {t.github}
            </button>
        </div>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-400 hover:text-blue-300 text-sm transition"
            >
                {isRegister ? t.haveAccount : t.noAccount}
            </button>
        </div>
      </div>
    </div>
  );
};

```

---
### 📄 File: components\CompactAssetSelector.tsx
```typescript

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

```

---
### 📄 File: components\ConfirmationModal.tsx
```typescript

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isDanger?: boolean;
}

export const ConfirmationModal: React.FC<Props> = ({
  isOpen, onClose, onConfirm, title, message, confirmLabel, cancelLabel, isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">{message}</p>
            
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition"
                >
                    {cancelLabel}
                </button>
                <button 
                    onClick={() => { onConfirm(); onClose(); }}
                    className={`flex-1 py-2.5 rounded-xl text-white font-bold transition shadow-lg ${isDanger ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

```

---
### 📄 File: components\HotkeysModal.tsx
```typescript

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
```

---
### 📄 File: components\LanguageStoreModal.tsx
```typescript
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
```

---
### 📄 File: components\MiniMode.tsx
```typescript

import React, { useState, useRef, useEffect } from 'react';
import { AppState, Currency, Language, AppSettings } from '../types';
import { TrendingUp, TrendingDown, X, PlayCircle, Smartphone, GripHorizontal } from 'lucide-react';
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
  const windowRef = useRef<HTMLDivElement>(null);

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
              <div className="w-full flex flex-col items-center justify-center bg-slate-900 rounded-xl py-3 border border-slate-700 shadow-inner">
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

```

---
### 📄 File: components\OnboardingTour.tsx
```typescript
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
```

---
### 📄 File: components\PerformanceChart.tsx
```typescript

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Trade, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  trades: Trade[];
  initialBalance: number;
  lang: Language;
}

export const PerformanceChart: React.FC<Props> = ({ trades, initialBalance, lang }) => {
  const t = TRANSLATIONS[lang];

  // Prepare data: Start with initial, then add each trade
  const data = React.useMemo(() => {
    const points = [{
        name: 'Start',
        balance: initialBalance,
        idx: 0
    }];

    // Reverse trades to show chronological order (Oldest -> Newest)
    [...trades].reverse().forEach((trade, i) => {
        points.push({
            name: `${i + 1}`,
            balance: trade.balanceAfter,
            idx: i + 1
        });
    });
    return points;
  }, [trades, initialBalance]);

  const isPositive = data[data.length - 1].balance >= initialBalance;

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-4 h-[400px]">
      <h3 className="font-bold text-slate-200 mb-4">{t.report} - {t.balance}</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={{fontSize: 12}}
                tickLine={false}
                axisLine={false}
            />
            <YAxis 
                stroke="#94a3b8" 
                tick={{fontSize: 12}} 
                domain={['auto', 'auto']}
                tickFormatter={(val) => val.toFixed(0)}
                tickLine={false}
                axisLine={false}
                orientation={lang === 'ar' ? 'right' : 'left'}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [value.toFixed(2), t.balance]}
                labelStyle={{ color: '#94a3b8' }}
            />
            <Area 
                type="monotone" 
                dataKey="balance" 
                stroke={isPositive ? "#22c55e" : "#ef4444"} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

```

---
### 📄 File: components\ProfileModal.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, User } from '../types';
import { X, User as UserIcon, Save, Image as ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (name: string, avatar: string) => void;
  lang: Language;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, user, onSave, lang }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');

  useEffect(() => {
    setName(user.name);
    setAvatar(user.avatar || '');
  }, [user, isOpen]);

  if (!isOpen) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, avatar);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-500" />
            {t.profileSettings}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600 relative group">
                {avatar ? (
                    <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-2xl font-bold text-slate-400">{name.charAt(0).toUpperCase()}</span>
                )}
            </div>
          </div>

          <div>
             <label className="block text-sm text-slate-400 mb-1">{t.nameLabel}</label>
             <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
          </div>

          <div>
             <label className="block text-sm text-slate-400 mb-1">{t.avatarLabel}</label>
             <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/image.png"
                />
             </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4">
            <Save className="w-5 h-5" /> {t.saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
};

```

---
### 📄 File: components\SessionManager.tsx
```typescript

import React, { useState, useRef, useEffect } from 'react';
import { Session, Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';
import { FolderClock, Trash2, Printer, ChevronDown, ChevronUp, FileSpreadsheet, MoreVertical, FileText, Info, HelpCircle } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import ExcelJS from 'exceljs';

interface Props {
  sessions: Session[];
  lang: Language;
  currency: Currency;
  onClearAll: () => void;
  onViewReport: (session: Session) => void;
  onViewArchiveReport: () => void;
}

export const SessionManager: React.FC<Props> = ({ sessions, lang, currency, onClearAll, onViewReport, onViewArchiveReport }) => {
  const t = TRANSLATIONS[lang];
  const [isOpen, setIsOpen] = useState(true); 
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside listener for individual session menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalSessionsProfit = sessions.reduce((acc, s) => acc + s.netProfit, 0);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleExportExcel = async (sessionData?: Session) => {
      const isSingle = !!sessionData;
      const filename = `TradeGuard_${isSingle ? 'Session' : 'Archive_Full'}.xlsx`;
      
      // Reverse to get Oldest First -> Newest Last (Session 1 ... Session N)
      const sessionsToExport = isSingle ? [sessionData] : [...sessions].reverse();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Archive');

      // Setup columns
      worksheet.columns = [
        { header: '#', key: 'id', width: 6 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Time', key: 'time', width: 14 },
        { header: 'Asset', key: 'asset', width: 12 },
        { header: 'Stake', key: 'stake', width: 12 },
        { header: 'Outcome', key: 'outcome', width: 12 },
        { header: 'Profit', key: 'profit', width: 12 },
        { header: 'Balance', key: 'balance', width: 14 },
      ];
      
      // Remove default header row to build custom structure
      worksheet.spliceRows(1, 1);

      // Ensure summary rows are above detail rows for grouping to work nicely (Top-Down)
      worksheet.properties.outlineProperties = { summaryBelow: false };

      sessionsToExport.forEach((s, idx) => {
          // 1. Session Header Row (Group Summary)
          const sDate = new Date(s.startTime).toLocaleDateString();
          const sTime = new Date(s.startTime).toLocaleTimeString();
          const profitSymbol = s.netProfit >= 0 ? '+' : '';
          const sessionNumber = isSingle ? 'Current' : idx + 1;
          
          const headerText = `SESSION ${sessionNumber} | Date: ${sDate} ${sTime} | W/L: ${s.winCount}/${s.lossCount} | Net: ${profitSymbol}${s.netProfit.toFixed(2)}`;
          
          const headerRow = worksheet.addRow([headerText]);
          
          // Style Header
          headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          headerRow.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF1e293b' } // Dark slate background
          };
          
          // Merge cells for header
          worksheet.mergeCells(`A${headerRow.number}:H${headerRow.number}`);
          
          // 2. Column Headers Row (Detail Header)
          const colHeaderRow = worksheet.addRow(["#", "Date", "Time", "Asset", "Stake", "Outcome", "Profit", "Balance"]);
          colHeaderRow.font = { bold: true, color: { argb: 'FF000000' } };
          colHeaderRow.fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'FFcbd5e1' } // Light slate/gray
          };
          colHeaderRow.outlineLevel = 1; // Grouped

          // 3. Trade Rows
          [...s.trades].reverse().forEach((t, tIdx) => {
              const row = worksheet.addRow([
                  tIdx + 1,
                  new Date(t.timestamp).toLocaleDateString(),
                  new Date(t.timestamp).toLocaleTimeString(),
                  t.asset,
                  parseFloat(t.stake.toFixed(2)),
                  t.outcome,
                  parseFloat(t.profit.toFixed(2)),
                  parseFloat(t.balanceAfter.toFixed(2))
              ]);

              // Colorize based on outcome
              const isWin = t.outcome === 'WIN';
              row.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: isWin ? 'FFdcfce7' : 'FFfee2e2' } // Light Green / Light Red
              };
              
              // Style text colors
              row.getCell(6).font = { color: { argb: isWin ? 'FF15803d' : 'FFb91c1c' }, bold: true }; // Outcome col
              row.getCell(7).font = { color: { argb: isWin ? 'FF15803d' : 'FFb91c1c' }, bold: true }; // Profit col

              row.outlineLevel = 1; // Grouped
          });

          // Empty Spacer Row (optional, but clean)
          // worksheet.addRow([]); 
      });

      // Write and Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      setOpenMenuId(null);
  };

  return (
    <>
    <div className="bg-slate-800 dark:bg-slate-800 bg-white rounded-xl shadow-lg border border-slate-700 dark:border-slate-700 border-gray-200 overflow-hidden flex flex-col h-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-slate-800 dark:bg-slate-800 bg-white hover:bg-slate-700/50 cursor-pointer flex justify-between items-center transition border-b border-slate-700"
      >
        <div className="flex items-center gap-2 text-slate-200 dark:text-slate-200 text-slate-900 font-bold text-sm">
            <FolderClock className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.sessionsHistory}</span>
            <span className="sm:hidden">Archive</span>
            <span className="text-slate-500">({sessions.length})</span>
        </div>
        <div className="flex items-center gap-2">
             {/* Report All Button */}
             <button
                onClick={(e) => { e.stopPropagation(); onViewArchiveReport(); }}
                disabled={sessions.length === 0}
                className={`flex items-center gap-2 px-2 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-[10px] font-bold border border-blue-600/20 ${sessions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Archive Report"
             >
                <FileText className="w-3 h-3" />
                <span className="hidden xl:inline">{lang === 'ar' ? 'عرض التقرير وطباعة' : 'Report & Print'}</span>
             </button>

             <div className="flex items-center gap-1 group relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); handleExportExcel(); }}
                    disabled={sessions.length === 0}
                    className={`flex items-center gap-2 px-2 py-1.5 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition text-[10px] font-bold border border-green-600/20 ${sessions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={t.exportExcel}
                >
                    <FileSpreadsheet className="w-3 h-3" />
                    <span className="hidden xl:inline">{t.exportExcel}</span>
                </button>
             </div>

             {/* Delete All Button */}
             <button 
                onClick={handleDeleteClick}
                disabled={sessions.length === 0}
                className={`flex items-center gap-2 px-2 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition text-[10px] font-bold border border-red-600/20 ${sessions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={t.clearAllHistory}
             >
                <Trash2 className="w-3 h-3" />
             </button>

             <div className="h-4 w-px bg-slate-700 mx-1"></div>

             <span className={`font-mono font-bold text-xs ${totalSessionsProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalSessionsProfit > 0 ? '+' : ''}{totalSessionsProfit.toFixed(2)}
             </span>
             {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50" ref={menuRef}>
           {sessions.length === 0 ? (
               <div className="flex-1 flex items-center justify-center text-slate-500 py-4 text-xs italic">
                   {lang === 'ar' ? 'الأرشيف فارغ' : 'Archive is empty'}
               </div>
           ) : (
               <div className="flex-1 overflow-y-auto">
                   <table className="w-full text-xs text-slate-300 dark:text-slate-300 text-gray-700">
                       <thead className="sticky top-0 bg-slate-800 z-10 shadow-sm">
                           <tr className="text-slate-400">
                               <th className="px-2 py-2 text-start font-normal">{t.sessionStart}</th>
                               <th className="px-2 py-2 text-center font-normal">W/L</th>
                               <th className="px-2 py-2 text-end font-normal">{t.sessionProfit}</th>
                               <th className="w-8"></th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800">
                           {sessions.map((session, idx) => (
                               <tr key={session.id} className="hover:bg-slate-800/50 transition relative">
                                   <td className="px-2 py-2">
                                       <div className="flex items-center gap-2">
                                           <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded">
                                               #{sessions.length - idx}
                                           </span>
                                           <div className="font-mono text-slate-300">{new Date(session.startTime).toLocaleDateString()}</div>
                                       </div>
                                       <div className="text-[10px] text-slate-500 ml-6">{new Date(session.startTime).toLocaleTimeString()}</div>
                                   </td>
                                   <td className="px-2 py-2 text-center font-mono">
                                       <span className="text-green-400">{session.winCount}</span>
                                       <span className="text-slate-600 mx-1">/</span>
                                       <span className="text-red-400">{session.lossCount}</span>
                                   </td>
                                   <td className={`px-2 py-2 text-end font-mono font-bold ${session.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                       {session.netProfit.toFixed(2)}
                                   </td>
                                   <td className="px-1 relative">
                                       <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === session.id ? null : session.id);
                                            }}
                                            className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-white"
                                       >
                                           <MoreVertical className="w-3 h-3" />
                                       </button>
                                       
                                       {openMenuId === session.id && (
                                           <div className="absolute right-6 top-0 w-32 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                                               <button 
                                                    onClick={(e) => { e.stopPropagation(); onViewReport(session); setOpenMenuId(null); }}
                                                    className="px-3 py-2 text-left hover:bg-slate-700 text-[10px] flex items-center gap-2"
                                               >
                                                   <Printer className="w-3 h-3 text-blue-400" />
                                                   {t.printSession}
                                               </button>
                                               <button 
                                                    onClick={(e) => { e.stopPropagation(); handleExportExcel(session); }}
                                                    className="px-3 py-2 text-left hover:bg-slate-700 text-[10px] flex items-center gap-2"
                                               >
                                                   <FileSpreadsheet className="w-3 h-3 text-green-400" />
                                                   {t.exportExcel}
                                               </button>
                                           </div>
                                       )}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           )}
        </div>
      )}
    </div>
    
    <ConfirmationModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onClearAll}
        title={t.confirmDeleteTitle}
        message={t.confirmDeleteBody}
        confirmLabel={t.confirmAction}
        cancelLabel={t.cancelAction}
        isDanger={true}
    />
    </>
  );
};

```

---
### 📄 File: components\SessionReportModal.tsx
```typescript

import React, { useRef } from 'react';
import { Session, Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, Printer, FileDown, TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import { PerformanceChart } from './PerformanceChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    session: Session | null;
    lang: Language;
    currency: Currency;
}

export const SessionReportModal: React.FC<Props> = ({ isOpen, onClose, session, lang, currency }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    if (!isOpen || !session) return null;
    const t = TRANSLATIONS[lang];

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!chartRef.current) return;

        const doc = new jsPDF();

        // 1. Header
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text("TradeGuard Pro - Session Report", 14, 20);
        doc.setFontSize(10);
        doc.text(`ID: ${session.id}`, 14, 26);
        doc.text(`Date: ${new Date(session.startTime).toLocaleString()}`, 14, 31);
        if (session.strategyName) {
            doc.text(`Strategy: ${session.strategyName}`, 14, 36);
        }

        // 2. Summary Stats Box
        doc.setFillColor(245, 247, 250); // Light gray
        doc.setDrawColor(226, 232, 240); // Border color
        doc.rect(14, 38, 180, 25, 'FD'); // Fill and Draw

        doc.setFontSize(12);

        // --- ROW 1: Net Profit & Total Trades ---
        const row1Y = 50;

        // Net Profit Label
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text("Net Profit:", 20, row1Y);
        const profitLabelW = doc.getTextWidth("Net Profit: ");

        // Net Profit Value (Colored)
        if (session.netProfit >= 0) {
            doc.setTextColor(22, 163, 74); // Green-600
        } else {
            doc.setTextColor(220, 38, 38); // Red-600
        }
        doc.text(`${session.netProfit > 0 ? '+' : ''}${session.netProfit.toFixed(2)} ${currency}`, 20 + profitLabelW + 2, row1Y);

        // Total Trades
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text(`Total Trades: ${session.tradeCount}`, 110, row1Y);

        // --- ROW 2: Win Rate & Win/Loss Counts ---
        const row2Y = 58;

        // Win Rate
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text(`Win Rate: ${session.tradeCount > 0 ? ((session.winCount / session.tradeCount) * 100).toFixed(1) : 0}%`, 20, row2Y);

        // Wins (Green)
        const winsX = 110;
        doc.setTextColor(22, 163, 74); // Green-600
        const winsStr = `Wins: ${session.winCount}`;
        doc.text(winsStr, winsX, row2Y);
        const winsW = doc.getTextWidth(winsStr);

        // Separator
        doc.setTextColor(0, 0, 0);
        const sepStr = " | ";
        doc.text(sepStr, winsX + winsW, row2Y);
        const sepW = doc.getTextWidth(sepStr);

        // Losses (Red)
        doc.setTextColor(220, 38, 38); // Red-600
        doc.text(`Losses: ${session.lossCount}`, winsX + winsW + sepW, row2Y);

        // Reset Color
        doc.setTextColor(0, 0, 0);

        // 3. Capture Chart Image
        try {
            const canvas = await html2canvas(chartRef.current, {
                backgroundColor: '#1e293b',
                scale: 2,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');

            doc.text("Performance Chart:", 14, 75);
            doc.addImage(imgData, 'PNG', 14, 80, 180, 80);

            // 4. Trade Table
            const tableStartY = 170;
            doc.text("Detailed Trade History:", 14, tableStartY - 5);

            const tableColumn = ["#", "Time", "Asset", "Stake", "Outcome", "Profit", "Balance"];
            const tableRows: any[] = [];

            [...session.trades].reverse().forEach((trade, index) => {
                tableRows.push([
                    index + 1,
                    new Date(trade.timestamp).toLocaleTimeString(),
                    trade.asset,
                    trade.stake.toFixed(2),
                    trade.outcome,
                    trade.profit.toFixed(2),
                    trade.balanceAfter.toFixed(2)
                ]);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: tableStartY,
                headStyles: {
                    fillColor: [30, 41, 59], // Slate-800
                    textColor: [255, 255, 255]
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },
                alternateRowStyles: {
                    fillColor: [241, 245, 249] // Slate-100
                },
                didParseCell: (data) => {
                    if (data.section === 'body') {
                        if (data.column.index === 4) { // Outcome
                            const text = data.cell.raw as string;
                            if (text === 'WIN') {
                                data.cell.styles.textColor = [22, 163, 74];
                                data.cell.styles.fontStyle = 'bold';
                            } else if (text === 'LOSS') {
                                data.cell.styles.textColor = [220, 38, 38];
                                data.cell.styles.fontStyle = 'bold';
                            }
                        }
                        if (data.column.index === 5) { // Profit
                            const val = parseFloat(data.cell.raw as string);
                            if (val > 0) {
                                data.cell.styles.textColor = [22, 163, 74];
                            } else if (val < 0) {
                                data.cell.styles.textColor = [220, 38, 38];
                            }
                        }
                    }
                }
            });

            doc.save(`Session_Report_${session.id}.pdf`);

        } catch (err) {
            console.error("Error generating PDF", err);
            alert("Failed to generate PDF chart. Please try regular Print.");
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden print:inset-0 print:w-full print:h-full print:max-w-none print:z-[9999] print:bg-white print:text-black">

                {/* Header - Hidden on Print */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 print:hidden">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            {t.report}
                        </h2>
                        <p className="text-xs text-slate-400">{session.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition text-sm font-bold"
                        >
                            <Printer className="w-4 h-4" /> {lang === 'ar' ? 'طباعة' : 'Print'}
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-sm font-bold shadow-lg"
                        >
                            <FileDown className="w-4 h-4" /> PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-900 print:bg-white print:p-0 print:overflow-visible">

                    {/* Report Header (Visible in UI & Print) */}
                    <div className="flex justify-between items-end border-b border-slate-700 print:border-gray-300 pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white print:text-black mb-1">Session Report</h1>
                            <div className="flex items-center gap-2 text-slate-400 print:text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(session.startTime).toLocaleString()}</span>
                            </div>
                            {session.strategyName && (
                                <div className="mt-2 text-sm text-blue-400 print:text-blue-700 font-bold">
                                    Strategy: {session.strategyName}
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500 uppercase tracking-wider">Net Profit</div>
                            <div className={`text-3xl font-mono font-bold ${session.netProfit >= 0 ? 'text-green-500 print:text-green-700' : 'text-red-500 print:text-red-700'}`}>
                                {session.netProfit > 0 ? '+' : ''}{session.netProfit.toFixed(2)} <span className="text-lg text-slate-500">{currency}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 print:grid-cols-4 print:gap-4">
                        <div className="bg-slate-800 print:bg-gray-100 p-4 rounded-xl border border-slate-700 print:border-gray-200">
                            <div className="text-xs text-slate-500 uppercase">Start Balance</div>
                            <div className="text-xl font-mono font-bold text-white print:text-black">{session.startBalance.toFixed(2)}</div>
                        </div>
                        <div className="bg-slate-800 print:bg-gray-100 p-4 rounded-xl border border-slate-700 print:border-gray-200">
                            <div className="text-xs text-slate-500 uppercase">End Balance</div>
                            <div className="text-xl font-mono font-bold text-white print:text-black">{session.endBalance.toFixed(2)}</div>
                        </div>
                        <div className="bg-slate-800 print:bg-gray-100 p-4 rounded-xl border border-slate-700 print:border-gray-200">
                            <div className="text-xs text-slate-500 uppercase">Wins / Losses</div>
                            <div className="text-xl font-bold flex items-center gap-2">
                                <span className="text-green-400 print:text-green-700">{session.winCount}</span>
                                <span className="text-slate-600">/</span>
                                <span className="text-red-400 print:text-red-700">{session.lossCount}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 print:bg-gray-100 p-4 rounded-xl border border-slate-700 print:border-gray-200">
                            <div className="text-xs text-slate-500 uppercase">Win Rate</div>
                            <div className="text-xl font-bold text-blue-400 print:text-blue-700">
                                {session.tradeCount > 0 ? ((session.winCount / session.tradeCount) * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white print:text-black">Performance Chart</h3>
                        {/* Changed height to auto to fit the 400px chart */}
                        <div className="w-full bg-slate-800 print:bg-white rounded-xl border border-slate-700 print:border-gray-300 p-2" ref={chartRef}>
                            {/* Reusing Performance Chart Component */}
                            <PerformanceChart trades={session.trades} initialBalance={session.startBalance} lang={lang} />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white print:text-black">Detailed Trade Log</h3>
                        <div className="border border-slate-700 print:border-gray-300 rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-800 print:bg-gray-200 text-slate-400 print:text-black uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3 text-center">#</th>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Asset</th>
                                        <th className="px-4 py-3 text-right">Stake</th>
                                        <th className="px-4 py-3 text-center">Result</th>
                                        <th className="px-4 py-3 text-right">Return</th>
                                        <th className="px-4 py-3 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 print:divide-gray-300 bg-slate-900 print:bg-white">
                                    {[...session.trades].reverse().map((trade, idx) => (
                                        <tr key={trade.id} className="text-slate-300 print:text-black">
                                            <td className="px-4 py-2 text-center text-slate-500">{idx + 1}</td>
                                            <td className="px-4 py-2 text-xs font-mono">{new Date(trade.timestamp).toLocaleTimeString()}</td>
                                            <td className="px-4 py-2 font-bold">{trade.asset}</td>
                                            <td className="px-4 py-2 text-right font-mono">{trade.stake.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${trade.outcome === 'WIN'
                                                    ? 'bg-green-500/10 text-green-400 print:text-green-700 print:bg-green-100'
                                                    : 'bg-red-500/10 text-red-400 print:text-red-700 print:bg-red-100'
                                                    }`}>
                                                    {trade.outcome === 'WIN' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {trade.outcome}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-2 text-right font-bold ${trade.profit >= 0 ? 'text-green-400 print:text-green-700' : 'text-red-400 print:text-red-700'}`}>
                                                {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right font-mono text-blue-300 print:text-blue-700">
                                                {trade.balanceAfter.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

```

---
### 📄 File: components\SettingsPanel.tsx
```typescript

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
      <div className="bg-slate-800 dark:bg-slate-800 bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-700 border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">

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
              <div className="text-[10px] text-slate-500 mb-1">{t.strategyPlaceholder}</div>
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
                className="w-full bg-slate-900 border border-green-500/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none placeholder-slate-600 shadow-[0_0_10px_rgba(34,197,94,0.1)] transition"
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
                      }`}
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
                      className="w-full bg-transparent text-sm font-bold text-slate-200 outline-none border-b border-transparent hover:border-slate-600 focus:border-blue-500 pb-1 transition-colors"
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

```

---
### 📄 File: components\StrategyModal.tsx
```typescript

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


```

---
### 📄 File: components\TradeHistory.tsx
```typescript

import React, { useState } from 'react';
import { Trade, Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';

interface Props {
  trades: Trade[];
  lang: Language;
  currency: Currency;
  onViewReport: () => void;
}

export const TradeHistory: React.FC<Props> = ({ trades, lang, currency, onViewReport }) => {
  const t = TRANSLATIONS[lang];
  const [sortAsc, setSortAsc] = useState(false);

  // Sorting logic
  const displayTrades = React.useMemo(() => {
    return [...trades].sort((a, b) => {
        return sortAsc 
            ? a.timestamp - b.timestamp 
            : b.timestamp - a.timestamp;
    });
  }, [trades, sortAsc]);

  const handleExportExcel = async () => {
      const filename = `TradeGuard_CurrentSession.xlsx`;
      const exportTrades = [...trades].reverse();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Current Session');

      // Setup columns
      worksheet.columns = [
        { header: '#', key: 'id', width: 6 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Time', key: 'time', width: 14 },
        { header: 'Asset', key: 'asset', width: 12 },
        { header: 'Stake', key: 'stake', width: 12 },
        { header: 'Outcome', key: 'outcome', width: 12 },
        { header: 'Profit', key: 'profit', width: 12 },
        { header: 'Balance', key: 'balance', width: 14 },
      ];

      // Style Header
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FF000000' } };
      headerRow.fill = {
           type: 'pattern',
           pattern: 'solid',
           fgColor: { argb: 'FFcbd5e1' } // Light slate/gray
      };

      // Add Data
      exportTrades.forEach((t, idx) => {
         const row = worksheet.addRow([
            idx + 1,
            new Date(t.timestamp).toLocaleDateString(),
            new Date(t.timestamp).toLocaleTimeString(),
            t.asset,
            parseFloat(t.stake.toFixed(2)),
            t.outcome,
            parseFloat(t.profit.toFixed(2)),
            parseFloat(t.balanceAfter.toFixed(2))
         ]);

         // Colorize based on outcome
         const isWin = t.outcome === 'WIN';
         row.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: isWin ? 'FFdcfce7' : 'FFfee2e2' } // Light Green / Light Red
         };
         
         // Style text colors
         row.getCell(6).font = { color: { argb: isWin ? 'FF15803d' : 'FFb91c1c' }, bold: true }; // Outcome col
         row.getCell(7).font = { color: { argb: isWin ? 'FF15803d' : 'FFb91c1c' }, bold: true }; // Profit col
      });

      // Write and Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-[400px]" data-tour="tour-history">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-200">{t.history}</h3>
        <div className="flex gap-2">
            <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition text-xs font-bold border border-green-600/20"
                title={t.exportExcel}
            >
                <FileSpreadsheet className="w-3 h-3" />
                <span className="hidden sm:inline">Excel</span>
            </button>
            <button 
                onClick={onViewReport} 
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-xs font-bold border border-blue-600/20"
                title="View Full Report"
            >
                <FileText className="w-3 h-3" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'تقرير' : 'Report'}</span>
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-slate-400 bg-slate-900 sticky top-0 z-10">
            <tr>
              <th 
                className="px-4 py-3 font-medium text-center cursor-pointer hover:bg-slate-800 hover:text-white transition select-none flex justify-center items-center gap-1"
                onClick={() => setSortAsc(!sortAsc)}
                title={sortAsc ? t.sortDesc : t.sortAsc}
              >
                # {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </th>
              <th className={`px-4 py-3 font-medium ${lang === 'en' ? 'text-left' : 'text-right'}`}>{t.asset}</th>
              <th className={`px-4 py-3 font-medium ${lang === 'en' ? 'text-left' : 'text-right'}`}>{t.time}</th>
              <th className={`px-4 py-3 font-medium ${lang === 'en' ? 'text-right' : 'text-left'}`}>{t.stake}</th>
              <th className="px-4 py-3 font-medium text-center">{t.outcome}</th>
              <th className={`px-4 py-3 font-medium ${lang === 'en' ? 'text-right' : 'text-left'}`}>{t.profit}</th>
              <th className={`px-4 py-3 font-medium ${lang === 'en' ? 'text-right' : 'text-left'}`}>{t.balance}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {displayTrades.map((trade, idx) => (
              <tr key={trade.id} className="hover:bg-slate-700/30 transition">
                <td className="px-4 py-3 text-slate-500 text-center font-mono">
                    {sortAsc ? idx + 1 : trades.length - idx}
                </td>
                <td className={`px-4 py-3 font-medium text-slate-300 ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                  {trade.asset}
                </td>
                <td className={`px-4 py-3 text-slate-400 text-xs ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                  {new Date(trade.timestamp).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                </td>
                <td className={`px-4 py-3 font-mono text-slate-300 ${lang === 'en' ? 'text-right' : 'text-left'}`}>
                  {trade.stake.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                    trade.outcome === 'WIN' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {trade.outcome === 'WIN' ? (
                        <>
                            <TrendingUp className="w-3 h-3 mx-1" />
                            {lang === 'ar' ? 'ربح' : 'WIN'}
                        </>
                    ) : (
                        <>
                            <TrendingDown className="w-3 h-3 mx-1" />
                            {lang === 'ar' ? 'خسارة' : 'LOSS'}
                        </>
                    )}
                  </span>
                </td>
                <td className={`px-4 py-3 font-mono font-bold ${lang === 'en' ? 'text-right' : 'text-left'} ${
                  trade.profit > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                </td>
                <td className={`px-4 py-3 font-mono text-blue-300 ${lang === 'en' ? 'text-right' : 'text-left'}`}>
                  {trade.balanceAfter.toFixed(2)}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                        {lang === 'ar' ? 'لا توجد صفقات مسجلة بعد' : 'No trades recorded yet'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

```

---
### 📄 File: components\TutorialModal.tsx
```typescript
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
```

---
### 📄 File: components\WelcomeModal.tsx
```typescript
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
```

---
### 📄 File: constants.ts
```typescript

import { Language } from './types';

export const BASE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export const DOWNLOADABLE_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

export const TRANSLATIONS: Record<string, any> = {
  ar: {
    title: 'Trade Manager Guard Pro V1.1',
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات والاستراتيجية',
    history: 'سجل الصفقات',
    report: 'التقرير والتحليل',

    // Auth
    loginTitle: 'تسجيل الدخول',
    registerTitle: 'إنشاء حساب جديد',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'دخول',
    registerBtn: 'تسجيل',
    continueWith: 'أو المتابعة باستخدام',
    google: 'Google',
    github: 'GitHub',
    haveAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    signOut: 'تسجيل الخروج',
    welcome: 'مرحباً',

    // User Menu & Help
    profile: 'الملف الشخصي',
    profileSettings: 'إعدادات الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    nameLabel: 'الاسم',
    avatarLabel: 'رابط الصورة (اختياري)',
    saveChanges: 'حفظ التغييرات',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    strategyGuide: 'دليل الاستراتيجية (Ronald PRO)',
    openStrategy: 'فتح مساعد الاستراتيجية',
    appTutorial: 'جولة في التطبيق (Live)',
    help: 'المساعدة',

    // Strategy Modal
    stratTitle: 'محلل الاستراتيجية الذكي',
    stratDesc: 'اختر الاستراتيجية المناسبة للبدء.',

    // Menu
    stratMenuTitle: 'الاستراتيجيات',
    stratRonald: 'سكالبينج 30 ثانية (Ronald PRO)',
    stratEmaSar: 'تتبع الاتجاه (EMA + SAR)',

    // Strategy 1: Ronald PRO
    ronaldTitle: 'سكالبينج 30 ثانية (Ronald PRO)',
    ronaldDesc: 'استراتيجية سريعة لصفقات 30 ثانية.',

    // Indicators (Ronald)
    checkEnvelopes: '1. حالة مؤشر Envelopes',
    valEnvelopes: 'الإعدادات: Period 9, Dev 0.01, MA: TMA',
    optEnvTop: 'ملامسة الخط العلوي (مقاومة)',
    optEnvBottom: 'ملامسة الخط السفلي (دعم)',
    optEnvMid: 'في المنتصف / غير واضح',

    checkAroon: '2. حالة مؤشر Aroon',
    valAroon: 'الإعدادات: Period 9',
    optAroonUp: 'الخط الأخضر (UP) هو المرتفع',
    optAroonDown: 'الخط الأحمر (DOWN) هو المرتفع',
    optAroonWeak: 'الخطوط متقاربة / ضعيفة',

    checkAC: '3. مؤشر Awesome Oscillator',
    valAC: 'الإعدادات: Fast 5, Slow 10',
    optAcGreen: 'أعمدة خضراء (صعود)',
    optAcRed: 'أعمدة حمراء (هبوط)',
    optAcWeak: 'ضعيفة / متذبذبة',

    checkRsi: '4. فلتر ADX (قوة الاتجاه)',
    valRsi: 'الإعدادات: Period 14, Min 20',
    optRsiBuy: 'اتجاه قوي (ADX > 20)',
    optRsiSell: 'تذبذب / اتجاه ضعيف',

    // Strategy 2: EMA + SAR
    emaSarTitle: 'تتبع الاتجاه (EMA + SAR)',
    emaSarDesc: 'التداول مع الاتجاه بتقاطع المتوسطات والبارابوليك.',

    checkEma: '1. تقاطع المتوسطات (EMA)',
    valEma: 'Fast: 8 (أصفر), Slow: 21 (أبيض)',
    optEmaBuy: 'الأصفر فوق الأبيض (اتجاه صاعد)',
    optEmaSell: 'الأصفر تحت الأبيض (اتجاه هابط)',
    optEmaFlat: 'الخطوط متشابكة / مسطحة',

    checkSar: '2. نقاط Parabolic SAR',
    valSar: 'Start: 0.02, Max: 0.2',
    optSarBelow: 'النقاط أسفل الشموع (شراء)',
    optSarAbove: 'النقاط أعلى الشموع (بيع)',

    checkFilter: '3. فلتر الإشارة (Signal)',
    valFilter: 'Pink Filter / AO',
    optFilterBuy: 'نقطة خضراء / إشارة شراء قوية',
    optFilterSell: 'نقطة حمراء / إشارة بيع قوية',
    optFilterNone: 'لا توجد إشارة واضحة',

    // Results
    resultAnalyzing: 'جاري التحليل...',
    resultBuy: 'قرار استراتيجي: شــــراء (CALL) 🟢',
    resultSell: 'قرار استراتيجي: بيــــع (PUT) 🔴',
    resultWait: 'القرار:  انتظر.. السوق غير واضح ✋',
    resultPartial: 'إشارة ضعيفة: لا تغامر',

    resetChecklist: 'مسح الاختيارات',
    contactSupport: 'تواصل مع الدعم',
    version: 'الإصدار 1.1',
    contactSubject: 'دعم فني - Trade Manager Guard Pro',
    contactBody: 'مرحباً، لدي استفسار بخصوص...',
    theme: 'المظهر',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    keyboardShortcuts: 'اختصارات لوحة المفاتيح',
    pressKey: 'اضغط أي مفتاح...',
    winAction: 'تسجيل ربح',
    lossAction: 'تسجيل خسارة',

    // Settings
    initialCapital: 'رأس المال الكلي',
    initialStake: 'مبلغ الصفقة الأولى',
    profitPct: 'نسبة الربح % (Payout)',
    winIncPct: 'زيادة عند الربح (%)',
    lossMult: 'مضاعف التعويض عند الخسارة',
    maxLosses: 'الحد الأقصى للخسائر المتتالية',
    assetName: 'قائمة الأصول (اختر 1)',
    currency: 'العملة',
    strategyName: 'اسم الاستراتيجية',
    strategyPlaceholder: 'اسم الاستراتيجية التي تعمل عليها اذا وجدت',
    assetsTitle: 'الأصول المفضلة (الاسم | نسبة الربح)  *يمكنك تغيير وكتابة اسم الاصل ونسبة ربحه',
    configureStrategy: 'ضبط الاستراتيجية والإعدادات',
    saveAndReturn: 'حفظ والعودة',

    // Actions
    win: 'ربحت',
    loss: 'خسرت',
    reset: 'تصفير وبدء جديد',
    newSession: 'جلسة جديدة',
    export: 'تصدير لـ Google Sheets',
    exportExcel: 'تصدير Excel (ملون)',
    exportPDF: 'حفظ التقرير (PDF)',
    printSession: 'طباعة هذه الجلسة',
    options: 'خيارات',
    installApp: 'تثبيت التطبيق',
    miniMode: 'الوضع المصغر (عائم)',
    openMini: 'فتح النافذة العائمة',
    opacity: 'الشفافية',
    drag: 'سحب',
    addLanguage: 'إضافة لغة',
    downloading: 'جاري تنزيل حزمة اللغة...',
    downloadComplete: 'تم التثبيت بنجاح',

    // Language Store
    languageStore: 'متجر اللغات',
    availableLangs: 'اللغات المتاحة للتنزيل',
    install: 'تنزيل',
    installed: 'مثبت',

    // Stats
    currentBalance: 'الرصيد الحالي',
    nextStake: 'مبلغ الصفقة القادمة',
    totalProfit: 'صافي الربح/الخسارة',
    winRate: 'نسبة الفوز',
    tradesCount: 'عدد الصفقات',
    consLosses: 'الخسائر المتتالية الحالية',

    // Sessions
    sessionsHistory: 'أرشيف الجلسات',
    sessionStart: 'البداية',
    sessionEnd: 'النهاية',
    sessionProfit: 'الربح',
    clearAllHistory: 'مسح كل المحفوظات',
    confirmDelete: 'تحذير: سيتم حذف جميع سجلات الجلسات والصفقات نهائياً. هل أنت متأكد؟',
    confirmReset: 'هل أنت متأكد من تصفير الحساب والبدء من جديد؟ (يستخدم فقط عند خسارة كامل رأس المال)',
    totalAllSessions: 'إجمالي كل الجلسات',

    // Modals
    confirmResetTitle: 'تأكيد التصفير الشامل',
    confirmResetBody: 'تحذير: هذا الخيار يستخدم فقط في حال خسارة كامل رأس المال (المرجنة). هل أنت متأكد أنك تريد تصفير الحساب والبدء من جديد؟ سيتم أرشفة الجلسة الحالية.',
    confirmDeleteTitle: 'حذف الأرشيف',
    confirmDeleteBody: 'تحذير: سيتم حذف جميع الجلسات والصفقات نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    confirmAction: 'نعم، نفذ',
    cancelAction: 'إلغاء',

    // Messages
    maxLossHit: 'تم الوصول لحد الخسائر! زر الخسارة معطل حتى بدء جلسة جديدة.',
    balanceLow: 'الرصيد غير كافي! ابدء بجلسة جديدة.',
    balanceCritical: 'رصيدك أقل من 1$. يجب عليك تصفير الحساب والبدء من جديد.',
    sessionReset: 'تم بدء جلسة جديدة بناءً على الرصيد المتبقي (2%).',
    enterProfitPct: 'الرجاء إدخال نسبة الربح او نسبة الأصول المفضلة',

    // Table
    time: 'الوقت',
    asset: 'الأصل',
    stake: 'المبلغ',
    outcome: 'النتيجة',
    profit: 'العائد',
    balance: 'الرصيد',
    sortAsc: 'ترتيب: الأقدم أولاً',
    sortDesc: 'ترتيب: الأحدث أولاً',

    // Welcome & Tour
    welcomeTourTitle: 'مرحباً بك في Trade Manager Guard Pro',
    welcomeTourDesc: 'هل ترغب في جولة سريعة للتعرف على ميزات التطبيق وكيفية استخدامه بفعالية؟',
    startTour: 'بدء الجولة',
    skipTour: 'تخطي',
    dontShowAgain: 'لا تظهر هذه الرسالة مرة أخرى',
    nextHint: 'التالي',
    prevHint: 'السابق',
    finishHint: 'إنهاء الجولة',

    // Tour Hints
    tourBalanceTitle: 'لوحة المعلومات',
    tourBalanceDesc: 'هنا يظهر رصيدك الحالي، والعملة المستخدمة. النظام يحسب المخاطرة والصفقات القادمة بناءً على هذا الرصيد.',
    tourStakeTitle: 'الصفقة القادمة',
    tourStakeDesc: 'هذا هو المبلغ الذي يجب أن تدخل به الصفقة التالية. يتم حسابه تلقائياً وبدقة بناءً على نتيجة الصفقة السابقة.',
    tourActionsTitle: 'تسجيل النتائج',
    tourActionsDesc: 'اضغط "ربحت" عند نجاح الصفقة لزيادة الربح، أو "خسرت" ليقوم النظام بتفعيل خطة التعويض.',
    tourSessionTitle: 'إدارة الجلسة والتصفير',
    tourSessionDesc: 'استخدم "جلسة جديدة" عند الوصول لحد الخسارة لإعادة الحسابات بأمان. أما "تصفير" فيستخدم فقط في حال خسارة كامل رأس المال للبدء من الصفر.',
    tourAssetsTitle: 'قائمة الأصول الذكية',
    tourAssetsEditDesc: 'قائمة موسعة بـ 10 أصول. اختر الأصل للتداول عليه.',
    tourAssetEditTitle: 'تعديل الأصل',
    tourAssetEditDesc: 'اضغط مباشرة على اسم الأصل أو نسبة الربح لتعديلها. التغييرات تحفظ تلقائياً.',
    tourConfigTitle: 'زر الإعدادات',
    tourConfigDesc: 'اضغط هنا لفتح نافذة الاستراتيجية وضبط رأس المال، نسب الربح، وحدود المخاطرة.',

    // Granular Settings Tour
    tourCapitalTitle: 'رأس المال',
    tourCapitalDesc: 'أدخل المبلغ الكلي الذي ستبدأ به. التطبيق سيستخدم هذا الرقم لحساب نسبة المخاطرة الآمنة.',
    tourInitStakeTitle: 'مبلغ البداية',
    tourInitStakeDesc: 'يتم ضبطه تلقائياً على 2%، ولكن يمكنك تعديله يدوياً. هذا هو المبلغ الذي تبدأ به الجلسة أو تعود إليه بعد سلسلة انتصارات.',
    tourCurrencyTitle: 'عملة الحساب',
    tourCurrencyDesc: 'اختر العملة التي تناسب محفظتك (USD, EUR, USDT...). هذا للتوضيح فقط ولا يؤثر على الحسابات.',
    tourPayoutTitle: 'نسبة العائد (Payout)',
    tourPayoutDesc: 'مهم جداً! أدخل نسبة عائد المنصة (مثلاً 85%). بدون هذا الرقم لا يمكن حساب الأرباح بدقة.',
    tourWinIncTitle: 'نسبة الزيادة عند الربح',
    tourWinIncDesc: 'هذه النسبة تضاف لمبلغ الصفقة القادمة عند الفوز، لتنمية رأس المال بشكل تراكمي (Compound).',
    tourLossMultTitle: 'مضاعف الخسارة',
    tourLossMultDesc: 'في حال الخسارة، يضرب النظام المبلغ بهذا الرقم (2.84) لتعويض الخسارة السابقة وتحقيق ربح بسيط.',
    tourLimitsTitle: 'حدود الأمان',
    tourLimitsDesc: 'حدد أقصى عدد للخسائر المتتالية المسموح بها قبل أن يمنعك التطبيق من التداول لحماية رصيدك من الانهيار.',

    // Reporting & Features Tour
    tourChartTitle: 'الرسم البياني',
    tourChartDesc: 'تتبع نمو رصيدك بصرياً. المنطقة الخضراء تعني أنك في ربح، والحمراء تعني أنك تحت رأس المال الأساسي.',
    tourHistoryTitle: 'سجل الصفقات',
    tourHistoryDesc: 'جدول تفصيلي لكل صفقة. يمكنك الضغط على العناوين لترتيب الجدول تصاعدياً أو تنازلياً.',
    tourArchiveTitle: 'أرشيف الجلسات',
    tourArchiveDesc: 'كل جلسة تداول (من البداية حتى التصفير أو جلسة جديدة) تحفظ هنا كملف مستقل.',
    tourArchiveActionsTitle: 'طباعة وحذف',
    tourArchiveActionsDesc: 'يمكنك طباعة تقرير PDF شامل لكل الجلسات، أو تصدير ملف Excel، أو مسح الأرشيف بالكامل.',

    tourMiniModeTitle: 'الوضع المصغر (PiP)',
    tourMiniModeDesc: 'اضغط هنا لفصل التطبيق في نافذة عائمة صغيرة تبقى فوق جميع النوافذ الأخرى، لتتداول وتراقب المنصة في نفس الوقت.',
    tourMiniWindowTitle: 'النافذة العائمة',
    tourMiniWindowDesc: 'هذه النافذة تبقى فوق متصفحك. يمكنك سحبها من الشريط العلوي لأي مكان.',
    tourMiniControlsTitle: 'أزرار التحكم المصغرة',
    tourMiniControlsDesc: 'سجل النتائج بسرعة وشاهد مبلغ الصفقة القادمة دون الحاجة للعودة للتطبيق الرئيسي.',
    tourMiniOpacityTitle: 'الشفافية',
    tourMiniOpacityDesc: 'تحكم بشفافية النافذة لتتمكن من رؤية الشارت خلفها بوضوح.',

    tourMenuTitle: 'القائمة والمظهر',
    tourMenuDesc: 'من هنا يمكنك تغيير اللغة، تفعيل الوضع الليلي/النهاري، وضبط اختصارات لوحة المفاتيح.',

    // Strategy Guide Content
    guideTitle: 'الدليل الشامل لاستراتيجية Trade Guard',
    guideIntro: 'مرحباً بك. هذا التطبيق ليس مجرد أداة لتسجيل الصفقات، بل هو نظام متكامل لإدارة رأس المال (Money Management) يهدف لحمايتك من الخسائر الكبيرة وتنمية حسابك بذكاء. يعتمد النظام على الرياضيات لتقليل المخاطر.',
    guideRule1: '1. الأساس: قاعدة الـ 2% والحفاظ على الرصيد',
    guideRule1Desc: 'القاعدة الذهبية في التداول هي البقاء في السوق. لذلك، يقوم التطبيق دائماً بحساب مبلغ الصفقة الأولى ليكون 2% فقط من رأس مالك المتاح. هذا يعني أنه حتى لو تعرضت لسلسلة خسائر، فإن حسابك لن يتبخر بسرعة، مما يعطيك فرصاً أكثر للتعويض.',
    guideRule2: '2. في حالة الربح (تنمية المكاسب)',
    guideRule2Desc: 'عندما تربح صفقة، لا نكتفي بالربح الثابت. النظام يقوم بزيادة مبلغ الصفقة التالية بنسبة مئوية بسيطة (افتراضياً 20% أو 5%). الهدف هو استغلال "سلسلة الانتصارات" (Winning Streak) لتحقيق أرباح مركبة دون تعريض رأس المال الأصلي لمخاطرة كبيرة.',
    guideRule3: '3. في حالة الخسارة (استراتيجية التعويض الذكي)',
    guideRule3Desc: 'الخسارة جزء من اللعبة. عند تسجيل خسارة، لا داعي للذعر. النظام يستخدم معامل ضرب (افتراضياً 2.84) لحساب مبلغ الصفقة التالية. هذا المبلغ الجديد مصمم ليعوض لك قيمة الخسارة السابقة + يضيف ربحاً بسيطاً فوقها. بمجرد الفوز في صفقة التعويض، يعيدك النظام تلقائياً لأخر مبلغ رابح آمن.',
    guideRule4: '4. شبكة الأمان (مانع المرجنة)',
    guideRule4Desc: 'أخطر ما يواجه المتداول هو العناد. لذلك، وضعنا حداً أقصى للخسائر المتتالية (افتراضياً 3). إذا خسرت 3 مرات متتالية، سيقوم التطبيق بتعطيل زر "خسرت" ويجبرك على التوقف. هنا يجب عليك أخذ استراحة، ثم الضغط على "جلسة جديدة" ليعيد النظام حساب المخاطرة بناءً على ما تبقى من رصيد، بدلاً من المغامرة بمبالغ ضخمة.',
  },
  en: {
    title: 'Trade Manager Guard Pro V1.1',
    dashboard: 'Dashboard',
    settings: 'Settings & Strategy',
    history: 'Trade History',
    report: 'Report & Analytics',

    // Auth
    loginTitle: 'Login',
    registerTitle: 'Create Account',
    email: 'Email Address',
    password: 'Password',
    loginBtn: 'Sign In',
    registerBtn: 'Register',
    continueWith: 'Or continue with',
    google: 'Google',
    github: 'GitHub',
    haveAccount: 'Already have an account?',
    noAccount: 'Don\'t have an account?',
    signOut: 'Sign Out',
    welcome: 'Welcome',

    // User Menu & Help
    profile: 'Profile',
    profileSettings: 'Profile Settings',
    editProfile: 'Edit Profile',
    nameLabel: 'Name',
    avatarLabel: 'Avatar URL (Optional)',
    saveChanges: 'Save Changes',
    profileUpdated: 'Profile updated successfully',
    strategyGuide: 'Strategy Guide (Ronald PRO)',
    openStrategy: 'Open Strategy Assistant',
    appTutorial: 'App Tour (Live)',

    // Strategy Modal
    stratTitle: 'Smart Strategy Analyzer',
    stratDesc: 'Select a strategy to get started.',

    // Menu
    stratMenuTitle: 'Strategies',
    stratRonald: '30s Scalping (Ronald PRO)',
    stratEmaSar: 'Trend Follow (EMA + SAR)',

    // Strategy 1: Ronald PRO
    ronaldTitle: '30s Scalping (Ronald PRO)',
    ronaldDesc: 'High frequency scalping for 30s expiration.',

    // Indicators (Ronald) - With Settings
    checkEnvelopes: '1. Envelopes Status',
    valEnvelopes: 'Period: 9, Dev: 0.01, MA: TMA, Source: Open',
    optEnvTop: 'Touching Upper Band (Resistance)',
    optEnvBottom: 'Touching Lower Band (Support)',
    optEnvMid: 'Middle / Unclear',

    checkAroon: '2. Aroon Status',
    valAroon: 'Period: 9',
    optAroonUp: 'Green Line (UP) is High',
    optAroonDown: 'Red Line (DOWN) is High',
    optAroonWeak: 'Lines Converging / Weak',

    checkAC: '3. Awesome Oscillator',
    valAC: 'Settings: Fast 5, Slow 10',
    optAcGreen: 'Green Bars (Bullish)',
    optAcRed: 'Red Bars (Bearish)',
    optAcWeak: 'Small / Weak',

    checkRsi: '4. ADX Filter (Trend Strength)',
    valRsi: 'Period: 14, Min Strength: 20',
    optRsiBuy: 'Strong Trend (ADX > 20)',
    optRsiSell: 'Weak / Ranging (ADX < 20)',

    // Strategy 2: EMA + SAR
    emaSarTitle: 'Trend Follow (EMA + SAR)',
    emaSarDesc: 'Follow the trend with EMA Cross and SAR confirmation.',

    checkEma: '1. EMA Crossover',
    valEma: 'Fast: 8 (Yellow), Slow: 21 (White)',
    optEmaBuy: 'Yellow > White (Up Trend)',
    optEmaSell: 'Yellow < White (Down Trend)',
    optEmaFlat: 'Lines Tangled / Flat',

    checkSar: '2. Parabolic SAR',
    valSar: 'Start: 0.02, Max: 0.2',
    optSarBelow: 'Dots BELOW Candles (Bullish)',
    optSarAbove: 'Dots ABOVE Candles (Bearish)',

    checkFilter: '3. Signal Filter',
    valFilter: 'Pink Filter / AO',
    optFilterBuy: 'Green Dot / Strong Buy Signal',
    optFilterSell: 'Red Dot / Strong Sell Signal',
    optFilterNone: 'No Clear Signal',

    // Results
    resultAnalyzing: 'Analyzing...',
    resultBuy: 'Decision: CALL (BUY) 🟢',
    resultSell: 'Decision: PUT (SELL) 🔴',
    resultWait: 'Decision: WAIT... Market Unclear ✋',
    resultPartial: 'Weak Signal: Do Not Trade',

    resetChecklist: 'Reset Selection',
    help: 'Help',
    contactSupport: 'Contact Support',
    version: 'Version 1.1',
    contactSubject: 'Support Request - Trade Manager Guard Pro',
    contactBody: 'Hello, I need help with...',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    keyboardShortcuts: 'Keyboard Shortcuts',
    pressKey: 'Press any key...',
    winAction: 'Log Win',
    lossAction: 'Log Loss',

    // Settings
    initialCapital: 'Total Capital',
    initialStake: 'Initial Stake',
    profitPct: 'Profit Percentage % (Payout)',
    winIncPct: 'Increase on Win (%)',
    lossMult: 'Loss Recovery Multiplier',
    maxLosses: 'Max Consecutive Losses',
    assetName: 'Asset List (Select 1)',
    currency: 'Currency',
    strategyName: 'Strategy Name',
    strategyPlaceholder: 'The name of the strategy you are working on, if any',
    assetsTitle: 'Favorite Assets (Name | Payout %)  *You can edit name and payout',
    configureStrategy: 'Configure Strategy & Settings',
    saveAndReturn: 'Save & Return',

    // Actions
    win: 'WIN',
    loss: 'LOSS',
    reset: 'Reset & Restart',
    newSession: 'New Session',
    export: 'Export to Google Sheets',
    exportExcel: 'Export Excel (Colored)',
    exportPDF: 'Save Report (PDF)',
    printSession: 'Print This Session',
    options: 'Options',
    installApp: 'Install App',
    miniMode: 'Mini Mode (Floating)',
    openMini: 'Open Floating Window',
    opacity: 'Opacity',
    drag: 'Drag',
    addLanguage: 'Add Language',
    downloading: 'Downloading language pack...',
    downloadComplete: 'Installed successfully',

    // Language Store
    languageStore: 'Language Store',
    availableLangs: 'Available for Download',
    install: 'Install',
    installed: 'Installed',

    // Stats
    currentBalance: 'Current Balance',
    nextStake: 'Next Trade Amount',
    totalProfit: 'Net P/L',
    winRate: 'Win Rate',
    tradesCount: 'Total Trades',
    consLosses: 'Current Cons. Losses',

    // Sessions
    sessionsHistory: 'Sessions Archive',
    sessionStart: 'Start',
    sessionEnd: 'End',
    sessionProfit: 'Profit',
    clearAllHistory: 'Clear All History',
    confirmDelete: 'WARNING: This will permanently delete all session logs and trades. Are you sure?',
    confirmReset: 'Are you sure you want to fully reset? (Only use if you lost all capital)',
    totalAllSessions: 'Total All Sessions',

    // Modals
    confirmResetTitle: 'Confirm Full Reset',
    confirmResetBody: 'WARNING: This is intended for use ONLY if you have lost your entire capital. Are you sure you want to reset and start over?',
    confirmDeleteTitle: 'Delete Archive',
    confirmDeleteBody: 'Warning: This will permanently delete all history and cannot be undone.',
    confirmAction: 'Yes, Proceed',
    cancelAction: 'Cancel',

    // Messages
    maxLossHit: 'Max losses reached! Loss button disabled until New Session.',
    balanceLow: 'Insufficient balance! Please start a New Session.',
    balanceCritical: 'Balance below $1. You must Reset and start over.',
    sessionReset: 'New session started based on remaining balance (2%).',
    enterProfitPct: 'Please enter Profit Percentage or Favorite Asset Percentage',

    // Table
    time: 'Time',
    asset: 'Asset',
    stake: 'Stake',
    outcome: 'Outcome',
    profit: 'Return',
    balance: 'Balance',
    sortAsc: 'Sort: Oldest First',
    sortDesc: 'Sort: Newest First',

    // Welcome & Tour
    welcomeTourTitle: 'Welcome to Trade Manager Guard Pro',
    welcomeTourDesc: 'Would you like a quick interactive tour to learn the features and how to use them effectively?',
    startTour: 'Start Tour',
    skipTour: 'Skip',
    dontShowAgain: 'Don\'t show this again',
    nextHint: 'Next',
    prevHint: 'Previous',
    finishHint: 'Finish Tour',

    // Tour Hints
    tourBalanceTitle: 'Dashboard Info',
    tourBalanceDesc: 'Here you see your current balance and currency. The system calculates risk based on this amount.',
    tourStakeTitle: 'Next Stake',
    tourStakeDesc: 'This is the amount for your next trade. It is auto-calculated based on the previous outcome.',
    tourActionsTitle: 'Logging Results',
    tourActionsDesc: 'Click "WIN" to log profit and increase stake, or "LOSS" to trigger the recovery plan.',
    tourSessionTitle: 'Session & Reset',
    tourSessionDesc: 'Use "New Session" when max losses are reached to recalculate safety. "Reset" is ONLY for when you have lost your total capital and need a fresh start.',
    tourAssetsTitle: 'Smart Asset List',
    tourAssetsEditDesc: 'Expanded list of 10 assets. Select one to trade.',
    tourAssetEditTitle: 'Edit Assets',
    tourAssetEditDesc: 'Click directly on the Asset Name or Payout % to edit them instantly.',
    tourConfigTitle: 'Settings Button',
    tourConfigDesc: 'Click here to open the configuration window where you can adjust your Capital, Risk Limits, and Strategy rules.',

    // Granular Settings Tour
    tourCapitalTitle: 'Total Capital',
    tourCapitalDesc: 'Enter your total starting funds here. The app uses this to calculate safe 2% entry stakes.',
    tourInitStakeTitle: 'Initial Stake',
    tourInitStakeDesc: 'Defaults to 2%, but you can override it manually. This is your "Base" stake.',
    tourCurrencyTitle: 'Currency',
    tourCurrencyDesc: 'Select your preferred currency (USD, EUR, USDT...). This is for display purposes only.',
    tourPayoutTitle: 'Payout %',
    tourPayoutDesc: 'Crucial! Enter the broker\'s payout percentage (e.g., 85) for accurate profit calculations.',
    tourWinIncTitle: 'Win Increase %',
    tourWinIncDesc: 'How much to increase your stake after a win to compound profits (e.g., 5% or 20%).',
    tourLossMultTitle: 'Loss Multiplier',
    tourLossMultDesc: 'The multiplication factor (default 2.84) used after a loss to recover funds + profit.',
    tourLimitsTitle: 'Safety Limits',
    tourLimitsDesc: 'Set the maximum allowed consecutive losses. The app locks the Loss button when hit to save your account.',

    // Reporting & Features
    tourChartTitle: 'Performance Chart',
    tourChartDesc: 'Visualizes your balance growth. Green area indicates profit, red indicates drawdown below starting capital.',
    tourHistoryTitle: 'Trade History',
    tourHistoryDesc: 'Detailed log of every trade. Click column headers to sort. Shows outcome, profit, and running balance.',
    tourArchiveTitle: 'Session Archive',
    tourArchiveDesc: 'Every trading session is saved here automatically when you reset or start over.',
    tourArchiveActionsTitle: 'Archive Actions',
    tourArchiveActionsDesc: 'Print reports, export to Excel, or manage individual session data.',

    tourMiniModeTitle: 'Mini Mode (PiP)',
    tourMiniModeDesc: 'Click this to detach the app into a small floating window that stays on top of other windows.',
    tourMiniWindowTitle: 'Floating Window',
    tourMiniWindowDesc: 'This window stays on top of your broker. You can drag it anywhere.',
    tourMiniControlsTitle: 'Compact Controls',
    tourMiniControlsDesc: 'Quickly Log Wins/Losses and see the next stake without switching windows.',
    tourMiniOpacityTitle: 'Transparency',
    tourMiniOpacityDesc: 'Adjust visibility to see the charts behind the floating window.',

    tourMenuTitle: 'Main Menu & Theme',
    tourMenuDesc: 'Access Language settings, switch Dark/Light theme, configure Hotkeys, and see the Strategy Guide.',

    // Strategy Guide Content
    guideTitle: 'The Comprehensive TradeGuard Strategy',
    guideIntro: 'Welcome. This app is more than a trade logger; it is a complete Money Management system designed to shield you from large drawdowns and grow your account intelligently using mathematical probability.',
    guideRule1: '1. Foundation: The 2% Rule',
    guideRule1Desc: 'The golden rule of trading is survival. This app calculates your starting stake as exactly 2% of your available capital. This ensures that even a bad streak won\'t deplete your account, giving you plenty of room to recover.',
    guideRule2: '2. Winning: Compound Growth',
    guideRule2Desc: 'When you win, we don\'t just stay static. The system increases your next stake by a small percentage (default 20%). This allows you to capitalize on "Winning Streaks" to build profit faster using the market\'s money, not just your own.',
    guideRule3: '3. Losing: Smart Recovery',
    guideRule3Desc: 'Losses happen. When you log a loss, the system applies a multiplier (default 2.84) to the next stake. This calculated amount is designed to recover the previous loss AND generate a small profit when you win. Once recovered, it reverts to a safe stake.',
    guideRule4: '4. Safety Net: Anti-Blowout',
    guideRule4Desc: 'To prevent emotional trading (revenge trading), there is a hard limit on consecutive losses (default 3). If you hit this limit, the "LOSS" button locks. You must take a break and click "New Session", which recalculates a safe stake based on the REMAINING balance, preventing total account blowout.',
  }
};

```

---
### 📄 File: create_apk_file.bat
```bat
@echo off
setlocal
chcp 65001 > nul
echo ===================================================
echo   Trade Manager Pro - APK Generator
echo   منشئ ملفات تطبيقات الأندرويد
echo ===================================================

cd /d "%~dp0"

:: --- SETUP PORTABLE NODE (From Run Project script) ---
set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [DEBUG] Checking Node paths...
if exist "%NODE_EXE%" (
    echo [OK] Using Portable Node: %NODE_EXE%
    set "PATH=%NODE_DIR%;%PATH%"
) else (
    echo [WARN] Portable Node not found. Trying global Node...
    set "NPM_CMD=npm"
)
:: ---------------------------

:: Check for Java
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed. You need Java JDK 17 to build Android apps.
    echo [ERROR] جافا غير مثبتة. تحتاج إلى تثبيت Java JDK لبناء التطبيق.
    pause
    exit /b
)

echo.
echo [1/4] Install & Build Web Project...
echo [1/4] جاري بناء ملفات الموقع...
call npm install
call npm run build

echo.
echo [2/4] Initializing Android Project...
echo [2/4] جاري تجهيز بيئة الأندرويد...
if not exist "android" (
    call npx cap add android
)
call npx cap sync

echo.
echo [3/4] Building APK File (Gradle)...
echo [3/4] جاري إنشاء ملف التطبيق APK...
echo This process downloads build tools and may take 5-10 minutes for the first time.
echo هذه العملية قد تستغرق بضع دقائق...
cd android
call gradlew.bat assembleDebug
cd ..

echo.
echo [4/4] Finalizing...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "TradeManager_Mobile.apk"
    echo.
    echo **********************************************************
    echo * SUCCESS!                                               *
    echo * تم إنشاء التطبيق بنجاح!                               *
    echo *                                                        *
    echo * Your Android App File (APK) is ready:                  *
    echo * الملف جاهز في المجلد الحالي باسم:                      *
    echo * "TradeManager_Mobile.apk"                              *
    echo *                                                        *
    echo * Copy this file to your phone and install it.           *
    echo * انقل هذا الملف لجوالك وقم بتثبيته.                   *
    echo **********************************************************
) else (
    echo.
    echo [ERROR] Could not generate APK.
    echo [ERROR] فشل إنشاء الملف.
    echo Possible reasons:
    echo  - Android SDK is missing (Install Android Studio Command Line Tools)
    echo  - Java JAVA_HOME is not set correctly
    echo.
    echo Try running "build_mobile_app.bat" instead to debug in Android Studio.
    echo جرب تشغيل الملف build_mobile_app.bat لفتح أندرويد ستوديو وحل المشكلة.
)

pause

```

---
### 📄 File: index.html
```html

<!DOCTYPE html>
<html lang="en" dir="ltr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Trade Manager Guard Pro V1.1</title>
    <link rel="manifest" href="/manifest.json">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              slate: {
                850: '#1e293b', 
                900: '#0f172a',
              }
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      html, body {
        height: 100%;
        overflow-y: auto; /* Enable vertical scroll */
        -webkit-overflow-scrolling: touch;
      }
      body {
        font-family: 'Inter', 'Tajawal', sans-serif;
        @apply bg-slate-900 text-slate-200 transition-colors duration-300;
      }
      html.light body {
        @apply bg-gray-50 text-black; /* STRICT BLACK TEXT */
      }
      /* Ensure inputs are readable in light mode */
      html.light input, html.light select {
        @apply text-black border-gray-300;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        @apply bg-slate-900;
      }
      html.light ::-webkit-scrollbar-track {
        @apply bg-gray-200;
      }
      ::-webkit-scrollbar-thumb {
        @apply bg-slate-700 rounded;
      }
      html.light ::-webkit-scrollbar-thumb {
        @apply bg-gray-400;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.554.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "recharts": "https://aistudiocdn.com/recharts@^3.5.0",
    "html2canvas": "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm",
    "jspdf": "https://aistudiocdn.com/jspdf@^2.5.1",
    "jspdf-autotable": "https://aistudiocdn.com/jspdf-autotable@^3.8.1",
    "react-dom": "https://aistudiocdn.com/react-dom@^19.2.0",
    "exceljs": "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/+esm"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root"></div>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    </script>
  <script type="module" src="/index.tsx"></script>
</body>
</html>

```

---
### 📄 File: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---
### 📄 File: manifest.json
```javascripton

{
  "name": "Trade Manager Guard Pro V1.1",
  "short_name": "TradeMgr Pro V1.1",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait",
  "icons": [
    {
      "src": "https://cdn-icons-png.flaticon.com/512/7210/7210660.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://cdn-icons-png.flaticon.com/512/7210/7210660.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

```

---
### 📄 File: metadata.json
```javascripton
{
  "name": "Trade Manager Guard Pro V1.3",
  "description": "Professional trade money management system with auto-compounding and loss recovery strategies.",
  "requestFramePermissions": []
}
```

---
### 📄 File: package.json
```javascripton
{
  "name": "trade-manager-guard-pro-v1.3",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "mobile": "npx cap open android"
  },
  "dependencies": {
    "react": "^19.2.0",
    "lucide-react": "^0.554.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.5.0",
    "html2canvas": "1.4.1",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.1",
    "exceljs": "4.4.0",
    "@capacitor/core": "^5.0.0",
    "@capacitor/android": "^5.0.0",
    "@capacitor/ios": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "@capacitor/cli": "^5.0.0"
  }
}
```

---
### 📄 File: sw.js
```javascript
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('tradeguard-store').then((cache) => cache.addAll([
      '/',
      '/index.html',
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
```

---
### 📄 File: tsconfig.json
```javascripton
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

---
### 📄 File: types.ts
```typescript

export type Language = string;
export type Currency = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED' | 'USDT';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Trade {
  id: string;
  timestamp: number;
  asset: string;
  stake: number;
  outcome: 'WIN' | 'LOSS';
  profit: number; // Positive for win, negative (stake) for loss
  balanceAfter: number;
  note?: string;
}

export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  startBalance: number;
  endBalance: number;
  netProfit: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  trades: Trade[]; // Added to store full history for reports
  strategyName?: string;
}

export interface AssetOption {
  name: string;
  defaultPayout: number | '';
}

export interface KeyboardShortcuts {
  win: string;
  loss: string;
  newSession: string;
  reset: string;
}

export interface AppSettings {
  initialCapital: number;
  initialStake: number;
  profitPercentage: number | ''; // Allow empty string for UI input
  winIncreasePercentage: number;
  lossIncreaseMultiplier: number;
  maxConsecutiveLosses: number;
  availableAssets: AssetOption[]; // Array of 10 assets
  selectedAssetIndex: number; // 0-9
  strategyName?: string;
}

export interface AppState {
  currentBalance: number;
  currentStake: number;
  nextStake: number;
  lastWinningStake: number;
  consecutiveLosses: number;
  trades: Trade[];
  sessions: Session[];
}

export const INITIAL_SETTINGS: AppSettings = {
  initialCapital: 20,
  initialStake: 1,
  profitPercentage: '',
  winIncreasePercentage: 5,
  lossIncreaseMultiplier: 2.84,
  maxConsecutiveLosses: 3,
  availableAssets: [
    { name: 'EUR/USD', defaultPayout: '' },
    { name: 'GBP/USD', defaultPayout: '' },
    { name: 'USD/JPY', defaultPayout: '' },
    { name: 'XAU/USD', defaultPayout: '' },
    { name: 'BTC/USD', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' }
  ],
  selectedAssetIndex: 0,
  strategyName: ''
};

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  win: 'w',
  loss: 'l',
  newSession: 'n',
  reset: 'r'
};

```

---
### 📄 File: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

```

---
### 📄 File: إصلاح_واستكمال_التشغيل.bat
```bat
@echo off
setlocal
chcp 65001 > nul
echo ==========================================
echo      Trade Manager - System Fixer
echo      أداة إصلاح مشاكل التشغيل
echo ==========================================
echo.

:: --- SETUP PORTABLE NODE (From Run Project script) ---
set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [1/3] Stopping stuck processes...
echo [1/3] إغلاق العمليات المعلقة...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM adb.exe /T 2>nul

echo.
echo [2/3] Cleaning Cache (Vite)...
echo [2/3] تنظيف الملفات المؤقتة...
cd /d "%~dp0"
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
)

if exist "node_modules\.vite" (
    echo.
    echo [ERROR] Could not delete hidden files. 
    echo [ERROR] فشل حذف الملفات العالقة.
    echo.
    echo SOLUTION: Restart your computer and try again.
    echo الحل: أعد تشغيل الجهاز وحاول مرة أخرى.
    pause
    exit /b
)

echo.
echo [3/3] Fix Complete! Starting App...
echo [3/3] تم الإصلاح! جاري التشغيل...
echo.

:: Run the app directly
call "%NPM_CMD%" run dev

pause

```

---
### 📄 File: تشغيل_المشروع.bat
```bat
@echo off
setlocal

echo ==========================================
echo    TRADE MANAGER - PORTABLE LAUNCHER
echo ==========================================
echo.

set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [DEBUG] Checking Node paths...
if not exist "%NODE_EXE%" (
    echo [ERROR] Node.exe not found at: %NODE_EXE%
    pause
    exit /b
)
if not exist "%NPM_CMD%" (
    echo [ERROR] NPM not found at: %NPM_CMD%
    pause
    exit /b
)

echo [OK] Node found.
"%NODE_EXE%" -v
echo.

echo [DEBUG] Setting PATH...
set "PATH=%NODE_DIR%;%PATH%"

echo [DEBUG] Navigate to project folder...
cd /d "%~dp0"
if %errorlevel% NEQ 0 (
    echo [ERROR] Could not find project folder!
    pause
    exit /b
)

echo [OK] Inside Project Folder: %CD%
echo.

if not exist "node_modules" (
    echo [ACTION] Installing dependencies...
    echo (This usually takes 1-2 minutes. Please wait.)
    call "%NPM_CMD%" install
    if %errorlevel% NEQ 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b
    )
) else (
    echo [INFO] node_modules exists. Skipping install.
)

echo.
echo ==========================================
echo      STARTING APPLICATION...
echo ==========================================
echo [INFO] Your browser will open shortly.
echo [INFO] Keep this black window OPEN.
echo.

call "%NPM_CMD%" run dev

echo.
echo [WARN] App stopped.
pause

```
