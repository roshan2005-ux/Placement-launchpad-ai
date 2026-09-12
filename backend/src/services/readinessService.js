import User from '../models/User.js';
import Analysis from '../models/Analysis.js';
import Assessment from '../models/Assessment.js';
import Interview from '../models/Interview.js';
import JobApplication from '../models/JobApplication.js';
import Roadmap from '../models/Roadmap.js';

/**
 * Deterministic Placement Readiness Calculation Engine
 * 
 * Formula (when all 5 components are complete):
 * - Resume Analysis Score: 20%
 * - Skills & Gap Alignment: 20%
 * - Technical Assessment:  25%
 * - AI Mock Interview:     25%
 * - Profile & Applications: 10%
 * Total = 100%
 * 
 * Transparent Re-weighting:
 * If any component is pending (not yet completed by the student), its score
 * is marked null/pending, and the active components are dynamically normalized
 * to 100% of the active weighting space without inventing synthetic scores.
 */
export const calculatePlacementReadiness = async (userId) => {
  const [user, analysis, assessment, interview, applications, roadmap] = await Promise.all([
    User.findById(userId),
    Analysis.findOne({ userId }),
    Assessment.findOne({ userId }),
    Interview.findOne({ userId, status: 'completed' }),
    JobApplication.find({ userId }),
    Roadmap.findOne({ userId }),
  ]);

  const targetJobRole = user?.targetJobRole || 'Full Stack Developer';

  // 1. Resume Component (Nominal Weight: 20%)
  const hasResumeScore = analysis && typeof analysis.overallMatch === 'number';
  const resumeScore = hasResumeScore ? analysis.overallMatch : null;

  // 2. Skills / Gap Alignment Component (Nominal Weight: 20%)
  let skillsScore = null;
  if (analysis) {
    const strongCount = analysis.strongSkills?.length || 0;
    const missingCount = analysis.missingSkills?.length || 0;
    const improveCount = analysis.skillsToImprove?.length || 0;
    const totalSkills = strongCount + missingCount + improveCount;
    if (totalSkills > 0) {
      // Score based on ratio of strong skills to verified competencies
      skillsScore = Math.min(100, Math.round(((strongCount * 1.0 + improveCount * 0.5) / totalSkills) * 100));
    } else {
      skillsScore = 60;
    }
  }

  // 3. Technical Assessment Component (Nominal Weight: 25%)
  const hasAssessmentScore = assessment && typeof assessment.score === 'number';
  const assessmentScore = hasAssessmentScore ? assessment.score : null;

  // 4. AI Mock Interview Component (Nominal Weight: 25%)
  const hasInterviewScore = interview && typeof interview.overallScore === 'number';
  const interviewScore = hasInterviewScore ? interview.overallScore : null;

  // 5. Profile & Application Activity Component (Nominal Weight: 10%)
  const profilePercent = user?.profileCompletion || 0;
  const appCount = applications.length;
  const activeApps = applications.filter((a) => ['Applied', 'Assessment', 'Interview'].includes(a.status)).length;
  // Calculate profile/application composite (up to 100)
  const appActivityScore = Math.min(100, appCount * 25 + activeApps * 10);
  const profileScore = Math.round(profilePercent * 0.6 + appActivityScore * 0.4);

  // Define component definitions with baseline nominal weights
  const componentDefs = [
    {
      key: 'resume',
      name: 'Resume Strength',
      nominalWeight: 20,
      score: resumeScore,
      status: resumeScore !== null ? 'completed' : 'pending',
      description: 'Semantic extraction and ATS resume alignment against target role standards.',
    },
    {
      key: 'skills',
      name: 'Skills Alignment',
      nominalWeight: 20,
      score: skillsScore,
      status: skillsScore !== null ? 'completed' : 'pending',
      description: 'Demonstrated competencies vs. identified curriculum skill gaps.',
    },
    {
      key: 'assessment',
      name: 'Technical Assessment',
      nominalWeight: 25,
      score: assessmentScore,
      status: assessmentScore !== null ? 'completed' : 'pending',
      description: 'Role-based timed technical and aptitude knowledge evaluation.',
    },
    {
      key: 'interview',
      name: 'AI Mock Interview',
      nominalWeight: 25,
      score: interviewScore,
      status: interviewScore !== null ? 'completed' : 'pending',
      description: 'Technical depth, question relevance, clarity, and communication under interview conditions.',
    },
    {
      key: 'profile',
      name: 'Profile & Outreach',
      nominalWeight: 10,
      score: profileScore,
      status: 'completed', // Profile data is always initialized on registration
      description: 'Placement profile completeness and active company application pipelines.',
    },
  ];

  // Dynamic Re-weighting over completed components
  const completedComponents = componentDefs.filter((c) => c.status === 'completed' && c.score !== null);
  const totalCompletedNominalWeight = completedComponents.reduce((sum, c) => sum + c.nominalWeight, 0);

  let overallReadinessScore = 0;
  const breakdown = componentDefs.map((c) => {
    let effectiveWeight = 0;
    if (c.status === 'completed' && c.score !== null && totalCompletedNominalWeight > 0) {
      effectiveWeight = Number(((c.nominalWeight / totalCompletedNominalWeight) * 100).toFixed(1));
      overallReadinessScore += (c.score * effectiveWeight) / 100;
    }
    return {
      ...c,
      effectiveWeight,
    };
  });

  overallReadinessScore = Math.min(100, Math.max(0, Math.round(overallReadinessScore)));

  // Tier Classification
  let readinessTier = 'Early Stage';
  let tierColor = 'text-slate-400';
  let tierDescription = 'Begin with resume verification and foundational skills training to build your placement profile.';

  if (overallReadinessScore >= 80) {
    readinessTier = 'Placement Ready';
    tierColor = 'text-emerald-400';
    tierDescription = 'Exceptional candidate readiness! Your technical, interview, and resume profile are aligned for campus offers.';
  } else if (overallReadinessScore >= 65) {
    readinessTier = 'Interview Ready';
    tierColor = 'text-indigo-400';
    tierDescription = 'Strong baseline across technical fundamentals. Focus on weak interview dimensions to secure top offers.';
  } else if (overallReadinessScore >= 50) {
    readinessTier = 'Developing';
    tierColor = 'text-amber-400';
    tierDescription = 'Good foundation established. Complete assessment benchmarks and roadmap projects to advance to interview readiness.';
  }

  // Identify Strongest & Weakest Areas
  let strongestArea = 'Profile Setup';
  let weakestArea = 'Technical Assessment';
  let highestScore = -1;
  let lowestScore = 999;

  completedComponents.forEach((c) => {
    if (c.score > highestScore) {
      highestScore = c.score;
      strongestArea = c.name;
    }
    if (c.score < lowestScore) {
      lowestScore = c.score;
      weakestArea = c.name;
    }
  });

  // If critical components are pending, flag them as weakest/recommended
  if (!hasInterviewScore) {
    weakestArea = 'AI Mock Interview (Pending)';
  } else if (!hasAssessmentScore) {
    weakestArea = 'Technical Assessment (Pending)';
  } else if (!hasResumeScore) {
    weakestArea = 'Resume Analysis (Pending)';
  }

  // Recommended Next Action
  let nextAction = 'Complete your technical assessment to unlock performance benchmarking.';
  if (!hasResumeScore) {
    nextAction = 'Upload and analyze your resume against your target job role.';
  } else if (!hasAssessmentScore) {
    nextAction = 'Take the 10-question technical skill assessment for ' + targetJobRole + '.';
  } else if (!hasInterviewScore) {
    nextAction = 'Complete your 5-question AI mock interview to evaluate verbal communication and technical depth.';
  } else if (roadmap && roadmap.completedWeeks < roadmap.totalWeeks) {
    nextAction = `Continue Week ${roadmap.completedWeeks + 1} of your Personalized Learning Roadmap.`;
  } else if (appCount === 0) {
    nextAction = 'Track your active company applications in the Job Application Tracker.';
  } else {
    nextAction = 'Retake mock interviews or assessments to raise your readiness score toward 90+.';
  }

  // Generate Personalized, Actionable Recommendations
  const recommendations = generateRecommendations({
    user,
    analysis,
    assessment,
    interview,
    applications,
    roadmap,
    targetJobRole,
    weakestArea,
    overallScore: overallReadinessScore,
  });

  const breakdownObj = {
    list: breakdown,
    resumeScore: breakdown.find((b) => b.key === 'resume'),
    skillScore: breakdown.find((b) => b.key === 'skills'),
    assessmentScore: breakdown.find((b) => b.key === 'assessment'),
    interviewScore: breakdown.find((b) => b.key === 'interview'),
    profileScore: breakdown.find((b) => b.key === 'profile'),
    resume: breakdown.find((b) => b.key === 'resume'),
    skills: breakdown.find((b) => b.key === 'skills'),
    assessment: breakdown.find((b) => b.key === 'assessment'),
    interview: breakdown.find((b) => b.key === 'interview'),
    profile: breakdown.find((b) => b.key === 'profile'),
  };

  return {
    overallReadinessScore,
    overallScore: overallReadinessScore,
    level: readinessTier,
    readinessTier,
    tierColor,
    tierDescription,
    targetJobRole,
    strongestArea,
    weakestArea,
    nextAction,
    breakdown: breakdownObj,
    breakdownList: breakdown,
    recommendations,
    completedComponentsCount: completedComponents.length,
    totalComponentsCount: componentDefs.length,
    formulaExplanation: 'Score = Weighted sum of Resume (20%), Skills (20%), Assessment (25%), Interview (25%), and Profile/Outreach (10%), re-weighted dynamically across active completed components.',
  };
};

/**
 * Generates personalized, student-tailored recommendations
 */
const generateRecommendations = ({
  user,
  analysis,
  assessment,
  interview,
  applications,
  roadmap,
  targetJobRole,
  weakestArea,
  overallScore,
}) => {
  const recs = [];

  // Recommendation 1: Technical Gap Closure (from Stage 4)
  if (analysis?.missingSkills && analysis.missingSkills.length > 0) {
    const topMissing = analysis.missingSkills.slice(0, 2).join(' & ');
    recs.push({
      id: 'rec_skills_gap',
      category: 'Skill Gap',
      priority: 'High',
      title: `Bridge Core Gaps: ${topMissing}`,
      description: `Your resume analysis identified ${topMissing} as critical missing skills for ${targetJobRole}. Review relevant roadmap tasks to build evidence.`,
      actionLink: '/roadmap',
      actionText: 'Open Learning Roadmap',
    });
  }

  // Recommendation 2: Assessment Action (from Stage 7)
  if (!assessment) {
    recs.push({
      id: 'rec_assessment_pending',
      category: 'Assessment',
      priority: 'High',
      title: `Take ${targetJobRole} Technical Assessment`,
      description: 'Complete the 10-question standardized technical test to benchmark aptitude, core concepts, and problem solving.',
      actionLink: '/assessment',
      actionText: 'Start Assessment',
    });
  } else if (assessment.weakAreas && assessment.weakAreas.length > 0) {
    const weakCat = assessment.weakAreas[0];
    recs.push({
      id: 'rec_assessment_weak',
      category: 'Assessment',
      priority: 'Medium',
      title: `Improve ${weakCat} Assessment Score`,
      description: `You scored lower in ${weakCat} during your last evaluation. Review key concepts and retake the test to elevate your score.`,
      actionLink: '/assessment',
      actionText: 'Retake Assessment',
    });
  }

  // Recommendation 3: Interview Action (from Stage 7)
  if (!interview) {
    recs.push({
      id: 'rec_interview_pending',
      category: 'Interview',
      priority: 'High',
      title: 'Practice with AI Mock Interview',
      description: 'Engage in a 5-question technical simulation to receive instant AI scoring on correctness, technical depth, and communication clarity.',
      actionLink: '/interview',
      actionText: 'Start Mock Interview',
    });
  } else if (interview.overallScore < 75) {
    const topImprovement = interview.areasToImprove?.[0] || 'Technical Depth';
    recs.push({
      id: 'rec_interview_refine',
      category: 'Interview',
      priority: 'Medium',
      title: `Refine Interview Performance: ${topImprovement}`,
      description: `Your interview feedback flagged ${topImprovement}. Practice structuring answers with concrete implementation mechanics and metrics.`,
      actionLink: '/interview',
      actionText: 'New Mock Interview',
    });
  }

  // Recommendation 4: Applications Action (from Stage 6)
  if (applications.length === 0) {
    recs.push({
      id: 'rec_applications_empty',
      category: 'Applications',
      priority: 'Medium',
      title: 'Begin Tracking Job Applications',
      description: 'Start tracking target company recruitment drives, online tests, and interview schedules in your Job Application Tracker.',
      actionLink: '/applications',
      actionText: 'Go to Application Tracker',
    });
  } else if (applications.length < 5) {
    recs.push({
      id: 'rec_applications_scale',
      category: 'Applications',
      priority: 'Low',
      title: 'Expand Target Pipeline',
      description: `You are tracking ${applications.length} applications. Expand your target outreach to 8-10 companies to maximize interview conversions.`,
      actionLink: '/applications',
      actionText: 'Add Applications',
    });
  }

  // Recommendation 5: Roadmap Progression (from Stage 5)
  if (roadmap && roadmap.completedWeeks < roadmap.totalWeeks) {
    const nextWeek = roadmap.weeks?.find((w) => !w.completed);
    if (nextWeek) {
      recs.push({
        id: 'rec_roadmap_next_week',
        category: 'Roadmap',
        priority: 'Medium',
        title: `Complete Week ${nextWeek.weekNumber}: ${nextWeek.topic}`,
        description: nextWeek.objective,
        actionLink: '/roadmap',
        actionText: 'View Milestone',
      });
    }
  }

  return recs.slice(0, 4);
};
