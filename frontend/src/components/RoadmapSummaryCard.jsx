import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Target, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const RoadmapSummaryCard = ({
  roadmap,
  hasAnalysis,
  targetRole,
  onGenerateRoadmap,
  generating = false,
  error = null,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-80 h-36 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Personalized Learning Roadmap
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            A tailored milestone curriculum targeting your verified skill gaps for {targetRole || 'your chosen role'}.
          </p>
        </div>

        {roadmap && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              {roadmap.durationWeeks}-Week Program Active
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Content based on roadmap existence */}
      {roadmap ? (
        <div className="relative z-10 space-y-6">
          {/* Summary Banner & Progress */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {roadmap.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {roadmap.summary}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/roadmap"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all"
                >
                  <span>View Full Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => onGenerateRoadmap(true)}
                  disabled={generating}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors disabled:opacity-50"
                  title="Regenerate Roadmap"
                >
                  <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Roadmap Milestone Progress
                </span>
                <span className="font-mono font-bold text-violet-400">
                  {roadmap.completedWeeks} of {roadmap.totalWeeks} Weeks Complete ({roadmap.progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(roadmap.progressPercent, 4)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Peek of Week Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {roadmap.weeks?.slice(0, 3).map((week) => (
              <div
                key={week.weekNumber}
                className={`p-4 rounded-xl border transition-all ${
                  week.completed
                    ? 'bg-slate-950/40 border-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className={week.completed ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                    WEEK 0{week.weekNumber}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {week.estimatedHours} hrs
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                  {week.topic}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {week.objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty state: prompt to generate */
        <div className="relative z-10 bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
            {generating ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Sparkles className="w-7 h-7" />
            )}
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Ready to Bridge Your Skill Gaps?
            </h3>
            <p className="text-xs text-slate-400">
              {hasAnalysis
                ? `Generate an adaptive 5-week study and project plan tailored to your verified skill gaps for ${targetRole}.`
                : 'Complete your Resume Analysis above first to uncover your exact skill gaps before generating a roadmap.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onGenerateRoadmap(false)}
              disabled={generating || !hasAnalysis}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Curating 5-Week Roadmap...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>Generate Personalized Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
