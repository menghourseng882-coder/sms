import React, { useState } from "react";
import { useApp } from "../App";
import { 
  Plus, 
  Search, 
  Users, 
  Trash2, 
  Edit,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  UserPlus,
  ArrowRightLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Student } from "../types";

export default function Students() {
  const { db, syncDb } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  
  const [formData, setFormData] = useState<Omit<Student, "id" | "active">>({
    nameKh: "",
    nameEn: "",
    dob: "",
    admissionDate: new Date().toISOString().split("T")[0],
    classId: "",
    paymentDay: 1,
    notes: ""
  });

  const filteredStudents = db.students.filter(s => {
    const matchesSearch = s.nameKh.toLowerCase().includes(search.toLowerCase()) || 
                         s.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      active: true
    };
    syncDb({ ...db, students: [...db.students, newStudent] });
    setIsModalOpen(false);
    setFormData({
      nameKh: "",
      nameEn: "",
      dob: "",
      admissionDate: new Date().toISOString().split("T")[0],
      classId: "",
      paymentDay: 1,
      notes: ""
    });
  };

  const deleteStudent = (id: string) => {
    if (confirm("តើអ្នកប្រាកដថាចង់លុបទិន្នន័យសិស្សនេះមែនទេ?")) {
      const newStudents = db.students.filter(s => s.id !== id);
      syncDb({ ...db, students: newStudents });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">គ្រប់គ្រងសិស្ស</h1>
          <p className="text-gray-500">មើល និងគ្រប់គ្រងសិស្សទាំងអស់តាមថ្នាក់នីមួយៗ</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-200"
        >
          <UserPlus size={20} />
          <span>បន្ថែមសិស្ស</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ស្វែងរកឈ្មោះសិស្ស (ខ្មែរ ឬ អង់គ្លេស)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
           <Filter size={18} className="text-gray-400" />
           <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium min-w-[160px]"
           >
            <option value="all">គ្រប់ថ្នាក់</option>
            {db.classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 italic">
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">ឈ្មោះសិស្ស (ខ្មែរ / EN)</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">គ្រូបង្រៀន</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">ថ្ងៃត្រូវបង់</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold">ស្ថានភាព</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-400 font-bold text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => {
                const className = db.classes.find(c => c.id === student.classId)?.name || "មិនទាន់មានថ្នាក់";
                return (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={student.id} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {student.nameEn[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{student.nameKh}</p>
                          <p className="text-xs text-gray-500 font-mono italic">{student.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-lg italic">
                        {className}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-600">រៀងរាល់ទី {student.paymentDay}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-none hover:shadow-md transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-white rounded-lg shadow-none hover:shadow-md transition-all">
                           <ArrowRightLeft size={16} />
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg shadow-none hover:shadow-md transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">រកមិនឃើញសិស្សទេ</h3>
            <p className="text-sm text-gray-500 mt-2">សាកល្បងប្តូរពាក្យស្វែងរក ឬបន្ថែមសិស្សថ្មី។</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 font-sans">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <UserPlus className="text-blue-600" size={32} />
                    បន្ថែមសិស្សថ្មី
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                    <X size={28} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 italic">ឈ្មោះខ្មែរ *</label>
                      <input 
                        required
                        type="text" 
                        placeholder="ឧទាហរណ៍: សុខ សាន"
                        value={formData.nameKh}
                        onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 italic">ឈ្មោះឡាតាំង (Latin) *</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Example: SOK SAN"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all uppercase" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 italic">ថ្ងៃខែឆ្នាំកំណើត</label>
                      <input 
                        type="date" 
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 italic">ជ្រើសរើសគ្រូ (Select Teacher) *</label>
                      <select 
                        required
                        value={formData.classId}
                        onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      >
                        <option value="">ជ្រើសរើសឈ្មោះគ្រូ</option>
                        {db.classes.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 italic">ថ្ងៃត្រូវបង់ប្រាក់ (រៀងរាល់ខែ) *</label>
                      <input 
                        required
                        type="number" 
                        min={1}
                        max={31}
                        value={formData.paymentDay}
                        onChange={(e) => setFormData({ ...formData, paymentDay: parseInt(e.target.value) })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 italic">ថ្ងៃចូលរៀន</label>
                      <input 
                        type="date" 
                        value={formData.admissionDate}
                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 italic">កំណត់ចំណាំ (Note)</label>
                  <textarea 
                    rows={2}
                    placeholder="សម្គាល់ផ្សេងៗអំពីសិស្ស..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none" 
                  />
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
                  >
                    បោះបង់
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    បន្ថែមសិស្ស
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
