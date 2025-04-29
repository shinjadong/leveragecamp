## 1. Firestore 회원(leverage-users) 컬렉션 스키마 (최신 마이그레이션 기준)

### 1. 컬렉션명
- `leverage-users`

### 2. 문서 ID
- Firebase Auth의 `uid` (고유 사용자 식별자)

### 3. 필드 상세 (마이그레이션 스크립트 기준)

| 필드명                | 타입         | 설명/예시                                      | 변환/주의사항 |
|----------------------|-------------|-----------------------------------------------|--------------|
| `email`              | string      | 이메일 주소                                    | 필수, 중복 불가 |
| `name`               | string      | 이름                                           | 필수 |
| `role`               | string      | 권한 (`admin` 또는 `user`)                     | 이름/이메일/그룹에 '관리자' 포함 시 `admin` |
| `points`             | number      | 보유 포인트                                    | 없으면 0 |
| `gender`             | string      | 성별                                           | 선택 |
| `phone`              | string      | 연락처(공백 제거)                              | 선택, 공백 자동 제거 |
| `birthdate`          | string      | 생년월일 (`YYYY-MM-DD`)                        | '0000-00-00' 또는 없음 → 빈 문자열 |
| `groups`             | string[]    | 회원 그룹(여러 개, 콤마로 구분)                | 문자열 → 배열 변환 |
| `smsConsent`         | boolean     | SMS 수신 동의 (`Y` → true)                     | 'Y'/'N' → true/false |
| `emailConsent`       | boolean     | 이메일 수신 동의 (`Y` → true)                  | 'Y'/'N' → true/false |
| `thirdPartyConsent`  | boolean     | 개인정보 제3자 제공 동의 (`Y` → true)          | 'Y'/'N' → true/false |
| `registrationDate`   | Timestamp   | 가입일 (없으면 현재 시각)                      | Firestore Timestamp, CSV 없으면 now |
| `loginCount`         | number      | 로그인 횟수                                    | 없으면 0 |
| `lastLogin`          | string      | 마지막 로그인 일시(문자열)                     | 선택 |
| `social.kakaoId`     | string      | 카카오 ID                                      | 선택 |
| `social.naverId`     | string      | 네이버 ID                                      | 선택 |
| `social.googleId`    | string      | 구글 ID                                        | 선택 |
| `social.appleId`     | string      | 애플 ID                                        | 선택 |
| `address.zip`        | string      | 우편번호                                       | 선택 |
| `address.addr`       | string      | 주소                                           | 선택 |
| `address.addrDetail` | string      | 상세주소                                       | 선택 |
| `address.city`       | string      | 도시명                                         | 선택 |
| `address.city2`      | string      | 도시군                                         | 선택 |
| `memo`               | string      | 관리자 메모                                    | 선택 |
| `createdAt`          | Timestamp   | 문서 생성 시각                                 | Firestore Timestamp, 마이그레이션 시 now |
| `updatedAt`          | Timestamp   | 문서 수정 시각                                 | Firestore Timestamp, 마이그레이션 시 now |

---

### 4. 구조 예시 (JSON)

```json
{
  "email": "user@example.com",
  "name": "홍길동",
  "role": "user",
  "points": 1000,
  "gender": "남",
  "phone": "01012345678",
  "birthdate": "1990-01-01",
  "groups": ["일반회원", "챌린지참여자"],
  "smsConsent": true,
  "emailConsent": false,
  "thirdPartyConsent": true,
  "registrationDate": "2024-04-25T12:34:56.000Z",
  "loginCount": 5,
  "lastLogin": "2024-05-01T09:00:00.000Z",
  "social": {
    "kakaoId": "",
    "naverId": "",
    "googleId": "",
    "appleId": ""
  },
  "address": {
    "zip": "12345",
    "addr": "서울시 강남구 테헤란로 1",
    "addrDetail": "101동 202호",
    "city": "서울",
    "city2": "강남구"
  },
  "memo": "VIP 고객",
  "createdAt": "2024-04-25T12:34:56.000Z",
  "updatedAt": "2024-04-25T12:34:56.000Z"
}
```

---

### 5. 마이그레이션 로직 특이사항
- **이메일/이름이 없으면 건너뜀**
- 이미 Firebase Auth에 등록된 이메일은 중복 생성하지 않음
- `role`은 이름/이메일/그룹에 '관리자' 포함 시 `admin`, 아니면 `user`
- `groups`는 콤마(,)로 구분된 문자열을 배열로 변환
- 동의 항목(Y/N)은 boolean으로 변환
- 날짜/시간 필드는 문자열 또는 Date 객체로 저장
- Firestore Timestamp 필드는 실제로는 JS Date 또는 ISO 문자열로 저장될 수 있음

---

### 6. 결론 및 참고
- 이 프로젝트의 **회원 데이터는 Firestore의 users 컬렉션**에 위와 같은 구조로 저장됩니다.
- 기존 MongoDB 기반의 User 스키마보다 훨씬 **다양한 필드와 구조**를 포함하고 있습니다.
- **클론 프로젝트**이지만, Firebase로의 일원화 과정에서 데이터 구조가 확장/변경된 점이 특징입니다.
- 실제 서비스에서는 Firestore 보안 규칙, 인덱스, 쿼리 최적화 등도 반드시 함께 고려해야 합니다.

---

#### 추가로 궁금한 점(예: 챌린지/강의/알림 등 다른 데이터의 마이그레이션, Firestore 쿼리 예시, ERD 도식화 등)이 있으면 언제든 말씀해 주세요!
필요하다면, **Firestore용 컬렉션 설계 문서**나 **자동화 스크립트**도 만들어드릴 수 있습니다.

---
