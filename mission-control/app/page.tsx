import { Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { getDashboardStats } from '@/lib/store';

export default function Home() {
  const stats = getDashboardStats();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          Mission Control
        </h1>
        
        {/* Subtitle */}
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          AI-powered command center for managing tasks, expenses, memories, and sub-agents
        </p>

        {/* CTA Button */}
        <a 
          href="/dashboard" 
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
        >
          Enter Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-bold text-white mb-1">{stats.totalTasks}</p>
            <p className="text-xs text-slate-400">Tasks</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-bold text-white mb-1">{stats.activeAgents}</p>
            <p className="text-xs text-slate-400">Agents</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-bold text-white mb-1">${stats.monthlySpend.toFixed(2)}</p>
            <p className="text-xs text-slate-400">Spent</p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-slate-600 text-sm">
          Built with Next.js & OpenClaw
        </p>
      </div>
    </main>
  );
}
