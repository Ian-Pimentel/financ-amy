import "../index.css";
import { useState, useEffect } from "react";
import type { Expense } from "../types";
import { getCategories, groupExpensesInYear, MONTHS } from "../utils";
import MonthComponent from "./components/MonthTable";
import { getExpenses, persistExpenses, getSalary, persistSalary } from "@/expensesRepository";
import { v4 as uuidv4 } from 'uuid';

function promptSalary() {
  const salary = Number(prompt('Digite seu salário', '0')?.replaceAll(',', '.'));

  if (isNaN(salary) || salary <= 0) return promptSalary();
  
  return salary;
}

export function App() {
  const [totalSalary] = useState(getSalary() || promptSalary());
  const [year, setYear] = useState((new Date).getFullYear())
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    persistSalary(totalSalary)
  }, [totalSalary])

  //tranformar persistencia no localstorage em hook?
  // pegar do localstorage
  useEffect(() => {
    setExpenses(getExpenses(year))
  }, [year]);

  // salvar no localstorage
  useEffect(() => {
    persistExpenses(expenses, year)
  }, [expenses])

  //#region expenses CRUD
  const getExpense = (id: string) => {
    return expenses.find(expense => expense.id === id)
  };

  const addExpense = (expense?: Partial<Expense>) => {
    setExpenses([
      ...expenses,
      {
        paid: false,
        name: '',
        date: new Date,
        value: 0,
        ...expense,
        category: "",
        id: uuidv4(),
      },
    ]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    if (!updatedExpense.id || !getExpense(updatedExpense.id)) {
      addExpense(updatedExpense)
      return
    }

    const newExpenses = expenses.map(expense => {
      if (updatedExpense.id === expense.id) {
        return updatedExpense
      }
      return expense;
    });
    setExpenses(newExpenses);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }
  //#endregion

  const groupedByMonthExpenses = Array.from(groupExpensesInYear(expenses)).sort(
    // isso aq parece meio ineficiente.
    // talvez trocar tipo do mês pelo index e quando for renderizar, acessar do array com os nomes
    (a, b) => MONTHS.indexOf(a[0]) - MONTHS.indexOf(b[0])
  );

  const categories = getCategories(expenses)

  return (
    <>
      <div className="flex justify-center items-center gap-1">
        <button type="button" className="border rounded p-1 cursor-pointer" onClick={() => setYear(year - 1)}>{year - 1}</button>
        <span>{year}</span>
        <button type="button" className="border rounded p-1 cursor-pointer" onClick={() => setYear(year + 1)}>{year + 1}</button>
      </div>
      {groupedByMonthExpenses.map((month, idx) => {
        return (
          <MonthComponent key={idx} salary={totalSalary} month={month[0]} expenses={month[1]} categories={categories} addExpense={addExpense} updateExpense={updateExpense} removeExpense={removeExpense} />
        )
      })}
    </>
  );
};

export default App;

