import { Timestamp } from 'firebase-admin/firestore';

export interface Lecture {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  order: number;
  createdBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export const LECTURE_COLLECTION = 'lectures'; 