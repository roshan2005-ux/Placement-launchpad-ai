import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { extractTextFromFile } from '../services/textExtractionService.js';
import { analyzeResume as runAiAnalysis } from '../services/aiProvider.js';

// @desc    Analyze student's resume against selected target job role
// @route   POST /api/analysis/resume
// @access  Private
export const analyzeResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 1. Verify user profile and target job role
    const user = await User.findById(userId);
    if (!user || !user.targetJobRole || !user.targetJobRole.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please select a target job role before analyzing your resume.',
      });
    }

    const targetJobRole = user.targetJobRole.trim();

    // 2. Verify student has uploaded a resume
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload your resume before running analysis.',
      });
    }

    // 3. Performance Optimization: check for existing valid analysis (unless force: true is requested)
    const forceReanalysis = Boolean(req.body && req.body.force === true);

    if (!forceReanalysis) {
      const existingAnalysis = await Analysis.findOne({
        userId,
        resumeId: resume._id || resume.id,
        targetJobRole,
      });

      if (existingAnalysis) {
        return res.status(200).json({
          status: 'success',
          message: 'Retrieved current analysis for this resume and role.',
          analysis: existingAnalysis.toSafeObject(),
          cached: true,
        });
      }
    }

    // 4. Extract resume text server-side
    let extractedText;
    try {
      extractedText = await extractTextFromFile(resume.storedName);
    } catch (extractionError) {
      return res.status(422).json({
        status: 'error',
        message: extractionError.message || 'Failed to extract text from resume.',
      });
    }

    // 5. Send cleaned text + target role to AI provider
    const aiResult = await runAiAnalysis(extractedText, targetJobRole);

    // 6. Save analysis to database
    const analysisDoc = await Analysis.create({
      userId,
      resumeId: resume._id || resume.id,
      targetJobRole,
      overallMatch: aiResult.overallMatch,
      summary: aiResult.summary,
      strongSkills: aiResult.strongSkills,
      skillsToImprove: aiResult.skillsToImprove,
      missingSkills: aiResult.missingSkills,
      recommendations: aiResult.recommendations,
      roleSpecificFeedback: aiResult.roleSpecificFeedback,
      provider: aiResult.provider,
      analyzedAt: new Date(),
    });

    return res.status(200).json({
      status: 'success',
      message: 'Resume analysis completed successfully.',
      analysis: analysisDoc.toSafeObject(),
      cached: false,
    });
  } catch (error) {
    console.error('[Analysis Controller Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to complete resume analysis.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get latest resume analysis for authenticated student
// @route   GET /api/analysis/resume
// @access  Private
export const getLatestAnalysis = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const latest = await Analysis.findOne({ userId });

    if (!latest) {
      return res.status(200).json({
        status: 'success',
        analysis: null,
      });
    }

    return res.status(200).json({
      status: 'success',
      analysis: latest.toSafeObject(),
    });
  } catch (error) {
    console.error('[Get Analysis Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve resume analysis.',
    });
  }
};
