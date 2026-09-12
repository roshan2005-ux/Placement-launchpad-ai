import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  Briefcase, 
  RefreshCw, 
  Clock, 
  Cpu,
  Target,
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const AnalysisResults = ({ 
  analysis, 
  targetRole, 
  onAnalyzeAgain, 
  loading 
}) => {
  if (!analysis) return null;

  const matchScore = analysis.overallMatch || 0;

  // Determine color theme based on score
  let scoreTheme = {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ring: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-400',
    label: 'Strong Role Match',
  };

  if (matchScore < 50) {
    scoreTheme = {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      ring: 'text-rose-400',
      gradient: 'from-rose-500 to-amber-500',
      label: 'Needs Skill Expansion',
    };
  } else if (matchScore < 75) {
    scoreTheme = {
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      ring: 'text-sky-400',
      gradient: 'from-sky-400 to-indigo-500',
      label: 'Moderate Role Match',
    };
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-8 animate-fadeIn">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Actions */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Resume Analysis Report
            </h2>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>Evaluated for target role:</span>
            <span className="font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {analysis.targetJobRole || targetRole}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Provider badge */}
          <div className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>
              {analysis.provider?.includes('gemini') ? 'Gemini 2.5 Flash' : 'Semantic Heuristic Engine'}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(analysis.analyzedAt)}</span>
          </div>

          {/* Analyze Again Button */}
          <button
            type="button"
            onClick={onAnalyzeAgain}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Re-analyzing...' : 'Analyze Again'}</span>
          </button>
        </div>
      </div>

      {/* A & B: Score Banner & Executive Summary */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section A: Overall Match Gauge */}
        <div className="lg:col-span-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="relative mb-3">
            {/* Circular Progress Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className={scoreTheme.ring}
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * matchScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {matchScore}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Match
                </span>
              </div>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${scoreTheme.badge}`}>
            {scoreTheme.label}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            Role Alignment Index
          </p>
        </div>

        {/* Section B: AI Summary */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Executive AI Evaluation Summary
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              "{analysis.summary}"
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              Benchmark: Top campus hiring bar standards
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">
              Zero-Hallucination Grounded Score
            </span>
          </div>
        </div>
      </div>

      {/* C, D & E: Skill Diagnostics (Strong, To Improve, Missing) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Section C: Strong Skills (Green) */}
        <div className="bg-slate-950/60 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-white">Strong Skills</h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {analysis.strongSkills?.length || 0} Found
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3.5">
              Verified technical capabilities actively evidenced in your resume text:
            </p>

            <div className="flex flex-wrap gap-2">
              {analysis.strongSkills && analysis.strongSkills.length > 0 ? (
                analysis.strongSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No strong skills identified.</span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-emerald-400/80 font-mono">
            &bull; Evidenced in resume
          </div>
        </div>

        {/* Section D: Skills to Improve (Amber) */}
        <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-white">Skills to Improve</h4>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {analysis.skillsToImprove?.length || 0} Areas
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3.5">
              Skills mentioned superficially or requiring deeper production experience:
            </p>

            <div className="flex flex-wrap gap-2">
              {analysis.skillsToImprove && analysis.skillsToImprove.length > 0 ? (
                analysis.skillsToImprove.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No secondary skills flagged.</span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-amber-400/80 font-mono">
            &bull; Needs project depth
          </div>
        </div>

        {/* Section E: Missing Skills (Rose / Red) */}
        <div className="bg-slate-950/60 border border-rose-500/20 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-white">Missing Skills</h4>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                {analysis.missingSkills?.length || 0} Gaps
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3.5">
              Critical competencies for {analysis.targetJobRole || targetRole} unevidenced in resume:
            </p>

            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                analysis.missingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3 text-rose-400" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">All core role competencies evidenced!</span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-rose-400/80 font-mono">
            &bull; High priority gap
          </div>
        </div>
      </div>

      {/* F & G: Recommendations & Role-Specific Feedback */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section F: Actionable Recommendations */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Actionable Recommendations
            </h3>
          </div>

          <div className="space-y-3">
            {analysis.recommendations?.map((rec, index) => (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300 hover:border-slate-700 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  {index + 1}
                </span>
                <span className="leading-relaxed flex-1">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section G: Role-Specific Feedback */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Role-Specific Recruitment Insights
            </h3>
          </div>

          <div className="space-y-3">
            {analysis.roleSpecificFeedback?.map((feedback, index) => (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300 hover:border-slate-700 transition-colors"
              >
                <Award className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed flex-1">{feedback}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
