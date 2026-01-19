
import React from 'react';
import { Moon, Sun, ShieldCheck, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userRole, theme, toggleTheme } = useApp();

  return (
    <div className={`min-h-screen flex transition-all duration-500 ease-in-out ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 glass-header border-b border-white/10 dark:border-white/5 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="md:hidden w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
             </div>
             <h2 className="hidden md:block text-lg font-bold tracking-tight text-slate-700 dark:text-slate-200">
               Gestão de Licenças <span className="text-indigo-600">Enterprise</span>
             </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{userRole === 'admin' ? 'Administrador' : 'Colaborador'}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase mt-1">
                  {userRole === 'admin' ? 'Acesso Total' : 'Visualização'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userRole === 'admin' ? 'from-indigo-500 to-purple-600' : 'from-emerald-500 to-teal-600'} flex items-center justify-center text-white font-bold ring-2 ring-indigo-500/20`}>
                {userRole === 'admin' ? 'AD' : 'CL'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
