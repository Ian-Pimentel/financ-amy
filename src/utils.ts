import type { Expense } from "./types";

export const generateRandExpenses = (num: number) => {
  const result: Expense[] = [];

  for (let month = 1; month <= 3; month++) {//const month in months) {
    for (let i = 0; i < num; i++) {
      const date = new Date;
      date.setMonth(+month);
      date.setDate(date.getDate() + i);
      result.push(
        {
          id: i,
          paid: Math.random() > .5,
          name: `teste ${months[month]} ${i + 1}`,
          date,
          value: Number((Math.random() * 100 + Math.random() * 10).toFixed(2))
        }
      );
    }
  }


  return result;
};

export const months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"] as const;

export const getDate = (date: Date) => date.toISOString().slice(0, 10);
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
export const daysInMonth = (year: number, month: number) => new Date(year, clamp(month+1, 0, 11), 0).getDate();

const mockExpense = (month: number) => {
  return {
    id: 0,
    paid: false,
    name: '',
    date: new Date(2025, month),
    value: 0
  }
}


export const groupExpensesInYear = (expensesToGroup: Expense[]) => {
  const mockMonths: Map<typeof months[number], Expense[]> = new Map(
    [
      ['JANEIRO', [mockExpense(0)]],
      ['FEVEREIRO', [mockExpense(1)]],
      ['MARÇO', [mockExpense(2)]],
      ['ABRIL', [mockExpense(3)]],
      ['MAIO', [mockExpense(4)]],
      ['JUNHO', [mockExpense(5)]],
      ['JULHO', [mockExpense(6)]],
      ['AGOSTO', [mockExpense(7)]],
      ['SETEMBRO', [mockExpense(8)]],
      ['OUTUBRO', [mockExpense(9)]],
      ['NOVEMBRO', [mockExpense(10)]],
      ['DEZEMBRO', [mockExpense(11)]]
    ]
  )

  for (const [month, expenses] of groupExpensesByMonth(expensesToGroup)) {
    mockMonths.set(month, expenses)
  }

  return mockMonths
};

export const groupExpensesByMonth = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    const key = months[expense.date.getMonth()]!;
    const month = (acc.has(key) ? acc.get(key) : acc.set(key, []).get(key))!;
    month.push(expense);
    return acc;
  }, new Map<typeof months[number], Expense[]>);
};