const admin = require('firebase-admin');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK 초기화
const serviceAccount = require(path.join(__dirname, '../aaaa-895ab-firebase-adminsdk-art0e-5a619f9ba9.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// 사용자 역할 정의
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// CSV 파일 경로 설정
const CSV_FILE_PATH = path.join(__dirname, '../migration/회원2025_04_25_1 - Sheet1.csv');

// 임시 비밀번호 생성 함수
const generateTempPassword = () => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
};

// 사용자 데이터 유효성 검사
const validateUserData = (data) => {
  if (!data['이메일'] || !data['이름']) {
    throw new Error(`필수 필드가 누락되었습니다: ${!data['이메일'] ? '이메일' : ''} ${!data['이름'] ? '이름' : ''}`);
  }
};

// Firestore 데이터 준비
const prepareFirestoreData = (data) => {
  const groups = data['회원 그룹'] ? data['회원 그룹'].split(',').map(g => g.trim()) : [];
  const isAdmin = data['이름'] === '관리자';

  return {
    email: data['이메일'],
    name: data['이름'],
    role: isAdmin ? USER_ROLES.ADMIN : USER_ROLES.USER,
    points: parseInt(data['보유 포인트'] || '0', 10),
    gender: data['성별'] || '',
    phone: (data['연락처'] || '').replace(/\s+/g, ''),
    birthdate: data['생년월일'] || '',
    groups: groups,
    smsConsent: data['SMS 수신 동의'] === 'Y',
    emailConsent: data['E-Mail 수신 동의'] === 'Y',
    thirdPartyConsent: data['개인정보제3자제공동의'] === 'Y',
    registrationDate: admin.firestore.Timestamp.fromDate(new Date(data['가입일'])),
    loginCount: parseInt(data['로그인 횟수'] || '0', 10),
    lastLogin: data['마지막 로그인'] || '',
    social: {
      kakaoId: data['KAKAO ID'] || '',
      naverId: data['NAVER ID'] || '',
      googleId: data['GOOGLE ID'] || '',
      appleId: data['APPLE ID'] || ''
    },
    address: {
      zip: data['우편번호'] || '',
      addr: data['주소'] || '',
      addrDetail: data['상세주소'] || '',
      city: data['도시명'] || '',
      city2: data['도시군'] || ''
    },
    memo: data['관리자 메모'] || '',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(data['가입일'])),
    updatedAt: admin.firestore.Timestamp.now()
  };
};

// 사용자 마이그레이션 함수
const migrateUsers = async () => {
  console.log('사용자 마이그레이션을 시작합니다...');
  
  const records = [];
  const parser = fs
    .createReadStream(CSV_FILE_PATH)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  // CSV 파일 읽기
  for await (const record of parser) {
    records.push(record);
  }
  
  console.log(`CSV 파일에서 ${records.length}개의 레코드를 읽었습니다.`);

  // 각 레코드 처리
  for (const record of records) {
    try {
      validateUserData(record);
      
      // 기존 사용자 확인
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(record['이메일']);
        console.log(`기존 사용자 발견: ${record['이메일']}`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // 새 사용자 생성
          const tempPassword = generateTempPassword();
          userRecord = await auth.createUser({
            email: record['이메일'],
            password: tempPassword,
            displayName: record['이름']
          });
          console.log(`새 사용자 생성됨: ${record['이메일']} (임시 비밀번호: ${tempPassword})`);
        } else {
          throw error;
        }
      }

      // Firestore 데이터 저장
      const firestoreData = prepareFirestoreData(record);
      await db.collection('users').doc(userRecord.uid).set(firestoreData);
      console.log(`Firestore 데이터 저장 완료: ${record['이메일']}`);

    } catch (error) {
      console.error(`사용자 처리 중 오류 발생 (${record['이메일']}):`, error.message);
    }
  }

  console.log('마이그레이션이 완료되었습니다.');
};

// 스크립트 실행
migrateUsers()
  .catch(error => {
    console.error('마이그레이션 중 오류가 발생했습니다:', error);
    process.exit(1);
  }); 