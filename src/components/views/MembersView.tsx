'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency, AVATAR_OPTIONS, COLOR_OPTIONS, monthLabel } from '@/lib/utils';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FamilyMember } from '@/types/budget';

export default function MembersView() {
  const { state, dispatch, getMemberExpenses } = useBudget();
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const newMember: FamilyMember = {
      id: uuidv4(),
      name,
      role,
      avatar,
      color,
    };
    dispatch({ type: 'ADD_MEMBER', payload: newMember });
    setIsAdding(false);
    setName('');
    setRole('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Czy na pewno usunąć członka: ${name}? Spowoduje to również usunięcie ich transakcji.`)) {
      dispatch({ type: 'DELETE_MEMBER', payload: id });
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Zarządzanie Rodziną</h1>
          <p className="text-secondary">Członkowie rodziny i ich wydatki (bieżący miesiąc).</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Anuluj' : '+ Dodaj osobę'}
        </button>
      </div>

      {isAdding && (
        <div className="card mb-6 animate-slide">
          <h3 className="mb-4">Nowy członek rodziny</h3>
          <form onSubmit={handleAdd} className="grid-2">
            <div className="flex-col gap-2">
              <label>Imię</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Np. Jan" />
            </div>
            <div className="flex-col gap-2">
              <label>Rola</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} required placeholder="Np. Tata, Syn" />
            </div>
            <div className="flex-col gap-2">
              <label>Awatar</label>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {AVATAR_OPTIONS.map(a => (
                  <button 
                    key={a} type="button" 
                    className={`btn-icon ${avatar === a ? 'active' : ''}`}
                    style={avatar === a ? { background: 'var(--accent-blue)', color: '#fff', borderColor: 'var(--accent-blue)' } : {}}
                    onClick={() => setAvatar(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-col gap-2">
              <label>Kolor akcentu</label>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map(c => (
                  <div 
                    key={c} 
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', background: c, cursor: 'pointer',
                      border: color === c ? '3px solid white' : 'none',
                      boxShadow: color === c ? `0 0 10px ${c}` : 'none'
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary">Zapisz</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-3">
        {state.members.map(m => {
          const exp = getMemberExpenses(m.id, state.selectedMonth);
          return (
            <div key={m.id} className="card" style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ fontSize: '2.5rem', background: 'var(--bg-glass)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{m.name}</h3>
                    <span className="badge" style={{ backgroundColor: `${m.color}20`, color: m.color }}>{m.role}</span>
                  </div>
                </div>
                <button className="btn-icon" onClick={() => handleDelete(m.id, m.name)}>🗑️</button>
              </div>

              <div className="divider" />
              
              <div className="flex-col gap-2 text-center" style={{ padding: '12px 0' }}>
                <span className="text-secondary text-sm">Wydatki ({monthLabel(state.selectedMonth)})</span>
                <span className="text-2xl font-bold text-red">-{formatCurrency(exp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
