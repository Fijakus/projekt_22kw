'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency, EXPENSE_CATEGORIES } from '@/lib/utils';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function LimitsView() {
  const { state, dispatch, getCategoryExpenses } = useBudget();
  const [isAdding, setIsAdding] = useState(false);

  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [limit, setLimit] = useState('');

  const catExpenses = getCategoryExpenses(state.selectedMonth);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || parseFloat(limit) <= 0) return;

    dispatch({
      type: 'SET_BUDGET_LIMIT',
      payload: { category: category as any, limit: parseFloat(limit) }
    });
    setIsAdding(false);
    setLimit('');
  };

  const handleDelete = (cat: string) => {
    if (confirm('Usunąć limit?')) {
      const remaining = state.budgetLimits.filter(b => b.category !== cat);
      // Hack for simplicity: reconstruct the array without this category
      // It's not in our Reducer officially as DELETE_BUDGET_LIMIT, so we update the limit to 0 logically or add a new action
      // Since we don't have DELETE_BUDGET_LIMIT we can set it to 0, which functionally breaks UI slightly, 
      // but let's just use LOAD_STATE mapping if really needed. For demo, setting limit: 0 hides it or we just won't show 0 limits.
      dispatch({ type: 'SET_BUDGET_LIMIT', payload: { category: cat as any, limit: 0 } });
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Limity Budżetowe</h1>
          <p className="text-secondary">Ustal limity na wydatki w poszczególnych kategoriach.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Anuluj' : '+ Ustaw Limit'}
        </button>
      </div>

      {isAdding && (
        <div className="card mb-6 animate-slide">
          <form onSubmit={handleAdd} className="grid-2">
            <div className="flex-col gap-2">
              <label>Kategoria wydatku</label>
              <select value={category} onChange={e => setCategory(e.target.value)} required>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-col gap-2">
              <label>Kwota limitu (PLN)</label>
              <input type="number" step="10" min="1" value={limit} onChange={e => setLimit(e.target.value)} required />
            </div>
            <div className="flex justify-end mt-4" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary">Zapisz Limit</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {state.budgetLimits.filter(b => b.limit > 0).map(b => {
          const spent = catExpenses[b.category] || 0;
          const percentage = Math.min((spent / b.limit) * 100, 100);
          const isOverLimit = spent > b.limit;
          
          return (
            <div key={b.category} className="card" style={{ borderLeft: `4px solid ${isOverLimit ? 'var(--accent-red)' : 'var(--accent-green)'}` }}>
               <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{b.category}</h3>
                  </div>
                </div>
                <button className="btn-icon" onClick={() => handleDelete(b.category)}><Trash2 size={16} /></button>
              </div>

              <div className="divider" />
              
              <div className="flex justify-between items-end mb-2">
                <div className="flex-col">
                  <span className="text-sm text-muted mb-1">Wydano</span>
                  <span className="text-xl font-bold" style={{ color: isOverLimit ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    {formatCurrency(spent)}
                  </span>
                </div>
                <div className="flex-col text-right">
                  <span className="text-sm text-muted mb-1">Limit</span>
                  <span className="text-lg font-bold text-secondary">
                    {formatCurrency(b.limit)}
                  </span>
                </div>
              </div>

              <div className="progress-track mb-2">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: isOverLimit ? 'var(--accent-red)' : 'var(--accent-green)' 
                  }} 
                />
              </div>
              <p className="text-xs text-right text-muted">{percentage.toFixed(0)}% wykorzystano</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
