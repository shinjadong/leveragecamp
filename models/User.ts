import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  points: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  birthdate?: string;
  groups: string[];
  smsConsent: boolean;
  emailConsent: boolean;
  thirdPartyConsent: boolean;
  registrationDate: Timestamp;
  loginCount: number;
  lastLogin?: Timestamp;
  social?: {
    kakaoId?: string;
    naverId?: string;
    googleId?: string;
    appleId?: string;
  };
  address?: {
    zip?: string;
    addr?: string;
    addrDetail?: string;
    city?: string;
    city2?: string;
  };
  memo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const USER_COLLECTION = 'users'; 