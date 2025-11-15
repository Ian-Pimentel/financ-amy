import type { Expense } from "@/types"
import { getDate } from "@/utils"
import { useState, type ChangeEvent } from "react"

type MonthProps = {
    month: string;
    expenses: Expense[];
    handleCellChange: (id: number, prop: keyof Expense, event: ChangeEvent<HTMLInputElement>) => void;
    addExpense: (expense?: Partial<Expense>) => void;
};

export default function MonthComponent({ month, expenses, handleCellChange, addExpense }: MonthProps) {
    const [open, setOpen] = useState(false);

    const expensesTotal = expenses/*.filter(exp => exp.paid)*/.map(exp => exp.value).reduce((prev, curr) => {
        return prev + curr;
    }, 0);

    const handleAddRow = (ev: React.KeyboardEvent<HTMLInputElement>, expense?: Partial<Expense>) => {
        if (ev.key === "Enter" || ev.key === "Tab") {
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
                <div className="grid grid-cols-[1fr_6fr_2fr_2fr]">

                    <span className="p-1 border-r border-b">Pago</span>
                    <span className="p-1 border-r border-b">Gasto</span>
                    <span className="p-1 border-r border-b text-right">Dia</span>
                    <span className="p-1 border-b text-right">Valor</span>


                    {expenses.map(({ id, paid, name, date, value }, idx) => {
                        const isLastCell = (idx + 1) === expenses.length
                        return (
                            <div className="contents" key={id}>
                                <span className="p-1 border-r border-b">
                                    <input
                                        className="w-full"
                                        type="checkbox"
                                        name="paid"
                                        id={`pago-${id}`}
                                        checked={paid}
                                        // value={paid ? "true" : "false"}
                                        onChange={(ev) => handleCellChange(id, "paid", ev)}
                                    />
                                </span>
                                <span className="p-1 border-r border-b">
                                    <input
                                        autoFocus={(idx + 1) === expenses.length && open}
                                        className="w-full"
                                        type="text"
                                        name="name"
                                        id={`name-${id}`}
                                        value={name}
                                        onChange={(ev) => handleCellChange(id, "name", ev)}
                                    />
                                </span>
                                <span className="p-1 border-r border-b">
                                    <time dateTime={getDate(date)} id={`date-${id}`}>
                                        <input
                                            className="text-right w-full"
                                            type="number"
                                            name="day"
                                            id={`day-${id}`}
                                            value={date.getDate()}
                                            onChange={(ev) => handleCellChange(id, "date", ev)}
                                        // onKeyDown={(ev) => {
                                        //   if (ev.key === "Enter" && expenses.length <= (idx + 1)) {
                                        //     ev.preventDefault()
                                        //     //implementar focusNext
                                        //   }
                                        // }}
                                        />
                                    </time>
                                </span>
                                <span className="p-1 border-b">
                                    <input
                                        className="text-right w-full"
                                        type="number"
                                        name="value"
                                        id={`value-${id}`}
                                        value={value}
                                        onChange={(ev) => handleCellChange(id, "value", ev)}
                                        onKeyDown={isLastCell ? (ev) => handleAddRow(ev, { date }) : undefined}
                                    />
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