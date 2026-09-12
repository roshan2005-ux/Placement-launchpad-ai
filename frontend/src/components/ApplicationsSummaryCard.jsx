import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  ArrowRight, 
  Plus, 
  Layers, 
  CheckCircle2, 
  MessageSquareCode, 
  Trophy, 
  Clock,
  ExternalLink,
  MapPin
} from 'lucide-react';

const STATUS_CONFIG = {
  Applied: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
  },
  Assessment: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  Interview: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
  },
  Selected: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  Rejected: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
  },
};

export const ApplicationsSummaryCard = ({
  stats = { total: 0, applied: 0, assessment: 0, interview: 0, selected: 0, rejected: 0, active: 0 },
  recentApplications = [],
  loading = false,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-80 h-36 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Job Application Tracker</h2>
          </div>
          <p className="text-xs text-slate-400">
            Track your ongoing company job applications, scheduled assessments, and interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all"
          >
            <span>Manage All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards: Total, Active, Interviews, Selected */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Applications */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {stats?.total || 0}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Total Applications</div>
          </div>
        </div>

        {/* Active Applications */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-indigo-400">
              {stats?.active || 0}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Active Pipelines</div>
          </div>
        </div>

        {/* Interviews */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-violet-400">
              {stats?.interview || 0}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Interviews</div>
          </div>
        </div>

        {/* Selected */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              {stats?.selected || 0}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Offers / Selected</div>
          </div>
        </div>
      </div>

      {/* Recent Applications List or Empty Prompt */}
      {recentApplications.length > 0 ? (
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-slate-500">Recent Applications</span>
            <Link to="/applications" className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              <span>View full list</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentApplications.slice(0, 3).map((app) => {
              const style = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                        {app.companyName}
                      </h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                      {app.jobRole}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        {app.location || 'Remote'}
                      </span>
                      <span>&bull;</span>
                      <span>{app.jobType}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>
                      {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'Recent'}
                    </span>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative z-10 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't tracked any job applications yet. Add your applied companies to view assessment schedules and interview progress.
          </p>
          <Link
            to="/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your First Job Application</span>
          </Link>
        </div>
      )}
    </div>
  );
};
