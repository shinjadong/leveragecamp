import { getFirestore } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';

// Firestore 인스턴스 가져오기
const db = getFirestore(getApp());

// DB 연결 함수
export const connectToDB = async () => {
  try {
    // Firestore 연결 테스트
    await db.listCollections();
    console.log('Firestore 연결 성공');
    return db;
  } catch (error) {
    console.error('Firestore 연결 실패:', error);
    throw error;
  }
};

export { db }; 