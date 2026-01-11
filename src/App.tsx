import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/layout/Layout';
import { StudentDashboard } from './pages/student/Dashboard';
import { ProfessorDashboard } from './pages/professor/Dashboard';
import { StudentVideos } from './pages/student/Videos';
import { StudentEvents } from './pages/student/Events';
import { StudentFinancial } from './pages/student/Financial';
import { StudentProfile } from './pages/student/Profile';

import { ProfessorStudents } from './pages/professor/Students';
import { ProfessorContent } from './pages/professor/Content';
import { ProfessorFinancial } from './pages/professor/Financial';
import { ProfessorEvents } from './pages/professor/Events';

// Protected Route Component
function ProtectedRoute({ allowedRole }: { allowedRole: 'student' | 'professor' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== allowedRole) {
    // Redirect to correct dashboard if accessing wrong section
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRole="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/videos" element={<StudentVideos />} />
              <Route path="/student/financial" element={<StudentFinancial />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/events" element={<StudentEvents />} />
            </Route>

            {/* Professor Routes */}
            <Route element={<ProtectedRoute allowedRole="professor" />}>
              <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
              <Route path="/professor/students" element={<ProfessorStudents />} />
              <Route path="/professor/content" element={<ProfessorContent />} />
              <Route path="/professor/financial" element={<ProfessorFinancial />} />
              <Route path="/professor/events" element={<ProfessorEvents />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
