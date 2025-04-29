import { getFirestore } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';

// Firestore 인스턴스 가져오기
const db = getFirestore(getApp());

export { db }; 