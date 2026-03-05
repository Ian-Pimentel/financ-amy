import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import ModalDialog from "./ModalDialog";
import { getDate } from '@/utils';
import TrashBin from './TrashbinIcon';

const fixedExpenses = [
    {
        id: uuidv4(),
        name: 'aaa',
        initDate: new Date(),
        endDate: new Date()
    },
    {
        id: uuidv4(),
        name: 'bbb',
        initDate: new Date(),
        endDate: new Date()
    },
    {
        id: uuidv4(),
        name: 'ccc',
        initDate: new Date(),
        endDate: new Date()
    },
]

export default function FixedExpensesModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className="border rounded p-1 cursor-pointer">Gastos fixos</button>
            <ModalDialog isOpen={isOpen}>
                <div className="w-[85vw] md:w-[50vw] p-1">
                    <button type="button">Novo Gasto Fixo</button>
                    <div className="grid grid-cols-[1fr_auto_min-content]">
                        <span className="p-1 border-r border-b">Gasto</span>
                        {/* <span className="p-1 border-r border-b text-right">Data Início</span> */}
                        <span className="p-1 border-r border-b text-right">Data Fim</span>
                        <span className="p-1 border-b text-center">Ações</span>

                        {fixedExpenses.map((expense, idx) => {
                            return (
                                <div className="contents" key={idx}>
                                    <span className="p-1 border-r border-b w-full h-full">
                                        {expense.name}
                                    </span>
                                    {/* <span className="p-1 border-r border-b w-full h-full text-right">
                                        {getDate(expense.initDate)}
                                    </span> */}
                                    <span className="p-1 border-r border-b w-full h-full text-right">
                                        {getDate(expense.endDate)}
                                    </span>
                                    <span className="p-1 border-b flex justify-center">
                                        <button className="block w-1/2 cursor-pointer">
                                            <TrashBin className="fill-(--font-color)" />
                                        </button>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <button type="button" onClick={() => setIsOpen(false)}>Fechar</button>
                </div>
            </ModalDialog>
        </>

    );
}