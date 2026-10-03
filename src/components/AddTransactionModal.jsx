import { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('طعام');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addTransaction({
      title,
      amount: Number(amount),
      type,
      category,
      date,
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-5">إضافة معاملة مالية</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نوع المعاملة */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-sm font-semibold rounded-xl border transition ${
                type === 'expense'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              مصروف
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-sm font-semibold rounded-xl border transition ${
                type === 'income'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              دخل
            </button>
          </div>

          {/* العنوان */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">بيان المعاملة</label>
            <input
              type="text"
              placeholder="مثال: فاتورة كهرباء، مرتب..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* المبلغ والتصنيف */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">المبلغ (ج.م)</label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="طعام">طعام</option>
                <option value="تسوق">تسوق</option>
                <option value="فواتير">فواتير</option>
                <option value="مواصلات">مواصلات</option>
                <option value="راتب">راتب</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
          </div>

          {/* التاريخ */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">التاريخ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition cursor-pointer"
          >
            حفظ المعاملة
          </button>
        </form>
      </div>
    </div>
  );
}