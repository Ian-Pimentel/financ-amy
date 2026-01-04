import type { Expense } from "./types"

const KEYNAME = 'expenses';

export const saveExpenses = (expenses: Expense[], year: number) => {
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