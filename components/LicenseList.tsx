
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Plus, FileText, Calendar, Trash2, Edit2, ChevronDown, Eye, Building2, ExternalLink, Printer
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useApp } from '../context/AppContext';
import { LICENSE_TYPES, STATUS_COLORS } from '../constants';

const LicenseList: React.FC = () => {
  const { licenses, companies, deleteLicense, userRole } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCompanyFilter = searchParams.get('companyId') || 'all';

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCompany, setFilterCompany] = useState(initialCompanyFilter);

  // Sync state with URL params
  useEffect(() => {
    const companyId = searchParams.get('companyId');
    if (companyId && companyId !== filterCompany) {
      setFilterCompany(companyId);
    } else if (!companyId && filterCompany !== 'all') {
       setFilterCompany('all');
    }
  }, [searchParams, filterCompany]);

  const handleCompanyFilterChange = (companyId: string) => {
    setFilterCompany(companyId);
    if (companyId === 'all') {
      searchParams.delete('companyId');
    } else {
      searchParams.set('companyId', companyId);
    }
    setSearchParams(searchParams);
  };

  const filtered = licenses.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || l.type === filterType;
    const matchesCompany = filterCompany === 'all' || l.companyId === filterCompany;
    return matchesSearch && matchesType && matchesCompany;
  });

  const getStatus = (date: string) => {
    const today = new Date();
    const expDate = parseISO(date);
    if (expDate < today) return 'expired';
    if (differenceInDays(expDate, today) < 60) return 'warning';
    return 'active';
  };

  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.fantasyName || 'Desconhecida';

  const getCompanyLicenseCount = (id: string) => licenses.filter(l => l.companyId === id).length;

  const getRenewalLink = (companyId: string, type: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.renewalLinks?.[type];
  };

  const handleQuickPrint = (url?: string) => {
    if (!url) {
      alert("Nenhum arquivo anexado para impressão.");
      return;
    }
    const w = window.open(url, '_blank');
    if (w) {
      w.onload = () => {
        w.focus();
        setTimeout(() => w.print(), 500);
      };
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Licenças & Alvarás</h1>
          <p className="text-slate-500 font-medium text-sm">Gerenciando {filtered.length} documentos regulatórios.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handlePrintReport}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest"
          >
            <Printer className="w-5 h-5" /> Imprimir Relatório
          </button>
          {userRole === 'admin' && (
            <Link 
              to="/licencas/nova" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 transition-all uppercase text-[10px] tracking-widest"
            >
              <Plus className="w-6 h-6" /> Novo Documento
            </Link>
          )}
        </div>
      </header>

      {/* Título para Impressão */}
      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-bold">Relatório de Licenças e Alvarás</h1>
        <p className="text-sm text-gray-500">Gerado em {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </div>

      {/* Filters Section - Hidden on Print */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm print:hidden">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome do documento..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="relative group">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <select 
            value={filterCompany}
            onChange={(e) => handleCompanyFilterChange(e.target.value)}
            className="w-full appearance-none pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <option value="all">Todas as Empresas</option>
            {companies
              .sort((a, b) => a.fantasyName.localeCompare(b.fantasyName))
              .map(c => (
                <option key={c.id} value={c.id}>
                  {c.fantasyName} ({getCompanyLicenseCount(c.id)})
                </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <option value="all">Todos os Tipos</option>
            {LICENSE_TYPES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 print:grid-cols-1 print:gap-4">
        {filtered.length > 0 ? (
          filtered.map(license => {
            const status = getStatus(license.expirationDate);
            const statusLabel = status === 'expired' ? 'CRÍTICO' : status === 'warning' ? 'ATENÇÃO' : 'VIGENTE';
            const renewalUrl = getRenewalLink(license.companyId, license.type);
            const hasFile = !!license.currentLicenseFile;
            
            return (
              <div key={license.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden print:shadow-none print:border-gray-300 print:rounded-lg">
                <div className="flex justify-between items-start mb-6 print:mb-2">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest border ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}>
                    {statusLabel}
                  </span>
                  <div className="flex gap-1 print:hidden">
                    {hasFile && (
                      <button 
                        onClick={() => handleQuickPrint(license.currentLicenseFile?.url)} 
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
                        title="Imprimir Cópia da Licença"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )}
                    <Link to={`/licencas/editar/${license.id}`} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100" title={userRole === 'admin' ? "Editar" : "Visualizar"}>
                      {userRole === 'admin' ? <Edit2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Link>
                    {userRole === 'admin' && (
                      <button onClick={() => confirm('Excluir documento?') && deleteLicense(license.id)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-6 flex-grow print:mb-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                     <Building2 className="w-3 h-3" />
                     {getCompanyName(license.companyId)}
                   </div>
                   
                   <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight print:text-lg">{license.name}</h3>
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">{license.type}</span>
                </div>

                <div className="space-y-3 mb-8 print:mb-2">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>Expira: <span className="text-slate-900 dark:text-slate-200">{format(parseISO(license.expirationDate), 'dd/MM/yyyy')}</span></span>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
                  <div className="flex -space-x-2">
                    {license.renewalDocuments.length > 0 ? (
                      license.renewalDocuments.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <FileText className="w-3 h-3 text-slate-400" />
                        </div>
                      ))
                    ) : <span className="text-[9px] font-bold text-slate-300">SEM ANEXOS</span>}
                  </div>
                  <Link to={`/licencas/editar/${license.id}`} className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">
                    {userRole === 'admin' ? 'Gerenciar Detalhes' : 'Visualizar'}
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center bg-slate-100/50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 font-black text-xl">Nenhum documento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseList;
