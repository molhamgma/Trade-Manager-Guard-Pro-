
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SettingsPanel = lazy(() => import('./components/SettingsPanel').then(m => ({ default: m.SettingsPanel })));
const TradeHistory = lazy(() => import('./components/TradeHistory').then(m => ({ default: m.TradeHistory })));
const PerformanceChart = lazy(() => import('./components/PerformanceChart').then(m => ({ default: m.PerformanceChart })));
const ArchiveChart = lazy(() => import('./components/ArchiveChart').then(m => ({ default: m.ArchiveChart })));
const SessionManager = lazy(() => import('./components/SessionManager').then(m => ({ default: m.SessionManager })));
const MiniMode = lazy(() => import('./components/MiniMode').then(m => ({ default: m.MiniMode })));
const Auth = lazy(() => import('./components/Auth').then(m => ({ default: m.Auth })));
const CompactAssetSelector = lazy(() => import('./components/CompactAssetSelector').then(m => ({ default: m.CompactAssetSelector })));
const LanguageStoreModal = lazy(() => import('./components/LanguageStoreModal').then(m => ({ default: m.LanguageStoreModal })));
const AboutModal = lazy(() => import('./components/AboutModal').then(m => ({ default: m.AboutModal })));
const TutorialModal = lazy(() => import('./components/TutorialModal').then(m => ({ default: m.TutorialModal })));
const WelcomeModal = lazy(() => import('./components/WelcomeModal').then(m => ({ default: m.WelcomeModal })));
const StrategyModal = lazy(() => import('./components/StrategyModal').then(m => ({ default: m.StrategyModal })));
const OnboardingTour = lazy(() => import('./components/OnboardingTour').then(m => ({ default: m.OnboardingTour })));
const ProfileModal = lazy(() => import('./components/ProfileModal').then(m => ({ default: m.ProfileModal })));
const HotkeysModal = lazy(() => import('./components/HotkeysModal').then(m => ({ default: m.HotkeysModal })));
const SessionReportModal = lazy(() => import('./components/SessionReportModal').then(m => ({ default: m.SessionReportModal })));
const ConfirmationModal = lazy(() => import('./components/ConfirmationModal').then(m => ({ default: m.ConfirmationModal })));
const DisclaimerModal = lazy(() => import('./components/DisclaimerModal').then(m => ({ default: m.DisclaimerModal })));
const SubscriptionWarningModal = lazy(() => import('./components/SubscriptionWarningModal').then(m => ({ default: m.SubscriptionWarningModal })));
import { supabase } from './supabaseClient';
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
    Info,
    CheckCircle2,
    Clock,
    ShieldAlert,
    Bell
} from 'lucide-react';

// --- Shared Components ---

// ERROR BOUNDARY COMPONENT
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    public state: { hasError: boolean, error: Error | null };

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: '#ff5555', padding: '40px', background: '#1a1a1a', height: '100vh', fontFamily: 'sans-serif' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Something went wrong</h1>
                    <div style={{ background: '#333', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
                        <pre style={{ color: '#ffaaaa' }}>{this.state.error?.toString()}</pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Reload App
                    </button>
                </div>
            );
        }
        return (this as any).props.children;
    }
}

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

const StatCard: React.FC<StatCardProps & { enableCopy?: boolean }> = ({ label, value, icon: Icon, colorClass, subValue, onEdit, isEditable, onMax, enableCopy }) => {
    const [showCopied, setShowCopied] = useState(false);

    const handleCopy = () => {
        if (!enableCopy) return;
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        const textToCopy = isNaN(numValue) ? value.toString() : numValue.toFixed(2);

        navigator.clipboard.writeText(textToCopy);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 300);
    };

    return (
        <div
            className={`bg-slate-800 dark:bg-slate-800 bg-white p-4 rounded-xl shadow border border-slate-700 dark:border-slate-700 border-gray-200 flex flex-col justify-between relative overflow-hidden group h-full ${enableCopy ? 'cursor-pointer hover:bg-slate-700/50 transition-colors' : ''}`}
            onClick={handleCopy}
            title={enableCopy ? "Click to Copy" : undefined}
        >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition"></div>

            {showCopied && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <span className="text-green-400 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Copied!
                    </span>
                </div>
            )}

            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-slate-400 dark:text-slate-500 text-gray-600 font-medium text-sm">{label}</span>
                <div className="flex items-center gap-2">
                    {enableCopy && <span className="opacity-0 group-hover:opacity-100 transition text-[10px] text-slate-500 uppercase font-bold">Copy</span>}
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                </div>
            </div>
            <div className="relative z-10">
                <div className="flex items-baseline gap-2">
                    {isEditable && onEdit ? (
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => onEdit(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-2xl font-bold bg-transparent border-b border-dashed border-slate-600 w-full outline-none focus:border-blue-500 font-mono ${colorClass}`}
                        />
                    ) : (
                        <div className={`text-2xl font-bold font-mono ${colorClass.includes('text-white') ? 'text-white dark:text-white text-black' : 'text-white dark:text-white text-black'}`}>{value}</div>
                    )}

                    {onMax && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onMax(); }}
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
};

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
    onOpenAdmin: () => void;
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
    onToggleTheme,
    onOpenAdmin
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

                {(user.role === 'admin' || user.role === 'Admin') && (
                    <button onClick={onOpenAdmin} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition font-bold mt-2 border border-blue-600/30">
                        <ShieldAlert className="w-4 h-4" /> Admin Panel
                    </button>
                )}

                <div className="h-px bg-slate-700 my-1 mx-2"></div>

                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-bold">
                    <LogOut className="w-4 h-4" /> {t.signOut}
                </button>
            </div>
        </div>
    );
};

const AppContent = () => {
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
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    const [isLocked, setIsLocked] = useState(false);
    const [showExpiryWarning, setShowExpiryWarning] = useState(false);
    const [usersDB, setUsersDB] = useState<User[]>([]);
    const [showStrategyGuide, setShowStrategyGuide] = useState(true);

    useEffect(() => {
        const isAccepted = localStorage.getItem('tg_disclaimer_accepted');
        if (isAccepted) setDisclaimerAccepted(true);

        const fetchGlobal = async () => {
            const { data } = await supabase
                .from('global_settings')
                .select('value')
                .eq('key', 'show_strategy_guide')
                .single();
            if (data) setShowStrategyGuide(data.value === true);
        };
        fetchGlobal();

        // Subscribe to global settings changes
        const channel = supabase
            .channel('global_settings_changes')
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'global_settings', filter: 'key=eq.show_strategy_guide' },
                (payload: any) => {
                    setShowStrategyGuide(payload.new.value === true);
                }
            )
            .subscribe();

        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch full profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    const mappedUser: User = {
                        id: profile.id,
                        email: session.user.email || '',
                        name: profile.full_name || profile.username || 'User',
                        role: profile.role || 'user',
                        avatar: profile.avatar_url,
                        status: profile.status || 'active',
                        isTrial: profile.is_trial ?? true,
                        subscriptionEnd: profile.subscription_end || (Date.now() + (7 * 24 * 60 * 60 * 1000)),
                        phone: profile.phone,
                        isPaid: profile.is_paid ?? false
                    };
                    setUser(mappedUser);

                    // Check Expiry
                    const daysLeft = Math.ceil((mappedUser.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24));
                    if (daysLeft <= 3) setShowExpiryWarning(true);
                }
            }
        };
        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && !user) {
                // optional: re-fetch profile
            }
        });

        return () => {
            subscription.unsubscribe();
            channel.unsubscribe();
        };
    }, []);

    // Fetch users from Supabase if Admin
    const fetchUsers = async () => {
        if (!user || (user.role !== 'admin' && user.role !== 'Admin')) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*');

            if (error) throw error;
            if (data) {
                const mappedUsers: User[] = data.map(p => ({
                    id: p.id,
                    email: p.email || '',
                    name: p.full_name || p.name || 'User',
                    role: (p.role as any) || 'user',
                    avatar: p.avatar_url,
                    status: (p.status as any) || 'active',
                    isTrial: p.is_trial ?? true,
                    subscriptionEnd: p.subscription_end || Date.now(),
                    phone: p.phone,
                    isPaid: p.is_paid ?? false
                }));
                setUsersDB(mappedUsers);
            }
        } catch (err) {
            console.error("Fetch Users Error:", err);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'Admin') {
            fetchUsers();
        }
    }, [user, isAdminOpen]); // Reload when admin panel opens

    const handleAcceptDisclaimer = () => {
        setDisclaimerAccepted(true);
        localStorage.setItem('tg_disclaimer_accepted', 'true');
    };

    // Subscription Check
    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'Admin') {
            const check = () => {
                if (Date.now() > user.subscriptionEnd || user.status === 'blocked' || user.isPaid === false) {
                    setIsLocked(true);
                } else {
                    setIsLocked(false);
                }
            };
            check();
            const interval = setInterval(check, 60000); // Check every minute
            return () => clearInterval(interval);
        } else {
            setIsLocked(false);
        }
    }, [user]);

    // Check for Low Subscription Time (Warning on generic entry)
    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'Admin' && !isLocked) {
            const timeLeft = user.subscriptionEnd - Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            // If less than 1 day and not already shown this session (we'll just use simple state for now)
            if (timeLeft > 0 && timeLeft < oneDay) {
                setShowExpiryWarning(true);
            }
        }
    }, [user, isLocked]);

    // Admin Update User (Supabase)
    const handleUpdateUser = async (userId: string, data: Partial<User>) => {
        // Optimistic UI Update
        const updatedDB = usersDB.map(u => u.id === userId ? { ...u, ...data } : u);
        setUsersDB(updatedDB);

        try {
            // Map App User fields to Supabase DB columns
            const dbUpdates: any = {};
            if (data.name) {
                dbUpdates.full_name = data.name;
                dbUpdates.name = data.name; // Redundancy for different schema versions
            }
            if (data.role) dbUpdates.role = data.role;
            if (data.status) dbUpdates.status = data.status;
            if (data.subscriptionEnd) dbUpdates.subscription_end = data.subscriptionEnd;
            if (data.isPaid !== undefined) dbUpdates.is_paid = data.isPaid;
            if (data.isTrial !== undefined) dbUpdates.is_trial = data.isTrial;

            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', userId);

            if (error) {
                // Revert optimistic update
                const revertDB = usersDB.map(u => u.id === userId ? { ...u } : u); // simplified revert
                setUsersDB(revertDB);
                throw error;
            }

            console.log("User updated in Supabase successfully");

            // Re-fetch to ensure sync after a short delay
            setTimeout(fetchUsers, 500);
        } catch (err) {
            console.error("Error updating user:", err);
            // Revert on error (optional, but good practice)
        }

        // If updating self
        if (user && user.id === userId) {
            setUser({ ...user, ...data });
        }
    };

    const handleLogin = (loggedInUser: User) => {
        // Just set the user. Supabase handles the source of truth now.
        setUser(loggedInUser);

        // If they are admin, fetch the full list immediately
        if (loggedInUser.role === 'admin' || loggedInUser.role === 'Admin') {
            // fetchUsers called via useEffect dependence on `user`
        }
    };


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
        if (savedSettings) {
            setSettings({ ...INITIAL_SETTINGS, ...JSON.parse(savedSettings) });
        }

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

                        <div className="relative">
                            <button
                                onClick={() => {
                                    const daysLeft = user ? Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
                                    if (daysLeft <= 3) setShowExpiryWarning(true);
                                }}
                                className="relative p-2 rounded-lg hover:bg-slate-700/50 transition mr-2"
                            >
                                <Bell className="w-6 h-6 text-slate-400 hover:text-white" />
                                {user && Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24)) <= 3 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800 animate-pulse"></span>
                                )}
                            </button>
                        </div>

                        {showStrategyGuide && (
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
                        )}

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
                                    onContact={() => window.open('https://t.me/+pmsIeiPj3KoyMTg0', '_blank')}
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
                                    onOpenAdmin={() => setIsAdminOpen(true)} // Added Admin button
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
                            enableCopy={true}
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

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                onSave={async (data, newPassword) => {
                    if (!user) return;

                    try {
                        const updates: any = {};
                        if (data.name) updates.full_name = data.name;
                        if (data.avatar) updates.avatar_url = data.avatar;
                        if (data.phone) updates.phone = data.phone;

                        // 1. Update Profile DB
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .update(updates)
                            .eq('id', user.id);

                        if (profileError) throw profileError;

                        // 2. Update Password if provided
                        if (newPassword) {
                            const { error: authError } = await supabase.auth.updateUser({
                                password: newPassword
                            });
                            if (authError) throw authError;
                        }

                        // 3. Update Local State
                        setUser({ ...user, ...data });

                    } catch (err) {
                        console.error("Failed to update profile", err);
                        throw err; // Propagate to modal to show error
                    }
                }}
                lang={lang}
            />
            <HotkeysModal isOpen={isHotkeysOpen} onClose={() => setIsHotkeysOpen(false)} shortcuts={shortcuts} onSave={setShortcuts} lang={lang} />
            <StrategyModal isOpen={showStrategyModal} onClose={() => setShowStrategyModal(false)} lang={lang} t={t} />

            {isAdminOpen && (
                <AdminDashboard
                    users={usersDB}
                    onClose={() => setIsAdminOpen(false)}
                    onUpdateUser={handleUpdateUser}
                />
            )}

            <SubscriptionWarningModal
                isOpen={showExpiryWarning}
                onClose={() => setShowExpiryWarning(false)}
                daysRemaining={user ? Math.max(0, Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24))) : 0}
                onContact={() => window.open('https://t.me/+pmsIeiPj3KoyMTg0', '_blank')}
            />
        </div>
    );
};

export const App = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}>
                <AppContent />
            </Suspense>
        </ErrorBoundary>
    );
};
