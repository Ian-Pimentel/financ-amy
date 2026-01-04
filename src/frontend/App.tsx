import "../index.css";
import { useState, useEffect } from "react";
import type { Expense } from "../types";
import { generateRandExpenses, groupExpensesInYear, months } from "../utils";
import MonthComponent from "./components/month_component";
import { getExpenses, saveExpenses } from "@/expenses_repository";


export function App() {
  // const [expenses, setExpenses] = useState(generateRandExpenses(2));
  // const [expenses, setExpenses] = useState([] as Expense[]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [year, setYear] = useState((new Date).getFullYear())
  const [expenses, setExpenses] = useState<Expense[]>([]);

  if (!totalSalary) setTotalSalary(+(prompt('Digite seu salário', '0')?.replaceAll(',', '.'))!)

  useEffect(() => {
    if (year) {
      setExpenses(getExpenses(year))
    }
  }, [year]);

  useEffect(() => {
    if(expenses.length) saveExpenses(expenses, year)
  }, [expenses])

  const groupedByMonthExpenses = Array.from(groupExpensesInYear(expenses)).sort(
    // isso aq parece meio ineficiente.
    // talvez trocar tipo do mês pelo index e quando for renderizar, acessar do array com os nomes
    (a, b) => months.indexOf(a[0]) - months.indexOf(b[0]) 
  );

  return (
    <>
      <div className="flex justify-center items-center gap-1">
        <button type="button" className="border rounded p-1 cursor-pointer" onClick={() => setYear(year - 1)}>{year - 1}</button>
        <span>{year}</span>
        <button type="button" className="border rounded p-1 cursor-pointer" onClick={() => setYear(year + 1)}>{year + 1}</button>
      </div>
      {groupedByMonthExpenses.map((month, idx) => {
        return (
          <MonthComponent key={idx} salary={totalSalary} month={month[0]} expenses={month[1]} setExpenses={setExpenses} />
        )
      })}
    </>
  );
};

export default App;
