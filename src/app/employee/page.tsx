'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function EmployeePage() {
  const { employee, setEmployee } = useStore();
  const [name, setName] = useState(employee.name);
  const [startDate, setStartDate] = useState(employee.startDate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEmployee({ name, startDate });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-white">Mitarbeiterdaten</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Neuer Vertriebsmitarbeiter</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Max Mustermann"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Startdatum Probezeit</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Gespeichert!' : 'Speichern'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
