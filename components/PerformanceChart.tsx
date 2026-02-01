
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
