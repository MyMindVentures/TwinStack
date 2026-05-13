import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Smartphone,
  Tablet, 
  Hammer, 
  PenTool,
  Clock,
  Layout,
  Code,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Landing() {
  return (
    <div className="flex flex-col bg-[#0a0a0a] text-zinc-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-8">
            <Sparkles className="w-3 h-3" />
            Productivity Reimagined
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-100 mb-6 font-sans">
            TwinStack
          </h1>
          <p className="text-xl md:text-3xl font-medium text-zinc-400 mb-8 tracking-tight">
            From Architecture to Build.
          </p>
          <p className="text-sm md:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed mb-10 font-medium font-mono italic">
            "A focused workflow app where The Architect turns ideas into structured requests and The Builder receives a clear execution queue."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-white/5 hover:bg-white transition-all uppercase tracking-widest text-xs"
              >
                Open App
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </section>

      {/* Workflow Section */}
      <section className="py-32 px-6 bg-[#0c0c0e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4 px-4 py-2 border border-zinc-800 rounded-full inline-block bg-zinc-900/50">
              The Synchronized Flow
            </h2>
            <p className="text-3xl font-bold text-zinc-100">Three Steps to Reality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WorkflowStep 
              number="01"
              title="Conceptualize Idea"
              description="The Architect describes a feature in plain language without worrying about structure."
              icon={<Zap className="w-6 h-6 text-blue-400" />}
            />
            <WorkflowStep 
              number="02"
              title="AI Resubmission"
              description="TwinStack automatically structures the intent into non-technical and technical specifications."
              icon={<Sparkles className="w-6 h-6 text-emerald-400" />}
            />
            <WorkflowStep 
              number="03"
              title="Execution Queue"
              description="The Builder receives a clear, prioritized card in their workspace ready for code."
              icon={<Hammer className="w-6 h-6 text-amber-500" />}
            />
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/40">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800 bg-[#0e0e0e]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5 text-blue-400" />
                    Architect Interface
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/2 bg-zinc-800 rounded-full animate-pulse" />
                  <div className="h-32 w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                    <div className="h-2 w-3/4 bg-zinc-800 rounded-full mb-2" />
                    <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
                  </div>
                  <div className="p-6 glass-panel rounded-xl architect-accent shadow-xl bg-zinc-900/40">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Technical Specification</p>
                    <p className="text-xs font-mono text-zinc-400">Implement AuthContext using React Context API...</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 bg-[#121212]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Hammer className="w-3.5 h-3.5 text-emerald-400" />
                    Builder Queue
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-5 glass-panel rounded-lg builder-accent border border-zinc-800 bg-zinc-900/60 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-[10px] font-mono text-zinc-600">REQ-0842</div>
                    </div>
                    <p className="text-xs text-zinc-200 font-medium">Dark mode state sync...</p>
                  </div>
                  <div className="p-5 glass-panel rounded-lg builder-accent border border-zinc-800 bg-zinc-900/40 opacity-50">
                    <div className="h-2 w-1/3 bg-zinc-800 rounded-full mb-4" />
                    <div className="h-2 w-full bg-zinc-800 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List */}
      <section className="py-32 px-6 bg-[#0c0c0e]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <Feature 
              icon={<Shield className="w-5 h-5 text-blue-400" />}
              title="2 Fixed Roles"
              description="Optimized for co-founder dynamics with distinct Architect and Builder profiles."
            />
            <Feature 
              icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
              title="AI-Structured Requests"
              description="Gemini-powered restructuring translates intent into technical specifications."
            />
            <Feature 
              icon={<Layout className="w-5 h-5 text-amber-500" />}
              title="Builder Queue"
              description="A clean, chronological waiting line of approved tasks for focused execution."
            />
            <Feature 
              icon={<Clock className="w-5 h-5 text-red-400" />}
              title="Timestamped Cards"
              description="Every request is documented with precise date and time tracking metadata."
            />
            <Feature 
              icon={<CheckCircle2 className="w-5 h-5 text-purple-400" />}
              title="Mobile & Tablet Optimized"
              description="High-fidelity workspace designed for touch interaction and split-screen usage."
            />
            <Feature 
              icon={<Zap className="w-5 h-5 text-zinc-100" />}
              title="Real-time Updates"
              description="Builders receive instant notifications as soon as a request is approved."
            />
          </div>
        </div>
      </section>

      {/* Why TwinStack Exists */}
      <section className="py-80 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.05),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-12">
              Founder's Vision
            </div>

            <h2 className="text-5xl md:text-8xl font-bold text-zinc-100 mb-24 tracking-tighter leading-none">
              Why TwinStack <br className="hidden md:block" /> <span className="text-zinc-500">Exists</span>
            </h2>
            
            <div className="space-y-16 text-xl md:text-2xl text-zinc-400 leading-relaxed font-light max-w-4xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                TwinStack was born from a real problem.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The Architect has spent years developing strong app concepts and fighting to attract vibecoders capable of turning those concepts into real products. Despite sharing ideas publicly and pushing constantly on social platforms, many people still underestimate the value of deep product thinking from non-coding founders.
              </motion.p>
              
              <div className="py-24">
                <div className="flex flex-col items-center">
                  <div className="h-[2px] w-12 bg-purple-500/30 mb-12" />
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-zinc-100 font-bold text-4xl md:text-6xl tracking-tighter italic leading-tight"
                  >
                    TwinStack was created as <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Proof of Mind.</span>
                  </motion.p>
                  <div className="h-[2px] w-12 bg-blue-500/30 mt-12" />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                A live build-in-public system where product architecture, execution requests and real development become visible in real time.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="text-left p-10 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/10 backdrop-blur-xl transition-all"
                >
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-4">Role 01: Architect</p>
                  <p className="text-3xl font-bold text-zinc-100 tracking-tight">Structures the vision.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="text-left p-10 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/10 backdrop-blur-xl transition-all"
                >
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-4">Role 02: Builder</p>
                  <p className="text-3xl font-bold text-zinc-100 tracking-tight">Transforms it into software.</p>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="max-w-3xl mx-auto"
              >
                Vibecoders can follow the evolution of TwinStack itself, observe the workflow, contribute improvements, fork ideas and potentially become long-term collaborators inside future Parallax Studio ventures.
              </motion.p>
              
              <div className="flex flex-wrap justify-center gap-6 pt-12">
                {['NDA Agreements', 'Revenue Splits', 'Venture Partnerships'].map((item, i) => (
                  <motion.span 
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (i * 0.1) }}
                    className="px-6 py-2 rounded-full border border-zinc-800/50 bg-zinc-950/20 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>

              <motion.p 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-bold text-4xl md:text-7xl mt-56 tracking-tighter leading-[1] max-w-4xl mx-auto"
              >
                “TwinStack exists to find the builders who see the vision before the crowd does.”
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plan */}
      <section className="py-32 px-6 bg-[#0c0c0e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4 px-4 py-2 border border-zinc-800 rounded-full inline-block bg-zinc-900/50">
              Subscription
            </h2>
            <p className="text-3xl font-bold text-zinc-100">Private Workspaces</p>
          </div>

          <div className="max-w-md mx-auto p-10 glass-panel rounded-3xl border border-amber-500/30 text-center relative overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-bold text-zinc-100 mb-2 relative z-10">Creator Plan</h3>
            <div className="flex items-end justify-center gap-1 mb-8 relative z-10">
              <span className="text-5xl font-bold text-white">$29</span>
              <span className="text-sm font-medium text-zinc-500 pb-1">/month</span>
            </div>
            <ul className="space-y-4 mb-10 text-sm md:text-base font-medium text-zinc-400 text-left relative z-10">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500" /> Create unlimited private projects</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500" /> TwinStack public viewing included</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500" /> Dedicated Builder queue</li>
            </ul>
            <button
               onClick={() => alert('Stripe Configuration Missing. Set STRIPE_SECRET_KEY in production to enable real checkout.')}
               className="w-full py-4 bg-amber-500 text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-amber-400 transition-colors relative z-10"
            >
              Subscribe via Stripe
            </button>
          </div>
        </div>
      </section>

      {/* Support The Mission */}
      <section className="py-32 px-6 bg-[#0a0a0a] border-t border-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-100">Support The Mission</h2>
            <div className="space-y-6 text-zinc-400 leading-relaxed font-light text-lg">
              <p>I am currently building TwinStack and future Parallax Studio ventures full-time. While this journey is immensely rewarding, it is currently self-funded during this critical early stage where apps aren't monetized and partnerships are still forming.</p>
              <p>TwinStack exists as Proof of Mind—a public display of product architecture and execution designed to attract aligned builders. Your support helps keep this vision alive, sustains full-time development, and accelerates the collaborations that will define the future of our studio.</p>
            </div>
            <div className="pt-8">
              <a 
                href="https://wise.com/pay/me/kevind469"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl shadow-lg shadow-white/5 hover:bg-white transition-all uppercase tracking-widest text-xs"
              >
                Support via Wise
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center font-bold text-zinc-100 border border-zinc-700 text-xs tracking-tighter">
              TS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest uppercase text-zinc-300">TwinStack</span>
              <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">by Parallax Studio</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
              © 2026 Parallax Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="text-[10px] text-zinc-500 hover:text-zinc-100 transition-colors uppercase tracking-widest font-bold">
                Terms & Conditions
              </Link>
              <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
              <Link to="/login" className="text-[10px] text-zinc-500 hover:text-zinc-100 transition-colors uppercase tracking-widest font-bold">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function WorkflowStep({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col p-8 glass-panel rounded-3xl border border-zinc-800/10 hover:border-zinc-800 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] font-mono text-zinc-700 font-bold tracking-widest group-hover:text-zinc-500 transition-colors">STEP {number}</span>
      </div>
      <h3 className="text-xl font-bold text-zinc-100 mb-2 truncate">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-200 mb-1 uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}
