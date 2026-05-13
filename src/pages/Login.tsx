import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { PenTool, Hammer, Eye, Lock, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { loginWithGoogle, loginWithEmail, db, handleFirestoreError, OperationType } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

interface LoginProps {
  onSelectRole: (role: UserRole) => void;
}

export default function Login({ onSelectRole }: LoginProps) {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async (role: UserRole) => {
    if (role === 'Vibecoder Guest') {
      // Show login/signup choice
      setShowPasswordModal(role);
      setError(null);
      setFormData({ email: '', password: '' });
      return;
    }
    
    // Architect and Builder require password
    setShowPasswordModal(role);
    setError(null);
    setFormData({ email: '', password: '' });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordModal) return;
    setLoading(true);
    setError(null);

    const isInternal = showPasswordModal !== 'Vibecoder Guest';
    const username = showPasswordModal === 'Architect' ? 'architect' : 'builder';
    const loginEmail = isInternal ? `${username}@twinstack.internal` : formData.email;
    const loginPassword = formData.password;

    try {
      if (isInternal) {
        // Internal flow
        console.log("Fetching internal user doc for:", username);
        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'internal_users', username));
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `internal_users/${username}`);
          return;
        }
        
        if (userDoc.exists()) {
          console.log("Internal user doc found, verifying hash...");
          const { passwordHash } = userDoc.data();
          const isMatch = bcrypt.compareSync(loginPassword, passwordHash);
          if (!isMatch) throw new Error('Invalid internal credentials');
        } else {
          console.log("Internal user doc not found, attempting to seed...");
          const validPasswords = {
            'architect': 'TwinStack_Architect!2026_Parallax#Orbit',
            'builder': 'TwinStack_Builder!2026_Forge#Vertex'
          };
          if (loginPassword !== (validPasswords as any)[username]) throw new Error('Invalid internal credentials');
          
          try {
            await setDoc(doc(db, 'internal_users', username), {
              username, role: showPasswordModal, passwordHash: bcrypt.hashSync(loginPassword, 10), createdAt: serverTimestamp()
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `internal_users/${username}`);
          }
          console.log("Seeding successful.");
        }
      }

      console.log("Attempting Firebase Auth login with:", loginEmail);
      // Login to Firebase Auth
      await loginWithEmail(loginEmail, loginPassword);
      onSelectRole(showPasswordModal);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0a0a]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-2 font-sans">Workspace</h1>
        <p className="text-zinc-500 font-medium">Select your profile and sign in to continue</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <RoleCard 
          role="Architect" 
          icon={<PenTool className="w-8 h-8" />}
          description="Design concepts and request features"
          color="bg-blue-500"
          onClick={() => handleRoleSelection('Architect')}
        />
        <RoleCard 
          role="Builder" 
          icon={<Hammer className="w-8 h-8" />}
          description="Access the queue and build the vision"
          color="bg-emerald-500"
          onClick={() => handleRoleSelection('Builder')}
        />
        <RoleCard 
          role="Vibecoder Guest" 
          icon={<Eye className="w-8 h-8" />}
          description="View the build process in real-time"
          color="bg-purple-500"
          onClick={() => handleRoleSelection('Vibecoder Guest')}
        />
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-800 text-zinc-100">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 italic">{showPasswordModal} Login</h3>
                </div>
                <button onClick={() => setShowPasswordModal(null)} className="text-zinc-500 hover:text-zinc-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-4">
                  {showPasswordModal === 'Vibecoder Guest' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vibecoder@example.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {showPasswordModal === 'Vibecoder Guest' ? 'Password' : 'Internal Password'}
                    </label>
                    <input 
                      autoFocus={showPasswordModal !== 'Vibecoder Guest'}
                      required
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    />
                    {error && <p className="text-red-400 text-[10px] font-bold mt-2 font-mono uppercase">Error: {error}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    disabled={loading}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 group",
                      showPasswordModal === 'Vibecoder Guest' 
                        ? "bg-purple-600 text-white hover:bg-purple-500" 
                        : "bg-zinc-100 text-black hover:bg-white"
                    )}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {showPasswordModal === 'Vibecoder Guest' && (
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">New here?</p>
                      <button
                        type="button"
                        onClick={() => navigate('/terms?intent=setup')}
                        className="text-xs text-zinc-100 font-bold uppercase tracking-widest hover:text-purple-400 transition-colors border-b border-zinc-800 pb-1"
                      >
                        Create Guest Profile
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-16 text-center space-y-4">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
          © 2026 Parallax Studio. All rights reserved.
        </p>
        <Link to="/terms" className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest font-bold border-b border-zinc-800 pb-1">
          Terms & Conditions
        </Link>
      </footer>
    </div>
  );
}

function RoleCard({ role, icon, description, color, onClick }: { 
  role: UserRole; 
  icon: React.ReactNode; 
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center p-8 glass-panel rounded-3xl text-center transition-all hover:shadow-2xl hover:shadow-blue-500/5 group"
    >
      <div className={cn("mb-6 p-4 rounded-2xl text-white transition-transform group-hover:scale-110 shadow-lg", color)}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">{role}</h2>
      <p className="text-zinc-500 text-sm leading-relaxed font-medium">{description}</p>
    </motion.button>
  );
}
