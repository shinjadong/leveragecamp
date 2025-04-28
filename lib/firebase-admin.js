// lib/firebase-admin.ts (CommonJS 변환)
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getStorage } = require('firebase-admin/storage');

// Firebase Admin SDK 초기화
if (!getApps().length) {
  // 환경 변수에서 서비스 계정 키를 가져오거나, JSON 파일로 관리
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
  );

  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

const adminDb = getFirestore();
const adminAuth = getAuth();
const adminStorage = getStorage();

module.exports = { adminDb, adminAuth, adminStorage };