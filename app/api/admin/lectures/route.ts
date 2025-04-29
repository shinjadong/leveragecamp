import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Lecture, LECTURE_COLLECTION } from "@/models/Lecture";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 강의 목록 조회 API
 * GET /api/admin/lectures
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
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    // 기본 쿼리
    let query = db.collection(LECTURE_COLLECTION);

    // 검색어 필터링
    if (search) {
      query = query.where("title", ">=", search)
        .where("title", "<=", search + "\uf8ff");
    }

    // 카테고리 필터링
    if (category !== "all") {
      query = query.where("category", "==", category);
    }

    // 상태 필터링
    if (status !== "all") {
      query = query.where("status", "==", status);
    }

    // 정렬 및 페이징
    const startAt = (page - 1) * limit;
    query = query.orderBy("createdAt", "desc").offset(startAt).limit(limit);

    // 강의 목록 조회
    const snapshot = await query.get();
    const lectures = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 전체 문서 수 조회
    const totalSnapshot = await db.collection(LECTURE_COLLECTION).count().get();
    const totalLectures = totalSnapshot.data().count;

    return NextResponse.json({
      lectures,
      pagination: {
        total: totalLectures,
        page,
        limit,
        totalPages: Math.ceil(totalLectures / limit),
      },
    });
  } catch (error) {
    console.error("강의 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "강의 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 강의 추가 API
 * POST /api/admin/lectures
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
    
    // 새 강의 생성
    const newLecture: Lecture = {
      ...data,
      createdBy: session.user.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Firestore에 저장
    const docRef = await db.collection(LECTURE_COLLECTION).add(newLecture);
    const savedLecture = await docRef.get();

    return NextResponse.json(
      { 
        message: "강의가 성공적으로 추가되었습니다.", 
        lecture: {
          id: savedLecture.id,
          ...savedLecture.data()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("강의 추가 오류:", error);
    return NextResponse.json(
      { error: "강의를 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
