import Interview from '../models/Interview.js';
import User from '../models/User.js';
import { generateQuestions, evaluateAnswer, finalizeInterview } from '../services/mockInterviewService.js';

// @desc    Start a new AI Mock Interview session
// @route   POST /api/interview/start
// @access  Private
export const startInterview = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    const targetJobRole = (req.body.role && req.body.role.trim())
      ? req.body.role.trim()
      : ((req.body.targetJobRole && req.body.targetJobRole.trim())
          ? req.body.targetJobRole.trim()
          : ((user && user.targetJobRole && user.targetJobRole.trim())
              ? user.targetJobRole.trim()
              : 'Full Stack Developer'));

    // Generate 5 structured questions
    const generated = await generateQuestions(targetJobRole);

    const interview = await Interview.create({
      userId,
      targetJobRole,
      status: 'in_progress',
      questions: generated.questions,
      provider: generated.provider,
    });

    return res.status(201).json({
      status: 'success',
      message: 'AI Mock Interview session started.',
      interview: interview.toSafeObject(),
      currentQuestion: interview.questions[0] || null,
    });
  } catch (error) {
    console.error('[Start Interview Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to initialize mock interview.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Submit an answer for an interview question
// @route   POST /api/interview/:id/answer
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { questionIndex, answer } = req.body;

    const interview = await Interview.findOne({ _id: id, userId });
    if (!interview) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview session not found or unauthorized.',
      });
    }

    const idx = Number(questionIndex);
    if (isNaN(idx) || idx < 0 || idx >= interview.questions.length) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid questionIndex ${questionIndex}. Must be between 0 and ${interview.questions.length - 1}.`,
      });
    }

    if (!answer || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a non-empty answer to evaluate.',
      });
    }

    const questionItem = interview.questions[idx];

    // Evaluate answer through dual-provider service
    const evaluated = await evaluateAnswer({
      targetJobRole: interview.targetJobRole,
      question: questionItem.question,
      studentAnswer: answer.trim(),
    });

    // Update question record
    questionItem.studentAnswer = answer.trim();
    questionItem.score = evaluated.score;
    questionItem.dimensions = evaluated.dimensions;
    questionItem.feedback = evaluated.feedback;
    questionItem.improvementTip = evaluated.improvementTip;
    questionItem.evaluation = {
      score: evaluated.score,
      dimensions: evaluated.dimensions,
      feedback: evaluated.feedback,
      improvementTip: evaluated.improvementTip,
    };

    // Check if all questions are answered
    const allAnswered = interview.questions.every((q) => q.studentAnswer && q.studentAnswer.trim());

    if (allAnswered) {
      const finalSummary = finalizeInterview(interview.questions);
      interview.status = 'completed';
      interview.overallScore = finalSummary.overallScore;
      interview.technicalPerformance = finalSummary.technicalPerformance;
      interview.answerRelevance = finalSummary.answerRelevance;
      interview.communication = finalSummary.communication;
      interview.areasToImprove = finalSummary.areasToImprove;
      interview.aiFeedback = finalSummary.aiFeedback;
      interview.completedAt = new Date();
    }

    await interview.save();

    return res.status(200).json({
      status: 'success',
      message: allAnswered ? 'Interview completed successfully!' : 'Answer evaluated.',
      interview: interview.toSafeObject(),
      evaluatedAnswer: questionItem,
      nextQuestion: allAnswered ? null : interview.questions[idx + 1] || null,
      isCompleted: allAnswered,
    });
  } catch (error) {
    console.error('[Submit Answer Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to evaluate answer.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get latest completed interview for authenticated student
// @route   GET /api/interview/latest
// @access  Private
export const getLatestInterview = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const latest = await Interview.findOne({ userId, status: 'completed' });

    return res.status(200).json({
      status: 'success',
      interview: latest ? latest.toSafeObject() : null,
    });
  } catch (error) {
    console.error('[Get Latest Interview Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve latest interview.',
    });
  }
};

// @desc    Get specific interview by ID
// @route   GET /api/interview/:id
// @access  Private
export const getInterviewById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, userId });
    if (!interview) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview session not found or unauthorized.',
      });
    }

    return res.status(200).json({
      status: 'success',
      interview: interview.toSafeObject(),
    });
  } catch (error) {
    console.error('[Get Interview By ID Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve interview details.',
    });
  }
};
