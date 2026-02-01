
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
