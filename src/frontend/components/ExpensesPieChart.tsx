import type { Expense } from '@/types';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const emptyChart = [{ name: "EMPTY", value: 1 }]
const emptyCell = <Cell fill="#f3f6f9" />

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatData = (data: Expense[]) => {
    const categories = new Map<string, number>()

    return data.reduce<Record<string, string | number>[]>((acc, exp) => {
        if (exp?.value) {
            if (!exp.category) {
                acc.push({
                    name: exp.name,
                    value: exp.value
                })
            } else {
                const currentValue = categories.get(exp.category) ?? 0;
                categories.set(exp.category, currentValue + exp.value);
            }
        }
        return acc;
    }, []).concat(Array.from(categories.entries()).map(([categ, value]) => {
        return {
            name: categ,
            value: value
        }
    }))
}

export default function ExpensesPieChart({ data }: { data: Expense[] }) {
    const dataToRender = formatData(data)
    // if (dataToRender.length === 0) dataToRender = emptyChart

    return (
        <PieChart
            className="w-full max-h-40 aspect-square *:focus:outline-none!"
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            responsive
        >
            <Pie
                data={dataToRender.length === 0 ? emptyChart : dataToRender}
                dataKey="value"
                nameKey="name"
                // cx="50%"
                // cy="50%"
                fill="#8884d8"
                // label
                isAnimationActive={false}
            >
                {
                    dataToRender.length === 0 ?
                        emptyCell :
                        dataToRender.map((slice, index) => {
                            return (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        })
                }
            </Pie>
            <Tooltip />
        </PieChart>
    );
}

{/* <PieChart
    className="w-full max-h-20 aspect-square *:focus:outline-none"
    responsive={true}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
>
    <Pie
        data={expenses}
        nameKey="name"
        dataKey="value"
        // cx="50%"
        // cy="50%"
        // outerRadius="50%"
        // fill="#8884d8"
        isAnimationActive={false}
    />
</PieChart> */}