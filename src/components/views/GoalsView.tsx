'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EMOJIS = ['🏖️', '🚗', '🛡️', '🏡', '💻', '🚲', '🐶', '✈️'];
const COLORS = ['#4f8ef7', '#8b5cf6', '#10d9a0', '#f59e0b', '#ec4899', '#f97316', '#06b6d4'];

export default function GoalsView() {
  const { state, dispatch } = useBudget();
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('0');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [icon, setIcon] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || parseFloat(targetAmount) <= 0) return;

    dispatch({
      type: 'ADD_GOAL',
      payload: {
        id: uuidv4(),
        name,
        targetAmount: parseFloat(targetAmount),
        savedAmount: parseFloat(savedAmount) || 0,
        deadline,
        icon,
        color
      }
    });
    setIsAdding(false);
    setName('');
    setTargetAmount('');
    setSavedAmount('0');
  };

  const handleDelete = (id: string) => {
    if (confirm('Usunąć ten cel?')) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
  };

  const handleUpdateSaved = (id: string, amount: string) => {
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;
    const newSaved = parseFloat(amount) || 0;
    dispatch({ type: 'UPDATE_GOAL', payload: { ...goal, savedAmount: newSaved } });
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Cele Oszczędnościowe</h1>
          <p className="text-secondary">Śledź swoje oszczędności na wybrane cele.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Anuluj' : '+ Dodaj Cel'}
        </button>
      </div>

      {isAdding && (
        <div className="card mb-6 animate-slide">
          <form onSubmit={handleAdd} className="grid-2">
            <div className="flex-col gap-2">
              <label>Nazwa celu</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="flex-col gap-2">
              <label>Kwota docelowa (PLN)</label>
              <input type="number" step="10" min="1" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required />
            </div>
            <div className="flex-col gap-2">
              <label>Obecnie zaoszczędzone (PLN)</label>
              <input type="number" step="10" min="0" value={savedAmount} onChange={e => setSavedAmount(e.target.value)} />
            </div>
            <div className="flex-col gap-2">
              <label>Termin do</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
            </div>
            <div className="flex-col gap-2">
              <label>Ikona i Kolor</label>
              <div className="flex gap-2 mb-2">
                {EMOJIS.map(e => (
                  <button key={e} type="button" className={`btn-icon ${icon === e ? 'bg-card-hover' : ''}`} onClick={() => setIcon(e)}>{e}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <div key={c} style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '2px solid white' : 'none' }} onClick={() => setColor(c)} />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary">Dodaj Cel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {state.goals.map(g => {
          const progress = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
          return (
            <div key={g.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="iconWrap" style={{ fontSize: '2rem' }}>{g.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{g.name}</h3>
                    <span className="text-secondary text-sm">Do: {new Date(g.deadline).toLocaleDateString('pl-PL')}</span>
                  </div>
                </div>
                <button className="btn-icon" onClick={() => handleDelete(g.id)}>🗑️</button>
              </div>

              <div className="divider" />
              
              <div className="flex justify-between items-end mb-2">
                <div className="flex-col">
                  <span className="text-sm text-muted mb-1">Zaoszczędzono</span>
                  <span className="text-xl font-bold" style={{ color: g.color }}>
                    {formatCurrency(g.savedAmount)}
                  </span>
                </div>
                <div className="flex-col text-right">
                  <span className="text-sm text-muted mb-1">Cel</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(g.targetAmount)}
                  </span>
                </div>
              </div>

              <div className="progress-track mb-4">
                <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: g.color }} />
              </div>

              <div className="flex items-center gap-2">
                <label style={{ margin: 0 }}>Aktualizuj kwotę:</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={g.savedAmount} 
                    onChange={e => handleUpdateSaved(g.id, e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '0.9rem', width: '120px' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
