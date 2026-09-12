import { 
  FileCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  MessageSquareCode, 
  Trophy, 
  Check, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const PlacementPipeline = ({
  hasResume = false,
  hasRoadmap = false,
  hasAnalysis = false,
  stats = { total: 0, applied: 0, assessment: 0, interview: 0, selected: 0, rejected: 0 },
}) => {
  const isSelected = (stats?.selected || 0) > 0;
  const hasInterviews = (stats?.interview || 0) > 0 || isSelected;
  const hasAssessments = (stats?.assessment || 0) > 0 || hasInterviews;
  const hasApplications = (stats?.total || 0) > 0;
  const hasSkillsImproved = hasRoadmap || hasAnalysis;
  const isResumeReady = hasResume;

  const pipelineStages = [
    {
      id: 1,
      title: 'Resume Ready',
      desc: 'Validated technical CV',
      icon: FileCheck,
      completed: isResumeReady,
      current: !isResumeReady,
      countBadge: isResumeReady ? 'Verified' : 'Pending',
      color: 'from-sky-500 to-indigo-500',
    },
    {
      id: 2,
      title: 'Skills Improved',
      desc: 'Stage 4/5 roadmap milestones',
      icon: Sparkles,
      completed: hasSkillsImproved,
      current: isResumeReady && !hasSkillsImproved,
      countBadge: hasRoadmap ? 'Roadmap Active' : hasAnalysis ? 'Gaps Identified' : 'Action Needed',
      color: 'from-violet-500 to-purple-500',
    },
    {
      id: 3,
      title: 'Applications Sent',
      desc: 'Outreach & applications',
      icon: Send,
      completed: hasApplications,
      current: hasSkillsImproved && !hasApplications,
      countBadge: `${stats?.total || 0} Sent`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 4,
      title: 'Assessments',
      desc: 'Online tests & coding rounds',
      icon: CheckCircle2,
      completed: hasAssessments,
      current: hasApplications && !hasAssessments && !hasInterviews && !isSelected,
      countBadge: `${stats?.assessment || 0} Active`,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 5,
      title: 'Interviews',
      desc: 'Technical & HR rounds',
      icon: MessageSquareCode,
      completed: hasInterviews,
      current: hasAssessments && !hasInterviews && !isSelected,
      countBadge: `${stats?.interview || 0} Active`,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 6,
      title: 'Placement Offer',
      desc: 'Dream role secured!',
      icon: Trophy,
      completed: isSelected,
      current: hasInterviews && !isSelected,
      countBadge: isSelected ? `${stats.selected} Offer!` : 'Final Goal',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  // Calculate overall placement readiness percentage based on pipeline
  const completedCount = pipelineStages.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / pipelineStages.length) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-10 w-96 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Placement Pipeline Progress</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time visual tracking from resume preparation to final recruitment offer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">
            {completedCount} of {pipelineStages.length} Milestones Reached
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Linear Stepper */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-2">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative flex flex-col justify-between">
                {/* Connector arrow on desktop */}
                {index < pipelineStages.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-6 z-20 text-slate-700 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl border transition-all h-full flex flex-col justify-between ${
                    stage.completed
                      ? 'bg-slate-950/70 border-emerald-500/30 shadow-md shadow-emerald-500/5'
                      : stage.current
                      ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div>
                    {/* Top indicator & badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          stage.completed
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : stage.current
                            ? 'bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {stage.completed ? <Check className="w-4 h-4" /> : `0${stage.id}`}
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                          stage.completed
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : stage.current
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-slate-800/60 text-slate-500 border-slate-700/50'
                        }`}
                      >
                        {stage.countBadge}
                      </span>
                    </div>

                    {/* Stage Title */}
                    <h4
                      className={`text-xs sm:text-sm font-bold tracking-tight mb-1 ${
                        stage.completed
                          ? 'text-white'
                          : stage.current
                          ? 'text-indigo-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </h4>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Bottom stage status */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-medium">
                    <span
                      className={
                        stage.completed
                          ? 'text-emerald-400'
                          : stage.current
                          ? 'text-indigo-400 font-semibold'
                          : 'text-slate-600'
                      }
                    >
                      {stage.completed ? 'Completed ✓' : stage.current ? 'In Progress ⚡' : 'Upcoming'}
                    </span>
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        stage.completed
                          ? 'text-emerald-400'
                          : stage.current
                          ? 'text-indigo-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
