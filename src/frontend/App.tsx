import "../index.css";
import { useState, useEffect } from "react";
import type { Expense } from "../types";
import { generateRandExpenses, groupExpensesInYear, months } from "../utils";
import MonthComponent from "./components/month_component";
import { getExpenses, saveExpenses } from "@/expenses_repository";


export function App() {
  // const [expenses, setExpenses] = useState(generateRandExpenses(2));
  // const [expenses, setExpenses] = useState([] as Expense[]);
  const [expenses, setExpenses] = useState(getExpenses());
  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const groupedByMonthExpenses = Array.from(groupExpensesInYear(expenses)).sort(
    (a, b) => months.indexOf(a[0]) - months.indexOf(b[0])
  );

  return (
    <>
      {groupedByMonthExpenses.map((month, idx) => {
        return (
          <MonthComponent key={idx} month={month[0]} expenses={month[1]} setExpenses={setExpenses} />
        )
      })}
    </>
  );
};

export default App;
