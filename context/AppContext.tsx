
import React, { useState, useEffect, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { parseISO, isBefore, differenceInDays } from 'date-fns';
import { License, Company, DashboardStats, UserRole, User, Theme } from '../types';

interface AppContextType {
  licenses: License[];
  companies: Company[];
  users: User[];
  isAuthenticated: boolean;
  userRole: UserRole;
  theme: Theme;
  toggleTheme: () => void;
  addLicense: (license: Omit<License, 'id'>) => void;
  updateLicense: (id: string, license: Partial<License>) => void;
  deleteLicense: (id: string) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getStats: () => DashboardStats;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Management
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('app_theme') as Theme) || 'light');

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('app_auth_token') === 'valid';
  });
  
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('app_user_role') as UserRole) || 'admin';
  });

  const [licenses, setLicenses] = useState<License[]>(() => {
    const saved = localStorage.getItem('licenses_pro_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies_pro_data');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Matriz Principal LTDA', fantasyName: 'Matriz', cnpj: '00.000.000/0001-91', active: true }
    ];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users_pro_data');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Administrador', email: 'admin@licensepro.com', role: 'admin', active: true },
      { id: '2', name: 'Colaborador Padrão', email: 'user@licensepro.com', role: 'user', active: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('licenses_pro_data', JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem('companies_pro_data', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('users_pro_data', JSON.stringify(users));
  }, [users]);

  const login = (role: UserRole) => {
    localStorage.setItem('app_auth_token', 'valid');
    localStorage.setItem('app_user_role', role);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('app_auth_token');
    localStorage.removeItem('app_user_role');
    setIsAuthenticated(false);
    // Note: We DO NOT remove 'app_theme' here, so it persists!
  };

  const addLicense = (data: Omit<License, 'id'>) => {
    setLicenses(prev => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateLicense = (id: string, data: Partial<License>) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteLicense = (id: string) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
  };

  const addCompany = (data: Omit<Company, 'id'>) => {
    setCompanies(prev => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateCompany = (id: string, data: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    setLicenses(prev => prev.filter(l => l.companyId !== id));
  };

  const addUser = (data: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const getStats = (): DashboardStats => {
    const today = new Date();
    const stats = { expired: 0, warning: 0, active: 0, total: licenses.length, companiesCount: companies.length };
    
    licenses.forEach(l => {
      const expDate = parseISO(l.expirationDate);
      if (isBefore(expDate, today)) {
        stats.expired++;
      } else if (differenceInDays(expDate, today) < 60) {
        stats.warning++;
      } else {
        stats.active++;
      }
    });
    
    return stats;
  };

  return (
    <AppContext.Provider value={{ 
      licenses, companies, users, isAuthenticated, userRole, theme, toggleTheme,
      addLicense, updateLicense, deleteLicense, 
      addCompany, updateCompany, deleteCompany,
      addUser, updateUser, deleteUser,
      getStats, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
