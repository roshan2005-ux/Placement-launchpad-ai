import mongoose from 'mongoose';
import crypto from 'crypto';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },
    storedName: {
      type: String,
      required: [true, 'Stored filename is required'],
      unique: true,
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    userId: this.userId,
    originalName: this.originalName,
    storedName: this.storedName,
    fileType: this.fileType,
    fileSize: this.fileSize,
    uploadedAt: this.uploadedAt || this.createdAt,
  };
};

const MongooseResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

// In-Memory Fallback Store for offline testing & environments without active MongoDB connection
const memoryResumeMap = new Map();

class MemoryResumeDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.userId = String(data.userId);
    this.originalName = data.originalName || '';
    this.storedName = data.storedName || '';
    this.fileType = data.fileType || '';
    this.fileSize = Number(data.fileSize) || 0;
    this.uploadedAt = data.uploadedAt || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toSafeObject() {
    return {
      id: this._id,
      userId: this.userId,
      originalName: this.originalName,
      storedName: this.storedName,
      fileType: this.fileType,
      fileSize: this.fileSize,
      uploadedAt: this.uploadedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryResumeMap.set(String(this.userId), this);
    return this;
  }
}

const Resume = {
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseResumeModel.findOne(query);
    }
    if (query.userId) {
      const uId = String(query.userId);
      return memoryResumeMap.get(uId) || null;
    }
    if (query._id) {
      const docId = String(query._id);
      for (const doc of memoryResumeMap.values()) {
        if (String(doc._id) === docId) return doc;
      }
    }
    return null;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseResumeModel.findById(id);
    }
    const targetId = String(id);
    for (const doc of memoryResumeMap.values()) {
      if (String(doc._id) === targetId) return doc;
    }
    return null;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseResumeModel.create(data);
    }
    const doc = new MemoryResumeDoc(data);
    memoryResumeMap.set(String(doc.userId), doc);
    return doc;
  },

  async findOneAndDelete(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseResumeModel.findOneAndDelete(query);
    }
    if (query.userId) {
      const uId = String(query.userId);
      const doc = memoryResumeMap.get(uId) || null;
      if (doc) {
        memoryResumeMap.delete(uId);
      }
      return doc;
    }
    return null;
  },
};

export default Resume;
