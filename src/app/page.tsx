'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/views/DashboardView';
import TransactionsView from '@/components/views/TransactionsView';
import TransactionForm from '@/components/TransactionForm';

import MembersView from '@/components/views/MembersView';
import GoalsView from '@/components/views/GoalsView';
import LimitsView from '@/components/views/LimitsView';

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'transactions': return <TransactionsView />;
      case 'members': return <MembersView />;
      case 'goals': return <GoalsView />;
      case 'limits': return <LimitsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          padding: '16px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button 
            className="btn-primary"
            onClick={() => setIsFormOpen(true)}
          >
            + Dodaj transakcję
          </button>
        </header>

        {renderView()}
      </main>

      {isFormOpen && (
        <TransactionForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
