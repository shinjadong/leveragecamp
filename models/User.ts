import { Timestamp } from 'firebase-admin/firestore';

// 사용자 역할 타입
export type UserRole = 'admin' | 'user' | 'instructor';

// 성별 타입
export type Gender = 'male' | 'female' | 'other';

// 소셜 계정 정보 인터페이스
export interface SocialAccounts {
  kakaoId?: string;
  naverId?: string;
  googleId?: string;
  appleId?: string;
  kakaoConnectedAt?: Timestamp;
  naverConnectedAt?: Timestamp;
  googleConnectedAt?: Timestamp;
  appleConnectedAt?: Timestamp;
}

// 주소 정보 인터페이스
export interface Address {
  zip?: string;        // 우편번호
  addr?: string;       // 기본주소
  addrDetail?: string; // 상세주소
  city?: string;       // 시/도
  city2?: string;      // 시/군/구
}

// 사용자 설정 인터페이스
export interface UserSettings {
  emailNotification: boolean;  // 이메일 알림 설정
  smsNotification: boolean;    // SMS 알림 설정
  pushNotification: boolean;   // 푸시 알림 설정
  marketingConsent: boolean;   // 마케팅 수신 동의
  thirdPartyConsent: boolean; // 개인정보 제3자 제공 동의
  darkMode?: boolean;         // 다크모드 설정
  language?: string;          // 선호 언어
}

// 학습 통계 인터페이스
export interface LearningStats {
  totalLectureTime: number;    // 총 강의 시청 시간(분)
  completedLectures: number;   // 완료한 강의 수
  completedChallenges: number; // 완료한 챌린지 수
  totalPoints: number;         // 총 획득 포인트
  ranking?: number;            // 전체 랭킹
  weeklyRanking?: number;      // 주간 랭킹
  lastLectureAt?: Timestamp;   // 마지막 강의 시청 시간
  lastChallengeAt?: Timestamp; // 마지막 챌린지 완료 시간
}

// 기본 사용자 인터페이스
export interface User {
  id?: string;
  email: string;              // 이메일 (로그인 ID)
  name: string;               // 이름
  nickname?: string;          // 닉네임
  role: UserRole;             // 권한
  gender?: Gender;            // 성별
  phone?: string;             // 전화번호
  birthdate?: string;         // 생년월일 (YYYY-MM-DD)
  profileImage?: string;      // 프로필 이미지 URL
  bio?: string;              // 자기소개
  groups: string[];          // 소속 그룹
  points: number;            // 보유 포인트
  status: 'active' | 'inactive' | 'suspended'; // 계정 상태
  
  // 연관 정보
  social?: SocialAccounts;   // 소셜 계정 정보
  address?: Address;         // 주소 정보
  settings: UserSettings;    // 사용자 설정
  stats: LearningStats;      // 학습 통계
  
  // 관리 정보
  memo?: string;             // 관리자 메모
  registrationDate: Timestamp; // 가입일시
  loginCount: number;        // 로그인 횟수
  lastLogin?: Timestamp;     // 최종 로그인 시간
  lastPasswordChange?: Timestamp; // 최종 비밀번호 변경일
  
  // 시스템 정보
  createdBy?: string;        // 생성자 ID
  updatedBy?: string;        // 수정자 ID
  createdAt: Timestamp;      // 생성 시간
  updatedAt: Timestamp;      // 수정 시간
}

// 컬렉션 이름 상수
export const USER_COLLECTION = 'users'; 