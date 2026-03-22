'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WeeklyData { w1: number; w2: number; w3: number; w4: number; }

export interface Deal {
  id: string;
  kunde: string;
  wert: number;
  datumVersendet: string;
  status: 'Offen' | 'Verhandlung' | 'Gewonnen' | 'Verloren';
  wahrscheinlichkeit?: number;
  erwarteterAbschluss?: string;
}

export interface MonthData {
  termineVereinbart?: WeeklyData;
  termineGehalten?: WeeklyData;
  anrufversuche?: WeeklyData;
  angeboteVersendet?: WeeklyData;
  pipelineWert?: WeeklyData;
  umsatz?: number;
  deals?: Deal[];
  kommentar?: string;
  produktwissenBestanden?: boolean;
  crmGepflegt?: boolean;
}

export interface KPISettings {
  m3_callsProTag_min: number;
  m3_termineKumuliert_min: number;
  m3_termineGehalten_min: number;
  m4_termineProWoche_min: number;
  m4_umsatz_min: number;
  m4_angebote_min: number;
  m5_pipeline_min: number;
  m5_umsatz_min: number;
  m6_pipeline_min: number;
  m6_umsatz_min: number;
  m6_gesamtumsatz_ziel: number;
}

const defaultSettings: KPISettings = {
  m3_callsProTag_min: 10,
  m3_termineKumuliert_min: 15,
  m3_termineGehalten_min: 5,
  m4_termineProWoche_min: 5,
  m4_umsatz_min: 4000,
  m4_angebote_min: 3,
  m5_pipeline_min: 100000,
  m5_umsatz_min: 10000,
  m6_pipeline_min: 300000,
  m6_umsatz_min: 50000,
  m6_gesamtumsatz_ziel: 65000,
};

interface AppState {
  employee: { name: string; startDate: string };
  months: Record<string, MonthData>;
  settings: KPISettings;
  setEmployee: (e: { name: string; startDate: string }) => void;
  updateMonth: (month: string, data: Partial<MonthData>) => void;
  updateSettings: (s: Partial<KPISettings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      employee: { name: '', startDate: '' },
      months: {},
      settings: defaultSettings,
      setEmployee: (e) => set({ employee: e }),
      updateMonth: (month, data) =>
        set((state) => ({ months: { ...state.months, [month]: { ...state.months[month], ...data } } })),
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),
    }),
    { name: 'kpi_tracker_v1' }
  )
);
