import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpenseChart() {
  const { transactions } = useFinance();

  // تجميع المصروفات فقط حسب الفئة
  const expenseData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += Number(curr.amount);
      } else {
        acc.push({ name: curr.category, value: Number(curr.amount) });
      }
      return acc;
    }, []);

  if (expenseData.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-80">
        <h3 className="text-lg font-bold text-white mb-2">توزيع المصروفات</h3>
        <p className="text-slate-400 text-sm">أضف بعض المصروفات ليتم رسم التحليل البياني هنا.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">توزيع المصروفات حسب الفئات</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {expenseData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${Number(value).toLocaleString()} ج.م`}
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}