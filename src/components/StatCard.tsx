'use client';

import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendPositive?: boolean;
  accent?: 'green' | 'red' | 'blue' | 'orange' | 'purple';
  subtitle?: string;
}

export default function StatCard({
  label, value, icon, trend, trendPositive, accent = 'blue', subtitle,
}: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[accent]}`}>
      <div className={styles.top}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{icon}</span>
        </div>
        {trend && (
          <span className={`${styles.trend} ${trendPositive ? styles.trendUp : styles.trendDown}`}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}
