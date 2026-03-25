'use client';

import { useBudget } from '@/lib/BudgetContext';
import StatCard from '@/components/StatCard';
import { formatCurrency, monthLabel } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CATEGORY_COLORS } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, Target as TargetIcon } from 'lucide-react';
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardView() {
  const { state, getTotalIncome, getTotalExpenses, getSavings, getCategoryExpenses } = useBudget();
  
  const income = getTotalIncome(state.selectedMonth);
  const expenses = getTotalExpenses(state.selectedMonth);
  const savings = getSavings(state.selectedMonth);
  
  const selectedMonthText = monthLabel(state.selectedMonth);

  // chart data
  const catExpenses = getCategoryExpenses(state.selectedMonth);
  const chartLabels = Object.keys(catExpenses);
  const chartDataValues = Object.values(catExpenses);
  const chartBgColors = chartLabels.map(l => CATEGORY_COLORS[l] || '#636975');

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: chartBgColors,
        borderColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#f1f5f9', font: { family: 'Inter', size: 13 } }
      }
    },
    cutout: '75%',
    maintainAspectRatio: false,
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    // A quick lookup for goal icons based on string name stored in state
    switch (iconName) {
      case 'Sun': return <ArrowUpRight size={18} />;
      case 'Car': return <TargetIcon size={18} />;
      case 'Shield': return <Wallet size={18} />;
      default: return <TargetIcon size={18} />;
    }
  };

  return (
    <div style={{ padding: '24px 32px' }} className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '4px' }}>Podsumowanie budżetu</h1>
        <p>Twoje dane sprzężone dla miesiąca: <strong style={{color: 'var(--text-primary)'}}>{selectedMonthText}</strong></p>
      </div>

      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <StatCard 
          label="Przychody" 
          value={formatCurrency(income)} 
          icon={<ArrowUpRight size={22} />} 
          accent="green" 
          subtitle={`Dane z ${selectedMonthText}`}
        />
        <StatCard 
          label="Wydatki" 
          value={formatCurrency(expenses)} 
          icon={<ArrowDownRight size={22} />} 
          accent="red" 
        />
        <StatCard 
          label="Oszczędności" 
          value={formatCurrency(savings)} 
          icon={<Wallet size={22} />} 
          accent="blue" 
          trend={savings > 0 ? 'Na plusie' : 'Na minusie'}
          trendPositive={savings > 0}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '24px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Wydatki wg kategorii</h3>
          {chartLabels.length > 0 ? (
            <div style={{ height: '260px' }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          ) : (
             <div className="empty-state">
              <span className="empty-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}><PieChart size={48} /></span>
              <p>Brak wydatków w tym miesiącu.</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '24px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Postęp celów</h3>
          <div className="flex-col gap-6">
            {state.goals.length > 0 ? state.goals.map(g => {
              const prog = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
              return (
                <div key={g.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: g.color }}><IconComponent iconName={g.icon} /></span>
                      {g.name}
                    </span>
                    <span className="text-xs text-muted">
                      {formatCurrency(g.savedAmount)} / {formatCurrency(g.targetAmount)}
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: '5px', background: 'var(--border)' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${prog}%`, backgroundColor: g.color }}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-muted">Zacznij od zdefiniowania celu oszczędnościowego!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
