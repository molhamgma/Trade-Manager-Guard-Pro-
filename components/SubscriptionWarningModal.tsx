import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    daysRemaining: number;
    onContact: () => void;
}

export const SubscriptionWarningModal: React.FC<Props> = ({ isOpen, onClose, daysRemaining, onContact }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-red-500/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Subscription Expiring Soon!</h2>
                    <p className="text-slate-400 mb-6">
                        Your subscription will expire in <span className="text-red-400 font-bold text-xl">{daysRemaining} days</span>.
                        Please renew your subscription to avoid losing access to Trade Manager Guard Pro.
                    </p>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-full mb-6 flex items-center justify-between">
                        <span className="text-slate-400 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> Days Left
                        </span>
                        <span className="text-red-500 font-bold font-mono text-xl">{daysRemaining}</span>
                    </div>

                    <button
                        onClick={onContact}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-900/20"
                    >
                        Contact Support to Renew
                    </button>
                </div>
            </div>
        </div>
    );
};
