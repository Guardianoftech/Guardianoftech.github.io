import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageContainer } from './components/layout/PageContainer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Hospitals } from './pages/Hospitals';
import { HospitalDetails } from './pages/HospitalDetails';
import { CompareHospitals } from './pages/CompareHospitals';
import { MedicalReports } from './pages/MedicalReports';
import { ReportAnalysis } from './pages/ReportAnalysis';
import { HealthProgress } from './pages/HealthProgress';
import { Recommendations } from './pages/Recommendations';
import { AIHealthAssistant } from './pages/AIHealthAssistant';
import { NotFound } from './pages/NotFound';
import { SehatMatch } from './pages/SehatMatch';
import { Medicine } from './pages/Medicine';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <PageContainer>
                <Dashboard />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/hospitals" element={
            <ProtectedRoute>
              <PageContainer>
                <Hospitals />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/hospitals/:id" element={
            <ProtectedRoute>
              <PageContainer>
                <HospitalDetails />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/compare" element={
            <ProtectedRoute>
              <PageContainer>
                <CompareHospitals />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <PageContainer>
                <MedicalReports />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/reports/:id" element={
            <ProtectedRoute>
              <PageContainer>
                <ReportAnalysis />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/health" element={
            <ProtectedRoute>
              <PageContainer>
                <HealthProgress />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <PageContainer>
                <Recommendations />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/assistant" element={
            <ProtectedRoute>
              <PageContainer>
                <AIHealthAssistant />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/sehatmatch" element={
            <ProtectedRoute>
              <PageContainer>
                <SehatMatch />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/medicine" element={
            <ProtectedRoute>
              <PageContainer>
                <Medicine />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageContainer>
                <Profile />
              </PageContainer>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;