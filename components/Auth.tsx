
import React, { useState } from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Lock, Mail, Github, Globe, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Props {
    onLogin: (user: User) => void;
    lang: Language;
    availableLanguages: { code: string, name: string }[];
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegister) {
                // Sign Up
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (authError) throw authError;

                // Profile is created by Trigger (see SQL), but we verify
                if (authData.user) {
                    // Wait a moment for trigger
                    await new Promise(r => setTimeout(r, 1000));
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (profile) {
                        // Map DB fields (snake_case) to User type (camelCase)
                        const mappedUser: User = {
                            id: profile.id,
                            email: authData.user.email || '',
                            name: profile.full_name || profile.username || 'User',
                            role: profile.role || 'user',
                            avatar: profile.avatar_url,
                            status: profile.status || 'active',
                            isTrial: profile.is_trial ?? true,
                            isPaid: profile.is_paid ?? false,
                            subscriptionEnd: profile.subscription_end || (Date.now() + (7 * 24 * 60 * 60 * 1000)), // Default 7 days
                            phone: profile.phone
                        };
                        onLogin(mappedUser);
                    } else {
                        // Fallback if trigger failed/delayed (shouldn't happen with correct SQL)
                        const fallbackUser: User = {
                            id: authData.user.id,
                            email: email,
                            name: email.split('@')[0],
                            role: 'user',
                            status: 'active',
                            isTrial: true,
                            isPaid: false,
                            subscriptionEnd: Date.now() + (7 * 24 * 60 * 60 * 1000)
                        };
                        onLogin(fallbackUser);
                    }
                }

            } else {
                // Sign In
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (authError) throw authError;

                if (authData.user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (profileError || !profile) {
                        // If no profile found (migration issue?), create a temp one locally or throw
                        console.error("Profile missing", profileError);
                        console.error("Profile missing", profileError);
                        setError(`Profile Error: ${profileError?.message || "Profile not found (RLS?)"}`);
                    } else {
                        const mappedUser: User = {
                            id: profile.id,
                            email: authData.user.email || '',
                            name: profile.full_name || profile.username || 'User',
                            role: profile.role || 'user',
                            avatar: profile.avatar_url,
                            status: profile.status || 'active',
                            isTrial: profile.is_trial ?? true,
                            isPaid: profile.is_paid ?? false,
                            subscriptionEnd: profile.subscription_end || Date.now(),
                            phone: profile.phone
                        };
                        onLogin(mappedUser);
                    }
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // OAuth will redirect, so no need to stop loading usually
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
                    <div className="flex items-center justify-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">CLOUD CONNECTED</span>
                    </div>
                    <p className="text-slate-400 mt-2">{isRegister ? t.registerTitle : t.loginTitle}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
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
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isRegister ? t.registerBtn : t.loginBtn}
                    </button>
                </form>



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
