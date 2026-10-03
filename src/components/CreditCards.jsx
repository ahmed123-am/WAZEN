import { useState } from 'react';
import { CreditCard, Plus, Trash2, Wifi, ShoppingBag } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreditCards() {
  const { cards, addCard, deleteCard, payWithCard, currency } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPayCard, setSelectedPayCard] = useState(null);

  // فورم إضافة كارت
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [bankName, setBankName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  // فورم الدفع
  const [payTitle, setPayTitle] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payCategory, setPayCategory] = useState('تسوق');

  const handleNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(raw.replace(/(\d{4})/g, '$1 ').trim());
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setExpiryDate(raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiryDate) return;

    addCard({
      cardHolder,
      cardNumber,
      expiryDate,
      bankName: bankName || 'البنك المعتمد',
      balance: Number(initialBalance) || 0,
      cardType: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
    });

    setCardHolder('');
    setCardNumber('');
    setExpiryDate('');
    setBankName('');
    setInitialBalance('');
    setShowAddModal(false);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!payTitle || !payAmount) return;

    const res = payWithCard(selectedPayCard.id, payAmount, payTitle, payCategory);
    if (!res.success) {
      alert(res.msg);
      return;
    }

    setPayTitle('');
    setPayAmount('');
    setSelectedPayCard(null);
  };

  return (
    <div className="bg-white border border-[#E8DFD5] rounded-2xl p-6 shadow-[0_4px_20px_rgba(140,109,70,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#FAF2EB] text-[#8C6D46] rounded-xl border border-[#ECD9C6]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4A3B2C]">البطاقات وحسابات الدفع</h3>
            <p className="text-xs text-[#8C7A6B]">الدفع الإلكتروني وتتبع رصيد الكروت</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-xs bg-[#FAF7F2] hover:bg-[#F0E8DC] border border-[#E2D5C5] px-3 py-1.5 rounded-xl text-[#5C4A38] font-bold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة كارت</span>
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-8 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#E2D5C5]">
          <p className="text-[#8C7A6B] text-xs">لا توجد بطاقات مضافة حتى الآن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c) => (
            <motion.div
              layout
              key={c.id}
              whileHover={{ y: -3 }}
              className="relative p-5 rounded-2xl bg-gradient-to-tr from-[#362D24] via-[#4A3B2C] to-[#68533E] text-white shadow-xl overflow-hidden border border-[#A88863]/30 min-h-[210px] flex flex-col justify-between"
            >
              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-xs font-medium tracking-wide text-[#E8DFD5]">{c.bankName}</span>
                  <div className="text-[11px] text-[#D9C4A6] mt-0.5">
                    الرصيد: <strong className="text-white">{(c.balance || 0).toLocaleString()} {currency}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#D9C4A6] rotate-90" />
                  <button
                    onClick={() => deleteCard(c.id)}
                    className="text-[#D9C4A6]/60 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* شريحة الكارت وزر الدفع */}
              <div className="flex justify-between items-center my-1 z-10">
                <div className="w-10 h-7 bg-gradient-to-br from-[#E6C687] via-[#D4AF37] to-[#AA8238] rounded-md border border-[#F3E5AB] flex items-center justify-center">
                  <div className="w-8 h-4 border border-[#8C6D46]/40 rounded-sm" />
                </div>

                <button
                  onClick={() => setSelectedPayCard(c)}
                  className="flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-white text-[#4A3B2C] px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8C6D46]" />
                  <span>دفع بالفيزا</span>
                </button>
              </div>

              <div className="dir-ltr text-left tracking-[0.2em] font-mono text-base font-semibold text-[#F7F4F0] my-1">
                {c.cardNumber}
              </div>

              <div className="flex justify-between items-end z-10 pt-1">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#C5A880]">Card Holder</span>
                  <span className="text-xs font-semibold tracking-wide text-white">{c.cardHolder}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#C5A880]">Expires</span>
                    <span className="text-xs font-mono text-white">{c.expiryDate}</span>
                  </div>
                  <span className="font-extrabold italic text-sm tracking-wider text-[#FAF7F2] border-t-2 border-[#D4AF37] pt-0.5">
                    {c.cardType === 'visa' ? 'VISA' : 'Mastercard'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* نافذة دفع سريع بالفيزا */}
      <AnimatePresence>
        {selectedPayCard && (
          <div className="fixed inset-0 bg-[#362D24]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E8DFD5] w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-base font-bold text-[#4A3B2C] mb-2">إجراء دفع إلكتروني</h3>
              <p className="text-xs text-[#8C7A6B] mb-4">
                الدفع عبر: <strong>{selectedPayCard.bankName}</strong> ({selectedPayCard.cardNumber.slice(-4)}****)
              </p>

              <form onSubmit={handlePaySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#8C7A6B] mb-1">اسم المعاملة / المتجر</label>
                  <input
                    type="text"
                    placeholder="مثال: أمازون، مطعم، تجديد اشتراك..."
                    value={payTitle}
                    onChange={(e) => setPayTitle(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-[#8C7A6B] mb-1">المبلغ ({currency})</label>
                    <input
                      type="number"
                      placeholder="0"
                      min="1"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8C7A6B] mb-1">التصنيف</label>
                    <select
                      value={payCategory}
                      onChange={(e) => setPayCategory(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-2.5 py-2 text-xs text-[#4A3B2C] focus:outline-none"
                    >
                      <option value="تسوق">تسوق</option>
                      <option value="طعام">طعام</option>
                      <option value="فواتير">فواتير</option>
                      <option value="مواصلات">مواصلات</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#4F772D] hover:bg-[#3E5F23] text-white font-bold rounded-xl text-xs transition"
                  >
                    تأكيد الدفع والخصم
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayCard(null)}
                    className="px-4 py-2 border border-[#E2D5C5] text-[#8C7A6B] rounded-xl text-xs font-semibold hover:bg-[#FAF7F2]"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة بطاقة جديدة */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-[#362D24]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-[#E8DFD5] w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-base font-bold text-[#4A3B2C] mb-4">إضافة بطاقة جديدة</h3>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#8C7A6B] mb-1">اسم البنك</label>
                  <input
                    type="text"
                    placeholder="مثال: البنك الأهلي، CIB..."
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8C7A6B] mb-1">اسم صاحب البطاقة</label>
                  <input
                    type="text"
                    placeholder="الاسم المطبوع على البطاقة"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-[#8C7A6B] mb-1">رقم البطاقة</label>
                    <input
                      type="text"
                      placeholder="16 رقم"
                      value={cardNumber}
                      onChange={handleNumberChange}
                      className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] font-mono focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8C7A6B] mb-1">رصيد البدء ({currency})</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#8C7A6B] mb-1">تاريخ الانتهاء (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full bg-[#FAF7F2] border border-[#E2D5C5] rounded-xl px-3 py-2 text-xs text-[#4A3B2C] font-mono focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#8C6D46] hover:bg-[#7A5E3C] text-white font-bold rounded-xl text-xs transition"
                  >
                    حفظ البطاقة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-[#E2D5C5] text-[#8C7A6B] rounded-xl text-xs font-semibold hover:bg-[#FAF7F2]"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}