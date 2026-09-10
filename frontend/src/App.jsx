import { useState, useEffect } from 'react';

function App() {
  const [healthStatus, setHealthStatus] = useState({ status: 'checking...', message: 'Connecting to backend...' });

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setHealthStatus(data))
      .catch((err) => {
        setHealthStatus({ status: 'offline', message: 'Backend unreachable or not started yet' });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Foundation Stage 1</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            Problem Statement 27
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            Placement Launchpad AI
          </h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            The Modern Placement Launchpad platform environment and core project scaffolding are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Frontend Stack</span>
            <span className="text-sm font-semibold text-sky-400 mt-1">React + Vite + Tailwind CSS</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Backend Stack</span>
            <span className="text-sm font-semibold text-emerald-400 mt-1">Node.js + Express REST API</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Backend Health Connection</span>
            <span className={`font-mono uppercase font-semibold ${healthStatus.status === 'ok' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {healthStatus.status}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
            {healthStatus.message}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80">
          <span>Ready for Stage 2: Database & Auth Setup</span>
          <span>Port 5173 (Vite) &bull; Port 5000 (Express)</span>
        </div>
      </div>
    </div>
  );
}

export default App;
