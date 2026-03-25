'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  AppState,
  FamilyMember,
  Transaction,
  BudgetGoal,
  MonthlyBudgetLimit,
} from '@/types/budget';

/* ─── Default seed data ─── */
const defaultState: AppState = {
  members: [
    { id: 'm1', name: 'Tata', role: 'Tata', avatar: '👨', color: '#4f8ef7' },
    { id: 'm2', name: 'Mama', role: 'Mama', avatar: '👩', color: '#ec4899' },
    { id: 'm3', name: 'Dziecko', role: 'Dziecko', avatar: '👧', color: '#10d9a0' },
  ],
  transactions: [
    {
      id: 't1', memberId: 'm1', type: 'income', category: 'Wynagrodzenie',
      amount: 6500, description: 'Wypłata – marzec', date: '2026-03-01',
      recurring: true, recurringInterval: 'monthly',
    },
    {
      id: 't2', memberId: 'm2', type: 'income', category: 'Wynagrodzenie',
      amount: 4800, description: 'Wypłata – marzec', date: '2026-03-01',
      recurring: true, recurringInterval: 'monthly',
    },
    {
      id: 't3', memberId: 'm1', type: 'expense', category: 'Czynsz/Hipoteka',
      amount: 2200, description: 'Czynsz za mieszkanie', date: '2026-03-05',
      recurring: true, recurringInterval: 'monthly',
    },
    {
      id: 't4', memberId: 'm2', type: 'expense', category: 'Jedzenie',
      amount: 1200, description: 'Zakupy spożywcze', date: '2026-03-10',
      recurring: false,
    },
    {
      id: 't5', memberId: 'm3', type: 'expense', category: 'Edukacja',
      amount: 350, description: 'Korepetycje matematyka', date: '2026-03-12',
      recurring: false,
    },
    {
      id: 't6', memberId: 'm1', type: 'expense', category: 'Transport',
      amount: 450, description: 'Paliwo', date: '2026-03-15',
      recurring: false,
    },
    {
      id: 't7', memberId: 'm2', type: 'expense', category: 'Zdrowie',
      amount: 280, description: 'Wizyta lekarska + leki', date: '2026-03-18',
      recurring: false,
    },
    {
      id: 't8', memberId: 'm1', type: 'expense', category: 'Rachunki',
      amount: 520, description: 'Prąd, gaz, internet', date: '2026-03-20',
      recurring: true, recurringInterval: 'monthly',
    },
  ],
  goals: [
    {
      id: 'g1', name: 'Wakacje letnie 🏖️', targetAmount: 8000,
      savedAmount: 3200, deadline: '2026-07-01',
      icon: '✈️', color: '#4f8ef7',
    },
    {
      id: 'g2', name: 'Nowy samochód 🚗', targetAmount: 35000,
      savedAmount: 12000, deadline: '2027-06-01',
      icon: '🚗', color: '#8b5cf6',
    },
    {
      id: 'g3', name: 'Fundusz awaryjny', targetAmount: 15000,
      savedAmount: 9500, deadline: '2026-12-31',
      icon: '🛡️', color: '#10d9a0',
    },
  ],
  budgetLimits: [
    { category: 'Jedzenie', limit: 1500 },
    { category: 'Rozrywka', limit: 600 },
    { category: 'Transport', limit: 600 },
    { category: 'Ubrania', limit: 400 },
    { category: 'Zdrowie', limit: 500 },
  ],
  selectedMonth: '2026-03',
};

/* ─── Actions ─── */
type Action =
  | { type: 'ADD_MEMBER'; payload: FamilyMember }
  | { type: 'UPDATE_MEMBER'; payload: FamilyMember }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: BudgetGoal }
  | { type: 'UPDATE_GOAL'; payload: BudgetGoal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_BUDGET_LIMIT'; payload: MonthlyBudgetLimit }
  | { type: 'SET_MONTH'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };

/* ─── Reducer ─── */
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'UPDATE_MEMBER':
      return { ...state, members: state.members.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter(m => m.id !== action.payload),
        transactions: state.transactions.filter(t => t.memberId !== action.payload),
      };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g) };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };

    case 'SET_BUDGET_LIMIT': {
      const existing = state.budgetLimits.findIndex(b => b.category === action.payload.category);
      const updated = [...state.budgetLimits];
      if (existing >= 0) updated[existing] = action.payload;
      else updated.push(action.payload);
      return { ...state, budgetLimits: updated };
    }

    case 'SET_MONTH':
      return { ...state, selectedMonth: action.payload };

    default:
      return state;
  }
}

/* ─── Context ─── */
interface BudgetContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Selectors
  getMonthTransactions: (month: string) => Transaction[];
  getTotalIncome: (month: string) => number;
  getTotalExpenses: (month: string) => number;
  getSavings: (month: string) => number;
  getMemberExpenses: (memberId: string, month: string) => number;
  getCategoryExpenses: (month: string) => Record<string, number>;
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('budzet_domowy_v1');
      if (saved) {
        const parsed = JSON.parse(saved) as AppState;
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('budzet_domowy_v1', JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  /* ─── Selectors ─── */
  const getMonthTransactions = useCallback(
    (month: string) => state.transactions.filter(t => t.date.startsWith(month)),
    [state.transactions],
  );

  const getTotalIncome = useCallback(
    (month: string) =>
      getMonthTransactions(month).filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [getMonthTransactions],
  );

  const getTotalExpenses = useCallback(
    (month: string) =>
      getMonthTransactions(month).filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [getMonthTransactions],
  );

  const getSavings = useCallback(
    (month: string) => getTotalIncome(month) - getTotalExpenses(month),
    [getTotalIncome, getTotalExpenses],
  );

  const getMemberExpenses = useCallback(
    (memberId: string, month: string) =>
      getMonthTransactions(month)
        .filter(t => t.memberId === memberId && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0),
    [getMonthTransactions],
  );

  const getCategoryExpenses = useCallback(
    (month: string) => {
      const result: Record<string, number> = {};
      getMonthTransactions(month)
        .filter(t => t.type === 'expense')
        .forEach(t => {
          result[t.category] = (result[t.category] ?? 0) + t.amount;
        });
      return result;
    },
    [getMonthTransactions],
  );

  return (
    <BudgetContext.Provider
      value={{
        state, dispatch,
        getMonthTransactions, getTotalIncome, getTotalExpenses,
        getSavings, getMemberExpenses, getCategoryExpenses,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used inside BudgetProvider');
  return ctx;
}
