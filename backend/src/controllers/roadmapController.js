import User from '../models/User.js';
import Analysis from '../models/Analysis.js';
import Roadmap from '../models/Roadmap.js';
import { generateRoadmap as runRoadmapGenerator } from '../services/roadmapGeneratorService.js';

// @desc    Generate personalized 4-6 week learning roadmap based on skill gaps
// @route   POST /api/roadmap/generate
// @access  Private
export const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 1. Verify user profile and target job role
    const user = await User.findById(userId);
    if (!user || !user.targetJobRole || !user.targetJobRole.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please select a target job role before generating your learning roadmap.',
      });
    }

    const targetJobRole = user.targetJobRole.trim();

    // 2. Verify latest resume analysis exists to provide authentic skill gap data
    const latestAnalysis = await Analysis.findOne({ userId });
    if (!latestAnalysis) {
      return res.status(400).json({
        status: 'error',
        message: 'Please complete your resume analysis first to identify your skill gaps before generating a roadmap.',
      });
    }

    // 3. Performance Optimization: return existing roadmap if already generated for this role (unless force: true)
    const forceRegenerate = Boolean(req.body && req.body.force === true);

    if (!forceRegenerate) {
      const existingRoadmap = await Roadmap.findOne({
        userId,
        targetJobRole,
      });

      if (existingRoadmap) {
        return res.status(200).json({
          status: 'success',
          message: 'Retrieved current learning roadmap for this role.',
          roadmap: existingRoadmap.toSafeObject(),
          cached: true,
        });
      }
    }

    // 4. Synthesize input data from user profile and analysis gaps
    const currentSkills = Array.from(
      new Set([
        ...(Array.isArray(user.skills) ? user.skills : []),
        ...(Array.isArray(latestAnalysis.strongSkills) ? latestAnalysis.strongSkills : []),
      ])
    );

    const missingSkills = Array.isArray(latestAnalysis.missingSkills) ? latestAnalysis.missingSkills : [];
    const skillsToImprove = Array.isArray(latestAnalysis.skillsToImprove) ? latestAnalysis.skillsToImprove : [];

    // 5. Generate AI/heuristic curriculum
    const generated = await runRoadmapGenerator({
      targetJobRole,
      currentSkills,
      missingSkills,
      skillsToImprove,
    });

    // 6. Save roadmap document in database
    const roadmapDoc = await Roadmap.create({
      userId,
      analysisId: latestAnalysis._id || latestAnalysis.id,
      targetJobRole,
      durationWeeks: generated.durationWeeks,
      title: generated.title,
      summary: generated.summary,
      weeks: generated.weeks,
      provider: generated.provider,
      generatedAt: new Date(),
    });

    return res.status(200).json({
      status: 'success',
      message: 'Personalized learning roadmap generated successfully.',
      roadmap: roadmapDoc.toSafeObject(),
      cached: false,
    });
  } catch (error) {
    console.error('[Roadmap Controller Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate learning roadmap.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get latest learning roadmap for authenticated student
// @route   GET /api/roadmap
// @access  Private
export const getLatestRoadmap = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const roadmap = await Roadmap.findOne({ userId });

    if (!roadmap) {
      return res.status(200).json({
        status: 'success',
        roadmap: null,
      });
    }

    return res.status(200).json({
      status: 'success',
      roadmap: roadmap.toSafeObject(),
    });
  } catch (error) {
    console.error('[Get Roadmap Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve learning roadmap.',
    });
  }
};

// @desc    Toggle completion status of a roadmap week milestone
// @route   PUT /api/roadmap/week/:weekNumber/toggle
// @access  Private
export const toggleWeekMilestone = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const weekNumber = Number(req.params.weekNumber);

    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({
        status: 'error',
        message: 'No active learning roadmap found.',
      });
    }

    if (isNaN(weekNumber) || weekNumber < 1) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid week number ${req.params.weekNumber}.`,
      });
    }

    const weekItem = roadmap.weeks.find((w) => Number(w.weekNumber) === weekNumber);
    if (!weekItem) {
      return res.status(400).json({
        status: 'error',
        message: `Week ${weekNumber} not found in this roadmap. Valid range is 1 to ${roadmap.weeks.length}.`,
      });
    }

    weekItem.completed = !weekItem.completed;
    await roadmap.save();

    return res.status(200).json({
      status: 'success',
      message: `Week ${weekNumber} milestone updated.`,
      roadmap: roadmap.toSafeObject(),
    });
  } catch (error) {
    console.error('[Toggle Week Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update milestone status.',
    });
  }
};
