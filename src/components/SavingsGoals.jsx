import { useState } from 'react';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavingsGoals() {
  const { goals, addGoal, depositToGoal, deleteGoal, currency, balance } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !target) return;
    addGoal({ title, target: Number(target) });
    setTitle('');
    setTarget('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white border border-[#E8DFD5] rounded-2xl p-6 shadow-[0_4px_20px_rgba(140,109,70,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#FAF2EB] text-[#C58940] rounded-xl border border-[#ECD9C6]">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4A3B2C]">أهداف الادخار وحصالتي</h3>
            <p className="text-xs text-[#8C7A6B]">حدد خططك وتابع ما تم توفيره</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 text-xs bg-[#FAF7F2] hover:bg-[#F0E8DC] border border-[#E2D5C5] px-3 py-1.5 rounded-xl text-[#5C4A38] font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>هدف جديد</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-2 mb-4 bg-[#FAF7F2] p-3 rounded-xl border border-[#E2D5C5]"
          >
            <input
              type="text"
              placeholder="اسم الهدف (مثلاً: عمرة، موبايل...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-white border border-[#E2D5C5] px-3 py-1.5 rounded-lg text-xs text-[#4A3B2C] focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="المبلغ المستهدف"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-28 bg-white border border-[#E2D5C5] px-3 py-1.5 rounded-lg text-xs text-[#4A3B2C] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#8C6D46] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7A5E3C] transition"
            >
              إضافة
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {goals.map((g) => {
          const progress = Math.min(Math.round((g.current / g.target) * 100), 100);
          return (
            <motion.div
              layout
              key={g.id}
              className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE5D9] space-y-2"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-[#4A3B2C]">{g.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8C7A6B]">
                    {g.current.toLocaleString()} / {g.target.toLocaleString()} {currency}
                  </span>
                  <button
                    onClick={() => {
                      const amount = prompt(
                        `الرصيد المتاح لديك: (${balance.toLocaleString()} ${currency})\nأدخل المبلغ المراد سحبه وإيداعه في الحصالة:`
                      );
                      if (amount !== null && amount.trim() !== '') {
                        depositToGoal(g.id, amount);
                      }
                    }}
                    className="text-xs bg-[#E8DFD5] text-[#5C4A38] hover:bg-[#DCD0C2] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
                  >
                    + إيداع
                  </button>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-[#B89B72] hover:text-[#BC4749] transition p-1 cursor-pointer"
                    title="حذف الهدف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* شريط التقدم */}
              <div className="w-full bg-[#EFE7DC] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C5A880] to-[#7D9D64] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}