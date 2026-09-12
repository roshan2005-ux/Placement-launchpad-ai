import React from 'react';
import { Link } from 'react-router-dom';

const ReadinessSummaryCard = ({ readiness, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4"></div>
        <div className="h-20 bg-slate-800/50 rounded-xl mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/40 rounded w-full"></div>
          <div className="h-4 bg-slate-800/40 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!readiness) return null;

  const score = readiness.overallReadinessScore ?? readiness.overallScore ?? 0;
  const level = readiness.readinessTier || readiness.level || 'Early Stage';
  const tierColor = readiness.tierColor || (score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-indigo-400' : score >= 50 ? 'text-amber-400' : 'text-slate-400');
  const breakdownItems = readiness.breakdownList || (readiness.breakdown?.list ? readiness.breakdown.list : []);

  // Determine badge styling based on score
  const getBadgeClass = () => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 65) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <h3 className="text-lg font-bold text-white tracking-wide">Placement Readiness</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getBadgeClass()}`}>
              {level}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Target Role: <span className="text-slate-200 font-medium">{readiness.targetJobRole || 'Full Stack Developer'}</span>
          </p>
        </div>

        <Link
          to="/readiness"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all duration-200 flex items-center space-x-1"
        >
          <span>Deep Dive Analysis</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Main Metric Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5 items-center">
        {/* Score Ring */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                className={score >= 80 ? 'text-emerald-500' : score >= 65 ? 'text-indigo-500' : score >= 50 ? 'text-amber-500' : 'text-slate-500'}
                fill="transparent"
                strokeDasharray={201.06}
                strokeDashoffset={201.06 - (201.06 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white">{score}%</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Readiness Index</div>
            <div className={`text-base font-bold ${tierColor}`}>{level}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {readiness.completedComponentsCount || 0} of {readiness.totalComponentsCount || 5} milestones active
            </div>
          </div>
        </div>

        {/* Priority Focus */}
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Key Focus Area</div>
          <div className="text-sm font-semibold text-slate-200 truncate">
            {readiness.weakestArea || 'Complete Milestones'}
          </div>
          <div className="text-xs text-slate-400 mt-1 line-clamp-2">
            {readiness.tierDescription || 'Continue completing milestones to boost your placement index.'}
          </div>
        </div>

        {/* Action Button Links */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2">
          <Link
            to="/assessment"
            className="w-full text-center text-xs font-semibold py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Skill Assessment</span>
          </Link>
          <Link
            to="/interview"
            className="w-full text-center text-xs font-semibold py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/70 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>AI Mock Interview</span>
          </Link>
        </div>
      </div>

      {/* Component Mini Progress Rows */}
      {breakdownItems.length > 0 && (
        <div className="pt-3 border-t border-slate-800/70 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {breakdownItems.map((comp) => (
            <div key={comp.key} className="bg-slate-800/30 rounded-lg p-2 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 truncate">{comp.name}</span>
                <span className={`font-semibold ${comp.status === 'completed' ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {comp.status === 'completed' ? `${comp.score}%` : 'Pending'}
                </span>
              </div>
              <div className="w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    comp.status === 'completed' ? 'bg-indigo-500' : 'bg-slate-600/30'
                  }`}
                  style={{ width: comp.status === 'completed' ? `${comp.score}%` : '15%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadinessSummaryCard;
