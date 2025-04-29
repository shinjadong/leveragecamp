import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요.'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, '내용을 입력해주세요.'],
  },
  type: {
    type: String,
    enum: ['notice', 'event', 'update'],
    default: 'notice',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
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
  targetUsers: {
    type: [String],
    default: ['all'],
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
NotificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema); 