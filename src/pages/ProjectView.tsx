import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Request, UserRole } from '../types';
import { restructureRequest } from '../services/gemini';
import { 
  ArrowLeft, Send, CheckCircle2, 
  Clock, Sparkles, Bell, 
  Code, Eye, GitFork, GitBranch
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function ProjectView({ role }: { role: UserRole }) {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRestructuring, setIsRestructuring] = useState(false);
  const [draftRequest, setDraftRequest] = useState<{ nonTech: string, tech: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const lastRequestCount = useRef(0);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const [projRes, reqRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/projects/${projectId}/requests`)
        ]);

        if (projRes.ok) setProject(await projRes.json());
        if (reqRes.ok) {
          const reqs = await reqRes.json();
          const approvedReqs = reqs.filter((r: Request) => r.status === 'approved');
          setRequests(approvedReqs);

          if (role === 'Builder' && approvedReqs.length > lastRequestCount.current && lastRequestCount.current !== 0) {
            const latest = approvedReqs[0];
            setNotification(latest.nonTechDescription);
            setTimeout(() => setNotification(null), 5000);
          }
          lastRequestCount.current = approvedReqs.length;
        } else {
           console.error("Failed to fetch requests", await reqRes.text());
        }
      } catch (err) {
        console.error("Workspace connection error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s instead of real-time for now
    return () => clearInterval(interval);
  }, [projectId, role]);

  const handleSendRequest = async () => {
    if (!inputText.trim()) return;
    setIsRestructuring(true);
    setDraftRequest(null);

    try {
      const result = await restructureRequest(inputText);
      setDraftRequest({
        nonTech: result.nonTechDescription,
        tech: result.techDescription
      });
    } catch (err) {
      console.error("Gemini restructuring error", err);
    } finally {
      setIsRestructuring(false);
    }
  };

  const handleApprove = async () => {
    if (!draftRequest || !projectId) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nonTechDescription: draftRequest.nonTech,
          techDescription: draftRequest.tech
        })
      });

      if (res.ok) {
        const newReq = await res.json();
        setRequests(prev => [newReq, ...prev]);
        setDraftRequest(null);
        setInputText('');
      }
    } catch (error) {
      console.error("Failed to create request", error);
    }
  };

  if (!project) return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
      Connecting to Workspace...
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#111111] border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 -ml-2 text-zinc-500 hover:text-zinc-100 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center font-bold text-zinc-100 border border-zinc-700">
              A&B
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-widest text-zinc-100 uppercase">{project.title}</h1>
              <p className="text-[10px] text-zinc-500 italic font-medium uppercase tracking-tight">Project Workspace</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Active Session</span>
            <span className={cn(
              "text-sm font-medium",
              role === 'Architect' ? "text-blue-400" : (role === 'Builder' ? "text-emerald-400" : "text-purple-400")
            )}>{role}</span>
          </div>
          <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
          <Link to="/dashboard" className="hidden sm:block px-4 py-2 text-xs border border-zinc-700 rounded text-zinc-300 hover:bg-zinc-800 transition-colors" title="Switch Project">Projects</Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden relative text-zinc-300">
        {/* Architect Side */}
        <div className={cn(
          "w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800 bg-[#0e0e0e]",
          role === 'Builder' && "hidden md:flex opacity-40 pointer-events-none grayscale-[0.5]",
          role === 'Vibecoder Guest' && "pointer-events-none opacity-80"
        )}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                New Request Input
              </h2>
            </div>

            <div className="flex-grow flex flex-col gap-6">
              <div className="space-y-2 group">
                <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Architectural Intent</label>
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe the next feature or logic change..."
                    className="w-full p-6 bg-[#161618] border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none h-48 md:h-64 transition-all shadow-inner"
                  />
                  <button
                    onClick={handleSendRequest}
                    disabled={!inputText.trim() || isRestructuring}
                    className="absolute bottom-4 right-4 p-4 bg-zinc-100 text-zinc-900 rounded-xl shadow-lg disabled:opacity-50 hover:bg-white transition-all active:scale-95 group-hover:shadow-blue-500/10"
                  >
                    {isRestructuring ? (
                      <div className="w-5 h-5 border-2 border-zinc-900 rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {draftRequest && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 glass-panel rounded-xl space-y-6 architect-accent shadow-2xl shadow-blue-900/10"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1">
                          <Eye className="w-3 h-3 text-blue-400" /> Non-Technical Summary
                        </span>
                        <p className="text-sm text-zinc-200 leading-relaxed italic pr-4 font-medium">"{draftRequest.nonTech}"</p>
                      </div>
                      <div className="pt-4 border-t border-zinc-800/50 space-y-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-1">
                          <Code className="w-3 h-3 text-blue-400" /> Technical Specification
                        </span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-mono opacity-80 bg-black/20 p-3 rounded-lg">"{draftRequest.tech}"</p>
                      </div>
                    </div>
                    <button
                      onClick={handleApprove}
                      className="w-full py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Send to Builder
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Builder Side */}
        <div className={cn(
          "w-full md:w-1/2 flex flex-col bg-[#121212]",
          role === 'Architect' && "hidden md:flex",
          role === 'Vibecoder Guest' && "flex"
        )}>
          <div className="p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Work Queue</h2>
              <div className="flex items-center space-x-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Live Queue</span>
                <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-700">
                  {requests.length} REQS
                </span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 glass-panel rounded-lg builder-accent border border-zinc-800 transition-all hover:bg-zinc-800/40"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">REQ-{String(request.id).slice(-4)}</div>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                          {request.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-bold">
                        {request.timestamp ? format(new Date(request.timestamp), 'MMM d · H:mm') : 'PENDING'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-zinc-100 font-medium leading-relaxed mb-4">
                      {request.nonTechDescription}
                    </p>
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-zinc-800/50">
                      <p className="text-[11px] text-zinc-500 leading-relaxed italic font-mono">
                        {request.techDescription}
                      </p>
                    </div>

                    {role === 'Vibecoder Guest' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800/50 pointer-events-auto">
                        <button className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center justify-center gap-2 transition-colors">
                          <GitFork className="w-3 h-3" />
                          Fork TwinStack
                        </button>
                        <button className="flex-1 py-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center justify-center gap-2 transition-colors">
                          <GitBranch className="w-3 h-3" />
                          Create Branch
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-700 py-20">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <Clock className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="font-bold uppercase tracking-[0.3em] text-[10px] opacity-40 italic">Awaiting Architect Logic</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Builder Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-8 right-8 w-80 bg-zinc-900 border border-emerald-500/50 p-5 rounded-2xl shadow-2xl flex items-start gap-4 z-50 backdrop-blur-xl"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Bell className="w-5 h-5 text-emerald-400 animate-swing" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-zinc-100 mb-1 uppercase tracking-wider">New Approved Request</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed italic font-medium">"{notification}"</p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-zinc-600 hover:text-zinc-400 transition-colors"
                aria-label="Close notification"
              >
                <Sparkles className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
