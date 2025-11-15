import type { Expense } from "./types";

export const generateRandExpenses = (num: number) => {
  const result: Expense[] = [];

  for (const month in months) {
    for (let i = 0; i < num; i++) {
      const date = new Date;
      date.setMonth(+month);
      date.setDate(date.getDate() + i);
      result.push(
        {
          id: i,
          paid: Math.random() > .5,
          name: `teste ${i + 1}`,
          date,
          value: Number((Math.random() * 100 + Math.random() * 10).toFixed(2))
        }
      );
    }
  }


  return result;
};

export const months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

export const generateRandomYear = () => {
  const year = new Map<typeof months[number], Expense[]>();
  for (const month of months) {
    year.set(month, generateRandExpenses(5));
  }
  return year;
};

export const getDate = (date: Date) => date.toISOString().slice(0, 10);
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
export const daysInMonth = (year: number, month: number) => new Date(year, clamp(month - 1, 0, 11), 0).getDate();
