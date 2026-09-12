import Assessment from '../models/Assessment.js';
import User from '../models/User.js';
import { getQuestionsForRole, gradeAssessment } from '../services/assessmentQuestionBank.js';

// @desc    Get 10 role-based questions for the student's target role
// @route   GET /api/assessment/questions
// @access  Private
export const getAssessmentQuestions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    const queryRole = req.query.role;
    const targetJobRole = (queryRole && queryRole.trim())
      ? queryRole.trim()
      : ((user && user.targetJobRole && user.targetJobRole.trim())
          ? user.targetJobRole.trim()
          : 'Full Stack Developer');

    const questions = getQuestionsForRole(targetJobRole);

    return res.status(200).json({
      status: 'success',
      role: targetJobRole,
      targetJobRole,
      totalQuestions: questions.length,
      questions,
    });
  } catch (error) {
    console.error('[Get Questions Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve assessment questions.',
    });
  }
};

// @desc    Submit answers and compute assessment score and gap analysis
// @route   POST /api/assessment/submit
// @access  Private
export const submitAssessment = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    const { answers } = req.body;

    if (!answers || (typeof answers !== 'object' && !Array.isArray(answers))) {
      return res.status(400).json({
        status: 'error',
        message: 'Submitted answers payload must be an array or object.',
      });
    }

    const targetJobRole = (req.body.role && req.body.role.trim())
      ? req.body.role.trim()
      : ((req.body.targetJobRole && req.body.targetJobRole.trim())
          ? req.body.targetJobRole.trim()
          : ((user && user.targetJobRole && user.targetJobRole.trim())
              ? user.targetJobRole.trim()
              : 'Full Stack Developer'));

    // Grade assessment against verified question bank
    const graded = gradeAssessment(targetJobRole, answers);

    const assessmentDoc = await Assessment.create({
      userId,
      targetJobRole,
      score: graded.score,
      totalQuestions: graded.totalQuestions,
      correctAnswers: graded.correctAnswers,
      wrongAnswers: graded.wrongAnswers,
      categoryScores: graded.categoryScores,
      strongAreas: graded.strongAreas,
      weakAreas: graded.weakAreas,
      detailedResults: graded.detailedResults,
      completedAt: new Date(),
    });

    return res.status(200).json({
      status: 'success',
      message: 'Assessment completed and verified.',
      assessment: assessmentDoc.toSafeObject(),
    });
  } catch (error) {
    console.error('[Submit Assessment Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to evaluate assessment submission.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get latest assessment result for authenticated student
// @route   GET /api/assessment/latest
// @access  Private
export const getLatestAssessment = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const latest = await Assessment.findOne({ userId });

    return res.status(200).json({
      status: 'success',
      assessment: latest ? latest.toSafeObject() : null,
    });
  } catch (error) {
    console.error('[Get Latest Assessment Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve assessment history.',
    });
  }
};
