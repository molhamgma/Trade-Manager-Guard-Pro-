
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
