import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, FileText, Scale, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSetupFlow = searchParams.get('intent') === 'setup';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-6 md:p-12 pb-32">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to landing</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <header>
            <h1 className="text-4xl font-bold text-zinc-100 mb-4 tracking-tight">Terms & Conditions</h1>
            <p className="text-zinc-500 font-medium">Last updated: May 13, 2026</p>
          </header>

          <section className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-2">Intellectual Property Rights</h2>
                <p className="leading-relaxed text-zinc-400 text-sm">
                  TwinStack, including but not limited to its concept, user interface design, collaboration workflow, proprietary synchronization logic, 
                  naming conventions, and visual assets, are the exclusive intellectual property of <span className="text-zinc-100 font-semibold">Parallax Studio</span>. 
                  Any unauthorized cloning, reproduction, resale, redistribution, or derivation based on these elements—in part or in whole—is 
                  strictly prohibited. Parallax Studio reserves all rights globally.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-2">Usage License & Guest Prohibitions</h2>
                <p className="leading-relaxed text-zinc-400 text-sm">
                  The TwinStack application is a tool for internal product development. "Vibecoder Guest" accounts are granted 
                  a non-exclusive, non-transferable, and revocable license to view specific build data for auditing and 
                  collaborative observation only. Guests are strictly prohibited from data scraping, modification of state, 
                  or any action that interferes with the core Architect-Builder pipeline. Access is provided "as is" without warranty.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-2">Enforcement & Legal Remedies</h2>
                <p className="leading-relaxed text-zinc-400 text-sm">
                  Parallax Studio monitors access signatures. Any attempt to replicate the unique "Logic Drift" mitigation 
                  or the "Intent-to-Spec" engine will result in immediate termination of access and the filing of copyright 
                  infringement claims. We retain the right to seek injunctive relief and damages in any jurisdiction 
                  where such violations occur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-2">Data Privacy</h2>
                <p className="leading-relaxed text-zinc-400">
                  All synchronization data and project metadata are encrypted. Parallax Studio does not sell your workflow data 
                  to third parties. The "build-in-public" visibility is controlled by project owners through the guest access portal.
                </p>
              </div>
            </div>
          </section>

          <footer className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <p className="text-sm text-zinc-600 italic">
              © 2026 Parallax Studio. All rights reserved. Registered in Digital Space.
            </p>
            
            {isSetupFlow && (
              <button
                onClick={() => navigate('/vibecoder-setup')}
                className="px-8 py-4 bg-zinc-100 text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white rounded-xl shadow-xl shadow-white/5 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                I Accept & Continue
                <Check className="w-4 h-4" />
              </button>
            )}
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
