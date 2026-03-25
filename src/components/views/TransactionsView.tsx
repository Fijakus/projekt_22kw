'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency, formatDate, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/utils';
import { Transaction } from '@/types/budget';
import { useState } from 'react';

export default function TransactionsView() {
  const { state, dispatch, getMonthTransactions } = useBudget();
  const transactions = getMonthTransactions(state.selectedMonth);

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions.filter(t => filterType === 'all' || t.type === filterType);
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Wszystkie Transakcje</h1>
          <p className="text-secondary">Historia operacji w bieżącym miesiącu.</p>
        </div>

        <div className="flex gap-2">
          <button 
            className={`btn-ghost ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
            style={filterType === 'all' ? { background: 'var(--bg-card)', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' } : {}}
          >
            Wszystko
          </button>
          <button 
            className={`btn-ghost ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
            style={filterType === 'income' ? { background: 'var(--bg-card)', borderColor: 'var(--accent-green)', color: 'var(--accent-green)' } : {}}
          >
            Przychody
          </button>
          <button 
            className={`btn-ghost ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
            style={filterType === 'expense' ? { background: 'var(--bg-card)', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' } : {}}
          >
            Wydatki
          </button>
        </div>
      </div>

      <div className="card p-0" style={{ overflow: 'hidden' }}>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📂</span>
            <p>Brak transakcji w wybranym miesiącu.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Data</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Opis</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Kategoria</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Osoba</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Kwota</th>
                  <th style={{ padding: '16px 24px', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(t => {
                  const m = state.members.find(memb => memb.id === t.memberId);
                  const isExp = t.type === 'expense';
                  return (
                    <tr 
                      key={t.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border)', 
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem' }}>{formatDate(t.date)}</td>
                      <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        <div className="flex items-center gap-2">
                          {t.description}
                          {t.recurring && <span title="Cykliczna" style={{ fontSize: '10px' }}>🔄</span>}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="badge" style={{ backgroundColor: `${CATEGORY_COLORS[t.category] || '#94a3b8'}20`, color: CATEGORY_COLORS[t.category] || 'var(--text-primary)'}}>
                          {CATEGORY_ICONS[t.category]} {t.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {m ? (
                          <div className="flex items-center gap-2">
                            <span>{m.avatar}</span>
                            <span className="text-sm">{m.name}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: isExp ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                        {isExp ? '-' : '+'}{formatCurrency(t.amount)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button className="btn-icon" style={{ borderColor: 'transparent', width: '30px', height: '30px' }} onClick={() => handleDelete(t.id)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
