import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Readiness = () => {
  const [readiness, setReadiness] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReadinessData();
  }, []);

  const fetchReadinessData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [readinessRes, recsRes] = await Promise.all([
        api.getPlacementReadiness().catch((err) => {
          console.error('Readiness fetch error:', err);
          return null;
        }),
        api.getPlacementRecommendations().catch((err) => {
          console.error('Recs fetch error:', err);
          return null;
        }),
      ]);

      if (readinessRes?.readiness) {
        setReadiness(readinessRes.readiness);
      }
      if (recsRes?.recommendations) {
        setRecommendations(recsRes.recommendations);
      } else if (readinessRes?.readiness?.recommendations) {
        setRecommendations(readinessRes.readiness.recommendations);
      }
    } catch (err) {
      console.error('Failed to load readiness command center:', err);
      setError('Failed to compute placement readiness metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Computing deterministic placement readiness score...</p>
        </div>
      </div>
    );
  }

  if (error || !readiness) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold text-white mb-2">Readiness Data Unavailable</h2>
          <p className="text-slate-400 text-xs mb-6">{error || 'Please complete onboarding milestones to view readiness.'}</p>
          <button
            onClick={fetchReadinessData}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Retry Computation
          </button>
        </div>
      </div>
    );
  }

  const score = readiness.overallReadinessScore ?? readiness.overallScore ?? 0;
  const level = readiness.readinessTier || readiness.level || 'Early Stage';
  const tierColor = readiness.tierColor || (score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-indigo-400' : score >= 50 ? 'text-amber-400' : 'text-slate-400');
  const breakdownList = readiness.breakdownList || (readiness.breakdown?.list ? readiness.breakdown.list : []);

  const getPriorityBadge = (priority) => {
    const p = String(priority).toLowerCase();
    if (p === 'high') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (p === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <span>Problem Statement 27 Solution</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Placement Readiness Command Center</h1>
            <p className="text-slate-400 text-xs mt-1">
              Deterministic 5-factor placement readiness index for <span className="text-indigo-300 font-semibold">{readiness.targetJobRole}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
            >
              Dashboard
            </Link>
            <button
              onClick={fetchReadinessData}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Recalculate</span>
            </button>
          </div>
        </div>

        {/* Master Score Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Master SVG Ring */}
            <div className="flex items-center space-x-6">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="52" stroke="currentColor" strokeWidth="10" className="text-slate-800" fill="transparent" />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className={score >= 80 ? 'text-emerald-500' : score >= 65 ? 'text-indigo-500' : score >= 50 ? 'text-amber-500' : 'text-slate-500'}
                    fill="transparent"
                    strokeDasharray={326.73}
                    strokeDashoffset={326.73 - (326.73 * score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{score}%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Readiness</span>
                </div>
              </div>

              <div>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${tierColor} bg-slate-800/80 border-slate-700`}>
                  {level}
                </span>
                <div className="text-xs text-slate-400 mt-1">
                  Active milestones: <span className="text-white font-semibold">{readiness.completedComponentsCount} of {readiness.totalComponentsCount}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Dynamic weight sum: 100%
                </div>
              </div>
            </div>

            {/* Strategic Overview */}
            <div className="space-y-3 bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 col-span-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Readiness Analysis</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {readiness.tierDescription || 'Continue completing milestones to build a comprehensive placement profile.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 mb-0.5">Strongest Pillar</div>
                  <div className="text-xs font-bold text-white truncate">{readiness.strongestArea || 'Profile Setup'}</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 mb-0.5">Primary Focus Area</div>
                  <div className="text-xs font-bold text-white truncate">{readiness.weakestArea || 'Technical Benchmark'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula Transparency Note */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-start space-x-2 text-xs text-slate-400">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong className="text-slate-300">Transparent Re-weighting: </strong>
              Baseline nominal weights are Resume (20%), Skills (20%), Assessment (25%), Mock Interview (25%), and Profile/Outreach (10%).
              When a component is pending, active completed components are dynamically normalized so effective weights always sum to 100% without fabricating synthetic scores.
            </span>
          </div>
        </div>

        {/* 5-Component Detailed Breakdown */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Component Breakdown & Scoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {breakdownList.map((comp) => {
              const isCompleted = comp.status === 'completed';
              return (
                <div
                  key={comp.key}
                  className={`bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                    isCompleted ? 'border-slate-800 hover:border-slate-700' : 'border-dashed border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm text-white">{comp.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{comp.description}</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <span className="text-slate-400">
                        Score: <strong className="text-white">{isCompleted ? `${comp.score}%` : '—'}</strong>
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Weight: <strong className="text-indigo-300">{comp.effectiveWeight}%</strong> (Nominal: {comp.nominalWeight}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-indigo-500' : 'bg-slate-700/30'
                        }`}
                        style={{ width: isCompleted ? `${comp.score}%` : '0%' }}
                      ></div>
                    </div>

                    {/* Component-Specific Action Link */}
                    {comp.key === 'assessment' && (
                      <Link
                        to="/assessment"
                        className="block w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-indigo-500/30 text-xs font-semibold text-center transition-all"
                      >
                        {isCompleted ? 'Retake Assessment' : 'Take Skill Assessment'}
                      </Link>
                    )}

                    {comp.key === 'interview' && (
                      <Link
                        to="/interview"
                        className="block w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-indigo-500/30 text-xs font-semibold text-center transition-all"
                      >
                        {isCompleted ? 'New Mock Interview' : 'Start Mock Interview'}
                      </Link>
                    )}

                    {comp.key === 'skills' && (
                      <Link
                        to="/roadmap"
                        className="block w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold text-center transition-all"
                      >
                        View Learning Roadmap
                      </Link>
                    )}

                    {comp.key === 'resume' && (
                      <Link
                        to="/dashboard"
                        className="block w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold text-center transition-all"
                      >
                        {isCompleted ? 'Review Resume Analysis' : 'Upload Resume'}
                      </Link>
                    )}

                    {comp.key === 'profile' && (
                      <Link
                        to="/applications"
                        className="block w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold text-center transition-all"
                      >
                        Track Job Applications
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Personalized Action Plan</h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={rec.id || idx}
                  className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 backdrop-blur-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority || 'Medium'} Priority
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">{rec.category || 'Roadmap'}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">{rec.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{rec.description}</p>
                  </div>

                  <Link
                    to={rec.actionLink || '/dashboard'}
                    className="inline-flex items-center justify-center space-x-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>{rec.actionText || 'Take Action'}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
              No pending recommendations. All milestones are on track!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Readiness;
