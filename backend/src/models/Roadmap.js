import mongoose from 'mongoose';
import crypto from 'crypto';

const weekItemSchema = new mongoose.Schema(
  {
    weekNumber: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    objective: {
      type: String,
      required: true,
      trim: true,
    },
    practiceTask: {
      type: String,
      required: true,
      trim: true,
    },
    projectTask: {
      type: String,
      required: true,
      trim: true,
    },
    estimatedHours: {
      type: Number,
      required: true,
      default: 10,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
    },
    targetJobRole: {
      type: String,
      required: [true, 'Target job role is required'],
      trim: true,
    },
    durationWeeks: {
      type: Number,
      required: true,
      default: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    weeks: {
      type: [weekItemSchema],
      required: true,
      default: [],
    },
    provider: {
      type: String,
      default: 'local-curriculum-engine',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

roadmapSchema.methods.toSafeObject = function () {
  const completedCount = this.weeks.filter((w) => w.completed).length;
  const progressPercent = this.weeks.length > 0
    ? Math.round((completedCount / this.weeks.length) * 100)
    : 0;

  const status = completedCount === 0 
    ? 'not_started' 
    : completedCount === this.weeks.length 
    ? 'completed' 
    : 'in_progress';

  return {
    id: this._id,
    userId: this.userId,
    analysisId: this.analysisId,
    targetJobRole: this.targetJobRole,
    targetRole: this.targetJobRole,
    durationWeeks: this.durationWeeks,
    title: this.title,
    summary: this.summary,
    weeks: this.weeks,
    completedWeeks: completedCount,
    totalWeeks: this.weeks.length,
    progressPercent,
    status,
    provider: this.provider,
    generatedAt: this.generatedAt || this.createdAt,
  };
};

const MongooseRoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

// In-Memory Fallback Store for offline testing & environments without active MongoDB connection
const memoryRoadmapMap = new Map();

class MemoryRoadmapDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.userId = String(data.userId);
    this.analysisId = data.analysisId ? String(data.analysisId) : null;
    this.targetJobRole = data.targetJobRole || '';
    this.durationWeeks = Number(data.durationWeeks) || 5;
    this.title = data.title || '';
    this.summary = data.summary || '';
    this.weeks = Array.isArray(data.weeks)
      ? data.weeks.map((w, idx) => ({
          weekNumber: Number(w.weekNumber) || idx + 1,
          topic: w.topic || '',
          objective: w.objective || '',
          practiceTask: w.practiceTask || '',
          projectTask: w.projectTask || '',
          estimatedHours: Number(w.estimatedHours) || 10,
          completed: Boolean(w.completed),
        }))
      : [];
    this.provider = data.provider || 'local-curriculum-engine';
    this.generatedAt = data.generatedAt || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toSafeObject() {
    const completedCount = this.weeks.filter((w) => w.completed).length;
    const progressPercent = this.weeks.length > 0
      ? Math.round((completedCount / this.weeks.length) * 100)
      : 0;

    const status = completedCount === 0 
      ? 'not_started' 
      : completedCount === this.weeks.length 
      ? 'completed' 
      : 'in_progress';

    return {
      id: this._id,
      userId: this.userId,
      analysisId: this.analysisId,
      targetJobRole: this.targetJobRole,
      targetRole: this.targetJobRole,
      durationWeeks: this.durationWeeks,
      title: this.title,
      summary: this.summary,
      weeks: this.weeks,
      completedWeeks: completedCount,
      totalWeeks: this.weeks.length,
      progressPercent,
      status,
      provider: this.provider,
      generatedAt: this.generatedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryRoadmapMap.set(String(this._id), this);
    return this;
  }
}

const Roadmap = {
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseRoadmapModel.findOne(query).sort({ generatedAt: -1 });
    }
    const docs = Array.from(memoryRoadmapMap.values()).filter((doc) => {
      let matches = true;
      if (query.userId && String(doc.userId) !== String(query.userId)) matches = false;
      if (query.targetJobRole && doc.targetJobRole !== query.targetJobRole) matches = false;
      if (query._id && String(doc._id) !== String(query._id)) matches = false;
      return matches;
    });

    if (docs.length === 0) return null;
    docs.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
    return docs[0];
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseRoadmapModel.findById(id);
    }
    const targetId = String(id);
    for (const doc of memoryRoadmapMap.values()) {
      if (String(doc._id) === targetId) return doc;
    }
    return null;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseRoadmapModel.create(data);
    }
    const doc = new MemoryRoadmapDoc(data);
    memoryRoadmapMap.set(String(doc._id), doc);
    return doc;
  },

  async deleteMany(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseRoadmapModel.deleteMany(query);
    }
    if (query.userId) {
      const uId = String(query.userId);
      for (const [key, doc] of memoryRoadmapMap.entries()) {
        if (String(doc.userId) === uId) {
          memoryRoadmapMap.delete(key);
        }
      }
    }
    return { acknowledged: true };
  },
};

export default Roadmap;
