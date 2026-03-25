import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { BudgetProvider } from '@/lib/BudgetContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Kalkulator Budżetu Domowego',
  description: 'Nowoczesna aplikacja do zarządzania budżetem domowym całej rodziny',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <BudgetProvider>
          {children}
        </BudgetProvider>
      </body>
    </html>
  );
}
