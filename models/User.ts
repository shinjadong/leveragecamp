import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요.'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, '이름을 입력해주세요.'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  points: {
    type: Number,
    default: 0,
    min: [0, '포인트는 0 이상이어야 합니다.'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  phone: {
    type: String,
    trim: true,
  },
  birthdate: {
    type: String,
  },
  groups: {
    type: [String],
    default: [],
  },
  smsConsent: {
    type: Boolean,
    default: false,
  },
  emailConsent: {
    type: Boolean,
    default: false,
  },
  thirdPartyConsent: {
    type: Boolean,
    default: false,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  social: {
    kakaoId: String,
    naverId: String,
    googleId: String,
    appleId: String,
  },
  address: {
    zip: String,
    addr: String,
    addrDetail: String,
    city: String,
    city2: String,
  },
  memo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// updatedAt 자동 업데이트
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 