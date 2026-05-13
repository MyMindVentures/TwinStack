import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Globe,
  UserCircle,
  Layers,
  Target,
  Twitter,
  Github,
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "../lib/utils";
import { UserRole } from "../types";
import { authService } from "../services/authService";

interface VibecoderSetupProps {
  onSelectRole: (role: UserRole) => void;
}

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "Australia",
  "Singapore",
  "Other",
];

const genders = ["Male", "Female", "Non-binary", "Other", "Prefer not to say"];

const skillsOptions = [
  "React",
  "TypeScript",
  "AI/ML",
  "UI/UX",
  "Backend",
  "Frontend",
  "Cloud",
  "Product",
  "Marketing",
  "Design",
  "DevOps",
  "Solidity",
];

const purposes = [
  "I want to contribute to the UI/UX",
  "I want to help with backend optimization",
  "I want to provide security audits",
  "I want to build a documentation site",
  "I'm here to fork and expand the ecosystem",
  "Other (please specify below)",
];

export default function VibecoderSetup({ onSelectRole }: VibecoderSetupProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    gender: "",
    skills: [] as string[],
    purpose: "",
    customPurpose: "",
    twitter: "",
    github: "",
    photoUrl: "",
  });

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const profile = {
        name: formData.name,
        country: formData.country,
        gender: formData.gender,
        skills: formData.skills,
        purpose:
          formData.purpose === "Other (please specify below)"
            ? formData.customPurpose
            : formData.purpose,
        twitter: formData.twitter,
        github: formData.github,
        photoUrl: formData.photoUrl || "",
      };

      await authService.signup(formData.email, formData.password, profile);

      // 3. Set Role & Redirect
      onSelectRole("Vibecoder Guest");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <button
          onClick={() => navigate("/login")}
          className="mb-8 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Back to choice
          </span>
        </button>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-text-primary mb-2 tracking-tight">
            The Vibecoder Profile
          </h1>
          <p className="text-text-secondary font-medium leading-relaxed">
            Complete your profile to access the TwinStack project resources.
            Permissions are strictly read-only for public auditing and
            collaborative vibes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          {/* Account Credentials */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-b border-border-subtle pb-2">
              01 / Account Access
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="vibecoder@example.com"
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Confirm Password
                  </label>
                  <input
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Identity Section */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-b border-border-subtle pb-2">
              02 / Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Country
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-bg-primary">
                      Select country
                    </option>
                    {countries.map((c) => (
                      <option key={c} value={c} className="bg-bg-primary">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <UserCircle className="w-3 h-3" /> Gender
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-bg-primary">
                    Select gender
                  </option>
                  {genders.map((g) => (
                    <option key={g} value={g} className="bg-bg-primary">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3 h-3" /> Your Purpose
                </label>
                <select
                  required
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-bg-primary">
                    Why are you here?
                  </option>
                  {purposes.map((p) => (
                    <option key={p} value={p} className="bg-bg-primary">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.purpose === "Other (please specify below)" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Detailed Purpose
                </label>
                <textarea
                  required
                  maxLength={500}
                  value={formData.customPurpose}
                  onChange={(e) =>
                    setFormData({ ...formData, customPurpose: e.target.value })
                  }
                  placeholder="Describe how you want to help TwinStack..."
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none h-24 resize-none"
                />
              </motion.div>
            )}
          </section>

          {/* Skills Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-b border-border-subtle pb-2">
              03 / Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsOptions.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                    formData.skills.includes(skill)
                      ? "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                      : "bg-surface-primary border-border-subtle text-text-secondary hover:border-border-strong",
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </section>

          {/* Socials Section */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 border-b border-border-subtle pb-2">
              04 / Provenance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Twitter className="w-3 h-3" /> Twitter/X URL
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                  placeholder="https://x.com/username"
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Github className="w-3 h-3" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  placeholder="https://github.com/username"
                  className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-3 h-3" /> User Avatar URL
              </label>
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, photoUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-surface-primary/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-border-strong focus:outline-none transition-all"
              />
              <p className="text-[10px] text-text-muted italic">
                Optional: Uploaded via external provider URL (or auto-fetch from
                Google).
              </p>
            </div>
          </section>

          <div className="bg-surface-primary/30 p-6 rounded-2xl border border-border-subtle/50 space-y-4">
            <p className="text-[10px] text-text-secondary leading-relaxed italic">
              By confirming, you agree to the{" "}
              <Link
                to="/terms"
                className="text-text-primary underline font-bold"
              >
                Terms & Conditions
              </Link>{" "}
              including intellectual property protection of the TwinStack
              engine.
            </p>
            <button
              disabled={
                loading ||
                formData.skills.length === 0 ||
                !formData.name ||
                !formData.country ||
                !formData.purpose
              }
              className={cn(
                "w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em] transition-all",
                loading ||
                  formData.skills.length === 0 ||
                  !formData.name ||
                  !formData.country ||
                  !formData.purpose
                  ? "bg-surface-hover text-text-muted cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-500/20 active:scale-[0.98]",
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Seal Profile & Sync
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
