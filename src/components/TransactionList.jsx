import { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function TransactionList() {
  const { transactions, deleteTransaction, currency } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="bg-white border border-[#E8DFD5] rounded-2xl p-6 shadow-[0_4px_20px_rgba(140,109,70,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-base font-bold text-[#4A3B2C]">العمليات المالية</h2>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute right-3 top-3 text-[#A39284]" />
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl pr-9 pl-3 py-2 text-xs text-[#4A3B2C] placeholder-[#A39284] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-[#F0E8DC]">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedType === 'all' ? 'bg-[#8C6D46] text-white' : 'bg-[#FAF7F2] text-[#8C7A6B]'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setSelectedType('income')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedType === 'income' ? 'bg-[#EDF4E5] text-[#4F772D] border border-[#DCE8D0]' : 'bg-[#FAF7F2] text-[#8C7A6B]'
          }`}
        >
          الدخل
        </button>
        <button
          onClick={() => setSelectedType('expense')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedType === 'expense' ? 'bg-[#FDF0ED] text-[#BC4749] border border-[#F5D8D2]' : 'bg-[#FAF7F2] text-[#8C7A6B]'
          }`}
        >
          المصروفات
        </button>

        <div className="mr-auto flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#8C7A6B]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E2D5C5] text-[#5C4A38] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">كل الفئات</option>
            <option value="طعام">طعام</option>
            <option value="تسوق">تسوق</option>
            <option value="فواتير">فواتير</option>
            <option value="مواصلات">مواصلات</option>
            <option value="راتب">راتب</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-[#8C7A6B] text-center py-8 text-xs">لا توجد عمليات تطابق البحث.</p>
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((item) => {
            const isIncome = item.type === 'income';
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE5D9] hover:border-[#D4C3B3] transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      isIncome ? 'bg-[#EDF4E5] text-[#4F772D] border-[#DCE8D0]' : 'bg-[#FDF0ED] text-[#BC4749] border-[#F5D8D2]'
                    }`}
                  >
                    {isIncome ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#4A3B2C] text-xs">{item.title}</h4>
                    <span className="text-[11px] text-[#8C7A6B]">
                      {item.category} • {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-xs tracking-wide ${
                      isIncome ? 'text-[#4F772D]' : 'text-[#BC4749]'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {Number(item.amount).toLocaleString()} {currency}
                  </span>
                  <button
                    onClick={() => deleteTransaction(item.id)}
                    className="p-1 text-[#A39284] hover:text-[#BC4749] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}