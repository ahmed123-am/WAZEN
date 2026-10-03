import { Scale, PlusCircle, Download, FileText } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Navbar({ onOpenModal }) {
  const { transactions, totalIncome, totalExpense, balance, currency, setCurrency } = useFinance();

  const exportToCSV = () => {
    if (transactions.length === 0) return alert('No transactions to export');
    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.title}"`,
      t.amount,
      t.type,
      t.category,
      t.date,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `wazen-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    if (transactions.length === 0) return alert('No transactions to export');
    const doc = new jsPDF();
    doc.text('Wazen - Financial Report', 14, 15);
    doc.text(
      `Balance: ${balance} ${currency} | Income: ${totalIncome} | Expenses: ${totalExpense}`,
      14,
      25
    );
    autoTable(doc, {
      head: [['Title', 'Amount', 'Type', 'Category', 'Date']],
      body: transactions.map((t) => [
        t.title,
        `${t.amount} ${currency}`,
        t.type,
        t.category,
        t.date,
      ]),
      startY: 32,
    });
    doc.save(`wazen-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#E8DFD5] sticky top-0 z-40 transition-colors shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF2EB] text-[#8C6D46] rounded-xl border border-[#ECD9C6]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-wide text-[#4A3B2C] leading-tight">WAZEN</h1>
            <p className="text-[11px] text-[#8C7A6B]">Smart Wealth & Balance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E2D5C5] text-[#5C4A38] text-xs rounded-xl px-2.5 py-2 focus:outline-none"
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="EGP">EGP</option>
            <option value="SAR">SAR</option>
          </select>

          <button
            onClick={exportToPDF}
            title="Download PDF Report"
            className="p-2 rounded-xl border border-[#E2D5C5] bg-[#FAF7F2] hover:bg-[#F0E8DC] text-[#7A5A36] transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={exportToCSV}
            title="Export CSV"
            className="p-2 rounded-xl border border-[#E2D5C5] bg-[#FAF7F2] hover:bg-[#F0E8DC] text-[#5B7052] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 bg-[#8C6D46] hover:bg-[#7A5E3C] text-white font-semibold px-4 py-2 rounded-xl transition text-sm shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
}