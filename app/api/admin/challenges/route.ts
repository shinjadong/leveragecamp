import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Challenge, CHALLENGE_COLLECTION } from "@/models/Challenge";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 챌린지 목록 조회 API
 * GET /api/admin/challenges
 */
export async function GET(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 쿼리 파라미터 추출
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    // 현재 날짜
    const now = Timestamp.now();

    // 기본 쿼리
    let query = db.collection(CHALLENGE_COLLECTION);

    // 검색어 필터링
    if (search) {
      query = query.where("title", ">=", search)
        .where("title", "<=", search + "\uf8ff");
    }

    // 상태 필터링
    if (status !== "all") {
      if (status === "upcoming") {
        query = query.where("startDate", ">", now);
      } else if (status === "active") {
        query = query.where("startDate", "<=", now)
          .where("endDate", ">=", now);
      } else if (status === "completed") {
        query = query.where("endDate", "<", now);
      }
    }

    // 정렬 및 페이징
    const startAt = (page - 1) * limit;
    query = query.orderBy("startDate").offset(startAt).limit(limit);

    // 챌린지 목록 조회
    const snapshot = await query.get();
    const challenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      status: getStatus(doc.data() as Challenge, now)
    }));

    // 전체 문서 수 조회
    const totalSnapshot = await db.collection(CHALLENGE_COLLECTION).count().get();
    const totalChallenges = totalSnapshot.data().count;

    return NextResponse.json({
      challenges,
      pagination: {
        total: totalChallenges,
        page,
        limit,
        totalPages: Math.ceil(totalChallenges / limit),
      },
    });
  } catch (error) {
    console.error("챌린지 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "챌린지 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 챌린지 추가 API
 * POST /api/admin/challenges
 */
export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 요청 데이터 파싱
    const data = await req.json();
    
    // 새 챌린지 생성
    const newChallenge: Challenge = {
      ...data,
      createdBy: session.user.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      participants: data.participants || 0,
      startDate: Timestamp.fromDate(new Date(data.startDate)),
      endDate: Timestamp.fromDate(new Date(data.endDate)),
    };

    // Firestore에 저장
    const docRef = await db.collection(CHALLENGE_COLLECTION).add(newChallenge);
    const savedChallenge = await docRef.get();

    return NextResponse.json(
      { 
        message: "챌린지가 성공적으로 추가되었습니다.", 
        challenge: {
          id: savedChallenge.id,
          ...savedChallenge.data()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("챌린지 추가 오류:", error);
    return NextResponse.json(
      { error: "챌린지를 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 챌린지 상태 계산 함수
 */
function getStatus(challenge: Challenge, now: Timestamp): string {
  const startDate = challenge.startDate;
  const endDate = challenge.endDate;
  
  if (now.toMillis() < startDate.toMillis()) {
    return "upcoming";
  } else if (now.toMillis() >= startDate.toMillis() && now.toMillis() <= endDate.toMillis()) {
    return "active";
  } else {
    return "completed";
  }
}
