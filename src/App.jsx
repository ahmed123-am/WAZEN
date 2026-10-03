import { useState } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import CreditCards from './components/CreditCards';
import BudgetCard from './components/BudgetCard';
import ExpenseChart from './components/ExpenseChart';
import TransactionList from './components/TransactionList';
import SavingsGoals from './components/SavingsGoals';
import AddTransactionModal from './components/AddTransactionModal';
import VaultIntro from './components/VaultIntro';
import { FinanceProvider } from './context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FinanceProvider>
      <AnimatePresence>
        {!isUnlocked && <VaultIntro onUnlock={() => setIsUnlocked(true)} />}
      </AnimatePresence>

      <div dir="rtl" className="min-h-screen bg-[#F7F4F0] text-[#4A3B2C] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EBE3D5]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#E0D7C6]/50 rounded-full blur-3xl pointer-events-none" />

        <Navbar onOpenModal={() => setIsModalOpen(true)} />

        {isUnlocked && (
          <motion.main
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-6xl mx-auto px-4 py-8 space-y-6 relative z-10"
          >
            {/* كروت الملخص المالي */}
            <SummaryCards />

            {/* قسم كروت الفيزا والبطاقات البنكية */}
            <CreditCards />

            {/* الميزانية وأهداف الادخار */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BudgetCard />
              <SavingsGoals />
            </div>

            {/* التحليل البياني وقائمة العمليات */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ExpenseChart />
              </div>
              <div className="lg:col-span-2">
                <TransactionList />
              </div>
            </div>
          </motion.main>
        )}

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </FinanceProvider>
  );
}