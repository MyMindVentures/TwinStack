import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { Project, UserRole } from '../types';
import { handleFirestoreError, OperationType } from '../services/error-handler';
import { Plus, LayoutGrid, LogOut, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface DashboardProps {
  role: UserRole;
  onLogout: () => void;
}

export default function Dashboard({ role, onLogout }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      
      if (role === 'Vibecoder Guest') {
        projs = projs.filter(p => p.title.toLowerCase().includes('twinstack'));
      }
      
      setProjects(projs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });
    return unsubscribe;
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;

    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: serverTimestamp(),
        architectId: auth.currentUser?.uid || 'anonymous'
      });
      setNewProject({ title: '', description: '' });
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-[#0a0a0a] min-h-screen">
      <header className="flex items-center justify-between mb-12 bg-[#111111] p-6 rounded-3xl border border-zinc-800 shadow-xl shadow-black/20">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl text-white shadow-lg",
            role === 'Architect' ? "bg-blue-500 shadow-blue-500/20" : (role === 'Builder' ? "bg-emerald-500 shadow-emerald-500/20" : "bg-purple-500 shadow-purple-500/20")
          )}>
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Projects</h1>
            <p className="text-sm text-zinc-500 font-medium">Account: <span className={cn(
              role === 'Architect' ? "text-blue-400" : (role === 'Builder' ? "text-emerald-400" : "text-purple-400")
            )}>{role}</span></p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {role === 'Architect' && (
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(24, 24, 27, 0.4)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600 hover:border-blue-500/50 hover:text-blue-500 transition-all group h-48 bg-zinc-900/10"
          >
            <Plus className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg uppercase tracking-widest text-xs">New Project</span>
          </motion.button>
        )}

        {projects.map((project) => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
        
        {!loading && projects.length === 0 && role !== 'Architect' && (
          <div className="md:col-span-2 py-20 text-center text-zinc-600 font-medium italic">
            No projects found. Wait for the Architect to initiate.
          </div>
        )}
      </div>

      <footer className="mt-20 pb-12 text-center space-y-4 border-t border-zinc-900 pt-12">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
          © 2026 Parallax Studio. All rights reserved.
        </p>
        <Link to="/terms" className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest font-bold border-b border-zinc-800 pb-1">
          Terms & Conditions
        </Link>
      </footer>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#111111] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleCreateProject} className="p-8">
                <h2 className="text-2xl font-bold text-zinc-100 mb-6 uppercase tracking-tight">App Concept</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">App Title</label>
                    <input 
                      type="text"
                      autoFocus
                      required
                      value={newProject.title}
                      onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. Zen Meditation App"
                      className="w-full p-4 bg-[#161618] border border-zinc-800 rounded-2xl text-zinc-100 focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Core Description</label>
                    <textarea 
                      required
                      maxLength={1500}
                      rows={5}
                      value={newProject.description}
                      onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="What is this app about?"
                      className="w-full p-4 bg-[#161618] border border-zinc-800 rounded-2xl text-zinc-100 focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none"
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-[10px] font-bold text-zinc-600">{newProject.description.length} / 1500</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 p-4 font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase text-xs tracking-widest"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 p-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl shadow-lg shadow-white/5 hover:bg-white transition-all uppercase text-xs tracking-widest"
                  >
                    Initialize Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ProjectCard = ({ project }: { project: Project }) => {
  const date = project.createdAt?.toDate ? project.createdAt.toDate() : new Date();

  return (
    <Link to={`/project/${project.id}`}>
      <motion.div
        whileHover={{ scale: 1.01, y: -4, backgroundColor: 'rgba(24, 24, 27, 0.4)' }}
        className="flex flex-col p-6 glass-panel rounded-3xl transition-all h-full group"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-zinc-100 line-clamp-1 group-hover:text-blue-400 transition-colors">{project.title}</h3>
          <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
        </div>
        <p className="text-zinc-500 text-sm line-clamp-3 mb-8 flex-grow font-medium leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-800/30 self-start px-3 py-2 rounded-xl border border-zinc-800/50">
          <Clock className="w-3.5 h-3.5 text-zinc-600" />
          {format(date, 'MMM d, h:mm a')}
        </div>
      </motion.div>
    </Link>
  );
};
