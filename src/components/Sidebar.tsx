'use client';

import { useBudget } from '@/lib/BudgetContext';
import { monthLabel, lastNMonths } from '@/lib/utils';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'transactions', icon: '💳', label: 'Transakcje' },
  { id: 'members', icon: '👨‍👩‍👧‍👦', label: 'Rodzina' },
  { id: 'goals', icon: '🎯', label: 'Cele' },
  { id: 'limits', icon: '📉', label: 'Limity' },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { state, dispatch } = useBudget();
  const months = lastNMonths(6);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏠</span>
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
            <span className={styles.navIcon}>{item.icon}</span>
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
