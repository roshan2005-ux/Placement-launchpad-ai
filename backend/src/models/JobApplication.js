import mongoose from 'mongoose';
import crypto from 'crypto';

export const VALID_STATUSES = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'];
export const VALID_JOB_TYPES = ['Full-Time', 'Internship', 'Part-Time', 'Contract'];

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    jobType: {
      type: String,
      enum: VALID_JOB_TYPES,
      default: 'Full-Time',
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: 'Applied',
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    userId: this.userId,
    companyName: this.companyName,
    jobRole: this.jobRole,
    location: this.location || 'Remote',
    applicationDate: this.applicationDate || this.createdAt,
    jobType: this.jobType || 'Full-Time',
    status: this.status || 'Applied',
    jobUrl: this.jobUrl || '',
    notes: this.notes || '',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const MongooseJobApplicationModel =
  mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

// In-Memory Fallback Store for offline testing & environments without active MongoDB connection
const memoryApplicationMap = new Map();

class MemoryJobApplicationDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.userId = String(data.userId);
    this.companyName = String(data.companyName || '').trim();
    this.jobRole = String(data.jobRole || '').trim();
    this.location = data.location ? String(data.location).trim() : 'Remote';
    this.applicationDate = data.applicationDate ? new Date(data.applicationDate) : new Date();
    this.jobType = VALID_JOB_TYPES.includes(data.jobType) ? data.jobType : 'Full-Time';
    this.status = VALID_STATUSES.includes(data.status) ? data.status : 'Applied';
    this.jobUrl = data.jobUrl ? String(data.jobUrl).trim() : '';
    this.notes = data.notes ? String(data.notes).trim() : '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toSafeObject() {
    return {
      id: this._id,
      userId: this.userId,
      companyName: this.companyName,
      jobRole: this.jobRole,
      location: this.location,
      applicationDate: this.applicationDate,
      jobType: this.jobType,
      status: this.status,
      jobUrl: this.jobUrl,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryApplicationMap.set(String(this._id), this);
    return this;
  }
}

const JobApplication = {
  async find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseJobApplicationModel.find(query).sort({ applicationDate: -1, createdAt: -1 });
    }

    const results = [];
    const targetUserId = query.userId ? String(query.userId) : null;
    const targetStatus = query.status ? String(query.status) : null;

    for (const doc of memoryApplicationMap.values()) {
      if (targetUserId && String(doc.userId) !== targetUserId) continue;
      if (targetStatus && doc.status !== targetStatus) continue;
      results.push(doc);
    }

    // Sort descending by applicationDate then createdAt
    results.sort((a, b) => {
      const timeA = new Date(a.applicationDate || a.createdAt).getTime();
      const timeB = new Date(b.applicationDate || b.createdAt).getTime();
      return timeB - timeA;
    });

    return results;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseJobApplicationModel.findById(id);
    }
    return memoryApplicationMap.get(String(id)) || null;
  },

  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseJobApplicationModel.findOne(query);
    }
    for (const doc of memoryApplicationMap.values()) {
      let match = true;
      if (query._id && String(doc._id) !== String(query._id)) match = false;
      if (query.userId && String(doc.userId) !== String(query.userId)) match = false;
      if (query.status && doc.status !== query.status) match = false;
      if (match) return doc;
    }
    return null;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseJobApplicationModel.create(data);
    }
    const doc = new MemoryJobApplicationDoc(data);
    memoryApplicationMap.set(String(doc._id), doc);
    return doc;
  },

  async findByIdAndDelete(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseJobApplicationModel.findByIdAndDelete(id);
    }
    const strId = String(id);
    const existing = memoryApplicationMap.get(strId) || null;
    if (existing) {
      memoryApplicationMap.delete(strId);
    }
    return existing;
  },

  async countDocuments(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseJobApplicationModel.countDocuments(query);
    }
    let count = 0;
    const targetUserId = query.userId ? String(query.userId) : null;
    const targetStatus = query.status ? String(query.status) : null;

    for (const doc of memoryApplicationMap.values()) {
      if (targetUserId && String(doc.userId) !== targetUserId) continue;
      if (targetStatus && doc.status !== targetStatus) continue;
      count++;
    }
    return count;
  },
};

export default JobApplication;
