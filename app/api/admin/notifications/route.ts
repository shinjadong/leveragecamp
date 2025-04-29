import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Notification, NOTIFICATION_COLLECTION } from "@/models/Notification";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 공지사항 목록 조회 API
 * GET /api/admin/notifications
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
    const isImportant = searchParams.get("isImportant");

    // 기본 쿼리
    let query = db.collection(NOTIFICATION_COLLECTION);

    // 검색어 필터링
    if (search) {
      query = query.where("title", ">=", search)
        .where("title", "<=", search + "\uf8ff");
    }

    // 카테고리 필터링
    if (category !== "all") {
      query = query.where("category", "==", category);
    }

    // 중요도 필터링
    if (isImportant !== null) {
      query = query.where("isImportant", "==", isImportant === "true");
    }

    // 정렬 및 페이징
    const startAt = (page - 1) * limit;
    query = query.orderBy("createdAt", "desc").offset(startAt).limit(limit);

    // 공지사항 목록 조회
    const snapshot = await query.get();
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 전체 문서 수 조회
    const totalSnapshot = await db.collection(NOTIFICATION_COLLECTION).count().get();
    const totalNotifications = totalSnapshot.data().count;

    return NextResponse.json({
      notifications,
      pagination: {
        total: totalNotifications,
        page,
        limit,
        totalPages: Math.ceil(totalNotifications / limit),
      },
    });
  } catch (error) {
    console.error("공지사항 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "공지사항 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 공지사항 추가 API
 * POST /api/admin/notifications
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
    
    // 새 공지사항 생성
    const newNotification: Notification = {
      ...data,
      author: session.user.name || "관리자",
      createdBy: session.user.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      viewCount: 0,
      startDate: Timestamp.fromDate(new Date(data.startDate)),
      endDate: Timestamp.fromDate(new Date(data.endDate)),
    };

    // Firestore에 저장
    const docRef = await db.collection(NOTIFICATION_COLLECTION).add(newNotification);
    const savedNotification = await docRef.get();

    return NextResponse.json(
      { 
        message: "공지사항이 성공적으로 추가되었습니다.", 
        notification: {
          id: savedNotification.id,
          ...savedNotification.data()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("공지사항 추가 오류:", error);
    return NextResponse.json(
      { error: "공지사항을 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
