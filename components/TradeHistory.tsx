
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
