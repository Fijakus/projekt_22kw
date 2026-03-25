'use client';

import { useBudget } from '@/lib/BudgetContext';
import { monthLabel, lastNMonths } from '@/lib/utils';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

import { LayoutDashboard, ReceiptText, Users, Target, Activity, Wallet } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: ReceiptText, label: 'Transakcje' },
  { id: 'members', icon: Users, label: 'Rodzina' },
  { id: 'goals', icon: Target, label: 'Cele' },
  { id: 'limits', icon: Activity, label: 'Limity' },
];

import { Home } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { state, dispatch } = useBudget();
  const months = lastNMonths(6);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Home size={32} className={styles.logoIcon} />
        <div>
          <div className={styles.logoTitle}>BudżetRodzinny</div>
          <div className={styles.logoSub}>Kalkulator domowy</div>
        </div>
      </div>

      {/* Month picker */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Miesiąc</div>
        <select
          className={styles.monthSelect}
          value={state.selectedMonth}
          onChange={e => dispatch({ type: 'SET_MONTH', payload: e.target.value })}
        >
          {months.map(m => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>Menu</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon size={18} className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
            {activeView === item.id && <span className={styles.activeDot} />}
          </button>
        ))}
      </nav>

      {/* Members quick view */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Członkowie</div>
        <div className={styles.membersList}>
          {state.members.map(m => (
            <div key={m.id} className={styles.memberChip}>
              <span className={styles.memberAvatar}>{m.avatar}</span>
              <span className={styles.memberName}>{m.name}</span>
              <span
                className={styles.memberDot}
                style={{ background: m.color }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerText}>💾 Dane zapisane lokalnie</span>
      </div>
    </aside>
  );
}
