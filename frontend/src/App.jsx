import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { CitizenIssuesPage } from './pages/CitizenIssuesPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { NearbyIssuesPage } from './pages/NearbyIssuesPage';
import { ProfilePage } from './pages/ProfilePage';

import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { AuthorityIssuesPage } from './pages/AuthorityIssuesPage';
import { AuthorityIssueDetailPage } from './pages/AuthorityIssueDetailPage';
import { AuthorityMapView } from './pages/AuthorityMapView';

import { AdminDashboard } from './pages/AdminDashboard';
import { ManageUsersPage } from './pages/ManageUsersPage';
import { ManageDepartmentsPage } from './pages/ManageDepartmentsPage';
import { ManageCategoriesPage } from './pages/ManageCategoriesPage';
import { ManageZonesPage } from './pages/ManageZonesPage';
import { FraudManagementPage } from './pages/FraudManagementPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'AUTHORITY') return <Navigate to="/authority/dashboard" replace />;
    return <Navigate to="/citizen/dashboard" replace />;
  }
  return children;
};

export function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-['Inter',sans-serif]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex gap-8">
        {/* Render Sidebar for logged in users */}
        {user && <Sidebar />}

        <main className="flex-1 w-full min-w-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Citizen Routes */}
            <Route
              path="/citizen/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'AUTHORITY', 'ADMIN']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/report"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'AUTHORITY', 'ADMIN']}>
                  <ReportIssuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/issues"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'AUTHORITY', 'ADMIN']}>
                  <CitizenIssuesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/issues/:id"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'AUTHORITY', 'ADMIN']}>
                  <IssueDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/nearby"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'AUTHORITY', 'ADMIN']}>
                  <NearbyIssuesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/profile"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'AUTHORITY', 'ADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Authority Routes */}
            <Route
              path="/authority/dashboard"
              element={
                <ProtectedRoute allowedRoles={['AUTHORITY', 'ADMIN']}>
                  <AuthorityDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/issues"
              element={
                <ProtectedRoute allowedRoles={['AUTHORITY', 'ADMIN']}>
                  <AuthorityIssuesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/issues/:id"
              element={
                <ProtectedRoute allowedRoles={['AUTHORITY', 'ADMIN']}>
                  <AuthorityIssueDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/map"
              element={
                <ProtectedRoute allowedRoles={['AUTHORITY', 'ADMIN']}>
                  <AuthorityMapView />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageDepartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/zones"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageZonesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fraud"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <FraudManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

    </div>
  );
}

export default App;
