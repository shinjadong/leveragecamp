/**
 * 회원 CSV → Firebase Auth/Firestore 마이그레이션 스크립트 (CommonJS)
 * 타입스크립트 strict 옵션 대응: 모든 매개변수 및 error 타입 명시
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const { adminAuth, adminDb } = require('../lib/firebase-admin.js');

// CSV 파일 경로
const csvFilePath = path.join(process.cwd(), 'migration', '회원2025_04_25_1 - Sheet1.csv');

// 임시 비밀번호
const DEFAULT_PASSWORD = 'leveragecamp2025';

/**
 * 관리자 구분 기준 (이름/이메일/그룹에 '관리자' 포함 시)
 */
function getRole(name: string, email: string, group: string): 'admin' | 'user' {
  if (
    (name && name.includes('관리자')) ||
    (email && email.includes('admin')) ||
    (group && group.includes('관리자'))
  ) {
    return 'admin';
  }
  return 'user';
}

/**
 * CSV 파싱 및 마이그레이션
 */
async function migrate() {
  const fileContent: string = fs.readFileSync(csvFilePath, 'utf8');
  parse(
    fileContent,
    {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    },
    async (err: Error | undefined, records: any[]) => {
      if (err) {
        console.error('CSV 파싱 오류:', err);
        process.exit(1);
      }
      console.log(`총 ${records.length}명의 회원 데이터를 처리합니다.`);
      const results: { email: string; uid: string }[] = [];
      const errors: { email: string; error: string }[] = [];
      for (const record of records) {
        try {
          const email: string = record['이메일']?.trim();
          const name: string = record['이름']?.trim();
          if (!email || !name) {
            console.warn('이메일 또는 이름이 없는 회원은 건너뜁니다.');
            continue;
          }
          // 이미 등록된 계정은 건너뜀
          let userRecord;
          try {
            userRecord = await adminAuth.getUserByEmail(email);
            console.log(`이미 존재하는 계정: ${email}`);
            continue;
          } catch (e: any) {
            // 존재하지 않으면 새로 생성
          }
          // Firebase Auth 계정 생성
          userRecord = await adminAuth.createUser({
            email,
            password: DEFAULT_PASSWORD,
            displayName: name,
            emailVerified: false,
            disabled: false,
          });
          // Firestore에 추가 정보 저장
          const userDoc = {
            email,
            name,
            role: getRole(name, email, record['회원 그룹'] || ''),
            points: parseInt(record['보유 포인트'] || '0', 10),
            gender: record['성별'] || '',
            phone: record['연락처']?.replace(/\s/g, '') || '',
            birthdate: record['생년월일'] && record['생년월일'] !== '0000-00-00' ? record['생년월일'] : '',
            groups: record['회원 그룹'] ? (record['회원 그룹'] as string).split(',').map((g: string) => g.trim()) : [],
            smsConsent: record['SMS 수신 동의'] === 'Y',
            emailConsent: record['E-Mail 수신 동의'] === 'Y',
            thirdPartyConsent: record['개인정보제3자제공동의'] === 'Y',
            registrationDate: record['가입일'] ? new Date(record['가입일']) : new Date(),
            loginCount: parseInt(record['로그인 횟수'] || '0', 10),
            lastLogin: record['마지막 로그인'] || '',
            social: {
              kakaoId: record['KAKAO ID'] || '',
              naverId: record['NAVER ID'] || '',
              googleId: record['GOOGLE ID'] || '',
              appleId: record['APPLE ID'] || '',
            },
            address: {
              zip: record['우편번호'] || '',
              addr: record['주소'] || '',
              addrDetail: record['상세주소'] || '',
              city: record['도시명'] || '',
              city2: record['도시군'] || '',
            },
            memo: record['관리자 메모'] || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await adminDb.collection('users').doc(userRecord.uid).set(userDoc);
          results.push({ email, uid: userRecord.uid });
          console.log(`회원 등록 완료: ${name} (${email})`);
        } catch (error: unknown) {
          let errorMsg = '알 수 없는 오류';
          if (error instanceof Error) errorMsg = error.message;
          console.error('회원 등록 오류:', errorMsg);
          errors.push({ email: record['이메일'], error: errorMsg });
        }
      }
      console.log(`\n마이그레이션 완료: ${results.length}명 성공, ${errors.length}명 실패`);
      if (errors.length > 0) {
        console.log('오류 목록:', errors);
      }
      process.exit(0);
    }
  );
}

migrate(); 