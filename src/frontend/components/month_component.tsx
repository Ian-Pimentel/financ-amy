import type { Expense } from "@/types"
import { clamp, daysInMonth, getDate } from "@/utils"
import { useState, type SetStateAction } from "react"
import TrashBin from "./trash_bin";

type MonthProps = {
    month: string;
    expenses: Expense[];
    setExpenses: React.Dispatch<SetStateAction<Expense[]>>;
};

export default function MonthComponent({ month, expenses, setExpenses }: MonthProps) {
    const [open, setOpen] = useState(false);

    const expensesTotal = expenses/*.filter(exp => exp.paid)*/.map(exp => exp.value).reduce((prev, curr) => {
        return prev + curr;
    }, 0);

    const getExpense = (id: number) => {
        return { ...expenses.find(expense => expense.id === id) }
    };

    const addExpense = (expense?: Partial<Expense>) => {
        setExpenses([
            ...expenses,
            {
                paid: false, name: '',
                date: new Date,
                value: 0,
                ...expense,
                id: expenses.length + 1,
            },
        ]);
    };

    const updateExpense = (fieldsToUpdate: Partial<Expense>) => {
        console.log(fieldsToUpdate.name)

        if (!fieldsToUpdate.id || !getExpense(fieldsToUpdate.id)) {
            addExpense(fieldsToUpdate)
            return
        }
        const newExpenses = expenses.map(expense => {
            if (fieldsToUpdate.id === expense.id) {
                return {
                    ...expense,
                    ...fieldsToUpdate,
                }
            }
            return expense;
        });
        setExpenses(newExpenses);
    };

    const removeExpense = (id: number) => {
        setExpenses(expenses.filter(expense => expense.id !== id))
    }

    const handleAddRow = (ev: React.KeyboardEvent<HTMLInputElement>, expense?: Partial<Expense>) => {
        if ( ev.key === "Enter" || (!ev.shiftKey && ev.key === "Tab")) {
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



    return (
        <div>
            <div tabIndex={0} className="flex cursor-pointer" onClick={toggleOpen} onKeyUp={handleOpen}>
                <div className={`${open && "rotate-90"} align-middle`}>{">"}</div>
                <div>{month}</div>
            </div>
            {open && (
                <div className="grid grid-cols-[1fr_6fr_2fr_2fr_1fr]">

                    <span className="p-1 border-r border-b">Pago</span>
                    <span className="p-1 border-r border-b">Gasto</span>
                    <span className="p-1 border-r border-b text-right">Dia</span>
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
                                <span className="p-1 border-r border-b">
                                    <input
                                        className="w-full"
                                        type="checkbox"
                                        name="paid"
                                        id={`pago-${expense.id}`}
                                        checked={expense.paid}
                                        // value={paid ? "true" : "false"}
                                        onChange={(ev) => updateExpense({ ...expense, paid: ev.target.checked })}
                                    />
                                </span>
                                <span className="p-1 border-r border-b">
                                    <input
                                        autoFocus={(idx + 1) === expenses.length && open}
                                        className="w-full"
                                        type="text"
                                        name="name"
                                        id={`name-${expense.id}`}
                                        value={expense.name}
                                        onChange={(ev) => updateExpense({ ...expense, name: ev.target.value })}
                                    />
                                </span>
                                <span className="p-1 border-r border-b">
                                    <time dateTime={getDate(expense.date)} id={`date-${expense.id}`}>
                                        <input
                                            className="text-right w-full"
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
                                </span>
                                <span className="p-1 border-b border-r">
                                    <input
                                        className="text-right w-full"
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
                                        className="block w-1/2 md:w-1/4"
                                        onClick={() => removeExpense(expense.id)}
                                    >
                                        <TrashBin className="fill-(--font-color) " preserveAspectRatio='none' />
                                    </button>
                                </span>
                            </div>
                        )
                    })}
                    <span className="p-1 col-span-3 border-r text-right">Total</span>
                    <span className="p-1 text-right">{expensesTotal.toFixed(2)}</span>
                </div>
            )}
        </div>
    );
}