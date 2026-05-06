/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Search, 
  Menu, 
  X,
  Plus,
  ChevronRight,
  LogOut,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Class, Student, Payment, Invoice } from "./types";
import { fetchDb, saveDb } from "./services/dbService";

// --- Context ---
interface AppContextType {
  db: Database;
  setDb: (db: Database) => void;
  syncDb: (newDb: Database) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// --- Components ---
import Dashboard from "./components/Dashboard";
import Classes from "./components/Classes";
import Students from "./components/Students";
import Payments from "./components/Payments";
import InvoiceView from "./components/InvoiceView";

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) {
  const location = useLocation();
  
  const menuItems = [
    { name: "ផ្ទាំងគ្រប់គ្រង", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "គ្រូបង្រៀន", path: "/classes", icon: <BookOpen size={20} /> },
    { name: "សិស្ស", path: "/students", icon: <Users size={20} /> },
    { name: "ការបង់ប្រាក់", path: "/payments", icon: <CreditCard size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">EduPay</span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path 
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="active"
                    className="ml-auto"
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-100">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={20} />
              <span>ចាកចេញ</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function Header({ setIsOpen }: { setIsOpen: (o: boolean) => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ស្វែងរកសិស្ស..." 
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500 italic">អ្នកគ្រប់គ្រង</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [db, setDb] = useState<Database>({ classes: [], students: [], payments: [], invoices: [] });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDb().then(data => {
      setDb(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const syncDb = async (newDb: Database) => {
    setDb(newDb);
    await saveDb(newDb);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">កំពុងដំណើរការ...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ db, setDb, syncDb, loading }}>
      <Router>
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          
          <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
            <Header setIsOpen={setIsSidebarOpen} />
            
            <div className="flex-1 p-4 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/students" element={<Students />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/invoice/:id" element={<InvoiceView />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
}
