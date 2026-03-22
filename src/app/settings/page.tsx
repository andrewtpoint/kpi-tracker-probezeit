'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';

const defaultSettings = {
  m3_callsProTag_min: 10, m3_termineKumuliert_min: 15, m3_termineGehalten_min: 5,
  m4_termineProWoche_min: 5, m4_umsatz_min: 4000, m4_angebote_min: 3,
  m5_pipeline_min: 100000, m5_umsatz_min: 10000,
  m6_pipeline_min: 300000, m6_umsatz_min: 50000, m6_gesamtumsatz_ziel: 65000,
};

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocal({ ...defaultSettings });
    updateSettings(defaultSettings);
  };

  const fields = [
    { key: 'm3_callsProTag_min', label: 'M3: Min. Calls/Tag', group: 'Monat 3' },
    { key: 'm3_termineKumuliert_min', label: 'M3: Min. Termine kumuliert', group: 'Monat 3' },
    { key: 'm3_termineGehalten_min', label: 'M3: Min. Termine gehalten', group: 'Monat 3' },
    { key: 'm4_termineProWoche_min', label: 'M4: Min. Termine/Woche', group: 'Monat 4' },
    { key: 'm4_umsatz_min', label: 'M4: Min. Umsatz (€)', group: 'Monat 4' },
    { key: 'm4_angebote_min', label: 'M4: Min. Angebote', group: 'Monat 4' },
    { key: 'm5_pipeline_min', label: 'M5: Min. Pipeline (€)', group: 'Monat 5' },
    { key: 'm5_umsatz_min', label: 'M5: Min. Umsatz (€)', group: 'Monat 5' },
    { key: 'm6_pipeline_min', label: 'M6: Min. Pipeline (€)', group: 'Monat 6' },
    { key: 'm6_umsatz_min', label: 'M6: Min. Umsatz (€)', group: 'Monat 6' },
    { key: 'm6_gesamtumsatz_ziel', label: 'Gesamt-Umsatz-Ziel (€)', group: 'Gesamt' },
  ] as const;

  const groups = [...new Set(fields.map(f => f.group))];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-white">KPI-Zielwerte Einstellungen</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {groups.map(group => (
          <div key={group} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4 text-lg">{group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.filter(f => f.group === group).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm text-slate-300 mb-1">{label}</label>
                  <input
                    type="number"
                    value={local[key]}
                    onChange={(e) => setLocal({ ...local, [key]: Number(e.target.value) })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />{saved ? 'Gespeichert!' : 'Speichern'}
          </button>
          <button onClick={handleReset} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
