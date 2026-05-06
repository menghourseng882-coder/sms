import React, { useState } from "react";
import { useApp } from "../App";
import { 
  Plus, 
  Search, 
  CreditCard, 
  Trash2, 
  Filter,
  CheckCircle2,
  XCircle,
  QrCode,
  FileText,
  DollarSign,
  Download,
  Calendar,
  X,
  ArrowRightLeft // Added
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Payment, Student, Invoice } from "../types";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

export default function Payments() {
  const { db, syncDb } = useApp();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth());
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [amount, setAmount] = useState(60000);
  const [currency, setCurrency] = useState<"KHR" | "USD">("KHR");
  const [note, setNote] = useState("");

  const months = [
    "មករា (January)", "កុម្ភៈ (February)", "មីនា (March)", "មេសា (April)", 
    "ឧសភា (May)", "មិថុនា (June)", "កក្កដា (July)", "សីហា (August)", 
    "កញ្ញា (September)", "តុលា (October)", "វិច្ឆិកា (November)", "ធ្នូ (December)"
  ];

  const quickAmounts = [100000, 80000, 70000, 60000];

  const filteredPayments = db.payments.filter(p => {
    const student = db.students.find(s => s.id === p.studentId);
    const matchesSearch = student?.nameKh.toLowerCase().includes(search.toLowerCase()) || 
                         student?.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = p.month === monthFilter;
    const matchesYear = p.year === yearFilter;
    return matchesSearch && matchesMonth && matchesYear;
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = db.students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const paymentId = Math.random().toString(36).substr(2, 9);
    const newPayment: Payment = {
      id: paymentId,
      studentId: selectedStudentId,
      classId: student.classId,
      month: monthFilter,
      year: yearFilter,
      amount,
      currency,
      status: "paid",
      paymentDate: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      notes: note
    };

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      paymentId: paymentId,
      qrCodeData: `https://edupay.app/invoice/${paymentId}`,
      createdAt: new Date().toISOString(),
      editHistory: []
    };

    syncDb({ 
      ...db, 
      payments: [...db.payments, newPayment],
      invoices: [...db.invoices, newInvoice]
    });
    
    setIsModalOpen(false);
    setSelectedStudentId("");
    setNote("");
    
    // Auto navigate to invoice view
    navigate(`/invoice/${newInvoice.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ការបង់ប្រាក់ & វិកយបត្រ</h1>
          <p className="text-gray-500">គ្រប់គ្រងការបង់ថ្លៃសិក្សាប្រចាំខែរបស់សិស្ស</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-200"
        >
          <CreditCard size={20} />
          <span>បង្កើតវិកយបត្រ</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="relative flex-1 w-full">
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">ស្វែងរកសិស្ស</label>
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
              type="text" 
              placeholder="ស្វែងរកតាមឈ្មោះសិស្ស..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
             />
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:w-48">
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">ខែ</label>
            <select 
              value={monthFilter}
              onChange={(e) => setMonthFilter(parseInt(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 lg:w-32">
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">ឆ្នាំ</label>
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 italic">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">សិស្ស / ថ្នាក់</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">វិកយបត្រ #</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">ចំនួនទឹកប្រាក់</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">ស្ថានភាព</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPayments.map((payment) => {
              const student = db.students.find(s => s.id === payment.studentId);
              const className = db.classes.find(c => c.id === payment.classId)?.name || "-";
              const invoiceId = db.invoices.find(inv => inv.paymentId === payment.id)?.id;
              
              return (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{student?.nameKh}</p>
                    <p className="text-xs text-gray-500">{className}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{payment.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-blue-600">
                      {payment.amount.toLocaleString()} {payment.currency === "USD" ? "$" : "៛"}
                    </p>
                    <p className="text-[10px] text-gray-400">{format(new Date(payment.paymentDate), "dd MMM yyyy")}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                      <CheckCircle2 size={12} />
                      <span>បង់រួច</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <Link 
                        to={`/invoice/${invoiceId}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-none hover:shadow-md transition-all tooltip"
                        title="មើលវិកយបត្រ"
                       >
                         <FileText size={18} />
                       </Link>
                       <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-white rounded-lg shadow-none hover:shadow-md transition-all">
                         <Download size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-20 px-4">
            <CreditCard size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">មិនទាន់មានការបង់ប្រាក់</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              ការបង់ប្រាក់សម្រាប់សិស្សក្នុងខែនេះ មិនទាន់ត្រូវបានកត់ត្រានៅឡើយទេ។ ចាប់ផ្តើមដោយការបង្កើតវិកយបត្រថ្មី។
            </p>
          </div>
        )}
      </div>

      {/* Create Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <form onSubmit={handleCreatePayment} className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <CreditCard size={24} />
                    </div>
                    វិកយបត្រថ្មី
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                    <X size={28} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 italic">សូមជ្រើសរើសសិស្ស *</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        required
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium appearance-none"
                      >
                        <option value="">-- បញ្ជីឈ្មោះសិស្សសកម្ម --</option>
                        {db.students.filter(s => s.active).map(s => {
                           const teacherName = db.classes.find(c => c.id === s.classId)?.name;
                           return <option key={s.id} value={s.id}>{s.nameKh} ({s.nameEn}) - គ្រូ: {teacherName}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 italic">សម្រាប់ខែ</label>
                      <select 
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(parseInt(e.target.value))}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      >
                        {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 italic">ឆ្នាំសិក្សា</label>
                      <select 
                        value={yearFilter}
                        onChange={(e) => setYearFilter(parseInt(e.target.value))}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      >
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                     <label className="block text-sm font-bold text-blue-600 mb-4 italic">ទឹកប្រាក់ដែលត្រូវបង់</label>
                     <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                          <input 
                            required
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full pl-6 pr-12 py-5 rounded-2xl bg-white border-2 border-blue-100 text-2xl font-black text-blue-600 focus:ring-4 focus:ring-blue-200/20 outline-none transition-all"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                             <button 
                                type="button"
                                onClick={() => setCurrency("KHR")}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${currency === "KHR" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                             >៛</button>
                             <button 
                                type="button"
                                onClick={() => setCurrency("USD")}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${currency === "USD" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                             >$</button>
                          </div>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {quickAmounts.map(a => (
                          <button 
                            key={a}
                            type="button" 
                            onClick={() => setAmount(a)}
                            className="bg-white/80 hover:bg-white px-4 py-2 rounded-xl text-xs font-bold text-blue-600 border border-blue-100 transition-all hover:shadow-sm"
                          >
                            {a.toLocaleString()}{currency === "USD" ? "$" : "៛"}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 italic">កំណត់ចំណាំបន្ថែម</label>
                    <textarea 
                      rows={2}
                      placeholder="ឧទាហរណ៍: បញ្ចុះតម្លៃ 10%..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-all"
                  >
                    បោះបង់
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-bold shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
                  >
                    <span>បង្កើត និងចេញវិកយបត្រ</span>
                    <ArrowRightLeft size={18} />
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
