import type { Expense } from "./types"

const keyName = 'expenses';

export const saveExpenses = (expenses: Expense[]) => {
    localStorage.setItem(keyName, JSON.stringify(expenses))
};

export const getExpenses = () => {
    const expensesString = localStorage.getItem(keyName)
    if (!expensesString) { return []; }
    const expenses = JSON.parse(expensesString) as Expense[]
    return expenses.map(expense => {
        return {
            ...expense,
            date: new Date(expense.date)
        }
    })
};