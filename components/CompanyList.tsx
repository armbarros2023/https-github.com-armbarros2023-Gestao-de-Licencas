
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Edit2, Trash2, ExternalLink, Activity, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CompanyList: React.FC = () => {
  const { companies, deleteCompany, licenses } = useApp();

  const getCompanyLicenseCount = (companyId: string) => {
    return licenses.filter(l => l.companyId === companyId).length;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Empresas e Unidades</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie as entidades jurídicas sob sua custódia.</p>
        </div>
        <Link 
          to="/empresas/nova" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
        >
          <Plus className="w-6 h-6" /> Cadastrar Empresa
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <div key={company.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="flex gap-2">
                {company.latitude && company.longitude && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${company.latitude},${company.longitude}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 transition-all"
                    title="Ver no Mapa"
                  >
                    <MapPin className="w-5 h-5" />
                  </a>
                )}
                <Link to={`/empresas/editar/${company.id}`} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all">
                  <Edit2 className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => confirm('Excluir empresa? Todas as licenças vinculadas também serão removidas.') && deleteCompany(company.id)}
                  className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Link to={`/licencas?companyId=${company.id}`} className="hover:underline decoration-indigo-500 underline-offset-4 decoration-2">
                  <h3 className="text-xl font-black leading-tight text-slate-800 dark:text-slate-100 cursor-pointer">{company.fantasyName}</h3>
                </Link>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-1">{company.name}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>CNPJ: <span className="font-mono">{company.cnpj}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <ExternalLink className="w-4 h-4 text-indigo-500" />
                  <span>{getCompanyLicenseCount(company.id)} Licenças Vinculadas</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${company.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500'}`}>
                {company.active ? 'Ativa' : 'Inativa'}
              </span>
              <Link to={`/licencas?companyId=${company.id}`} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline">Ver Licenças</Link>
            </div>
          </div>
        ))}

        <Link to="/empresas/nova" className="border-4 border-dashed border-slate-100 dark:border-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-500/30 hover:text-indigo-500 transition-all group min-h-[320px]">
           <div className="w-16 h-16 rounded-full border-4 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Plus className="w-10 h-10" />
           </div>
           <span className="font-black text-lg uppercase tracking-tighter">Nova Empresa</span>
        </Link>
      </div>
    </div>
  );
};

export default CompanyList;
