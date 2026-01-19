
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Upload, File, Trash2, CheckCircle, 
  FileText, AlertCircle, Building2, ChevronDown, Download, 
  Printer, Lock, StickyNote, AlertTriangle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useApp } from '../context/AppContext';
import { LICENSE_TYPES } from '../constants';
import { LicenseFile, Company } from '../types';

// Security Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

// --- Sub-Components ---

const FormHeader: React.FC<{
  isEditing: boolean;
  isAdmin: boolean;
  onBack: () => void;
}> = ({ isEditing, isAdmin, onBack }) => (
  <div className="mb-10 flex items-center justify-between">
    <button onClick={onBack} className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Voltar
    </button>
    <div className="text-right">
      <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-slate-100">
        {isEditing ? (isAdmin ? 'Editar Licença' : 'Detalhes da Licença') : 'Nova Licença'}
      </h1>
      {!isAdmin && <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded font-bold uppercase">Modo Visualização</span>}
    </div>
  </div>
);

const InfoSection: React.FC<{
  name: string;
  setName: (v: string) => void;
  companyId: string;
  setCompanyId: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  expirationDate: string;
  setExpirationDate: (v: string) => void;
  companies: Company[];
  isAdmin: boolean;
}> = ({ name, setName, companyId, setCompanyId, type, setType, expirationDate, setExpirationDate, companies, isAdmin }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl space-y-10">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
        <FileText className="w-7 h-7" />
      </div>
      <div>
        <h2 className="text-xl font-black tracking-tight">Informações Cadastrais</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dados do Documento Regulatório</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="space-y-2 lg:col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome da Licença / Alvará</label>
        <input 
          required
          readOnly={!isAdmin}
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Licença Prévia LP-001/2024"
          className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold ${!isAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Empresa Vinculada</label>
        <div className="relative">
          <select 
            value={companyId}
            disabled={!isAdmin}
            onChange={e => setCompanyId(e.target.value)}
            className={`w-full appearance-none px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold pr-12 ${!isAdmin ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.fantasyName} ({c.cnpj})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Órgão</label>
        <div className="relative">
          <select 
            value={type}
            disabled={!isAdmin}
            onChange={e => setType(e.target.value)}
            className={`w-full appearance-none px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold pr-12 ${!isAdmin ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
          >
            {LICENSE_TYPES.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Data de Vencimento</label>
        <input 
          required
          readOnly={!isAdmin}
          type="date" 
          value={expirationDate}
          onChange={e => setExpirationDate(e.target.value)}
          className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold ${!isAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
        />
      </div>
    </div>
  </div>
);

const NotesSection: React.FC<{
  notes: string;
  setNotes: (v: string) => void;
  isAdmin: boolean;
}> = ({ notes, setNotes, isAdmin }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl">
    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
      <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-xl text-violet-600">
        <StickyNote className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-black tracking-tight">Notas & Observações</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registro de ocorrências e detalhes</p>
      </div>
    </div>
    <textarea 
      rows={4}
      readOnly={!isAdmin}
      value={notes}
      onChange={e => setNotes(e.target.value)}
      placeholder="Digite aqui observações importantes sobre esta licença, histórico de contatos ou pendências..."
      className={`w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none ${!isAdmin ? 'cursor-not-allowed opacity-80' : ''}`}
    />
  </div>
);

const CopySection: React.FC<{
  currentFile: LicenseFile | null;
  isAdmin: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onPrint: (url: string) => void;
  error?: string | null;
}> = ({ currentFile, isAdmin, onUpload, onRemove, onPrint, error }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl text-emerald-600">
        <CheckCircle className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-black tracking-tight">Cópia da Licença</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documento Final Vigente</p>
      </div>
    </div>

    {error && (
      <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-bold">{error}</p>
      </div>
    )}

    <div className="flex justify-center">
      {currentFile ? (
        <div className="w-full max-w-4xl space-y-6">
          <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl flex flex-col items-center justify-center text-center">
            <File className="w-16 h-16 text-emerald-600 mb-4" />
            <p className="text-xl font-black text-slate-700 dark:text-slate-200 break-all">{currentFile.name}</p>
            <p className="text-xs font-bold text-slate-400 uppercase mt-2">Disponível para Download e Impressão</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href={currentFile.url} download={currentFile.name} className="flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-indigo-600/30 active:scale-95">
              <Download className="w-4 h-4" /> Baixar
            </a>
            <button type="button" onClick={() => onPrint(currentFile.url)} className="flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
            {isAdmin && (
              <button type="button" onClick={() => onRemove(currentFile.id)} className="flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/10 dark:hover:bg-rose-900/20 text-rose-600 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">
                <Trash2 className="w-4 h-4" /> Remover
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-10">
          {isAdmin ? (
            <label className="block p-12 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group">
              <input type="file" className="hidden" onChange={onUpload} accept={ALLOWED_TYPES.join(',')} />
              <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Fazer Upload da Licença</p>
              <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase">PDF ou Imagem (Máx 5MB)</p>
            </label>
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-slate-400">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-bold">Nenhum documento disponível</p>
              <p className="text-xs mt-2">Aguarde o upload do administrador</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const RenewalSection: React.FC<{
  documents: LicenseFile[];
  isAdmin: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onPrint: (url: string) => void;
}> = ({ documents, isAdmin, onUpload, onRemove, onPrint }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl text-amber-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight">Renovação-Documentos</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolos, Formulários e Guias</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {documents.map(doc => (
            <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold truncate text-slate-700 dark:text-slate-200">{doc.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Enviado em: {format(parseISO(doc.uploadedAt), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={doc.url} download={doc.name} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all font-bold text-xs" title="Baixar">
                  <Download className="w-4 h-4" /> <span className="hidden sm:inline">Baixar</span>
                </a>
                <button type="button" onClick={() => onPrint(doc.url)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all" title="Imprimir">
                  <Printer className="w-4 h-4" />
                </button>
                {isAdmin && (
                  <button type="button" onClick={() => onRemove(doc.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all" title="Remover">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
          <div>
            <p className="font-bold text-sm">Nenhum documento de renovação listado.</p>
            {!isAdmin && <p className="text-xs mt-1">O administrador ainda não adicionou arquivos.</p>}
          </div>
        </div>
      )}

      {isAdmin && (
        <label className="block p-4 bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-white hover:border-indigo-400 dark:hover:bg-slate-800 cursor-pointer transition-all text-center mt-6">
          <input type="file" className="hidden" onChange={onUpload} accept={ALLOWED_TYPES.join(',')} />
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Adicionar Arquivo de Renovação
          </span>
        </label>
      )}
    </div>
  </div>
);

// --- Main Component ---

const LicenseForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { licenses, companies, addLicense, updateLicense, userRole } = useApp();
  
  const [name, setName] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [type, setType] = useState('Cetesb');
  const [expirationDate, setExpirationDate] = useState('');
  const [currentFile, setCurrentFile] = useState<LicenseFile | null>(null);
  const [renewalDocs, setRenewalDocs] = useState<LicenseFile[]>([]);
  const [notes, setNotes] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (id) {
      const existing = licenses.find(l => l.id === id);
      if (existing) {
        setName(existing.name);
        setCompanyId(existing.companyId);
        setType(existing.type);
        setExpirationDate(existing.expirationDate.split('T')[0]);
        setCurrentFile(existing.currentLicenseFile || null);
        setRenewalDocs(existing.renewalDocuments);
        setNotes(existing.notes || '');
      }
    }
  }, [id, licenses]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Formato de arquivo inválido. Use apenas PDF, JPG ou PNG.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Arquivo muito grande. O tamanho máximo permitido é 5MB.";
    }
    return null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCurrent: boolean) => {
    if (!isAdmin) return;
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Security Validation
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    const newFile: LicenseFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    };

    if (isCurrent) setCurrentFile(newFile);
    else setRenewalDocs(prev => [...prev, newFile]);
    e.target.value = '';
  };

  const removeFile = (fileId: string, isCurrent: boolean) => {
    if (!isAdmin) return;
    if (isCurrent) setCurrentFile(null);
    else setRenewalDocs(prev => prev.filter(f => f.id !== fileId));
  };

  const handlePrint = (url: string) => {
    const w = window.open(url, '_blank');
    if (w) {
      w.onload = () => {
        w.focus();
        setTimeout(() => w.print(), 500);
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!name || !expirationDate || !companyId) return;

    const data = {
      name,
      companyId,
      type,
      expirationDate: new Date(expirationDate).toISOString(),
      currentLicenseFile: currentFile || undefined,
      renewalDocuments: renewalDocs,
      notes
    };

    if (id) updateLicense(id, data);
    else addLicense(data);
    navigate('/licencas');
  };

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Building2 className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-black">Nenhuma empresa cadastrada</h2>
        <p className="text-slate-500">Cadastre uma empresa primeiro para vincular licenças.</p>
        {isAdmin && (
           <button onClick={() => navigate('/empresas/nova')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">Cadastrar Empresa Agora</button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32">
      <FormHeader isEditing={!!id} isAdmin={isAdmin} onBack={() => navigate(-1)} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <InfoSection 
          name={name} setName={setName}
          companyId={companyId} setCompanyId={setCompanyId}
          type={type} setType={setType}
          expirationDate={expirationDate} setExpirationDate={setExpirationDate}
          companies={companies}
          isAdmin={isAdmin}
        />

        <NotesSection notes={notes} setNotes={setNotes} isAdmin={isAdmin} />

        <div className="space-y-8">
          <CopySection 
            currentFile={currentFile} 
            isAdmin={isAdmin} 
            onUpload={(e) => handleFileUpload(e, true)}
            onRemove={(id) => removeFile(id, true)}
            onPrint={handlePrint}
            error={uploadError}
          />
          
          <RenewalSection 
            documents={renewalDocs} 
            isAdmin={isAdmin}
            onUpload={(e) => handleFileUpload(e, false)}
            onRemove={(id) => removeFile(id, false)}
            onPrint={handlePrint}
          />
        </div>

        <div className="fixed bottom-10 right-10 z-50 flex gap-4">
           <button 
            type="button"
            onClick={() => navigate('/licencas')}
            className="px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-50 transition-all"
          >
            {isAdmin ? 'Cancelar / Voltar' : 'Voltar para Lista'}
          </button>
          
          {isAdmin && (
            <button 
              type="submit"
              className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-600/50 transition-all active:scale-95 flex items-center gap-3"
            >
              <Save className="w-4 h-4" /> Salvar Alterações
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LicenseForm;
