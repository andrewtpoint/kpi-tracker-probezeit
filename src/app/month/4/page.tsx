'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { sumWeekly, formatEuro, calcStatus, statusConfig } from '@/lib/utils-kpi';
import Link from 'next/link';
import { ArrowLeft, Calendar, Plus, Trash2 } from 'lucide-react';
import type { Deal } from '@/lib/store';

const WEEKS = ['w1', 'w2', 'w3', 'w4'] as const;

export default function Month4Page() {
  const { months, settings, updateMonth } = useStore();
  const data = months['4'] || {};
  const [newDeal, setNewDeal] = useState({ kunde: '', wert: 0, datumVersendet: '', status: 'Offen' as Deal['status'] });

  const update = (field: string, week: string, value: number) => {
    const current = (data as Record<string, Record<string, number>>)[field] || {};
    updateMonth('4', { [field]: { ...current, [week]: value } } as Record<string, Record<string, number>>);
  };

  const vereinbart = data.termineVereinbart || { w1: 0, w2: 0, w3: 0, w4: 0 };
  const gehalten = data.termineGehalten || { w1: 0, w2: 0, w3: 0, w4: 0 };
  const angebote = data.angeboteVersendet || { w1: 0, w2: 0, w3: 0, w4: 0 };
  const pipeline = data.pipelineWert || { w1: 0, w2: 0, w3: 0, w4: 0 };
  const deals = data.deals || [];

  const totalVereinbart = sumWeekly(vereinbart);
  const totalGehalten = sumWeekly(gehalten);
  const totalAngebote = sumWeekly(angebote);
  const totalPipeline = sumWeekly(pipeline);
  const umsatz = data.umsatz || 0;
  const showupRate = totalVereinbart > 0 ? (totalGehalten / totalVereinbart) * 100 : 0;

  const umsatzStatus = calcStatus(umsatz, settings.m4_umsatz_min, settings.m4_umsatz_min * 1.5);

  const addDeal = () => {
    if (!newDeal.kunde) return;
    const deal: Deal = { ...newDeal, id: Date.now().toString() };
    updateMonth('4', { deals: [...deals, deal] });
    setNewDeal({ kunde: '', wert: 0, datumVersendet: '', status: 'Offen' });
  };

  const removeDeal = (id: string) => updateMonth('4', { deals: deals.filter(d => d.id !== id) });
  const updateDealStatus = (id: string, status: Deal['status']) => updateMonth('4', { deals: deals.map(d => d.id === id ? { ...d, status } : d) });

  const kpis = [
    { field: 'termineVereinbart', label: 'Termine vereinbart', data: vereinbart },
    { field: 'termineGehalten', label: 'Termine gehalten', data: gehalten },
    { field: 'angeboteVersendet', label: 'Angebote versendet', data: angebote },
    { field: 'pipelineWert', label: 'Pipeline Wert (€)', data: pipeline },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Monat 4 – Skalierung</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Termine vereinbart', value: totalVereinbart }, { label: 'Show-up Rate', value: `${showupRate.toFixed(0)}%` }, { label: 'Angebote', value: totalAngebote }, { label: 'Pipeline', value: formatEuro(totalPipeline) }].map(({ label, value }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Umsatz Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Umsatz M4</h3>
            <span className={`text-sm font-medium ${statusConfig[umsatzStatus].color}`}>{statusConfig[umsatzStatus].label}</span>
          </div>
          <input
            type="number"
            value={umsatz || ''}
            onChange={e => updateMonth('4', { umsatz: Number(e.target.value) })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:outline-none focus:border-cyan-500"
            placeholder="0"
          />
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (umsatz / settings.m4_umsatz_min) * 100)}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">Ziel: {formatEuro(settings.m4_umsatz_min)}</p>
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
                        <input type="number" min="0"
                          value={(kpiData as Record<string, number>)[w] || ''}
                          onChange={e => update(field, w, Number(e.target.value))}
                          className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center text-sm focus:outline-none focus:border-cyan-500" />
                      </td>
                    ))}
                    <td className="py-3 px-2 text-center font-bold text-cyan-400">{field === 'pipelineWert' ? formatEuro(sumWeekly(kpiData)) : sumWeekly(kpiData)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deals */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Angebots-Tracking</h2>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <input value={newDeal.kunde} onChange={e => setNewDeal({...newDeal, kunde: e.target.value})} placeholder="Kunde" className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input type="number" value={newDeal.wert || ''} onChange={e => setNewDeal({...newDeal, wert: Number(e.target.value)})} placeholder="Wert (€)" className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input type="date" value={newDeal.datumVersendet} onChange={e => setNewDeal({...newDeal, datumVersendet: e.target.value})} className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <button onClick={addDeal} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1"><Plus className="w-4 h-4" />Hinzufügen</button>
          </div>
          {deals.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="text-slate-400"><th className="text-left py-2">Kunde</th><th className="text-right py-2">Wert</th><th className="text-center py-2">Datum</th><th className="text-center py-2">Status</th><th></th></tr></thead>
              <tbody className="divide-y divide-slate-700">
                {deals.map(deal => (
                  <tr key={deal.id}>
                    <td className="py-2 text-white">{deal.kunde}</td>
                    <td className="py-2 text-right text-cyan-400 font-semibold">{formatEuro(deal.wert)}</td>
                    <td className="py-2 text-center text-slate-400">{deal.datumVersendet}</td>
                    <td className="py-2 text-center">
                      <select value={deal.status} onChange={e => updateDealStatus(deal.id, e.target.value as Deal['status'])} className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs">
                        {['Offen','Verhandlung','Gewonnen','Verloren'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-2"><button onClick={() => removeDeal(deal.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
