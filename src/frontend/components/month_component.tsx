import { v4 as uuidv4 } from 'uuid'
import type { Expense } from "@/types"
import { clamp, daysInMonth, getDate, months } from "@/utils"
import { useState, type SetStateAction } from "react"
import TrashBin from "./trash_bin";
import ExpensesPieChart from './expenses_pie_chart';

type MonthProps = {
    month: string;
    expenses: Expense[];
    salary: number;
    setExpenses: React.Dispatch<SetStateAction<Expense[]>>;
};

// const currency = <span className='text-(--hint-color)'>R$</span>;

export default function MonthComponent({ month, expenses, salary, setExpenses }: MonthProps) {
    const [open, setOpen] = useState(month === months[(new Date).getMonth()]);
    console.log(month, months[(new Date).getMonth()])

    const expensesTotal = expenses/*.filter(exp => exp.paid)*/.map(exp => exp.value).reduce((prev, curr) => {
        return prev + curr;
    }, 0);

    const getExpense = (id: string) => {
        return expenses.find(expense => expense.id === id)
    };

    const addExpense = (expense?: Partial<Expense>) => {
        setExpenses([
            ...expenses,
            {
                paid: false, name: '',
                date: new Date,
                value: 0,
                ...expense,
                category: "",
                id: uuidv4(),
            },
        ]);
    };

    const updateExpense = (fieldsToUpdate: Partial<Expense>) => {
        // if (!fieldsToUpdate.id || !getExpense(fieldsToUpdate.id)) {
        //     addExpense(fieldsToUpdate)
        //     return
        // }

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

    const removeExpense = (id: string) => {
        setExpenses(expenses.filter(expense => expense.id !== id))
    }

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

    return (
        <div>
            <div tabIndex={0} className="flex cursor-pointer" onClick={toggleOpen} onKeyUp={handleOpen}>
                <div className={`${open && "rotate-90"} align-middle`}>{">"}</div>
                <div className='grow'>{month}</div>
                <div className="text-right before:content-['R$_'] before:text-(--hint-color)">{(salary - expensesTotal).toFixed(2)}</div>
            </div>
            {open && (
                <div>
                    <ExpensesPieChart data={expenses} />
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
                                            className="w-full h-full"
                                            type="checkbox"
                                            name="paid"
                                            id={`pago-${expense.id}`}
                                            checked={expense.paid}
                                            // value={paid ? "true" : "false"}
                                            onChange={(ev) => updateExpense({ ...expense, paid: ev.target.checked })}
                                        />
                                    </span>
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
                                            className="w-full h-full"
                                            
                                            type="text"
                                            name="category"
                                            placeholder="Digite a categoria do gasto"
                                            list="expense-catogries"
                                            id={`category-${expense.id}`}
                                            value={expense.category}
                                            // onKeyDown={handleRemoveRow}
                                            onChange={(ev) => updateExpense({ ...expense, category: ev.target.value.toUpperCase() })}
                                        />
                                        </span>
                                    </div>
                                    <span className="p-1 border-r border-b">
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
                                    </span>
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
                                            className="block w-1/2 md:w-1/4 lg:w-1/5"
                                            onClick={() => removeExpense(expense.id)}
                                        >
                                            <TrashBin className="fill-(--font-color)" />
                                        </button>
                                    </span>
                                </div>
                            )
                        })}
                        <span className="p-1 col-span-3 border-r text-right">Total</span>
                        <span className="p-1 text-right col-span-2 flex justify-start gap-1">
                            <span className="before:content-['R$_'] before:text-(--hint-color)">{expensesTotal.toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}