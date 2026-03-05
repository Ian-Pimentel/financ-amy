import type { Expense } from "./types"

const KEYNAME = 'expenses';

export const persistExpenses = (expenses: Expense[], year: number) => {
    localStorage.setItem(`${KEYNAME}_${year}`, JSON.stringify(expenses))
};

export const getExpenses = (year: number) => {
    const expensesString = localStorage.getItem(`${KEYNAME}_${year}`)
    if (!expensesString) { return []; }
    const expenses = JSON.parse(expensesString) as Expense[]
    return expenses.map(expense => {
        return {
            ...expense,
            date: new Date(expense.date)
        }
    })
};

export const persistSalary = (salary: number) => {
    localStorage.setItem('salary', salary.toFixed(2))
};

export const getSalary = () => {
  const salary = Number(localStorage.getItem('salary'));
  return (isNaN(salary) || salary <= 0) ? 0 : salary;
};