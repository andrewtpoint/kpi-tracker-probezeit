'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { sumWeekly, formatEuro, calcStatus, statusConfig } from '@/lib/utils-kpi';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Deal } from '@/lib/store';

export default function Month5Page() {
  const { months, settings, updateMonth } = useStore();
  const data = months['5'] || {};
  const m4data = months['4'] || {};
  const [newDeal, setNewDeal] = useState({ kunde: '', wert: 0, wahrscheinlichkeit: 50, erwarteterAbschluss: '', status: 'Offen' as Deal['status'] });

  const deals = data.deals || [];
  const m4Umsatz = m4data.umsatz || 0;
  const m5Umsatz = data.umsatz || 0;

  const totalPipelineGewichtet = deals.reduce((sum, d) => sum + d.wert * ((d.wahrscheinlichkeit || 50) / 100), 0);
  const totalPipelineRaw = deals.reduce((sum, d) => sum + d.wert, 0);
  const milestone5 = totalPipelineRaw >= settings.m5_pipeline_min;

  const pipelineStatus = calcStatus(totalPipelineRaw, settings.m5_pipeline_min, settings.m5_pipeline_min * 1.5);
  const umsatzStatus = calcStatus(m5Umsatz, settings.m5_umsatz_min, settings.m5_umsatz_min * 1.5);

  const addDeal = () => {
    if (!newDeal.kunde) return;
    const deal: Deal = { ...newDeal, id: Date.now().toString() };
    updateMonth('5', { deals: [...deals, deal] });
    setNewDeal({ kunde: '', wert: 0, wahrscheinlichkeit: 50, erwarteterAbschluss: '', status: 'Offen' });
  };

  const removeDeal = (id: string) => updateMonth('5', { deals: deals.filter(d => d.id !== id) });

  const pipelineColor = totalPipelineRaw >= settings.m5_pipeline_min * 1.5 ? 'text-green-400' :
    totalPipelineRaw >= settings.m5_pipeline_min ? 'text-blue-400' :
    totalPipelineRaw >= settings.m5_pipeline_min * 0.5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Monat 5 – Pipeline-Aufbau</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Meilenstein M5 */}
        <div className={`p-5 rounded-xl border ${milestone5 ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
          <div className="flex items-center gap-3">
            {milestone5 ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-slate-500" />}
            <div>
              <p className="font-semibold text-white text-lg">Meilenstein M5: Pipeline {formatEuro(settings.m5_pipeline_min)}</p>
              <p className={`text-2xl font-bold mt-1 ${pipelineColor}`}>{formatEuro(totalPipelineRaw)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pipeline gesamt', value: formatEuro(totalPipelineRaw), color: pipelineColor },
            { label: 'Pipeline gewichtet', value: formatEuro(totalPipelineGewichtet), color: 'text-white' },
            { label: 'M4 Umsatz (readonly)', value: formatEuro(m4Umsatz), color: 'text-slate-400' },
            { label: 'M5 Umsatz', value: formatEuro(m5Umsatz), color: statusConfig[umsatzStatus].color },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* M5 Umsatz Eingabe */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">Umsatz M5</h3>
          <input
            type="number"
            value={m5Umsatz || ''}
            onChange={e => updateMonth('5', { umsatz: Number(e.target.value) })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:outline-none focus:border-cyan-500"
            placeholder="0"
          />
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (m5Umsatz / settings.m5_umsatz_min) * 100)}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">Ziel: {formatEuro(settings.m5_umsatz_min)}</p>
        </div>

        {/* Pipeline Deals */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Pipeline Deals</h2>
          <div className="grid grid-cols-5 gap-2 mb-4">
            <input value={newDeal.kunde} onChange={e => setNewDeal({...newDeal, kunde: e.target.value})} placeholder="Kunde" className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input type="number" value={newDeal.wert || ''} onChange={e => setNewDeal({...newDeal, wert: Number(e.target.value)})} placeholder="Wert (€)" className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input type="number" min="0" max="100" value={newDeal.wahrscheinlichkeit} onChange={e => setNewDeal({...newDeal, wahrscheinlichkeit: Number(e.target.value)})} placeholder="Wahrsch. %" className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input type="date" value={newDeal.erwarteterAbschluss} onChange={e => setNewDeal({...newDeal, erwarteterAbschluss: e.target.value})} className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <button onClick={addDeal} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1"><Plus className="w-4 h-4" />Hinzufügen</button>
          </div>
          {deals.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400">
                  <th className="text-left py-2">Kunde</th>
                  <th className="text-right py-2">Wert</th>
                  <th className="text-center py-2">Wahrsch.</th>
                  <th className="text-right py-2">Gewichtet</th>
                  <th className="text-center py-2">Abschluss</th>
                  <th></th>
                </tr></thead>
                <tbody className="divide-y divide-slate-700">
                  {deals.map(deal => (
                    <tr key={deal.id}>
                      <td className="py-2 text-white">{deal.kunde}</td>
                      <td className="py-2 text-right text-white">{formatEuro(deal.wert)}</td>
                      <td className="py-2 text-center text-slate-300">{deal.wahrscheinlichkeit || 50}%</td>
                      <td className="py-2 text-right text-cyan-400 font-semibold">{formatEuro(deal.wert * ((deal.wahrscheinlichkeit || 50) / 100))}</td>
                      <td className="py-2 text-center text-slate-400">{deal.erwarteterAbschluss || '-'}</td>
                      <td className="py-2"><button onClick={() => removeDeal(deal.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-600">
                    <td colSpan={3} className="py-2 text-slate-400 font-semibold">Gesamt</td>
                    <td className="py-2 text-right text-cyan-400 font-bold text-lg">{formatEuro(totalPipelineGewichtet)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
