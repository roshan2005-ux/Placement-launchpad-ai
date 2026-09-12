import mongoose from 'mongoose';
import crypto from 'crypto';

const answerResultSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    selectedAnswer: { type: String, default: null },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    category: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    targetJobRole: {
      type: String,
      required: [true, 'Target job role is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 10,
    },
    correctAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    categoryScores: {
      type: Map,
      of: Number,
      default: {},
    },
    strongAreas: {
      type: [String],
      default: [],
    },
    weakAreas: {
      type: [String],
      default: [],
    },
    detailedResults: {
      type: [answerResultSchema],
      default: [],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

assessmentSchema.methods.toSafeObject = function () {
  const catScores = this.categoryScores instanceof Map
    ? Object.fromEntries(this.categoryScores)
    : this.categoryScores || {};

  return {
    id: this._id,
    _id: this._id,
    userId: this.userId,
    targetJobRole: this.targetJobRole,
    role: this.targetJobRole,
    score: this.score,
    passed: this.score >= 60,
    totalQuestions: this.totalQuestions,
    correctAnswers: this.correctAnswers,
    wrongAnswers: this.wrongAnswers,
    categoryScores: catScores,
    categoryBreakdown: catScores,
    strongAreas: this.strongAreas,
    weakAreas: this.weakAreas,
    detailedResults: this.detailedResults,
    answers: this.detailedResults,
    completedAt: this.completedAt || this.createdAt,
  };
};

const MongooseAssessmentModel =
  mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

// In-Memory Fallback Store for offline testing & environments without active MongoDB connection
const memoryAssessmentMap = new Map();

class MemoryAssessmentDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.userId = String(data.userId);
    this.targetJobRole = String(data.targetJobRole || '').trim();
    this.score = Number(data.score) || 0;
    this.totalQuestions = Number(data.totalQuestions) || 10;
    this.correctAnswers = Number(data.correctAnswers) || 0;
    this.wrongAnswers = Number(data.wrongAnswers) || 0;
    this.categoryScores = data.categoryScores || {};
    this.strongAreas = Array.isArray(data.strongAreas) ? data.strongAreas : [];
    this.weakAreas = Array.isArray(data.weakAreas) ? data.weakAreas : [];
    this.detailedResults = Array.isArray(data.detailedResults) ? data.detailedResults : [];
    this.completedAt = data.completedAt ? new Date(data.completedAt) : new Date();
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toSafeObject() {
    return {
      id: this._id,
      _id: this._id,
      userId: this.userId,
      targetJobRole: this.targetJobRole,
      role: this.targetJobRole,
      score: this.score,
      passed: this.score >= 60,
      totalQuestions: this.totalQuestions,
      correctAnswers: this.correctAnswers,
      wrongAnswers: this.wrongAnswers,
      categoryScores: this.categoryScores,
      categoryBreakdown: this.categoryScores,
      strongAreas: this.strongAreas,
      weakAreas: this.weakAreas,
      detailedResults: this.detailedResults,
      answers: this.detailedResults,
      completedAt: this.completedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryAssessmentMap.set(String(this._id), this);
    return this;
  }
}

const Assessment = {
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAssessmentModel.findOne(query).sort({ completedAt: -1, createdAt: -1 });
    }
    const matches = [];
    for (const doc of memoryAssessmentMap.values()) {
      let match = true;
      if (query._id && String(doc._id) !== String(query._id)) match = false;
      if (query.userId && String(doc.userId) !== String(query.userId)) match = false;
      if (match) matches.push(doc);
    }
    matches.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    return matches[0] || null;
  },

  async find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAssessmentModel.find(query).sort({ completedAt: -1 });
    }
    const results = [];
    for (const doc of memoryAssessmentMap.values()) {
      if (query.userId && String(doc.userId) !== String(query.userId)) continue;
      results.push(doc);
    }
    results.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    return results;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAssessmentModel.create(data);
    }
    const doc = new MemoryAssessmentDoc(data);
    memoryAssessmentMap.set(String(doc._id), doc);
    return doc;
  },
};

export default Assessment;
