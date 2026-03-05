export type Expense = {
    readonly id: string;
    paid: boolean;
    name: string;
    category: string;
    date: Date;
    value: number;
};