import mongoose from 'mongoose';
import crypto from 'crypto';

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume ID is required'],
    },
    targetJobRole: {
      type: String,
      required: [true, 'Target job role is required'],
      trim: true,
    },
    overallMatch: {
      type: Number,
      required: [true, 'Overall match score is required'],
      min: 0,
      max: 100,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
    },
    strongSkills: {
      type: [String],
      default: [],
    },
    skillsToImprove: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    roleSpecificFeedback: {
      type: [String],
      default: [],
    },
    provider: {
      type: String,
      default: 'local-engine',
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    userId: this.userId,
    resumeId: this.resumeId,
    targetJobRole: this.targetJobRole,
    overallMatch: this.overallMatch,
    summary: this.summary,
    strongSkills: this.strongSkills,
    skillsToImprove: this.skillsToImprove,
    missingSkills: this.missingSkills,
    recommendations: this.recommendations,
    roleSpecificFeedback: this.roleSpecificFeedback,
    provider: this.provider,
    analyzedAt: this.analyzedAt || this.createdAt,
  };
};

const MongooseAnalysisModel = mongoose.models.Analysis || mongoose.model('Analysis', analysisSchema);

// In-Memory Fallback Store for offline testing & environments without active MongoDB connection
const memoryAnalysisMap = new Map();

class MemoryAnalysisDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.userId = String(data.userId);
    this.resumeId = String(data.resumeId);
    this.targetJobRole = data.targetJobRole || '';
    this.overallMatch = Number(data.overallMatch) || 0;
    this.summary = data.summary || '';
    this.strongSkills = Array.isArray(data.strongSkills) ? data.strongSkills : [];
    this.skillsToImprove = Array.isArray(data.skillsToImprove) ? data.skillsToImprove : [];
    this.missingSkills = Array.isArray(data.missingSkills) ? data.missingSkills : [];
    this.recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
    this.roleSpecificFeedback = Array.isArray(data.roleSpecificFeedback) ? data.roleSpecificFeedback : [];
    this.provider = data.provider || 'local-engine';
    this.analyzedAt = data.analyzedAt || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toSafeObject() {
    return {
      id: this._id,
      userId: this.userId,
      resumeId: this.resumeId,
      targetJobRole: this.targetJobRole,
      overallMatch: this.overallMatch,
      summary: this.summary,
      strongSkills: this.strongSkills,
      skillsToImprove: this.skillsToImprove,
      missingSkills: this.missingSkills,
      recommendations: this.recommendations,
      roleSpecificFeedback: this.roleSpecificFeedback,
      provider: this.provider,
      analyzedAt: this.analyzedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryAnalysisMap.set(String(this._id), this);
    return this;
  }
}

const Analysis = {
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAnalysisModel.findOne(query).sort({ analyzedAt: -1 });
    }
    const docs = Array.from(memoryAnalysisMap.values()).filter((doc) => {
      let matches = true;
      if (query.userId && String(doc.userId) !== String(query.userId)) matches = false;
      if (query.resumeId && String(doc.resumeId) !== String(query.resumeId)) matches = false;
      if (query.targetJobRole && doc.targetJobRole !== query.targetJobRole) matches = false;
      return matches;
    });

    if (docs.length === 0) return null;
    docs.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));
    return docs[0];
  },

  async find(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAnalysisModel.find(query).sort({ analyzedAt: -1 });
    }
    return Array.from(memoryAnalysisMap.values()).filter((doc) => {
      let matches = true;
      if (query.userId && String(doc.userId) !== String(query.userId)) matches = false;
      return matches;
    });
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAnalysisModel.create(data);
    }
    const doc = new MemoryAnalysisDoc(data);
    memoryAnalysisMap.set(String(doc._id), doc);
    return doc;
  },

  async deleteMany(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseAnalysisModel.deleteMany(query);
    }
    if (query.userId) {
      const uId = String(query.userId);
      for (const [key, doc] of memoryAnalysisMap.entries()) {
        if (String(doc.userId) === uId) {
          memoryAnalysisMap.delete(key);
        }
      }
    }
    return { acknowledged: true };
  },
};

export default Analysis;
