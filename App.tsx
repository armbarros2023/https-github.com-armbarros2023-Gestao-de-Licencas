
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import LicenseList from './components/LicenseList';
import LicenseForm from './components/LicenseForm';
import CompanyList from './components/CompanyList';
import CompanyForm from './components/CompanyForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Login from './components/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider, useApp } from './context/AppContext';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Licenses: List is public, Create/Edit is Admin only */}
        <Route path="/licencas" element={<LicenseList />} />
        
        <Route path="/licencas/nova" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <LicenseForm />
          </ProtectedRoute>
        } />
        
        <Route path="/licencas/editar/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
             {/* User can view, logic inside component handles readonly state, 
                 but we wrap it here to ensure auth context is ready */}
            <LicenseForm />
          </ProtectedRoute>
        } />
        
        {/* Companies: List is public, Create/Edit is Admin only */}
        <Route path="/empresas" element={<CompanyList />} />
        
        <Route path="/empresas/nova" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CompanyForm />
          </ProtectedRoute>
        } />
        
        <Route path="/empresas/editar/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CompanyForm />
          </ProtectedRoute>
        } />

        {/* User Management: Strictly Admin Only */}
        <Route path="/usuarios" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserList />
          </ProtectedRoute>
        } />
        
        <Route path="/usuarios/nova" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserForm />
          </ProtectedRoute>
        } />
        
        <Route path="/usuarios/editar/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserForm />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
