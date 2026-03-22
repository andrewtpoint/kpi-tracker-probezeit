import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KPI-Tracker Probezeit Vertrieb',
  description: 'Strukturierte Begleitung neuer Vertriebsmitarbeiter durch die Probezeit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
