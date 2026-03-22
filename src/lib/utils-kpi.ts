export type KPIStatus = 'erreicht' | 'gut' | 'unter_ziel' | 'kritisch' | 'offen';

export function sumWeekly(w?: { w1?: number; w2?: number; w3?: number; w4?: number }): number {
  if (!w) return 0;
  return (w.w1 || 0) + (w.w2 || 0) + (w.w3 || 0) + (w.w4 || 0);
}

export function calcStatus(ist: number, min: number, ideal: number): KPIStatus {
  if (ist === 0) return 'offen';
  if (ist >= ideal) return 'erreicht';
  if (ist >= min) return 'gut';
  if (ist >= min * 0.8) return 'unter_ziel';
  return 'kritisch';
}

export const statusConfig: Record<KPIStatus, { label: string; color: string; bg: string; border: string }> = {
  erreicht: { label: 'Erreicht', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700' },
  gut: { label: 'Gut', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700' },
  unter_ziel: { label: 'Unter Ziel', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700' },
  kritisch: { label: 'Kritisch', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700' },
  offen: { label: 'Offen', color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700' },
};

export function formatEuro(n: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}
