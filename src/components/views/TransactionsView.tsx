'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency, formatDate, CATEGORY_COLORS, getInitials } from '@/lib/utils';
import { Transaction } from '@/types/budget';
import { useState } from 'react';
import { Trash2, RefreshCw, Layers } from 'lucide-react';

export default function TransactionsView() {
  const { state, dispatch, getMonthTransactions } = useBudget();
  const transactions = getMonthTransactions(state.selectedMonth);

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions.filter(t => filterType === 'all' || t.type === filterType);
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    if (confirm('Usunąć wybraną transakcję ze spisu?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Rejestr Transakcji</h1>
          <p className="text-secondary">Przejrzysta ewidencja operacji finansowych.</p>
        </div>

        <div className="flex gap-2">
          <button 
            className={`btn-ghost ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
            style={filterType === 'all' ? { background: 'var(--bg-card)', borderColor: 'var(--border-hover)', color: 'var(--text-primary)' } : {}}
          >
            Pełny rejestr
          </button>
          <button 
            className={`btn-ghost ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
            style={filterType === 'income' ? { background: 'var(--bg-glass)', borderColor: '#4A6FA5', color: '#4A6FA5' } : {}}
          >
            Przychody
          </button>
          <button 
            className={`btn-ghost ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
            style={filterType === 'expense' ? { background: 'var(--bg-glass)', borderColor: '#9E768F', color: '#9E768F' } : {}}
          >
            Wydatki
          </button>
        </div>
      </div>

      <div className="card p-0" style={{ overflow: 'hidden' }}>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--border)' }}>
              <Layers size={48} />
            </span>
            <p>Brak zapisów w wybranym przedziale czasowym.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Data Operacji</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Szczegóły</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Klasyfikacja</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Podmiot</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Kwota (PLN)</th>
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
                      <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDate(t.date)}</td>
                      <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        <div className="flex items-center gap-2">
                          {t.description}
                          {t.recurring && <span title="Abonament / Zlecenie stałe" style={{ color: 'var(--text-muted)' }}><RefreshCw size={14} /></span>}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="badge" style={{ 
                          backgroundColor: `${CATEGORY_COLORS[t.category] || '#636975'}15`, 
                          color: CATEGORY_COLORS[t.category] || 'var(--text-primary)',
                          border: `1px solid ${CATEGORY_COLORS[t.category] || '#636975'}30`,
                          padding: '4px 10px',
                          fontWeight: 600,
                        }}>
                          {t.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {m ? (
                          <div className="flex items-center gap-2">
                            <div style={{ background: m.color, color: 'white', fontSize: '0.65rem', width: '22px', height: '22px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {getInitials(m.name)}
                            </div>
                            <span className="text-sm font-semibold">{m.name}</span>
                          </div>
                        ) : <span className="text-muted">-</span>}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: isExp ? 'var(--text-primary)' : '#4A6FA5' }}>
                        {isExp ? '-' : '+'}{formatCurrency(t.amount)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button className="btn-icon" style={{ borderColor: 'transparent', width: '32px', height: '32px' }} onClick={() => handleDelete(t.id)}>
                          <Trash2 size={16} />
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
