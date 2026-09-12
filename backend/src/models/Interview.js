import mongoose from 'mongoose';
import crypto from 'crypto';

const interviewQuestionSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    question: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    studentAnswer: { type: String, default: '' },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    improvementTip: { type: String, default: '' },
    dimensions: {
      correctness: { type: Number, default: 0 },
      relevance: { type: Number, default: 0 },
      technicalDepth: { type: Number, default: 0 },
      clarity: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    technicalPerformance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    answerRelevance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    communication: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    areasToImprove: {
      type: [String],
      default: [],
    },
    aiFeedback: {
      type: String,
      default: '',
    },
    questions: {
      type: [interviewQuestionSchema],
      default: [],
    },
    provider: {
      type: String,
      default: 'local-interview-engine',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.methods.toSafeObject = function () {
  const formattedQuestions = this.questions.map((q) => {
    const qObj = q.toObject ? q.toObject() : { ...q };
    const hasEval = qObj.score > 0 || (qObj.feedback && qObj.feedback.trim());
    return {
      ...qObj,
      evaluation: hasEval
        ? {
            score: qObj.score,
            dimensions: qObj.dimensions,
            feedback: qObj.feedback,
            improvementTip: qObj.improvementTip,
          }
        : null,
    };
  });

  const strengths = [];
  if (this.technicalPerformance >= 70) strengths.push('Strong Technical Foundation & System Logic');
  if (this.answerRelevance >= 70) strengths.push('Direct & Focused Question Alignment');
  if (this.communication >= 70) strengths.push('Clear Articulation & Structured Thought Process');
  if (strengths.length === 0 && this.overallScore > 0) {
    strengths.push('Familiarity with Core Engineering Terminology');
  }

  return {
    id: this._id,
    _id: this._id,
    userId: this.userId,
    targetJobRole: this.targetJobRole,
    role: this.targetJobRole,
    status: this.status,
    overallScore: this.overallScore,
    technicalPerformance: this.technicalPerformance,
    answerRelevance: this.answerRelevance,
    communication: this.communication,
    strengths: this.strengths && this.strengths.length > 0 ? this.strengths : strengths,
    areasToImprove: this.areasToImprove,
    improvements: this.areasToImprove,
    aiFeedback: this.aiFeedback,
    questions: formattedQuestions,
    totalQuestions: this.questions.length,
    answeredQuestions: this.questions.filter((q) => q.studentAnswer && q.studentAnswer.trim()).length,
    provider: this.provider,
    completedAt: this.completedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const MongooseInterviewModel =
  mongoose.models.Interview || mongoose.model('Interview', interviewSchema);

// In-Memory Fallback Store for offline testing & environments without active MongoDB connection
const memoryInterviewMap = new Map();

class MemoryInterviewDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.userId = String(data.userId);
    this.targetJobRole = String(data.targetJobRole || '').trim();
    this.status = data.status || 'in_progress';
    this.overallScore = Number(data.overallScore) || 0;
    this.technicalPerformance = Number(data.technicalPerformance) || 0;
    this.answerRelevance = Number(data.answerRelevance) || 0;
    this.communication = Number(data.communication) || 0;
    this.areasToImprove = Array.isArray(data.areasToImprove) ? data.areasToImprove : [];
    this.aiFeedback = String(data.aiFeedback || '');
    this.questions = Array.isArray(data.questions) ? data.questions : [];
    this.provider = data.provider || 'local-interview-engine';
    this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toSafeObject() {
    const formattedQuestions = this.questions.map((q) => {
      const qObj = { ...q };
      const hasEval = qObj.score > 0 || (qObj.feedback && qObj.feedback.trim());
      return {
        ...qObj,
        evaluation: hasEval
          ? {
              score: qObj.score,
              dimensions: qObj.dimensions,
              feedback: qObj.feedback,
              improvementTip: qObj.improvementTip,
            }
          : null,
      };
    });

    const strengths = [];
    if (this.technicalPerformance >= 70) strengths.push('Strong Technical Foundation & System Logic');
    if (this.answerRelevance >= 70) strengths.push('Direct & Focused Question Alignment');
    if (this.communication >= 70) strengths.push('Clear Articulation & Structured Thought Process');
    if (strengths.length === 0 && this.overallScore > 0) {
      strengths.push('Familiarity with Core Engineering Terminology');
    }

    return {
      id: this._id,
      _id: this._id,
      userId: this.userId,
      targetJobRole: this.targetJobRole,
      role: this.targetJobRole,
      status: this.status,
      overallScore: this.overallScore,
      technicalPerformance: this.technicalPerformance,
      answerRelevance: this.answerRelevance,
      communication: this.communication,
      strengths: this.strengths && this.strengths.length > 0 ? this.strengths : strengths,
      areasToImprove: this.areasToImprove,
      improvements: this.areasToImprove,
      aiFeedback: this.aiFeedback,
      questions: formattedQuestions,
      totalQuestions: this.questions.length,
      answeredQuestions: this.questions.filter((q) => q.studentAnswer && q.studentAnswer.trim()).length,
      provider: this.provider,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryInterviewMap.set(String(this._id), this);
    return this;
  }
}

const Interview = {
  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseInterviewModel.findById(id);
    }
    return memoryInterviewMap.get(String(id)) || null;
  },

  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseInterviewModel.findOne(query).sort({ completedAt: -1, createdAt: -1 });
    }
    const matches = [];
    for (const doc of memoryInterviewMap.values()) {
      let match = true;
      if (query._id && String(doc._id) !== String(query._id)) match = false;
      if (query.userId && String(doc.userId) !== String(query.userId)) match = false;
      if (query.status && doc.status !== query.status) match = false;
      if (match) matches.push(doc);
    }
    matches.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
    return matches[0] || null;
  },

  async find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseInterviewModel.find(query).sort({ completedAt: -1, createdAt: -1 });
    }
    const results = [];
    for (const doc of memoryInterviewMap.values()) {
      if (query.userId && String(doc.userId) !== String(query.userId)) continue;
      if (query.status && doc.status !== query.status) continue;
      results.push(doc);
    }
    results.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
    return results;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseInterviewModel.create(data);
    }
    const doc = new MemoryInterviewDoc(data);
    memoryInterviewMap.set(String(doc._id), doc);
    return doc;
  },
};

export default Interview;
