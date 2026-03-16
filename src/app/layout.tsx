import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Management MVP',
  description: 'Lightweight PM demo app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </body>
    </html>
  );
}
