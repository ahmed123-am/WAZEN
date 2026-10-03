import { useState } from 'react';
import { Target, Edit2, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function BudgetCard() {
  const { budget, setBudget, totalExpense, currency } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  const percentage = budget > 0 ? Math.min(Math.round((totalExpense / budget) * 100), 100) : 0;
  const isOverBudget = totalExpense > budget;

  const handleSave = () => {
    setBudget(Number(newBudget));
    setIsEditing(false);
  };

  let progressColor = 'bg-[#7D9D64]';
  if (percentage >= 80) progressColor = 'bg-[#D4A373]';
  if (isOverBudget || percentage === 100) progressColor = 'bg-[#BC4749]';

  return (
    <div className="bg-white border border-[#E8DFD5] rounded-2xl p-6 shadow-[0_4px_20px_rgba(140,109,70,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#FAF2EB] text-[#A66E38] rounded-xl border border-[#ECD9C6]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#4A3B2C]">الميزانية الشهرية</h4>
            <p className="text-xs text-[#8C7A6B]">مراقبة سقف المصاريف</p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-24 bg-[#FAF7F2] border border-[#E2D5C5] text-[#4A3B2C] text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="p-1.5 bg-[#7D9D64]/15 text-[#4F772D] rounded-lg"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs text-[#8C7A6B] hover:text-[#4A3B2C] transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>تعديل</span>
          </button>
        )}
      </div>

      <div className="flex justify-between items-end mb-2.5 text-xs text-[#8C7A6B]">
        <span>تم إنفاق: <strong className="text-[#4A3B2C]">{totalExpense.toLocaleString()} {currency}</strong></span>
        <span>الحد: <strong className="text-[#4A3B2C]">{budget.toLocaleString()} {currency}</strong></span>
      </div>

      <div className="w-full bg-[#F4EFEA] rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between items-center text-xs">
        <span className={isOverBudget ? 'text-[#BC4749] font-bold' : 'text-[#8C7A6B]'}>
          {isOverBudget ? 'تجاوزت الميزانية المحددة!' : `${percentage}% مستهلك`}
        </span>
        <span className="text-[#8C7A6B]">
          المتبقي: {Math.max(budget - totalExpense, 0).toLocaleString()} {currency}
        </span>
      </div>
    </div>
  );
}