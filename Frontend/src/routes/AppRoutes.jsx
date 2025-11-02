import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { LoginPage } from '../modules/auth';
import { OnboardingPage } from '../modules/onboarding';
import { Sidebar } from '../modules/dashboard';
import { DashboardRoutes } from '../modules/dashboard';
import { ProtectedRoute } from './ProtectedRoute';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Consciousness</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <DashboardRoutes />
        </div>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
