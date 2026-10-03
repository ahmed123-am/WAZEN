import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // 1. المعاملات المالية
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. الميزانية الشهرية
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('monthly_budget');
    return saved ? Number(saved) : 5000;
  });

  // 3. العملة
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'ج.م';
  });

  // 4. أهداف الادخار وحصالتي
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('savings_goals');
    return saved
      ? JSON.parse(saved)
      : [
          { id: '1', title: 'شراء لابتوب جديد', target: 25000, current: 8000 },
        ];
  });

  // 5. البطاقات البنكية
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('bank_cards');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            cardHolder: 'محمد أحمد',
            cardNumber: '4123 4567 8901 2345',
            expiryDate: '12/28',
            cardType: 'visa',
            bankName: 'البنك الأهلي',
            balance: 10000,
          },
        ];
  });

  // حفظ التغييرات تلقائياً في localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('monthly_budget', budget.toString());
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('savings_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('bank_cards', JSON.stringify(cards));
  }, [cards]);

  // دوال المعاملات
  const addTransaction = (t) => {
    setTransactions((prev) => [{ ...t, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // دوال البطاقات
  const addCard = (card) => {
    setCards((prev) => [
      { ...card, id: Date.now().toString(), balance: Number(card.balance || 0) },
      ...prev,
    ]);
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  // حسابات الإجماليات
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  // دوال أهداف الادخار (مع السحب من الرصيد المتاح)
  const addGoal = (g) => {
    setGoals((prev) => [
      { ...g, id: Date.now().toString(), current: 0 },
      ...prev,
    ]);
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const depositToGoal = (id, amount) => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح!');
      return false;
    }

    if (numericAmount > balance) {
      alert(
        `عفواً، الرصيد المتاح الحالي (${balance.toLocaleString()} ${currency}) لا يكفي لإيداع ${numericAmount.toLocaleString()} ${currency}`
      );
      return false;
    }

    const targetGoal = goals.find((g) => g.id === id);
    if (!targetGoal) return false;

    // 1. زيادة المبلغ في الحصالة
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, current: Math.min(g.current + numericAmount, g.target) }
          : g
      )
    );

    // 2. تسجيل معاملة خصم تسحب من الرصيد المتاح فوراً
    addTransaction({
      title: `ادخار لحساب: ${targetGoal.title}`,
      amount: numericAmount,
      type: 'expense',
      category: 'ادخار',
      date: new Date().toISOString().split('T')[0],
    });

    return true;
  };

  // الدفع بالفيزا وخصم رصيد البطاقة
  const payWithCard = (cardId, amount, title, category) => {
    const selectedCard = cards.find((c) => c.id === cardId);
    if (!selectedCard) return { success: false, msg: 'البطاقة غير موجودة' };
    if (selectedCard.balance < Number(amount)) {
      return { success: false, msg: 'عفواً، رصيد البطاقة غير كافٍ لإتمام الدفع!' };
    }

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, balance: c.balance - Number(amount) } : c
      )
    );

    addTransaction({
      title: `${title} (دفع فيزا: ${selectedCard.bankName})`,
      amount: Number(amount),
      type: 'expense',
      category: category || 'أخرى',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'visa',
    });

    return { success: true };
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        budget,
        setBudget,
        currency,
        setCurrency,
        goals,
        addGoal,
        depositToGoal,
        deleteGoal,
        cards,
        addCard,
        deleteCard,
        payWithCard,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);