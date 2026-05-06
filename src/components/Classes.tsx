import React, { useState } from "react";
import { useApp } from "../App";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  BookOpen, 
  Users, 
  Trash2, 
  Edit,
  ChevronRight,
  TrendingUp,
  X // Added X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Class } from "../types";

export default function Classes() {
  const { db, syncDb } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", grade: "", description: "" });
  const [search, setSearch] = useState("");

  const filteredClasses = db.classes.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.grade.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: Class = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      createdAt: new Date().toISOString()
    };
    syncDb({ ...db, classes: [...db.classes, newClass] });
    setIsModalOpen(false);
    setFormData({ name: "", grade: "", description: "" });
  };

  const deleteClass = (id: string) => {
    if (confirm("តើអ្នកប្រាកដថាចង់លុបថ្នាក់នេះមែនទេ? សិស្សក្នុងថ្នាក់នេះនឹងត្រូវផ្ទេរចេញ។")) {
      const newClasses = db.classes.filter(c => c.id !== id);
      const newStudents = db.students.map(s => s.classId === id ? { ...s, classId: "" } : s);
      syncDb({ ...db, classes: newClasses, students: newStudents });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">គ្រប់គ្រងថ្នាក់រៀន</h1>
          <p className="text-gray-500">បង្កើត និងគ្រប់គ្រងព័ត៌មានថ្នាក់រៀនទាំងអស់</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span>បង្កើតថ្នាក់ថ្មី</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="ស្វែងរកថ្នាក់រៀន (ឧទាហរណ៍: Grade 12A)..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredClasses.map((cls) => {
            const studentCount = db.students.filter(s => s.classId === cls.id).length;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={cls.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteClass(cls.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <BookOpen size={24} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{cls.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{cls.grade}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-gray-400" />
                    <span>{studentCount} សិស្ស</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span>សកម្ម</span>
                  </div>
                </div>

                <button className="w-full py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                  <span>មើលបញ្ជីសិស្ស</span>
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredClasses.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="max-w-xs mx-auto">
              <BookOpen size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">មិនមានថ្នាក់រៀនទេ</h3>
              <p className="text-sm text-gray-500 mt-2">ចាប់ផ្តើមដោយការបង្កើតឈ្មោះគ្រូដំបូងរបស់អ្នក ដើម្បីគ្រប់គ្រងសិស្ស។</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                + បន្ថែមគ្រូឥឡូវនេះ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
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
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">ថ្នាក់រៀនថ្មី</h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ឈ្មោះគ្រូ (Teacher Name)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ឧទាហរណ៍: អ្នកគ្រូ សុភា, លោកគ្រូ វិចិត្រ..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">កម្រិត / ថ្នាក់ទី</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ឧទាហរណ៍: Grade 12"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ការពិពណ៌នា (លម្អិត)</label>
                    <textarea 
                      rows={3}
                      placeholder="បញ្ជាក់បន្ថែមអំពីថ្នាក់នេះ..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none" 
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50"
                  >
                    បោះបង់
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all"
                  >
                    រក្សាទុក
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
