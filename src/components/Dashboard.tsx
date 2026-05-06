import { useApp } from "../App";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  BookOpen, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { db } = useApp();

  const totalStudents = db.students.filter(s => s.active).length;
  const totalClasses = db.classes.length;
  
  const totalRevenueUSD = db.payments
    .filter(p => p.status === "paid" && p.currency === "USD")
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalRevenueKHR = db.payments
    .filter(p => p.status === "paid" && p.currency === "KHR")
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { 
      name: "សិស្សសរុប", 
      value: totalStudents, 
      icon: <Users className="text-blue-600" />, 
      color: "bg-blue-50",
      change: "+2.5%",
      isPositive: true
    },
    { 
      name: "ចំនួនគ្រូសរុប", 
      value: totalClasses, 
      icon: <BookOpen className="text-purple-600" />, 
      color: "bg-purple-50",
      change: "+1",
      isPositive: true
    },
    { 
      name: "ចំណូលសរុប ($)", 
      value: `${totalRevenueUSD.toLocaleString()}$`, 
      icon: <DollarSign className="text-emerald-600" />, 
      color: "bg-emerald-50",
      change: "+12%",
      isPositive: true
    },
    { 
      name: "ចំណូលសរុប (៛)", 
      value: `${totalRevenueKHR.toLocaleString()}៛`, 
      icon: <Wallet className="text-orange-600" />, 
      color: "bg-orange-50",
      change: "-3%",
      isPositive: false
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ផ្ទាំងគ្រប់គ្រង</h1>
        <p className="text-gray-500">ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងការបង់ប្រាក់ EduPay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.name}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
            <span>ការបង់ប្រាក់ថ្មីៗ</span>
            <button className="text-sm text-blue-600 hover:underline">មើលទាំងអស់</button>
          </h2>
          <div className="space-y-4">
            {db.payments.slice(-5).reverse().map((payment) => {
              const student = db.students.find(s => s.id === payment.studentId);
              return (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {student?.nameEn?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student?.nameKh || "Unknown"}</p>
                      <p className="text-xs text-gray-500">ខែ {payment.month + 1}, {payment.year}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{payment.amount.toLocaleString()}{payment.currency === "USD" ? "$" : "៛"}</p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {payment.status === "paid" ? "បង់រួច" : "មិនទាន់បង់"}
                    </span>
                  </div>
                </div>
              );
            })}
            {db.payments.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <CreditCard size={48} className="mx-auto mb-3 opacity-20" />
                <p>មិនទាន់មានទិន្នន័យការបង់ប្រាក់</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
            <span>សង្ខេបតាមគ្រូ</span>
            <button className="text-sm text-blue-600 hover:underline">គ្រប់គ្រងគ្រូ</button>
          </h2>
          <div className="space-y-6">
            {db.classes.map((cls) => {
              const classStudents = db.students.filter(s => s.classId === cls.id);
              const paidStudents = classStudents.filter(s => {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return db.payments.some(p => p.studentId === s.id && p.month === currentMonth && p.year === currentYear && p.status === "paid");
              });
              const percentage = classStudents.length ? (paidStudents.length / classStudents.length) * 100 : 0;

              return (
                <div key={cls.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-semibold text-gray-900">{cls.name}</p>
                      <p className="text-xs text-gray-500">{cls.grade}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{paidStudents.length}/{classStudents.length} បង់រួច</p>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
            {db.classes.length === 0 && (
               <div className="text-center py-12 text-gray-400">
               <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
               <p>មិនទាន់មានទិន្នន័យថ្នាក់រៀន</p>
             </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
