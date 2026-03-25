export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Jedzenie'
  | 'Czynsz/Hipoteka'
  | 'Transport'
  | 'Rozrywka'
  | 'Zdrowie'
  | 'Edukacja'
  | 'Ubrania'
  | 'Rachunki'
  | 'Oszczędności'
  | 'Inne';

export type IncomeCategory =
  | 'Wynagrodzenie'
  | 'Freelance'
  | 'Inwestycje'
  | 'Alimenty'
  | 'Zasiłek'
  | 'Inne';

export interface FamilyMember {
  id: string;
  name: string;
  role: string;           // np. "Tata", "Mama", "Dziecko"
  avatar: string;         // emoji
  color: string;          // accent color hex
}

export interface Transaction {
  id: string;
  memberId: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  amount: number;
  description: string;
  date: string;           // ISO date string
  recurring: boolean;
  recurringInterval?: 'monthly' | 'weekly' | 'yearly';
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;       // ISO date string
  icon: string;           // emoji
  color: string;
}

export interface MonthlyBudgetLimit {
  category: ExpenseCategory;
  limit: number;
}

export interface AppState {
  members: FamilyMember[];
  transactions: Transaction[];
  goals: BudgetGoal[];
  budgetLimits: MonthlyBudgetLimit[];
  selectedMonth: string;  // 'YYYY-MM'
}
