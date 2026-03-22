'use client';
import { useStore } from '@/lib/store';
import { formatEuro, sumWeekly, calcStatus, statusConfig, getDaysUntil, addMonths } from '@/lib/utils-kpi';
import Link from 'next/link';
import { TrendingUp, Phone, Calendar, Euro, AlertTriangle, CheckCircle, XCircle, Users, Settings, Clock } from 'lucide-react';

export default function Dashboard() {
  const { employee, months, settings } = useStore();
  const endDate = employee.startDate ? addMonths(employee.startDate, 6) : '';
  const daysLeft = endDate ? getDaysUntil(endDate) : null;

  const m3 = months['3'] || {};
  const m4 = months['4'] || {};
  const m5 = months['5'] || {};
  const m6 = months['6'] || {};

  const m3TermineGesamt = sumWeekly(m3.termineVereinbart);
  const m3TermineGehalten = sumWeekly(m3.termineGehalten);
  const m4Umsatz = m4.umsatz || 0;
  const m5Pipeline = sumWeekly(m5.pipelineWert);
  const m5Umsatz = m5.umsatz || 0;
  const m6Pipeline = sumWeekly(m6.pipelineWert);
  const m6Umsatz = m6.umsatz || 0;
  const gesamtUmsatz = m4Umsatz + m5Umsatz + m6Umsatz;
  const gesamtPipeline = sumWeekly(m4.pipelineWert) + m5Pipeline + m6Pipeline;

  const milestone3 = m3TermineGesamt >= settings.m3_termineKumuliert_min && m3TermineGehalten >= settings.m3_termineGehalten_min;
  const milestone5 = m5Pipeline >= settings.m5_pipeline_min;
  const milestone6 = gesamtUmsatz >= settings.m6_umsatz_min || gesamtPipeline >= settings.m6_pipeline_min;

  const umsatzProgress = Math.min(100, (gesamtUmsatz / settings.m6_gesamtumsatz_ziel) * 100);

  const navItems = [
    { href: '/employee', label: 'Mitarbeiter', icon: Users },
    { href: '/month/3', label: 'Monat 3', icon: Phone },
    { href: '/month/4', label: 'Monat 4', icon: Calendar },
    { href: '/month/5', label: 'Monat 5', icon: TrendingUp },
    { href: '/month/6', label: 'Monat 6', icon: Euro },
    { href: '/settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">KPI-Tracker Probezeit</h1>
            <p className="text-slate-400 text-sm">Vertrieb & Sales Performance</p>
          </div>
          {employee.name && (
            <div className="text-right">
              <p className="text-white font-semibold">{employee.name}</p>
              <p className="text-slate-400 text-sm">Start: {employee.startDate} | Ende: {endDate}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!employee.name && (
          <div className="mb-8 p-6 bg-cyan-900/30 border border-cyan-700 rounded-xl text-center">
            <p className="text-cyan-300 text-lg font-semibold">Willkommen! Bitte zuerst Mitarbeiterdaten eintragen.</p>
            <Link href="/employee" className="mt-3 inline-block bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition">
              Mitarbeiter anlegen
            </Link>
          </div>
        )}

        {/* Countdown Card */}
        {daysLeft !== null && (
          <div className={`mb-6 p-5 rounded-xl border flex items-center gap-4 ${
            daysLeft > 30 ? 'bg-slate-800 border-slate-700' :
            daysLeft > 0 ? 'bg-yellow-900/30 border-yellow-700' :
            'bg-red-900/30 border-red-700'
          }`}>
            <Clock className={`w-8 h-8 ${ daysLeft > 30 ? 'text-slate-400' : daysLeft > 0 ? 'text-yellow-400' : 'text-red-400'}`} />
            <div>
              <p className="text-slate-300 text-sm">Verbleibende Zeit</p>
              <p className="text-2xl font-bold text-white">{daysLeft > 0 ? `${daysLeft} Tage` : 'Probezeit beendet'}</p>
            </div>
            <div className="ml-auto w-48">
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, ((180 - daysLeft) / 180) * 100))}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-right">{Math.round(((180 - Math.max(0, daysLeft)) / 180) * 100)}% abgeschlossen</p>
            </div>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-600 rounded-xl p-4 flex flex-col items-center gap-2 transition group">
              <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
              <span className="text-sm text-slate-300 group-hover:text-white font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Meilenstein Cards */}
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Kritische Meilensteine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-5 rounded-xl border ${ milestone3 ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-3">
              {milestone3 ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-slate-500" />}
              <span className="font-semibold text-white">Meilenstein M3</span>
            </div>
            <p className="text-sm text-slate-400">15 Termine vereinbart + 5 gehalten</p>
            <div className="mt-3 flex gap-4 text-sm">
              <span className={m3TermineGesamt >= 15 ? 'text-green-400' : 'text-slate-400'}>
                Vereinbart: {m3TermineGesamt}/15
              </span>
              <span className={m3TermineGehalten >= 5 ? 'text-green-400' : 'text-slate-400'}>
                Gehalten: {m3TermineGehalten}/5
              </span>
            </div>
          </div>

          <div className={`p-5 rounded-xl border ${ milestone5 ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-3">
              {milestone5 ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-slate-500" />}
              <span className="font-semibold text-white">Meilenstein M5</span>
            </div>
            <p className="text-sm text-slate-400">Pipeline {formatEuro(settings.m5_pipeline_min)} aufgebaut</p>
            <p className={`mt-3 text-lg font-bold ${ m5Pipeline >= settings.m5_pipeline_min ? 'text-green-400' : 'text-slate-300'}`}>
              {formatEuro(m5Pipeline)}
            </p>
          </div>

          <div className={`p-5 rounded-xl border ${ milestone6 ? 'bg-green-900/20 border-green-700' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-3">
              {milestone6 ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-slate-500" />}
              <span className="font-semibold text-white">Meilenstein M6</span>
            </div>
            <p className="text-sm text-slate-400">Pipeline {formatEuro(settings.m6_pipeline_min)} ODER Umsatz {formatEuro(settings.m6_umsatz_min)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-500">Pipeline</p>
                <p className={`font-bold ${ gesamtPipeline >= settings.m6_pipeline_min ? 'text-green-400' : 'text-slate-300'}`}>{formatEuro(gesamtPipeline)}</p>
              </div>
              <div>
                <p className="text-slate-500">Umsatz</p>
                <p className={`font-bold ${ gesamtUmsatz >= settings.m6_umsatz_min ? 'text-green-400' : 'text-slate-300'}`}>{formatEuro(gesamtUmsatz)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Umsatz Progress */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Gesamtumsatz-Ziel</h3>
            <span className="text-slate-400 text-sm">Ziel: {formatEuro(settings.m6_gesamtumsatz_ziel)}</span>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all"
              style={{ width: `${umsatzProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cyan-400 font-semibold">{formatEuro(gesamtUmsatz)}</span>
            <span className="text-slate-400">{umsatzProgress.toFixed(1)}%</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[['M4', m4Umsatz], ['M5', m5Umsatz], ['M6', m6Umsatz]].map(([label, val]) => (
              <div key={label as string} className="text-center">
                <p className="text-slate-500 text-xs">{label as string}</p>
                <p className="text-white font-bold">{formatEuro(val as number)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Finale Bewertung */}
        {employee.name && (
          <div className={`p-6 rounded-xl border text-center ${
            milestone6 ? 'bg-green-900/30 border-green-600' : 'bg-slate-800 border-slate-700'
          }`}>
            {milestone6 ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-400">PROBEZEIT BESTANDEN</p>
              </>
            ) : (
              <>
                <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-xl font-semibold text-slate-400">Probezeit läuft noch</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
