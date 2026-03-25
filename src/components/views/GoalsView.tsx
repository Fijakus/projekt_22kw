'use client';

import { useBudget } from '@/lib/BudgetContext';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Target, Plane, Car, Home, Laptop, Bike, PawPrint, Bus, Settings } from 'lucide-react';

const ICON_NAMES = ['Target', 'Plane', 'Car', 'Home', 'Laptop', 'Bike', 'PawPrint', 'Bus'];
const COLORS = ['#4A6FA5', '#6E8898', '#9E768F', '#5D737E', '#8B94A3', '#B08493', '#D0A352', '#688E75'];

export default function GoalsView() {
  const { state, dispatch } = useBudget();
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('0');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [icon, setIcon] = useState(ICON_NAMES[0]);
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
    if (confirm('Jesteś pewien, że chcesz usunąć ten cel?')) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
  };

  const handleUpdateSaved = (id: string, amount: string) => {
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;
    const newSaved = parseFloat(amount) || 0;
    dispatch({ type: 'UPDATE_GOAL', payload: { ...goal, savedAmount: newSaved } });
  };

  const RenderIcon = ({ name, size = 20, col }: { name: string, size?: number, col?: string }) => {
    const props = { size, color: col || 'currentColor' };
    switch (name) {
      case 'Plane': return <Plane {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'Bike': return <Bike {...props} />;
      case 'PawPrint': return <PawPrint {...props} />;
      case 'Bus': return <Bus {...props} />;
      case 'Target':
      default: return <Target {...props} />;
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Cele Oszczędnościowe</h1>
          <p className="text-secondary">Śledź oszczędności do wyznaczonych celów.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Anuluj' : '+ Dodaj Cel'}
        </button>
      </div>

      {isAdding && (
        <div className="card mb-6 animate-slide" style={{ padding: '32px' }}>
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
            <div className="flex-col gap-2" style={{ gridColumn: '1 / -1' }}>
              <label>Ikona</label>
              <div className="flex gap-2">
                {ICON_NAMES.map(e => (
                  <button 
                    key={e} type="button" 
                    className={`btn-icon`} 
                    style={{
                      marginRight: '8px',
                      background: icon === e ? 'var(--bg-glass)' : 'transparent',
                      borderColor: icon === e ? 'var(--border-hover)' : 'transparent',
                      color: icon === e ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }} 
                    onClick={() => setIcon(e)}>
                    <RenderIcon name={e} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-col gap-2" style={{ gridColumn: '1 / -1' }}>
              <label>Kolor</label>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <div 
                    key={c} 
                    style={{ 
                      width: '28px', height: '28px', borderRadius: '50%', background: c, cursor: 'pointer', 
                      border: color === c ? '3px solid white' : '2px solid transparent' 
                    }} 
                    onClick={() => setColor(c)} 
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary">Utwórz Cel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {state.goals.map(g => {
          const progress = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
          return (
            <div key={g.id} className="card" style={{ borderTop: `2px solid ${g.color}` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="iconWrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: 'var(--bg-glass)' }}>
                    <RenderIcon name={g.icon} size={24} col={g.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '2px', fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</h3>
                    <span className="text-secondary text-xs font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      DO: {new Date(g.deadline).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                </div>
                <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDelete(g.id)}>Usuń</button>
              </div>

              <div className="divider" />
              
              <div className="flex justify-between items-end mb-3 mt-2">
                <div className="flex-col">
                  <span className="text-xs text-muted font-bold text-uppercase mb-1">Zaoszczędzono</span>
                  <span className="text-xl font-bold" style={{ color: g.color }}>
                    {formatCurrency(g.savedAmount)}
                  </span>
                </div>
                <div className="flex-col text-right">
                  <span className="text-xs text-muted font-bold text-uppercase mb-1">Docelowo</span>
                  <span className="text-lg font-semibold text-secondary">
                    {formatCurrency(g.targetAmount)}
                  </span>
                </div>
              </div>

              <div className="progress-track mb-5" style={{ background: 'var(--bg-glass)', height: '8px' }}>
                <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: g.color }} />
              </div>

              <div className="flex items-center justify-between gap-4 p-3" style={{ background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <label style={{ margin: 0, fontSize: '0.85rem' }}>Zaktualizuj stan:</label>
                <input 
                  type="number" 
                  value={g.savedAmount} 
                  onChange={e => handleUpdateSaved(g.id, e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.9rem', width: '130px', background: 'var(--bg-secondary)' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
