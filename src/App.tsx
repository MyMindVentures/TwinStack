import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';
import Landing from './pages/Landing';
import Terms from './pages/Terms';
import VibecoderSetup from './pages/VibecoderSetup';
import { UserRole } from './types';
import { authService, AuthUser } from './services/authService';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-purple-500/20 selection:text-purple-200">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onSelectRole={() => {}} />} 
          />
          <Route 
            path="/vibecoder-setup" 
            element={<VibecoderSetup onSelectRole={() => {}} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user 
                ? <Dashboard role={user.role} onLogout={handleLogout} /> 
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/project/:projectId" 
            element={
              user 
                ? <ProjectView role={user.role} /> 
                : <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
