import "../index.css";
import { useState, type ChangeEvent } from "react";
import type { Expense } from "../types";
import { clamp, daysInMonth, generateRandExpenses, months } from "../utils";
import MonthComponent from "./components/month_component";

const groupExpensesByMonth = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    const key = months[expense.date.getMonth()]!;
    const month = (acc.has(key) ? acc.get(key) : acc.set(key, []).get(key))!;
    month.push(expense);
    return acc;
  }, new Map<string, Expense[]>);
};

export function App() {
  const [expenses, setExpenses] = useState(generateRandExpenses(3));
  
  const groupedByMonthExpenses = Array.from(groupExpensesByMonth(expenses)).sort(
    (a, b) => months.indexOf(a[0]) - months.indexOf(b[0])
  );

  const getExpense = (id: number) => {
    return expenses.find(expense => expense.id === id)
  };

  const addExpense = (expense?: Partial<Expense>) => {
    setExpenses([
      ...expenses,
      {
        id: expenses.length,
        paid: false, name: '',
        date: new Date,
        value: 0,
        ...expense
      },
    ]);
  };

  const updateExpense = (id: number, fieldsToUpdate: Partial<Expense>) => {
    const newExpenses = expenses.map(expense => {
      if (id === expense.id) {
        return {
          ...expense,
          ...fieldsToUpdate
        }
      }
      return expense;
    });
    setExpenses(newExpenses);
  };

  const handleCellChange = (id: number, prop: keyof Expense, { target }: ChangeEvent<HTMLInputElement>) => {
    switch (prop) {
      case "paid":
        updateExpense(id, { paid: target.checked });
        break;
      case "name":
        updateExpense(id, { name: target.value });
        break;
      case "date":
        const expense = getExpense(id)!;
        const clampedDay = clamp(+target.value, 1, daysInMonth(expense.date.getFullYear(), expense.date.getMonth()));
        expense.date.setDate(clampedDay);
        updateExpense(id, { date: expense.date });
        break;
      case "value":
        updateExpense(id, { value: +target.value });
        break;
    }
  };

  return (
    <>
      {groupedByMonthExpenses.map((month, idx) => {
        return (
          <MonthComponent key={idx} month={month[0]} expenses={month[1]} handleCellChange={handleCellChange} addExpense={addExpense} />
        )
      })}
    </>
  );
};

export default App;
