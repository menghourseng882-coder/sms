import { useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../App";
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Search,
  Calendar,
  CreditCard,
  User,
  GraduationCap,
  History,
  Edit3
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceView() {
  const { id } = useParams();
  const { db } = useApp();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoice = db.invoices.find(inv => inv.id === id);
  const payment = db.payments.find(p => p.id === invoice?.paymentId);
  const student = db.students.find(s => s.id === payment?.studentId);
  const studentClass = db.classes.find(c => c.id === payment?.classId);

  if (!invoice || !payment || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <Search size={64} className="text-gray-200 mb-4" />
         <h2 className="text-xl font-bold text-gray-900">រកមិនឃើញវិកយបត្រ</h2>
         <p className="text-gray-500 mt-2">វិកយបត្រដែលអ្នកកំពុងស្វែងរក ប្រហែលជាត្រូវបានលុប ឬមិនមានក្នុងប្រព័ន្ធ។</p>
         <Link to="/payments" className="mt-6 text-blue-600 font-bold hover:underline flex items-center gap-2">
            <ChevronLeft size={18} />
            ត្រឡប់ទៅការបង់ប្រាក់
         </Link>
      </div>
    );
  }

  const exportPDF = async () => {
    if (!invoiceRef.current) return;
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice-${payment.invoiceNumber}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const months = [
    "មករា (Jan)", "កុម្ភៈ (Feb)", "មីនា (Mar)", "មេសា (Apr)", 
    "ឧសភា (May)", "មិថុនា (Jun)", "កក្កដា (Jul)", "សីហា (Aug)", 
    "កញ្ញា (Sep)", "តុលា (Oct)", "វិច្ឆិកា (Nov)", "ធ្នូ (Dec)"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between no-print">
        <button 
          onClick={() => navigate("/payments")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
        >
          <ChevronLeft size={20} />
          <span>ត្រឡប់ក្រោយ</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={18} />
            <span>រក្សាទុក (PDF)</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Printer size={18} />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden print:shadow-none print:border-none"
      >
        <div ref={invoiceRef} className="p-8 lg:p-16 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-gray-100 pb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">E</div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">EduPay Invoice</h1>
              </div>
              <p className="text-gray-500 max-w-xs font-medium italic">
                ប្រព័ន្ធគ្រប់គ្រងសាលារៀន និងការបង់ប្រាក់សិស្ស <br/>
                រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា
              </p>
            </div>
            <div className="text-right">
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs mb-4">
                <CheckCircle2 size={16} />
                <span>បានបង់រួច (Paid)</span>
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">លេខវិកយបត្រ / Invoice No.</p>
              <p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">{payment.invoiceNumber}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest border-l-4 border-blue-600 pl-3">ព័ត៌មានសិស្ស / Student Info</p>
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-400" />
                      <div>
                        <p className="text-lg font-black text-gray-900 leading-none">{student.nameKh}</p>
                        <p className="text-sm text-gray-500 font-mono italic uppercase">{student.nameEn}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <GraduationCap size={18} className="text-gray-400" />
                      <p className="font-bold text-gray-700">{studentClass?.name} - {studentClass?.grade}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest border-l-4 border-emerald-600 pl-3">ព័ត៌មានការបង់ប្រាក់ / Payment Info</p>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-gray-700">
                      <Calendar size={18} className="text-gray-400" />
                      <p className="font-bold">បង់សម្រាប់ខែ: <span className="text-blue-600">{months[payment.month]}, {payment.year}</span></p>
                   </div>
                   <div className="flex items-center gap-3 text-gray-700">
                      <CreditCard size={18} className="text-gray-400" />
                      <p className="font-bold">កាលបរិច្ឆេទ: <span className="text-gray-900">{format(new Date(payment.paymentDate), "dd MMMM yyyy")}</span></p>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-[2rem] p-8 space-y-6 border border-gray-100">
               <div className="p-4 bg-white rounded-3xl shadow-xl shadow-blue-100/50">
                <QRCodeSVG value={invoice.qrCodeData} size={160} level="H" includeMargin />
               </div>
               <div className="text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">ស្កែនដើម្បីផ្ទៀងផ្ទាត់ / Scan to verify</p>
                  <p className="text-[10px] text-gray-300 font-mono break-all max-w-[200px]">{id}</p>
               </div>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-6">
             <div className="overflow-hidden rounded-3xl border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-900 text-white font-sans uppercase text-[10px] tracking-[0.2em] font-black">
                      <th className="px-8 py-5">បរិយាយ / Description</th>
                      <th className="px-8 py-5 text-right">តម្លៃ / Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="px-8 py-8 border-b border-gray-50">
                        <p className="text-lg font-black text-gray-900">ថ្លៃសិក្សាប្រចាំខែ (Monthly Tuition Fee)</p>
                        <p className="text-sm text-gray-500 italic mt-1 underline underline-offset-4 decoration-blue-100">ខែ {months[payment.month]} - ឆ្នាំ {payment.year}</p>
                        {payment.notes && <p className="text-xs text-blue-500 mt-3 font-medium italic">* {payment.notes}</p>}
                      </td>
                      <td className="px-8 py-8 text-right border-b border-gray-50 font-black text-xl text-gray-900">
                        {payment.amount.toLocaleString()} {payment.currency === "USD" ? "$" : "៛"}
                      </td>
                    </tr>
                    <tr className="bg-blue-50/30">
                       <td className="px-8 py-8 text-right font-black text-gray-400 uppercase text-xs tracking-widest">
                          សរុបអត្តប្បន្ន / Total Amount Paid
                       </td>
                       <td className="px-8 py-8 text-right text-3xl font-black text-blue-600">
                          {payment.amount.toLocaleString()} {payment.currency === "USD" ? "$" : "៛"}
                       </td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>

          {/* Footer Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-dashed border-gray-200">
             <div className="text-center md:text-left space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Issued By</p>
                <div className="flex items-center gap-2 font-black text-gray-900">
                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                   EduPay Finance Team
                </div>
             </div>
             <p className="text-[10px] text-gray-300 italic max-w-sm text-center md:text-right">
                ឯកសារនេះត្រូវបានបង្កើតឡើងដោយស្វ័យប្រវត្តិតាមរយៈប្រព័ន្ធ EduPay។ រាល់ព័ត៌មានទាំងអស់ត្រូវបានរក្សាទុកជាសម្ងាត់។
             </p>
          </div>
        </div>
      </motion.div>

      {/* History section (optional visual sugar) */}
      <div className="no-print space-y-4">
         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <History size={16} />
            ប្រវត្តិកែប្រែ / Edit History
         </h3>
         <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
               <Edit3 size={18} />
            </div>
            <p className="text-sm text-gray-500 font-medium italic">មិនទាន់មានការកែប្រែលើវិកយបត្រនេះទេ (No modifications for this invoice)</p>
         </div>
      </div>
    </div>
  );
}
