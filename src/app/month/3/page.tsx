'use client';
import { useStore } from '@/lib/store';
import { sumWeekly, calcStatus, statusConfig, formatEuro } from '@/lib/utils-kpi';
import Link from 'next/link';
import { ArrowLeft, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

const WEEKS = ['w1', 'w2', 'w3', 'w4'] as const;

export default function Month3Page() {
  const { months, settings, updateMonth } = useStore();
  const data = months['3'] || {};

  const update = (field: string, week: string, value: number) => {
    const current = (data as Record<string, Record<string, number>>)[field] || {};
    updateMonth('3', { [field]: { ...current, [week]: value } } as Record<string, Record<string, number>>);
  };

  const calls = data.anrufversuche || { w1: 0, w2: 0, w3: 0, w4: 0 };
  const vereinbart = data.termineVereinbart || { w1: 0, w2: 0, w3: 0, w4: 0 };
  const gehalten = data.termineGehalten || { w1: 0, w2: 0, w3: 0, w4: 0 };

  const totalCalls = sumWeekly(calls);
  const callsProTag = totalCalls / 20;
  const totalVereinbart = sumWeekly(vereinbart);
  const totalGehalten = sumWeekly(gehalten);
  const quote = totalCalls > 0 ? (totalVereinbart / totalCalls) * 100 : 0;

  const milestone = totalVereinbart >= settings.m3_termineKumuliert_min && totalGehalten >= settings.m3_termineGehalten_min;
  const fruehwarnung = callsProTag < settings.m3_callsProTag_min && totalCalls > 0;

  const kpis = [
    { field: 'anrufversuche', label: 'Anrufversuche/Woche', data: calls },
    { field: 'termineVereinbart', label: 'Termine vereinbart/Woche', data: vereinbart },
    { field: 'termineGehalten', label: 'Termine gehalten/Woche', data: gehalten },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <Phone className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Monat 3 – Erste Akquise</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Frühwarnung */}
        {fruehwarnung && (
          <div className="p-4 bg-orange-900/30 border border-orange-700 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <p className="text-orange-300 font-medium">Frühwarnung: Ø {callsProTag.toFixed(1)} Calls/Tag – Ziel ist min. {settings.m3_callsProTag_min} Calls/Tag!</p>
          </div>
        )}

        {/* Meilenstein Status */}
        <div className={`p-5 rounded-xl border ${milestone ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
          <div className="flex items-center gap-3">
            {milestone ? <CheckCircle className="w-6 h-6 text-green-400" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-600" />}
            <div>
              <p className="font-semibold text-white">Meilenstein M3: {milestone ? 'ERREICHT' : 'Ausstehend'}</p>
              <p className="text-sm text-slate-400">{totalVereinbart}/{settings.m3_termineKumuliert_min} Termine vereinbart | {totalGehalten}/{settings.m3_termineGehalten_min} gehalten</p>
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Calls gesamt', value: totalCalls }, { label: 'Calls/Tag Ø', value: callsProTag.toFixed(1) }, { label: 'Termine vereinbart', value: totalVereinbart }, { label: 'Quote', value: `${quote.toFixed(1)}%` }].map(({ label, value }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Wocheneingabe */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Wocheneingabe</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm">
                  <th className="text-left py-2 pr-4">KPI</th>
                  {WEEKS.map(w => <th key={w} className="text-center py-2 px-2">{w.toUpperCase()}</th>)}
                  <th className="text-center py-2 px-2">Gesamt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {kpis.map(({ field, label, data: kpiData }) => (
                  <tr key={field}>
                    <td className="py-3 pr-4 text-slate-300 text-sm font-medium whitespace-nowrap">{label}</td>
                    {WEEKS.map(w => (
                      <td key={w} className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          value={(kpiData as Record<string, number>)[w] || ''}
                          onChange={e => update(field, w, Number(e.target.value))}
                          className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </td>
                    ))}
                    <td className="py-3 px-2 text-center font-bold text-cyan-400">{sumWeekly(kpiData)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kommentar */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3">Kommentar / Feedback</h2>
          <textarea
            value={data.kommentar || ''}
            onChange={e => updateMonth('3', { kommentar: e.target.value })}
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
            placeholder="Feedback, Beobachtungen, Maßnahmen..."
          />
        </div>
      </div>
    </div>
  );
}
