import { ArrowDownCircle, ArrowUpCircle, WalletCards } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';

export default function SummaryCards() {
  const { balance, totalIncome, totalExpense, currency } = useFinance();

  const cards = [
    {
      title: 'الرصيد المتاح',
      amount: balance,
      icon: WalletCards,
      textColor: 'text-[#4A3B2C]',
      iconColor: 'text-[#8C6D46] bg-[#F4EFEA] border-[#E2D5C5]',
    },
    {
      title: 'إجمالي الدخل',
      amount: totalIncome,
      icon: ArrowUpCircle,
      textColor: 'text-[#4F772D]',
      iconColor: 'text-[#4F772D] bg-[#EDF4E5] border-[#DCE8D0]',
      prefix: '+',
    },
    {
      title: 'إجمالي المصروفات',
      amount: totalExpense,
      icon: ArrowDownCircle,
      textColor: 'text-[#BC4749]',
      iconColor: 'text-[#BC4749] bg-[#FDF0ED] border-[#F5D8D2]',
      prefix: '-',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-white border border-[#E8DFD5] shadow-[0_4px_20px_rgba(140,109,70,0.04)] flex items-center justify-between"
          >
            <div>
              <p className="text-[#8C7A6B] text-xs font-medium mb-1.5">{c.title}</p>
              <h3 className={`text-2xl font-bold ${c.textColor} tracking-tight`}>
                {c.prefix || ''}{Number(c.amount).toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#A39284]">{currency}</span>
              </h3>
            </div>
            <div className={`p-3.5 rounded-2xl border ${c.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}