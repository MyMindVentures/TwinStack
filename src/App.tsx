import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';
import Landing from './pages/Landing';
import Terms from './pages/Terms';
import VibecoderSetup from './pages/VibecoderSetup';
import { UserRole } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    localStorage.getItem('selectedRole') as UserRole | null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-blue-500/20 selection:text-blue-200">
        <Routes>
          <Route 
            path="/login" 
            element={
              (user && selectedRole) 
                ? <Navigate to="/dashboard" /> 
                : <Login onSelectRole={handleRoleSelect} />
            } 
          />
          <Route 
            path="/vibecoder-setup" 
            element={<VibecoderSetup onSelectRole={handleRoleSelect} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              (user && selectedRole)
                ? <Dashboard role={selectedRole} onLogout={async () => {
                    await auth.signOut();
                    setSelectedRole(null);
                    localStorage.removeItem('selectedRole');
                  }} /> 
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/project/:projectId" 
            element={
              (user && selectedRole) 
                ? <ProjectView role={selectedRole} /> 
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
