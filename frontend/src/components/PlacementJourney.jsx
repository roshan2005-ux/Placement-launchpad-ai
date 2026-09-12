import { 
  FileSearch, 
  Layers, 
  MapPin, 
  CheckCircle, 
  Bot, 
  Trophy, 
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlacementJourney = ({ 
  hasAnalysis = false, 
  hasRoadmap = false,
  hasAssessment = false,
  hasInterview = false,
  hasReadiness = false,
}) => {
  const steps = [
    {
      step: 1,
      title: 'Resume Analysis',
      link: '/dashboard',
      status: hasAnalysis ? 'Completed' : 'Ready',
      isCompleted: hasAnalysis,
      isNext: !hasAnalysis,
      icon: FileSearch,
      color: hasAnalysis
        ? 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
        : 'from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30',
      description:
        'Automated semantic extraction of skills, projects, certifications, and technical domains from your uploaded resume.',
      highlight: hasAnalysis ? 'Active Analysis Report' : 'Upload & Analyze',
    },
    {
      step: 2,
      title: 'Skill Gap Analysis',
      link: '/dashboard',
      status: hasAnalysis ? 'Completed' : 'Pending',
      isCompleted: hasAnalysis,
      isNext: false,
      icon: Layers,
      color: hasAnalysis
        ? 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
        : 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30',
      description:
        'Comparison matrix benchmarking your current skill profile against your chosen target job role industry requirements.',
      highlight: hasAnalysis ? 'Gaps Identified & Ranked' : 'Role Alignment',
    },
    {
      step: 3,
      title: 'Personalized Roadmap',
      link: '/roadmap',
      status: hasRoadmap ? 'Completed' : hasAnalysis ? 'Ready' : 'Pending',
      isCompleted: hasRoadmap,
      isNext: hasAnalysis && !hasRoadmap,
      icon: MapPin,
      color: hasRoadmap
        ? 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
        : 'from-violet-500/20 to-indigo-500/10 text-violet-400 border-violet-500/30',
      description:
        'Week-by-week learning roadmap prioritizing missing core skills, hands-on projects, and curated technical resources.',
      highlight: hasRoadmap ? 'Curriculum Active' : 'Generate Roadmap',
    },
    {
      step: 4,
      title: 'Skill Assessment',
      link: '/assessment',
      status: hasAssessment ? 'Completed' : 'Ready to Start',
      isCompleted: hasAssessment,
      isNext: !hasAssessment && (hasRoadmap || hasAnalysis),
      icon: CheckCircle,
      color: hasAssessment
        ? 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
        : 'from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30',
      description:
        'Standardized 10-question technical & aptitude test benchmarking knowledge against your target role.',
      highlight: hasAssessment ? 'Verified Benchmark' : 'Take 10-Q Test',
    },
    {
      step: 5,
      title: 'AI Mock Interview',
      link: '/interview',
      status: hasInterview ? 'Completed' : 'Available',
      isCompleted: hasInterview,
      isNext: !hasInterview && hasAssessment,
      icon: Bot,
      color: hasInterview
        ? 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
        : 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
      description:
        'Real-time 5-question AI simulation evaluating technical depth, answer relevance, and communication.',
      highlight: hasInterview ? '5-Dimension Evaluated' : 'Start Simulation',
    },
    {
      step: 6,
      title: 'Placement Readiness',
      link: '/readiness',
      status: hasReadiness ? 'Calculated' : 'Available',
      isCompleted: hasReadiness,
      isNext: hasAssessment && hasInterview,
      icon: Trophy,
      color: hasReadiness
        ? 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
        : 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
      description:
        'Comprehensive readiness score combining resume, verified skills, assessment, interview, and application tracking.',
      highlight: 'Full Command Center',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-xl font-bold text-white tracking-tight">Placement Preparation Journey</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Your structured 6-stage pathway from campus enrollment to offer letter.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>{hasRoadmap ? 'Stage 5 Roadmap Active' : hasAnalysis ? 'Stage 4 Complete' : 'Stage 3 Vault Active'}</span>
          <span>&bull;</span>
          <span className="text-violet-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {hasRoadmap ? 'Assessments Next in Stage 6' : 'Personalized Curriculum'}
          </span>
        </div>
      </div>

      {/* Connected Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              to={item.link}
              key={item.step}
              className={`relative rounded-2xl p-6 transition-all border ${
                item.isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-500/5 hover:border-emerald-400'
                  : item.isNext
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl shadow-indigo-500/5 hover:border-indigo-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              } flex flex-col justify-between group overflow-hidden`}
            >
              {/* Top ambient glow for active step */}
              {item.isNext && (
                <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              )}
              {item.isCompleted && (
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div>
                {/* Step number badge & status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center border ${
                        item.isCompleted
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                          : item.isNext
                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.isCompleted ? '✓' : `0${item.step}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Step {item.step}</span>
                  </div>

                  {item.isCompleted ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Completed
                    </span>
                  ) : item.isNext ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Ready
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-slate-800/80 text-slate-400 border border-slate-700/80 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      Available
                    </span>
                  )}
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-base font-bold transition-colors ${
                      item.isCompleted
                        ? 'text-emerald-300'
                        : item.isNext
                        ? 'text-white group-hover:text-indigo-300'
                        : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom footer bar */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-500 group-hover:text-slate-400 transition-colors">
                  {item.highlight}
                </span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {item.isCompleted ? 'View Details' : 'Open'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
