
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  PlusCircle, 
  Building2, 
  ShieldCheck, 
  PieChart,
  Settings,
  LogOut,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { logout, userRole } = useApp();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/' },
    { icon: Building2, label: 'Empresas / Unidades', path: '/empresas' },
    { icon: Files, label: 'Licenças e Alvarás', path: '/licencas' },
  ];

  // Only Admin can see "Nova Licença" shortcut and "Usuários"
  if (userRole === 'admin') {
    menuItems.push({ icon: PlusCircle, label: 'Nova Licença', path: '/licencas/nova' });
    menuItems.push({ icon: Users, label: 'Gestão de Usuários', path: '/usuarios' });
  }

  return (
    <aside className="w-20 glass-sidebar border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col z-50 transition-all duration-300">
      <div className="py-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer group relative">
          <ShieldCheck className="text-white w-7 h-7" />
          <span className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
            LicensePro v2
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 flex flex-col items-center">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }
            `}
          >
             {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto flex flex-col items-center gap-4">
        <div className="group relative">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center border border-slate-200 dark:border-slate-800 cursor-help">
            <PieChart className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="absolute left-full ml-4 bottom-0 p-4 bg-slate-900 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0 w-48">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-3 h-3 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Plano Enterprise</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[9px] font-medium text-slate-400">IA Ativa e Monitoramento.</p>
            <div className="absolute bottom-4 -left-1 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        </div>
        
        <div className="space-y-2 w-full flex flex-col items-center">
          <button className="relative flex items-center justify-center w-12 h-12 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-2xl transition-all group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
              Configurações
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </span>
          </button>
          
          <button 
            onClick={logout}
            className="relative flex items-center justify-center w-12 h-12 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="absolute left-full ml-4 px-3 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
              Sair do Sistema
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-rose-600 rotate-45"></div>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
