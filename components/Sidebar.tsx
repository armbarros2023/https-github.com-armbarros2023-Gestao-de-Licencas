
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
    <aside className="w-72 glass-sidebar border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-3">
          <ShieldCheck className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter leading-none">LICENSE<br/><span className="text-indigo-600 dark:text-indigo-400">PRO v2</span></h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }
            `}
          >
             {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-100 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano Atual</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-[11px] font-medium text-slate-500">Versão Enterprise com IA Ativa.</p>
        </div>
        
        <div className="space-y-1 mt-4">
          <button className="flex items-center gap-3 px-5 py-3.5 w-full text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-2xl transition-all group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-bold text-sm">Configurações</span>
          </button>
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-5 py-3.5 w-full text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Sair do Sistema</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
