import { Timestamp } from 'firebase-admin/firestore';

export interface Notification {
  id?: string;
  title: string;
  content: string;
  type: 'notice' | 'event' | 'update';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'published' | 'archived';
  startDate: Timestamp;
  endDate: Timestamp;
  targetUsers: string[];
  author?: string;
  createdBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewCount: number;
}

export const NOTIFICATION_COLLECTION = 'notifications'; 