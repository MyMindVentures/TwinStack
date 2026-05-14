import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Project, UserRole } from "../types";
import { Plus, LayoutGrid, LogOut, ChevronRight, Clock, KeyRound, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface DashboardProps {
  role: UserRole;
  onLogout: () => void;
}

export default function Dashboard({ role, onLogout }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  // Change Password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", {
        credentials: "include",
      });
      if (res.ok) {
        const projs = await res.json();
        setProjects(projs);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...newProject, visibility: "public" }),
      });

      if (res.ok) {
        await fetchProjects();
        setNewProject({ title: "", description: "" });
        setIsModalOpen(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error(
          "Failed to create project:",
          errorData.error || res.statusText,
        );
      }
    } catch (error) {
      console.error("Project creation error:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordForm.new.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordForm.current === passwordForm.new) {
      setPasswordError("New password must differ from current password");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });

      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordForm({ current: "", new: "", confirm: "" });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-bg-primary min-h-screen">
      <header className="flex items-center justify-between mb-12 bg-surface-primary p-6 rounded-3xl border border-border-subtle shadow-xl shadow-black/20">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "p-3 rounded-2xl text-white shadow-lg",
              role === "Architect"
                ? "bg-blue-500 shadow-blue-500/20"
                : role === "Builder"
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : "bg-purple-500 shadow-purple-500/20",
            )}
          >
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
            <p className="text-sm text-text-secondary font-medium">
              Account:{" "}
              <span
                className={cn(
                  role === "Architect"
                    ? "text-blue-400"
                    : role === "Builder"
                      ? "text-emerald-400"
                      : "text-purple-400",
                )}
              >
                {role}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {role === 'Architect' && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/seed/twinstack", { method: "POST" });
                  if (res.ok) {
                    alert("TwinStack seed sorted successfully.");
                    fetchProjects();
                  } else {
                    alert("Failed to run seed.");
                  }
                } catch (e) {
                  alert("Error running seed.");
                }
              }}
              className="text-[10px] font-bold text-blue-400 border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 rounded uppercase tracking-widest hover:bg-blue-400/20 transition-colors"
            >
              Repair TwinStack Seed
            </button>
          )}
          <button
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPasswordError("");
              setPasswordSuccess(false);
              setPasswordForm({ current: "", new: "", confirm: "" });
            }}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            title="Change Password"
          >
            <KeyRound className="w-5 h-5" />
          </button>
          <button
            onClick={onLogout}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            title="Log out"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(role === "Architect" || role === "Subscribed User") && (
          <motion.button
            whileHover={{
              scale: 1.01,
              backgroundColor: "rgba(24, 24, 27, 0.4)",
            }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-subtle rounded-3xl text-text-muted hover:border-blue-500/50 hover:text-blue-500 transition-all group h-48 bg-surface-primary/10"
          >
            <Plus className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg uppercase tracking-widest text-xs">
              New Project
            </span>
          </motion.button>
        )}

        {projects.map((project) => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}

        {!loading &&
          projects.length === 0 &&
          role !== "Architect" &&
          role !== "Subscribed User" && (
            <div className="md:col-span-2 py-20 text-center text-text-muted font-medium italic">
              No projects found. Wait for the Architect to initiate.
            </div>
          )}
      </div>

      <footer className="mt-20 pb-12 text-center space-y-4 border-t border-bg-primary pt-12">
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
          © 2026 Parallax Studio. All rights reserved.
        </p>
        <Link
          to="/terms"
          className="text-[10px] text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest font-bold border-b border-border-subtle pb-1"
        >
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
              className="relative w-full max-w-lg bg-surface-primary rounded-3xl border border-border-subtle shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleCreateProject} className="p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6 uppercase tracking-tight">
                  App Concept
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                      App Title
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="e.g. Zen Meditation App"
                      className="w-full p-4 bg-bg-secondary border border-border-subtle rounded-2xl text-text-primary focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                      Core Description
                    </label>
                    <textarea
                      required
                      maxLength={1500}
                      rows={5}
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="What is this app about?"
                      className="w-full p-4 bg-bg-secondary border border-border-subtle rounded-2xl text-text-primary focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none"
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-[10px] font-bold text-text-muted">
                        {newProject.description.length} / 1500
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 p-4 font-bold text-text-secondary hover:text-text-primary transition-colors uppercase text-xs tracking-widest"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-4 bg-white text-zinc-900 font-bold rounded-2xl shadow-lg shadow-white/5 hover:bg-white transition-all uppercase text-xs tracking-widest"
                  >
                    Initialize Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-primary border border-border-subtle rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Change Password</h2>
                  <p className="text-xs text-text-secondary">Passwords are stored securely in the database</p>
                </div>
              </div>

              {passwordSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Password Updated</p>
                  <p className="text-xs text-text-secondary">Your new password is now active</p>
                </motion.div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-xs text-red-400 font-medium">{passwordError}</p>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.current}
                        onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                        className="w-full p-4 pr-12 bg-bg-secondary border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-amber-500/50 transition-colors"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.new}
                        onChange={e => setPasswordForm(f => ({ ...f, new: e.target.value }))}
                        className="w-full p-4 pr-12 bg-bg-secondary border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-amber-500/50 transition-colors"
                        placeholder="Min. 8 characters"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.new.length > 0 && passwordForm.new.length < 8 && (
                      <p className="text-[10px] text-amber-400 ml-1">{8 - passwordForm.new.length} more characters needed</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                        className={cn(
                          "w-full p-4 pr-12 bg-bg-secondary border rounded-xl text-sm text-text-primary focus:outline-none transition-colors",
                          passwordForm.confirm && passwordForm.confirm !== passwordForm.new
                            ? "border-red-500/50 focus:border-red-500/50"
                            : passwordForm.confirm && passwordForm.confirm === passwordForm.new
                              ? "border-emerald-500/50 focus:border-emerald-500/50"
                              : "border-border-subtle focus:border-amber-500/50"
                        )}
                        placeholder="Re-enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.confirm && passwordForm.confirm !== passwordForm.new && (
                      <p className="text-[10px] text-red-400 ml-1">Passwords do not match</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="flex-1 p-4 border border-border-strong text-text-secondary rounded-2xl hover:bg-surface-hover transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading || !passwordForm.current || passwordForm.new.length < 8 || passwordForm.new !== passwordForm.confirm}
                      className="flex-1 p-4 bg-amber-500 text-zinc-900 font-bold rounded-2xl shadow-lg shadow-amber-500/10 hover:bg-amber-400 transition-all uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <div className="w-4 h-4 border-2 border-zinc-900 rounded-full border-t-transparent animate-spin mx-auto" />
                      ) : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ProjectCard = ({ project }: { project: Project }) => {
  const date = project.createdAt ? new Date(project.createdAt) : new Date();

  return (
    <Link to={`/project/${project.id}`}>
      <motion.div
        whileHover={{
          scale: 1.01,
          y: -4,
          backgroundColor: "rgba(24, 24, 27, 0.4)",
        }}
        className="flex flex-col p-6 glass-panel rounded-3xl transition-all h-full group"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-text-primary line-clamp-1 group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <ChevronRight className="w-5 h-5 text-border-strong group-hover:text-text-secondary transition-colors" />
        </div>
        <p className="text-text-secondary text-sm line-clamp-3 mb-8 flex-grow font-medium leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-text-secondary font-bold uppercase tracking-widest bg-surface-hover/30 self-start px-3 py-2 rounded-xl border border-border-subtle/50">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          {format(date, "MMM d, h:mm a")}
        </div>
      </motion.div>
    </Link>
  );
};
