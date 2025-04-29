import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, '설명을 입력해주세요.'],
  },
  difficulty: {
    type: String,
    enum: ['쉬움', '보통', '어려움'],
    default: '보통',
  },
  points: {
    type: Number,
    required: [true, '포인트를 입력해주세요.'],
    min: [0, '포인트는 0 이상이어야 합니다.'],
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  startDate: {
    type: Date,
    required: [true, '시작일을 입력해주세요.'],
  },
  endDate: {
    type: Date,
    required: [true, '종료일을 입력해주세요.'],
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
ChallengeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema); 