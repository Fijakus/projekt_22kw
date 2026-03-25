'use client';

import { useState, FormEvent } from 'react';
import { useBudget } from '@/lib/BudgetContext';
import { TransactionType, ExpenseCategory, IncomeCategory, Transaction } from '@/types/budget';
import { v4 as uuidv4 } from 'uuid';
import styles from './TransactionForm.module.css';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/utils';

interface TransactionFormProps {
  onClose: () => void;
  initialData?: Transaction; // For editing
}

export default function TransactionForm({ onClose, initialData }: TransactionFormProps) {
  const { state, dispatch } = useBudget();
  
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [memberId, setMemberId] = useState(initialData?.memberId || state.members[0]?.id || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<string>(
    initialData?.category || (type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [recurring, setRecurring] = useState(initialData?.recurring || false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !memberId || !category || !description || !date) return;

    const transaction: Transaction = {
      id: initialData?.id || uuidv4(),
      memberId,
      type,
      category: category as ExpenseCategory | IncomeCategory,
      amount: parseFloat(amount),
      description,
      date,
      recurring,
      ...(recurring ? { recurringInterval: 'monthly' } : {})
    };

    if (initialData) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edytuj transakcję' : 'Dodaj transakcję'}</h2>
          <button className="btn-icon" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'expense' ? styles.activeExpense : ''}`}
              onClick={() => {
                setType('expense');
                setCategory(EXPENSE_CATEGORIES[0]);
              }}
            >
              Wydatki
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'income' ? styles.activeIncome : ''}`}
              onClick={() => {
                setType('income');
                setCategory(INCOME_CATEGORIES[0]);
              }}
            >
              Przychody
            </button>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Kto?</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
                {state.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.group}>
              <label>Kwota (PLN)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Np. 150.00"
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Kategoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                {type === 'expense'
                  ? EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)
                  : INCOME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.group}>
              <label>Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.group}>
            <label>Opis</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Z czym związana jest transakcja?"
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
            />
            <label htmlFor="recurring">Transakcja cykliczna (co miesiąc)</label>
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn-ghost" onClick={onClose}>Anuluj</button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Zapisz zmiany' : 'Dodaj transakcję'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
