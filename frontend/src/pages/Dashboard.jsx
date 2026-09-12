import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ResumeSection } from '../components/ResumeSection';
import { AnalysisResults } from '../components/AnalysisResults';
import { RoadmapSummaryCard } from '../components/RoadmapSummaryCard';
import { ApplicationsSummaryCard } from '../components/ApplicationsSummaryCard';
import { PlacementPipeline } from '../components/PlacementPipeline';
import { PlacementJourney } from '../components/PlacementJourney';
import ReadinessSummaryCard from '../components/ReadinessSummaryCard';
import { 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Check, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  User as UserIcon, 
  LogOut,
  ChevronRight,
  GraduationCap,
  RefreshCw,
  Cpu
} from 'lucide-react';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Python Developer',
  'Java Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'Cybersecurity Analyst',
];

export const Dashboard = () => {
  const { user, updateProfile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(user?.targetJobRole || '');
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [roleMessage, setRoleMessage] = useState(null);
  const [roleError, setRoleError] = useState(null);

  // Stage 4: Resume Analysis State
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);

  // Stage 5: Personalized Roadmap State
  const [roadmap, setRoadmap] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

  // Stage 6: Job Application Tracker State
  const [appStats, setAppStats] = useState({
    total: 0,
    applied: 0,
    assessment: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    active: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  // Stage 7: Placement Readiness, Assessment & Interview State
  const [readiness, setReadiness] = useState(null);
  const [readinessLoading, setReadinessLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [latestInterview, setLatestInterview] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    refreshProfile();
    fetchLatestAnalysis();
    fetchLatestRoadmap();
    fetchApplicationData();
    fetchReadinessData();
  }, []);

  const fetchReadinessData = async () => {
    try {
      setReadinessLoading(true);
      const [readinessRes, assRes, intRes] = await Promise.all([
        api.getPlacementReadiness().catch(() => null),
        api.getLatestAssessment().catch(() => null),
        api.getLatestInterview().catch(() => null),
      ]);
      if (readinessRes?.readiness) {
        setReadiness(readinessRes.readiness);
      }
      if (assRes?.assessment) {
        setLatestAssessment(assRes.assessment);
      }
      if (intRes?.interview) {
        setLatestInterview(intRes.interview);
      }
    } catch (err) {
      console.warn('Could not fetch readiness data:', err.message);
    } finally {
      setReadinessLoading(false);
    }
  };

  useEffect(() => {
    if (user?.targetJobRole) {
      setSelectedRole(user.targetJobRole);
    }
  }, [user?.targetJobRole]);

  const fetchLatestAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      const res = await api.getLatestAnalysis();
      if (res.status === 'success') {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.warn('Could not fetch existing analysis:', err.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const fetchLatestRoadmap = async () => {
    try {
      const res = await api.getLatestRoadmap();
      if (res.status === 'success' && res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.warn('Could not fetch existing roadmap:', err.message);
    }
  };

  const fetchApplicationData = async () => {
    try {
      setAppsLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        api.getApplicationStats(),
        api.getApplications(),
      ]);
      if (statsRes.status === 'success') {
        setAppStats(statsRes.stats);
      }
      if (appsRes.status === 'success') {
        setRecentApplications(appsRes.applications?.slice(0, 3) || []);
      }
    } catch (err) {
      console.warn('Could not fetch application statistics:', err.message);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleGenerateRoadmap = async (force = false) => {
    try {
      setGeneratingRoadmap(true);
      setRoadmapError(null);
      const res = await api.generateRoadmap(force);
      if (res.status === 'success' && res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      setRoadmapError(err.message || 'Failed to generate personalized roadmap.');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    if (newRole === selectedRole && user?.targetJobRole === newRole) return;

    try {
      setSelectedRole(newRole);
      setRoleUpdating(true);
      setRoleError(null);
      setRoleMessage(null);

      const res = await updateProfile({ targetJobRole: newRole });
      if (res.status === 'success') {
        setRoleMessage(`Target role saved: ${newRole}`);
        setTimeout(() => setRoleMessage(null), 4000);
      }
    } catch (err) {
      setRoleError(err.message || 'Failed to update target role.');
      setSelectedRole(user?.targetJobRole || '');
    } finally {
      setRoleUpdating(false);
    }
  };

  const handleRunAnalysis = async (force = false) => {
    const activeRole = selectedRole || user?.targetJobRole;

    if (!activeRole || !activeRole.trim()) {
      setAnalysisError('Please select a target job role before analyzing your resume.');
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError(null);

      const res = await api.analyzeResume(force);
      if (res.status === 'success' && res.analysis) {
        setAnalysis(res.analysis);
        // Scroll smoothly to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } catch (err) {
      setAnalysisError(err.message || 'Failed to complete resume analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentName = user?.name || 'Student';
  const profileCompletion = user?.profileCompletion || 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">
                Placement Launchpad <span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-0.5">Student Placement Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-semibold text-indigo-300 uppercase">
                {studentName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-300">
                {studentName}
              </span>
            </div>

            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Section A & B: Welcome & Profile Completion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section A: Welcome Section */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Placement Portal Active
                </span>
                {user?.college && (
                  <>
                    <span className="text-xs text-slate-600">&bull;</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      {user.college}
                    </span>
                  </>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">{studentName}</span>!
                </h1>
                <p className="text-base sm:text-lg text-slate-300 font-medium mt-1">
                  Let's prepare you for your dream placement.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Connect your technical credentials, select your target recruitment profile, and maintain your verified resume for automated skills benchmarking.
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-semibold text-indigo-300">
                  {selectedRole || 'Not selected yet'}
                </span>
              </div>

              <Link
                to="/profile"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                <span>View Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Section B: Profile Completion */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight">Profile Completion</h2>
                </div>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {profileCompletion}%
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Calculated dynamically across academic details, target career role, skills inventory, and aspirations.
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-700 ease-out shadow-sm shadow-emerald-500/30"
                    style={{ width: `${Math.max(profileCompletion, 5)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100% Target</span>
                </div>
              </div>

              {/* Quick Checklist */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Role Selected</span>
                  {selectedRole ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                      <Check className="w-3 h-3" /> Set
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">Pending</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Skills Added</span>
                  {user?.skills && user.skills.length > 0 ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                      <Check className="w-3 h-3" /> {user.skills.length} skills
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">Pending</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Academic Background</span>
                  {user?.college && user?.branch ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                      <Check className="w-3 h-3" /> Complete
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">Incomplete</span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-2">
              <Link
                to="/profile"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
              >
                <span>Edit Profile Information</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section C: Target Job Role Selection */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Target Job Role</h2>
              </div>
              <p className="text-xs text-slate-400">
                Select the primary job profile you want to prepare for. Your selection is saved to your authenticated profile.
              </p>
            </div>

            {roleUpdating && (
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to profile...</span>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {roleMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-300 text-xs">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{roleMessage}</span>
            </div>
          )}

          {roleError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{roleError}</span>
            </div>
          )}

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {TARGET_ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  disabled={roleUpdating}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-bold leading-snug transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {role}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'border border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-indigo-300 font-semibold' : 'text-slate-500'}>
                      {isSelected ? 'Current Target' : 'Click to Select'}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section D: Resume Section */}
        <ResumeSection
          onAnalyze={() => handleRunAnalysis(true)}
          analyzing={analyzing}
          hasAnalysis={Boolean(analysis)}
          targetRole={selectedRole || user?.targetJobRole}
          onResumeChange={(resume) => {
            setCurrentResume(resume);
            if (!resume) setAnalysis(null);
          }}
        />

        {/* Stage 4: AI Resume Analysis Section */}
        <div ref={resultsRef} className="space-y-4">
          {/* Analyzing Loading Card */}
          {analyzing && (
            <div className="bg-slate-900/90 border border-sky-500/40 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden animate-pulse">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto shadow-inner">
                  <Cpu className="w-7 h-7 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Analyzing your resume against {selectedRole || 'target role'}...
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Extracting skills, verifying project evidence, and mapping competencies with AI.
                  </p>
                </div>
                <div className="w-48 mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full animate-progress" />
                </div>
              </div>
            </div>
          )}

          {/* Analysis Error Alert */}
          {analysisError && !analyzing && (
            <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Analysis Could Not Complete</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{analysisError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRunAnalysis(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysis && !analyzing && (
            <AnalysisResults
              analysis={analysis}
              targetRole={selectedRole || user?.targetJobRole}
              onAnalyzeAgain={() => handleRunAnalysis(true)}
              loading={analyzing}
            />
          )}
        </div>

        {/* Stage 7: Placement Readiness Summary Card */}
        <ReadinessSummaryCard
          readiness={readiness}
          loading={readinessLoading}
        />

        {/* Stage 5: Personalized Learning Roadmap Section */}
        <RoadmapSummaryCard
          roadmap={roadmap}
          hasAnalysis={Boolean(analysis)}
          targetRole={selectedRole || user?.targetJobRole}
          onGenerateRoadmap={handleGenerateRoadmap}
          generating={generatingRoadmap}
          error={roadmapError}
        />

        {/* Stage 6: Job Application Tracker Summary Section */}
        <ApplicationsSummaryCard
          stats={appStats}
          recentApplications={recentApplications}
          loading={appsLoading}
        />

        {/* Stage 6: Placement Pipeline Progress */}
        <PlacementPipeline
          hasResume={Boolean(currentResume)}
          hasRoadmap={Boolean(roadmap)}
          hasAnalysis={Boolean(analysis)}
          stats={appStats}
        />

        {/* Section E: Placement Preparation Journey */}
        <PlacementJourney 
          hasAnalysis={Boolean(analysis)} 
          hasRoadmap={Boolean(roadmap)}
          hasAssessment={Boolean(latestAssessment)}
          hasInterview={Boolean(latestInterview)}
          hasReadiness={Boolean(readiness)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
