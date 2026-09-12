import { calculatePlacementReadiness } from '../services/readinessService.js';

// @desc    Get overall Placement Readiness Score and breakdown
// @route   GET /api/readiness
// @access  Private
export const getPlacementReadiness = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const readiness = await calculatePlacementReadiness(userId);

    return res.status(200).json({
      status: 'success',
      readiness,
    });
  } catch (error) {
    console.error('[Get Placement Readiness Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to calculate placement readiness score.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get personalized actionable recommendations for authenticated student
// @route   GET /api/readiness/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const readiness = await calculatePlacementReadiness(userId);

    return res.status(200).json({
      status: 'success',
      targetJobRole: readiness.targetJobRole,
      overallReadinessScore: readiness.overallReadinessScore,
      recommendations: readiness.recommendations,
    });
  } catch (error) {
    console.error('[Get Recommendations Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve recommendations.',
    });
  }
};
