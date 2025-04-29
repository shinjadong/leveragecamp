import { Timestamp } from 'firebase-admin/firestore';

export interface Challenge {
  id?: string;
  title: string;
  description: string;
  difficulty: '쉬움' | '보통' | '어려움';
  points: number;
  status: 'draft' | 'published' | 'archived';
  startDate: Timestamp;
  endDate: Timestamp;
  participants?: number;
  createdBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const CHALLENGE_COLLECTION = 'challenges'; 