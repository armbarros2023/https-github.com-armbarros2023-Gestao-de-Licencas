
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2,
  Files,
  Loader2,
  TrendingUp,
  ShieldAlert,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  FileSearch
} from 'lucide-react';
import { parseISO, format, differenceInDays, isBefore } from 'date-fns';
import { useApp } from '../context/AppContext';
import { analyzeLicensesStatus } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { licenses, companies } = useApp();
  const [filterCompany, setFilterCompany] = useState('all');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredLicenses = useMemo(() => {
    if (filterCompany === 'all') return licenses;
    return licenses.filter(l => l.companyId === filterCompany);
  }, [licenses, filterCompany]);

  const stats = useMemo(() => {
    const today = new Date();
    const result = { expired: 0, warning: 0, active: 0, total: filteredLicenses.length };
    
    filteredLicenses.forEach(l => {
      const expDate = parseISO(l.expirationDate);
      if (isBefore(expDate, today)) {
        result.expired++;
      } else if (differenceInDays(expDate, today) < 60) {
        result.warning++;
      } else {
        result.active++;
      }
    });
    return result;
  }, [filteredLicenses]);

  const runAudit = async () => {
    if (filteredLicenses.length > 0) {
      setLoadingAi(true);
      try {
        const analysis = await analyzeLicensesStatus(filteredLicenses, companies);
        setAiAnalysis(analysis);
      } catch (err) {
        setAiAnalysis("Falha ao processar auditoria. Verifique sua conexão ou API Key.");
      } finally {
        setLoadingAi(false);
      }
    } else {
      setAiAnalysis("Não há dados suficientes para realizar os testes de conformidade.");
    }
  };

  // Efeito para rodar a auditoria sempre que o filtro ou os dados mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      runAudit();
    }, 500);
    return () => clearTimeout(timer);
  }, [filterCompany, licenses]);

  const upcomingLicenses = [...filteredLicenses]
    .sort((a, b) => parseISO(a.expirationDate).getTime() - parseISO(b.expirationDate).getTime())
    .slice(0, 5);

  const getStatusInfo = (date: string) => {
    const today = new Date();
    const expDate = parseISO(date);
    if (expDate < today) return { label: 'Crítico', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' };
    if (differenceInDays(expDate, today) < 60) return { label: 'Atenção', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' };
    return { label: 'Vigente', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
  };

  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.fantasyName || 'N/A';

  const compliancePercentage = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 h-full pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Painel de Conformidade</h1>
          <p className="text-slate-500 font-medium mt-2">
            Visão consolidada {filterCompany === 'all' ? `para ${companies.length} entidades.` : `para ${getCompanyName(filterCompany)}.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-64">
            <select 
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold cursor-pointer text-sm shadow-sm"
            >
              <option value="all">Todas as Empresas</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.fantasyName}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border dark:border-slate-800 p-2 rounded-2xl shadow-sm w-full sm:w-auto">
             <div className="bg-indigo-600 text-white p-2 rounded-xl">
                <TrendingUp className="w-5 h-5" />
             </div>
             <div className="pr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Status Global</p>
                <p className="text-sm font-bold">{compliancePercentage}% em Conformidade</p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Vencidas" value={stats.expired} icon={ShieldAlert} variant="rose" />
        <KpiCard label="Próximas" value={stats.warning} icon={Clock} variant="amber" />
        <KpiCard label="Ativas" value={stats.active} icon={CheckCircle2} variant="emerald" />
        <KpiCard 
          label={filterCompany === 'all' ? "Unidades Totais" : "Unidade Selecionada"} 
          value={filterCompany === 'all' ? companies.length : 1} 
          icon={Building2} 
          variant="indigo" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
              <Files className="w-6 h-6 text-indigo-500" />
              Prioridades de Renovação
            </h3>
            <Link to={`/licencas?companyId=${filterCompany}`} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline">VER TODAS</Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
            {upcomingLicenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa / Unidade</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {upcomingLicenses.map(l => {
                      const status = getStatusInfo(l.expirationDate);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-900/5 transition-all">
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{getCompanyName(l.companyId)}</span>
                          </td>
                          <td className="px-8 py-5">
                            <p className="font-bold text-slate-800 dark:text-slate-100">{l.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{l.type}</p>
                          </td>
                          <td className="px-8 py-5 text-sm font-medium">{format(parseISO(l.expirationDate), 'dd/MM/yyyy')}</td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 font-medium">
                Nenhuma licença encontrada para o critério selecionado.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              Auditoria de Testes (IA)
            </h3>
            <button 
                onClick={runAudit}
                disabled={loadingAi}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all disabled:opacity-50"
                title="Executar Novos Testes"
            >
                <RefreshCw className={`w-4 h-4 ${loadingAi ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="bg-slate-900 dark:bg-slate-900/40 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group min-h-[450px] border border-slate-800">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <div className="relative z-10 space-y-6 h-full flex flex-col">
               {loadingAi ? (
                <div className="flex flex-col items-center justify-center flex-1 py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
                    <Sparkles className="w-5 h-5 text-indigo-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Analisando Conformidade...</p>
                </div>
              ) : (
                <>
                  <div className="prose prose-invert prose-sm flex-1 custom-scrollbar overflow-y-auto pr-2">
                    {aiAnalysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-lg w-fit">
                                <CheckCircle2 className="w-3 h-3" /> Auditado com Sucesso
                            </div>
                            <div className="text-indigo-100 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                                {aiAnalysis}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <FileSearch className="w-12 h-12 text-slate-700" />
                            <p className="text-slate-500 text-sm font-bold">
                                Aguardando dados para processar a auditoria...
                            </p>
                        </div>
                    )}
                  </div>
                  
                  {aiAnalysis && !aiAnalysis.includes("dados suficientes") && (
                    <div className="pt-6 border-t border-white/10 space-y-3 mt-auto">
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <p className="text-[10px] font-bold text-amber-200">Resultados gerados por IA. Valide juridicamente.</p>
                        </div>
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/20">
                            Exportar Testes (PDF)
                        </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, icon: Icon, variant }: any) => {
  const styles = {
    rose: 'text-rose-600 bg-rose-600',
    amber: 'text-amber-600 bg-amber-600',
    emerald: 'text-emerald-600 bg-emerald-600',
    indigo: 'text-indigo-600 bg-indigo-600',
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${styles[variant as keyof typeof styles]} shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="text-right">
          <span className="block text-4xl font-black tracking-tighter text-slate-800 dark:text-slate-100">{value}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
