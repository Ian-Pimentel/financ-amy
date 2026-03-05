import type { Expense } from "@/types"
import { clamp, daysInMonth, getDate, MONTHS } from "@/utils"
import { useState, type SetStateAction } from "react"
import TrashBin from "./TrashbinIcon";
// import ExpensesPieChart from './ExpensesPieChart';

type MonthProps = {
    month: string;
    expenses: Expense[];
    salary: number;
    categories: string[];
    addExpense: (expense?: Partial<Expense>) => void;
    updateExpense: (updatedExpense: Expense) => void;
    removeExpense: (id: string) => void;
};

// const currency = <span className='text-(--hint-color)'>R$</span>;

export default function MonthComponent({ month, expenses, salary, categories, addExpense, updateExpense, removeExpense }: MonthProps) {
    const [open, setOpen] = useState(month === MONTHS[(new Date).getMonth()]);

    const expensesTotal = expenses/*.filter(exp => exp.paid)*/.map(exp => exp.value).reduce((prev, curr) => {
        return prev + curr;
    }, 0);

    // console.log(categories)

    const handleAddRow = (ev: React.KeyboardEvent<HTMLInputElement>, expense?: Partial<Expense>) => {
        if (ev.key === "Enter" || (!ev.shiftKey && ev.key === "Tab")) {
            ev.preventDefault();
            addExpense(expense);
        }
    };

    const toggleOpen = () => {
        setOpen(!open);
    };

    const handleOpen = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            toggleOpen();
        }
    };

    // const handleRemoveRow = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    //     if (ev.key === "Backspace") {
    //         ev.preventDefault();
    //         console.log('go back')
    //     }
    // }

    const moneySaved = salary - expensesTotal;

    return (
        <div>
            <div tabIndex={0} className="flex cursor-pointer" onClick={toggleOpen} onKeyUp={handleOpen}>
                <div className={`${open && "rotate-90"} align-middle`}>{">"}</div>
                <div className='grow'>{month}</div>
                <div className={`${(moneySaved < 0) && 'text-red-400'} text-right before:content-['R$_'] before:text-(--hint-color)`}>{(moneySaved).toFixed(2)}</div>
            </div>
            {open && (
                <div>
                    {/* <ExpensesPieChart data={expenses} /> */}
                    {/* <div className="grid grid-cols-[min-content_6fr_min-content_2fr_min-content]"> */}
                    <div className="grid grid-cols-[6fr_2fr_min-content]">
                        {/* <span className="p-1 border-r border-b">Pago</span> */}
                        <span className="p-1 border-r border-b">Gasto</span>
                        {/* <span className="p-1 border-r border-b text-right">Dia</span> */}
                        <span className="p-1 border-r border-b text-right">Valor</span>
                        <span className="p-1 border-b text-center">Ações</span>


                        {expenses.map((expense, idx) => {
                            const isLastCell = (idx + 1) === expenses.length
                            const handleDateInput = (day: number) => {
                                const clampedDay = clamp(day, 1, daysInMonth(expense.date.getFullYear(), expense.date.getMonth()));
                                return new Date(expense.date.getFullYear(), expense.date.getMonth(), clampedDay)
                            }
                            return (
                                <div className="contents" key={idx}>
                                    {/* <span className="p-1 border-r border-b">
                                        <input
                                            className="w-full h-full"
                                            type="checkbox"
                                            name="paid"
                                            id={`pago-${expense.id}`}
                                            checked={expense.paid}
                                            // value={paid ? "true" : "false"}
                                            onChange={(ev) => updateExpense({ ...expense, paid: ev.target.checked })}
                                        />
                                    </span> */}
                                    <div className="flex p-1 border-r border-b">
                                        <input
                                            className="w-full h-full"
                                            autoFocus={(idx + 1) === expenses.length && open}
                                            type="text"
                                            name="name"
                                            // placeholder="Digite o nome do gasto"
                                            id={`name-${expense.id}`}
                                            value={expense.name}
                                            // onKeyDown={handleRemoveRow}
                                            onChange={(ev) => updateExpense({ ...expense, name: ev.target.value })}
                                        />
                                        <span className="w-full h-full flex before:content-['#']">
                                            <input
                                                className="w-full h-full placeholder:text-(--hint-color)"

                                                type="text"
                                                name="category"
                                                placeholder="Categoria"
                                                list={`categories-${expense.id}`}
                                                id={`category-${expense.id}`}
                                                value={expense.category}
                                                // onKeyDown={handleRemoveRow}
                                                onChange={(ev) => updateExpense({ ...expense, category: ev.target.value.toUpperCase() })}
                                            />
                                            {categories.length ? (
                                                <datalist id={`categories-${expense.id}`}>
                                                    {categories.map((categ, idx) => <option key={`category-${expense.id}-${idx}`} value={categ} />)}
                                                </datalist>
                                            ) : null}
                                        </span>
                                    </div>
                                    {/* <span className="p-1 border-r border-b">
                                        <time dateTime={getDate(expense.date)} id={`date-${expense.id}`}>
                                            <input
                                                className="text-right w-full h-full"
                                                type="number"
                                                name="day"
                                                id={`day-${expense.id}`}
                                                value={expense.date.getDate()}
                                                onChange={(ev) => updateExpense({ ...expense, date: handleDateInput(+ev.target.value) })}
                                            // onKeyDown={(ev) => {
                                            //   if (ev.key === "Enter" && expenses.length <= (idx + 1)) {
                                            //     ev.preventDefault()
                                            //     //implementar focusNext
                                            //   }
                                            // }}
                                            />
                                        </time>
                                    </span> */}
                                    <span className="p-1 border-b border-r flex before:content-['R$_'] before:text-(--hint-color)">
                                        <input
                                            className="text-right w-full h-full"
                                            type="number"
                                            name="value"
                                            id={`value-${expense.id}`}
                                            value={expense.value}
                                            onChange={(ev) => updateExpense({ ...expense, value: +ev.target.value })}
                                            inputMode="search"
                                            onKeyDown={isLastCell ? (ev) => handleAddRow(ev, { date: expense.date }) : undefined}
                                        />
                                    </span>
                                    <span className="p-1 border-b flex justify-center">
                                        <button
                                            className="block w-1/2 cursor-pointer"
                                            onClick={() => removeExpense(expense.id)}
                                        >
                                            <TrashBin className="fill-(--font-color)" />
                                        </button>
                                    </span>
                                </div>
                            )
                        })}
                        {/* <span className="p-1 col-span-3 border-r text-right">Total</span> */}
                        <span className="p-1 border-r text-right">Total</span>
                        <span className="p-1 flex before:content-['R$_'] before:text-(--hint-color)">
                            <span className="text-right w-full inline-block">{expensesTotal.toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}