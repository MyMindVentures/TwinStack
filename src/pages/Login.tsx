import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole } from "../types";
import { PenTool, Hammer, Eye, Lock, ArrowRight, X, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState<UserRole | null>(
    null,
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async (role: UserRole) => {
    setShowPasswordModal(role);
    setError(null);
    setFormData({ email: "", password: "" });
  };

  const isInternal =
    showPasswordModal === "Architect" || showPasswordModal === "Builder";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordModal) return;
    setLoading(true);
    setError(null);

    const credentials: any = { password: formData.password };

    if (isInternal) {
      credentials.username = showPasswordModal.toLowerCase();
    } else {
      credentials.email = formData.email;
    }

    try {
      await authService.login(credentials);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.message || "Authentication failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2 font-sans">
          Workspace
        </h1>
        <p className="text-text-secondary font-medium">
          Select your profile and sign in to continue
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
        <RoleCard
          role="Architect"
          icon={<PenTool className="w-8 h-8" />}
          description="Design concepts and request features"
          color="bg-blue-500"
          onClick={() => handleRoleSelection("Architect")}
        />
        <RoleCard
          role="Builder"
          icon={<Hammer className="w-8 h-8" />}
          description="Access the queue and build the vision"
          color="bg-emerald-500"
          onClick={() => handleRoleSelection("Builder")}
        />
        <RoleCard
          role="Vibecoder Guest"
          icon={<Eye className="w-8 h-8" />}
          description="View the build process in real-time"
          color="bg-purple-500"
          onClick={() => handleRoleSelection("Vibecoder Guest")}
        />
        <RoleCard
          role="Subscribed User"
          icon={<Zap className="w-8 h-8" />}
          description="Create your own private projects"
          color="bg-amber-500"
          onClick={() => handleRoleSelection("Subscribed User")}
        />
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-surface-primary border border-border-subtle rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-surface-hover text-text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary italic">
                    {showPasswordModal} Login
                  </h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(null)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-4">
                  {!isInternal && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder={
                          showPasswordModal === "Vibecoder Guest"
                            ? "vibecoder@example.com"
                            : "subscriber@example.com"
                        }
                        className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {isInternal ? "Internal Password" : "Password"}
                    </label>
                    <input
                      autoFocus={isInternal}
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••••••"
                      className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    />
                    {error && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 font-mono uppercase">
                        Error: {error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    disabled={loading}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 group",
                      !isInternal
                        ? "bg-purple-600 text-white hover:bg-purple-500"
                        : "bg-white text-black hover:bg-white",
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

                  {showPasswordModal === "Vibecoder Guest" && (
                    <div className="text-center">
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-4">
                        New here?
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/terms?intent=setup")}
                        className="text-xs text-text-primary font-bold uppercase tracking-widest hover:text-purple-400 transition-colors border-b border-border-subtle pb-1"
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
    </div>
  );
}

function RoleCard({
  role,
  icon,
  description,
  color,
  onClick,
}: {
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
      <div
        className={cn(
          "mb-6 p-4 rounded-2xl text-white transition-transform group-hover:scale-110 shadow-lg",
          color,
        )}
      >
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">{role}</h2>
      <p className="text-text-secondary text-sm leading-relaxed font-medium">
        {description}
      </p>
    </motion.button>
  );
}
