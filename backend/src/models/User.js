import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// 1. Mongoose Schema Definition
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    degree: {
      type: String,
      trim: true,
      default: 'B.Tech',
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: 'Final Year',
    },
    targetJobRole: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    careerGoal: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') return next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') {
    next();
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getProfileCompletion = function () {
  const fields = [
    Boolean(this.name),
    Boolean(this.college),
    Boolean(this.degree),
    Boolean(this.branch),
    Boolean(this.year),
    Boolean(this.targetJobRole),
    Boolean(this.skills && this.skills.length > 0),
    Boolean(this.careerGoal),
  ];
  const filledCount = fields.filter(Boolean).length;
  return Math.round((filledCount / fields.length) * 100);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    college: this.college,
    degree: this.degree,
    branch: this.branch,
    year: this.year,
    targetJobRole: this.targetJobRole,
    skills: this.skills,
    careerGoal: this.careerGoal,
    profileCompletion: this.getProfileCompletion(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const MongooseUserModel = mongoose.models.User || mongoose.model('User', userSchema);

// In-Memory Document Store for Immediate Offline Testing / Fallback
const memoryUserMap = new Map();

class MemoryUserDoc {
  constructor(data) {
    this._id = data._id || crypto.randomUUID();
    this.name = data.name || '';
    this.email = (data.email || '').toLowerCase().trim();
    this.password = data.password || '';
    this.role = data.role || 'student';
    this.college = data.college || '';
    this.degree = data.degree || 'B.Tech';
    this.branch = data.branch || '';
    this.year = data.year || 'Final Year';
    this.targetJobRole = data.targetJobRole || '';
    this.skills = Array.isArray(data.skills) ? data.skills : [];
    this.careerGoal = data.careerGoal || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async comparePassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  getProfileCompletion() {
    const fields = [
      Boolean(this.name),
      Boolean(this.college),
      Boolean(this.degree),
      Boolean(this.branch),
      Boolean(this.year),
      Boolean(this.targetJobRole),
      Boolean(this.skills && this.skills.length > 0),
      Boolean(this.careerGoal),
    ];
    const filledCount = fields.filter(Boolean).length;
    return Math.round((filledCount / fields.length) * 100);
  }

  toSafeObject() {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      college: this.college,
      degree: this.degree,
      branch: this.branch,
      year: this.year,
      targetJobRole: this.targetJobRole,
      skills: this.skills,
      careerGoal: this.careerGoal,
      profileCompletion: this.getProfileCompletion(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    memoryUserMap.set(String(this._id), this);
    return this;
  }
}

// Unified Dual-Engine User Model
const User = {
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUserModel.findOne(query);
    }
    if (query.email) {
      const targetEmail = String(query.email).toLowerCase().trim();
      for (const doc of memoryUserMap.values()) {
        if (doc.email === targetEmail) return doc;
      }
      return null;
    }
    return null;
  },

  findById(id) {
    if (mongoose.connection.readyState === 1) {
      return MongooseUserModel.findById(id);
    }
    const doc = memoryUserMap.get(String(id)) || null;

    // Return chainable mock promise that supports .select('-password') and direct await
    const promise = Promise.resolve(doc);
    promise.select = () => Promise.resolve(doc);
    return promise;
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUserModel.create(data);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const doc = new MemoryUserDoc({
      ...data,
      password: hashedPassword,
    });
    memoryUserMap.set(String(doc._id), doc);
    return doc;
  },
};

export default User;
