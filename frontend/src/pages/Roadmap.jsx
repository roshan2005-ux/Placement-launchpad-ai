import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Target, 
  Code2, 
  FolderGit2, 
  RefreshCw, 
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Roadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [togglingWeek, setTogglingWeek] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getLatestRoadmap();
      if (res.status === 'success') {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error('Failed to load roadmap:', err.message);
      setError('Could not retrieve learning roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (force = false) => {
    try {
      setGenerating(true);
      setError(null);
      setNotice(null);

      const res = await api.generateRoadmap(force);
      if (res.status === 'success' && res.roadmap) {
        setRoadmap(res.roadmap);
        setNotice(force ? 'Roadmap regenerated successfully.' : 'Personalized roadmap created.');
        setTimeout(() => setNotice(null), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate learning roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleWeek = async (weekNumber) => {
    try {
      setTogglingWeek(weekNumber);
      const res = await api.toggleRoadmapWeek(weekNumber);
      if (res.status === 'success' && res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      setError(err.message || 'Failed to update milestone status.');
    } finally {
      setTogglingWeek(null);
    }
  };

  const targetRole = roadmap?.targetJobRole || user?.targetJobRole || 'Your Target Role';
  const totalEstimatedHours = roadmap?.weeks?.reduce((acc, w) => acc + (w.estimatedHours || 0), 0) || 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          {roadmap && (
            <button
              type="button"
              onClick={() => handleGenerate(true)}
              disabled={generating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Regenerating...' : 'Regenerate Roadmap'}</span>
            </button>
          )}
        </div>

        {/* Notices and Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleGenerate(true)}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            <span className="text-sm text-slate-400 font-medium">Loading your personalized roadmap...</span>
          </div>
        ) : !roadmap ? (
          /* Empty State */
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">No Active Roadmap Found</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate a 4-6 week custom learning roadmap prioritized around your verified skill gaps for {targetRole}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleGenerate(false)}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all cursor-pointer"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{generating ? 'Curating Curriculum...' : 'Generate Roadmap Now'}</span>
            </button>
          </div>
        ) : (
          /* Roadmap Header & Timeline */
          <div className="space-y-8">
            {/* Header Hero Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-80 h-36 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      Target Role: {roadmap.targetJobRole}
                    </span>
                    <span className="text-xs text-slate-500">&bull;</span>
                    <span className="text-xs text-slate-400 font-medium font-mono">
                      {roadmap.durationWeeks} Weeks Curriculum
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {roadmap.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {roadmap.summary}
                  </p>
                </div>

                {/* Overall Hours & Completed Metrics */}
                <div className="flex sm:flex-col gap-3 justify-between sm:text-right flex-shrink-0">
                  <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl min-w-[140px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      Total Commitment
                    </span>
                    <span className="text-lg font-bold font-mono text-white flex items-center gap-1.5 sm:justify-end">
                      <Clock className="w-4 h-4 text-violet-400" />
                      ~{totalEstimatedHours} Hours
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl min-w-[140px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      Completed Weeks
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-400 flex items-center gap-1.5 sm:justify-end">
                      <CheckCircle2 className="w-4 h-4" />
                      {roadmap.completedWeeks} / {roadmap.totalWeeks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    Overall Roadmap Progress
                  </span>
                  <span className="font-mono font-bold text-violet-400">
                    {roadmap.progressPercent}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${Math.max(roadmap.progressPercent, 4)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline Weekly Cards */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  Weekly Milestones & Task Breakdown
                </h2>
                <span className="text-xs text-slate-500">
                  Click checkbox to mark week completed
                </span>
              </div>

              <div className="space-y-5">
                {roadmap.weeks?.map((week) => {
                  const isDone = week.completed;
                  const isUpdating = togglingWeek === week.weekNumber;

                  return (
                    <div
                      key={week.weekNumber}
                      className={`rounded-3xl border transition-all relative overflow-hidden ${
                        isDone
                          ? 'bg-slate-900/60 border-emerald-500/30'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Week Card Header */}
                      <div className="p-6 sm:p-7 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleToggleWeek(week.weekNumber)}
                            disabled={isUpdating}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0 mt-0.5 sm:mt-0 ${
                              isDone
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'border-2 border-slate-700 hover:border-violet-400 text-transparent'
                            }`}
                            title={isDone ? 'Mark as incomplete' : 'Mark week completed'}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 fill-current" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2.5 mb-1">
                              <span
                                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  isDone
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                                }`}
                              >
                                Week 0{week.weekNumber}
                              </span>

                              {isDone && (
                                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                                  Milestone Achieved ✓
                                </span>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {week.topic}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 self-end sm:self-auto bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                          <Clock className="w-3.5 h-3.5 text-violet-400" />
                          <span>~{week.estimatedHours} hrs estimated</span>
                        </div>
                      </div>

                      {/* Week Card Body: Objective, Practice Task, Project Task */}
                      <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* 1. Objective */}
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                              <Target className="w-4 h-4" />
                              <span>Learning Objective</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {week.objective}
                            </p>
                          </div>
                          <div className="pt-2 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                            Theoretical & Conceptual
                          </div>
                        </div>

                        {/* 2. Practice Task */}
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                              <Code2 className="w-4 h-4" />
                              <span>Practice Task</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {week.practiceTask}
                            </p>
                          </div>
                          <div className="pt-2 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                            Algorithmic & Drills
                          </div>
                        </div>

                        {/* 3. Project Task */}
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                              <FolderGit2 className="w-4 h-4" />
                              <span>Project Deliverable</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {week.projectTask}
                            </p>
                          </div>
                          <div className="pt-2 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                            Portfolio GitHub Artifact
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
