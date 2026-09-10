import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Map, 
  CheckSquare, 
  MessageSquareCode, 
  Sparkles, 
  ArrowUpRight, 
  UserCheck, 
  Lock,
  Compass
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const completion = user?.profileCompletion || 0;
  const targetRole = user?.targetJobRole || 'Target Role Not Set';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Student Portal Live
                </span>
                <span className="text-xs text-slate-500">&bull;</span>
                <span className="text-xs text-slate-400 font-medium">{user?.college || 'College Enrolled'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">{user?.name || 'Student'}</span>
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl">
                Track your placement preparation, target role diagnostics, and career readiness milestones.
              </p>
            </div>

            {/* Target Role & Profile Completion Widget */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[200px]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target Role</span>
                </div>
                <div className="text-sm font-bold text-slate-100 truncate">
                  {targetRole}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[200px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Profile Status</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{completion}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mt-2 block"
                >
                  Edit profile details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Future Stages Modules (Roadmap Preview) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Placement Modules & Pipelines</h2>
              <p className="text-xs text-slate-400">Stages in development for Problem Statement 27.</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Stage 2 Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Stage 4: AI Career Analysis */}
            <div className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Coming in Stage 4</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  AI Career Analysis & Resume Parser
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Upload your resume in PDF format for Gemini AI extraction of technical competencies, project verification, and automated skill-gap analysis against top industry tech stacks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Gemini API &bull; Skill Gap Matrix</span>
                <span className="text-slate-600">Stage 4</span>
              </div>
            </div>

            {/* Stage 5: Learning Roadmap */}
            <div className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Map className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Coming in Stage 5</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Personalized Learning Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Dynamic step-by-step milestone planner tailored specifically to bridge the exact gaps identified between your resume and {targetRole}.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Custom Milestone Engine</span>
                <span className="text-slate-600">Stage 5</span>
              </div>
            </div>

            {/* Stage 6: Assessment */}
            <div className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Coming in Stage 6</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Adaptive Assessments & Quizzes
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Role-aligned technical mcqs, core CS fundamentals (OS, DBMS, CN), and quantitative aptitude tests with instant performance grading.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Adaptive Quiz Engine</span>
                <span className="text-slate-600">Stage 6</span>
              </div>
            </div>

            {/* Stage 7: AI Mock Interview */}
            <div className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Coming in Stage 7</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  AI Mock Interview Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Interactive real-time mock interview conducting technical, behavioral, and system design rounds with instant feedback on confidence and accuracy.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Interactive AI Simulator</span>
                <span className="text-slate-600">Stage 7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
