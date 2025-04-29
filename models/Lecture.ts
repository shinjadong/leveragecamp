import mongoose from 'mongoose';

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, '설명을 입력해주세요.'],
  },
  videoUrl: {
    type: String,
    required: [true, '동영상 URL을 입력해주세요.'],
  },
  thumbnailUrl: {
    type: String,
    required: [true, '썸네일 URL을 입력해주세요.'],
  },
  duration: {
    type: Number,
    required: [true, '영상 길이를 입력해주세요.'],
    min: [0, '영상 길이는 0 이상이어야 합니다.'],
  },
  category: {
    type: String,
    required: [true, '카테고리를 선택해주세요.'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  order: {
    type: Number,
    default: 0,
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
LectureSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Lecture || mongoose.model('Lecture', LectureSchema); 