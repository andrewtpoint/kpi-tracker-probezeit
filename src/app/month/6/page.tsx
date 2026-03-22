'use client';
import { useStore } from '@/lib/store';
import { sumWeekly, formatEuro } from '@/lib/utils-kpi';
import Link from 'next/link';
import { ArrowLeft, Euro, CheckCircle, XCircle, Trophy } from 'lucide-react';

export default function Month6Page() {
  const { months, settings, updateMonth } = useStore();
  const data = months['6'] || {};
  const m4 = months['4'] || {};
  const m5 = months['5'] || {};
  const m4Umsatz = m4.umsatz || 0;
  const m5Umsatz = m5.umsatz || 0;
  const m6Umsatz = data.umsatz || 0;
  const gesamtUmsatz = m4Umsatz + m5Umsatz + m6Umsatz;
  const m4Pipeline = sumWeekly(m4.pipelineWert);
  const m5Pipeline = (m5.deals || []).reduce((s, d) => s + d.wert, 0);
  const m6Pipeline = sumWeekly(data.pipelineWert);
  const gesamtPipeline = m4Pipeline + m5Pipeline + m6Pipeline;
  const kriterium1 = gesamtUmsatz >= settings.m6_umsatz_min;
  const kriterium2 = gesamtPipeline >= settings.m6_pipeline_min;
  const bestanden = kriterium1 || kriterium2;
  const umsatzProgress = Math.min(100, (gesamtUmsatz / settings.m6_gesamtumsatz_ziel) * 100);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <Euro className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Monat 6 - Finale Bewertung</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className={`p-8 rounded-xl border text-center ${bestanden ? 'bg-green-900/30 border-green-600' : 'bg-red-900/20 border-red-800'}`}>
          {bestanden ? (
            <><Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" /><p className="text-4xl font-bold text-green-400">PROBEZEIT BESTANDEN</p></>
          ) : (
            <><XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" /><p className="text-4xl font-bold text-red-400">NICHT BESTANDEN</p></>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-6 rounded-xl border ${kriterium1 ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-3">
              {kriterium1 ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-slate-500" />}
              <h3 className="text-white font-semibold">Kriterium 1: Umsatz >= {formatEuro(settings.m6_umsatz_min)}</h3>
            </div>
            <p className={`text-3xl font-bold ${kriterium1 ? 'text-green-400' : 'text-white'}`}>{formatEuro(gesamtUmsatz)}</p>
          </div>
          <div className={`p-6 rounded-xl border ${kriterium2 ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-3">
              {kriterium2 ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-slate-500" />}
              <h3 className="text-white font-semibold">Kriterium 2: Pipeline >= {formatEuro(settings.m6_pipeline_min)}</h3>
            </div>
            <p className={`text-3xl font-bold ${kriterium2 ? 'text-green-400' : 'text-white'}`}>{formatEuro(gesamtPipeline)}</p>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">Umsatz M6 eingeben</h3>
          <input type="number" value={m6Umsatz || ''} onChange={e => updateMonth('6', { umsatz: Number(e.target.value) })} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:outline-none focus:border-cyan-500" placeholder="0" />
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">Pipeline M6</h3>
          <div className="grid grid-cols-4 gap-3">
            {(['w1','w2','w3','w4'] as const).map(w => (
              <div key={w}>
                <label className="block text-xs text-slate-400 mb-1">{w.toUpperCase()}</label>
                <input type="number" min="0"
                  value={(data.pipelineWert as Record<string, number> | undefined)?.[w] || ''}
                  onChange={e => { const c = data.pipelineWert || {w1:0,w2:0,w3:0,w4:0}; updateMonth('6', { pipelineWert: { ...c, [w]: Number(e.target.value) } }); }}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between mb-3">
            <h3 className="text-white font-semibold">Gesamt-Umsatz-Fortschritt</h3>
            <span className="text-slate-400">Ziel: {formatEuro(settings.m6_gesamtumsatz_ziel)}</span>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full" style={{ width: `${umsatzProgress}%` }} />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-cyan-400 font-semibold">{formatEuro(gesamtUmsatz)}</span>
            <span className="text-slate-400">{umsatzProgress.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
