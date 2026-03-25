'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency, COLOR_OPTIONS, getInitials } from '@/lib/utils';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FamilyMember } from '@/types/budget';
import { Trash2 } from 'lucide-react';

export default function MembersView() {
  const { state, dispatch, getMemberExpenses } = useBudget();
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const newMember: FamilyMember = {
      id: uuidv4(),
      name,
      role,
      avatar: getInitials(name),
      color,
    };
    dispatch({ type: 'ADD_MEMBER', payload: newMember });
    setIsAdding(false);
    setName('');
    setRole('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Czy na pewno usunąć członka: ${name}? Spowoduje to również usunięcie transakcji przypisanych do tej osoby.`)) {
      dispatch({ type: 'DELETE_MEMBER', payload: id });
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Zarządzanie Rodziną</h1>
          <p className="text-secondary">Zarządzaj domownikami i monitoruj ich bieżące wydatki.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Anuluj' : '+ Dodaj Osobę'}
        </button>
      </div>

      {isAdding && (
        <div className="card mb-6 animate-slide" style={{ padding: '32px' }}>
          <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Rejestracja nowego członka rodziny</h3>
          <form onSubmit={handleAdd} className="grid-2">
            <div className="flex-col gap-2">
              <label>Imię / Nazwa</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Np. Jan Kowalski" />
            </div>
            <div className="flex-col gap-2">
              <label>Rola przypisana</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} required placeholder="Np. Ojciec, Administrator" />
            </div>
            
            <div className="flex-col gap-2" style={{ gridColumn: '1 / -1' }}>
              <label>Kolor identyfikacyjny</label>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map(c => (
                  <div 
                    key={c} 
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', background: c, cursor: 'pointer',
                      border: color === c ? '3px solid white' : '2px solid transparent',
                      boxShadow: color === c ? `0 0 10px ${c}50` : 'none'
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary">Zatwierdź Osobowość</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-3">
        {state.members.map(m => {
          const exp = getMemberExpenses(m.id, state.selectedMonth);
          return (
            <div key={m.id} className="card" style={{ borderLeft: `5px solid ${m.color}`, position: 'relative' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ 
                    fontSize: '1.2rem', fontWeight: 800, color: 'white', background: m.color, 
                    width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    {getInitials(m.name)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</h3>
                    <span className="badge" style={{ backgroundColor: `var(--bg-glass)`, color: 'var(--text-secondary)', fontWeight: 600 }}>{m.role}</span>
                  </div>
                </div>
                <button className="btn-icon" style={{ padding: '6px', border: '1px solid transparent' }} onClick={() => handleDelete(m.id, m.name)}>
                  <Trash2 size={16} color="var(--text-muted)" />
                </button>
              </div>

              <div className="divider" style={{ borderTop: '1px solid var(--border)' }} />
              
              <div className="flex-col gap-2 p-3 rounded" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                <span className="text-secondary text-xs uppercase font-bold" style={{ letterSpacing: '0.05em' }}>Miesięczne Koszty</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)'}}>
                  {formatCurrency(exp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
