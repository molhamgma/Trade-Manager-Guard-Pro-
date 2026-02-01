
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
        worksheet.properties.outlineProperties = { summaryBelow: false, summaryRight: false };

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
