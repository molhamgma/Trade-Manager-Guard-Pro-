import React, { useState } from 'react';
import { User } from '../types';
import { X, Search, Calendar, DollarSign, UserCheck, UserX, Clock, ShieldAlert, Save, Activity, Layout, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Props {
    users: User[];
    onUpdateUser: (userId: string, data: Partial<User>) => void;
    onClose: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ users, onUpdateUser, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<User>>>({});
    const [globalShowStrategy, setGlobalShowStrategy] = useState<boolean>(true);
    const [isSavingGlobal, setIsSavingGlobal] = useState(false);
    const [isSavingUser, setIsSavingUser] = useState(false);

    // Fetch Global Settings
    React.useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('global_settings')
                .select('value')
                .eq('key', 'show_strategy_guide')
                .single();
            if (data) setGlobalShowStrategy(data.value === true);
        };
        fetchSettings();
    }, []);

    const toggleGlobalStrategy = async () => {
        setIsSavingGlobal(true);
        const newValue = !globalShowStrategy;
        try {
            await supabase
                .from('global_settings')
                .update({ value: newValue })
                .eq('key', 'show_strategy_guide');
            setGlobalShowStrategy(newValue);
        } finally {
            setIsSavingGlobal(false);
        }
    };

    // Pricing State (Local only for now)
    const [prices, setPrices] = useState({
        day: 5,
        month: 50,
        year: 400
    });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLocalUpdate = (userId: string, data: Partial<User>) => {
        setPendingChanges(prev => ({
            ...prev,
            [userId]: { ...(prev[userId] || {}), ...data }
        }));
        if (selectedUser?.id === userId) {
            setSelectedUser({ ...selectedUser, ...data });
        }
    };

    const handleSaveUser = async () => {
        if (!selectedUser || !pendingChanges[selectedUser.id]) return;
        setIsSavingUser(true);
        try {
            await onUpdateUser(selectedUser.id, pendingChanges[selectedUser.id]);
            // Clear pending for this user
            const newPending = { ...pendingChanges };
            delete newPending[selectedUser.id];
            setPendingChanges(newPending);
        } finally {
            setIsSavingUser(false);
        }
    };

    const handleExtendSubscription = (days: number) => {
        if (!selectedUser) return;
        const currentEnd = selectedUser.subscriptionEnd > Date.now() ? selectedUser.subscriptionEnd : Date.now();
        const newEnd = currentEnd + (days * 24 * 60 * 60 * 1000);
        handleLocalUpdate(selectedUser.id, { subscriptionEnd: newEnd, status: 'active' });
    };

    const formatDate = (ts: number) => new Date(ts).toLocaleDateString();
    const getDaysRemaining = (ts: number) => Math.ceil((ts - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
            <div className="bg-slate-800 w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* Sidebar - User List */}
                    <div className="w-1/3 border-r border-slate-700 flex flex-col bg-slate-800/50">
                        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Global Controls</h4>
                            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700 mb-4 group cursor-pointer hover:border-indigo-500/50 transition-all" onClick={toggleGlobalStrategy}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${globalShowStrategy ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Strategy Guide</div>
                                        <div className="text-[10px] text-slate-500">Visible to everyone</div>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${globalShowStrategy ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${globalShowStrategy ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search subscribers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filteredUsers.map(user => {
                                const isExpired = user.subscriptionEnd < Date.now();
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`w-full p-4 flex items-center gap-3 border-b border-slate-700/50 hover:bg-slate-700 transition text-left
                      ${selectedUser?.id === user.id ? 'bg-slate-700 border-l-4 border-l-blue-500' : ''}
                    `}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                      ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}
                    `}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-white truncate">{user.name}</div>
                                                {user.isPaid && <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-bold uppercase">Paid</span>}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate">{user.email}</div>
                                        </div>
                                        {isExpired && <Clock className="w-4 h-4 text-red-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content - User Details */}
                    <div className="flex-1 bg-slate-900/30 p-6 overflow-y-auto">
                        {selectedUser ? (
                            <div className="space-y-8 animate-in fade-in duration-300">

                                {/* User Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <span>{selectedUser.email}</span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                            <span className={selectedUser.status === 'active' ? 'text-green-400' : 'text-red-400 uppercase font-bold text-xs'}>
                                                {selectedUser.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-400 mb-1">Subscription Expires</div>
                                        <div className={`text-xl font-mono font-bold ${selectedUser.subscriptionEnd < Date.now() ? 'text-red-500' : 'text-green-400'}`}>
                                            {formatDate(selectedUser.subscriptionEnd)}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {getDaysRemaining(selectedUser.subscriptionEnd)} days remaining
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
                                            <Calendar className="w-4 h-4 text-blue-400" /> Extend Subscription
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button onClick={() => handleExtendSubscription(1)} className="px-3 py-2 bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg text-sm transition">
                                                +1 Day
                                            </button>
                                            <button onClick={() => handleExtendSubscription(30)} className="px-3 py-2 bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg text-sm transition">
                                                +1 Month
                                            </button>
                                            <button onClick={() => handleExtendSubscription(365)} className="px-3 py-2 bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg text-sm transition">
                                                +1 Year
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
                                            <DollarSign className="w-4 h-4 text-green-400" /> Payment Status
                                        </h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleLocalUpdate(selectedUser.id, { isPaid: true, status: 'active' })}
                                                className={`flex-1 py-2 rounded-lg transition font-medium border ${selectedUser.isPaid ? 'bg-green-600/20 text-green-400 border-green-600/50 hover:bg-green-600 hover:text-white' : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white'}`}
                                            >
                                                Mark Paid
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to REVOKE this user's access? This will block their account and mark as unpaid.")) {
                                                        handleLocalUpdate(selectedUser.id, { isPaid: false, status: 'blocked' });
                                                    }
                                                }}
                                                className={`flex-1 py-2 rounded-lg transition font-medium border ${(!selectedUser.isPaid && selectedUser.status === 'blocked') ? 'bg-red-600/20 text-red-400 border-red-600/50 hover:bg-red-600 hover:text-white' : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white'}`}
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Security & Roles */}
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
                                        <ShieldAlert className="w-4 h-4 text-orange-400" /> Administrative Actions
                                    </h4>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                const isAdmin = selectedUser.role?.toLowerCase() === 'admin';
                                                handleLocalUpdate(selectedUser.id, { role: isAdmin ? 'user' : 'admin' });
                                            }}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${selectedUser.role?.toLowerCase() === 'admin' ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
                                        >
                                            <ShieldAlert className="w-4 h-4" />
                                            {selectedUser.role?.toLowerCase() === 'admin' ? 'Remove Admin Privileges' : 'Make Administrator'}
                                        </button>
                                    </div>
                                </div>

                                {/* Date Picker Override */}
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-400" />
                                        Set Expiry Date
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs text-slate-400 mb-1">Select Valid Until Date</label>
                                            <input
                                                type="date"
                                                value={new Date(selectedUser.subscriptionEnd).toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    if (!e.target.value) return;
                                                    const date = new Date(e.target.value);
                                                    // Set to end of that day (23:59:59)
                                                    date.setHours(23, 59, 59, 999);
                                                    handleLocalUpdate(selectedUser.id, { subscriptionEnd: date.getTime(), status: 'active' });
                                                }}
                                                className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white w-full focus:ring-2 focus:ring-purple-500 outline-none"
                                            />
                                        </div>
                                        <div className="text-sm text-slate-400 pb-2">
                                            Valid for: <span className="text-purple-400 font-bold">{getDaysRemaining(selectedUser.subscriptionEnd)}</span> days from today
                                        </div>
                                    </div>
                                </div>

                                {/* Save Changes Buffer */}
                                {pendingChanges[selectedUser.id] && (
                                    <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                                <ShieldAlert className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Unsaved Changes</div>
                                                <div className="text-xs text-blue-400">You have modified this user's profile.</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSaveUser}
                                            disabled={isSavingUser}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
                                        >
                                            {isSavingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isSavingUser ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <UserCheck className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select a user to manage details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
