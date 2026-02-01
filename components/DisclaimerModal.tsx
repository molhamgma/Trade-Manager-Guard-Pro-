import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    onAccept: () => void;
}

export const DisclaimerModal: React.FC<Props> = ({ onAccept }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4">
            <div className="bg-black border-2 border-red-600 rounded-lg max-w-2xl w-full p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-in fade-in zoom-in duration-300">

                <div className="flex justify-center mb-6">
                    <h1 className="text-6xl font-black text-red-600 tracking-tighter uppercase drop-shadow-lg">
                        Warning
                    </h1>
                </div>

                <div className="space-y-6 text-lg text-slate-200 leading-relaxed font-medium">
                    <p>
                        This content is intended for informational and educational purposes only. It does not constitute investment or trading advice.
                    </p>
                    <p>
                        Any decisions made based on this software are solely your responsibility. Trading financial instruments carries risk and may not be suitable for everyone.
                    </p>
                    <p className="text-slate-400 text-sm">
                        Always consult local laws — in some countries, certain brokers may be illegal or regulated as gambling platforms. I do not provide private services or initiate contact. Beware of fraud and impersonation.
                    </p>
                </div>

                <div className="mt-10">
                    <button
                        onClick={onAccept}
                        className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-12 rounded-full transition transform hover:scale-105 shadow-xl uppercase tracking-wider"
                    >
                        I Understand & Accept Risk
                    </button>
                </div>
            </div>
        </div>
    );
};
