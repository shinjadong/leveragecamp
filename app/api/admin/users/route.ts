import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { User, USER_COLLECTION } from "@/models/User";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 회원 목록 조회 API
 * GET /api/admin/users
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

    // 기본 쿼리
    let query = db.collection(USER_COLLECTION);

    // 검색어 필터링
    if (search) {
      query = query.where("name", ">=", search)
        .where("name", "<=", search + "\uf8ff");
    }

    // 상태 필터링
    if (status !== "all") {
      query = query.where("status", "==", status);
    }

    // 정렬 및 페이징
    const startAt = (page - 1) * limit;
    query = query.orderBy("createdAt", "desc").offset(startAt).limit(limit);

    // 회원 목록 조회
    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.password;
      return {
        id: doc.id,
        ...data
      };
    });

    // 전체 문서 수 조회
    const totalSnapshot = await db.collection(USER_COLLECTION).count().get();
    const totalUsers = totalSnapshot.data().count;

    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("회원 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "회원 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 회원 추가 API
 * POST /api/admin/users
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
    
    // 이메일 중복 확인
    const emailQuery = await db.collection(USER_COLLECTION)
      .where("email", "==", data.email)
      .get();
    if (!emailQuery.empty) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      );
    }

    // 새 회원 생성
    const newUser: User = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      registrationDate: Timestamp.now(),
      loginCount: 0,
      points: 0,
      groups: [],
      smsConsent: false,
      emailConsent: false,
      thirdPartyConsent: false,
    };

    // Firestore에 저장
    const docRef = await db.collection(USER_COLLECTION).add(newUser);
    const savedUser = await docRef.get();
    const userData = savedUser.data();
    delete userData?.password;

    return NextResponse.json(
      { 
        message: "회원이 성공적으로 추가되었습니다.", 
        user: {
          id: savedUser.id,
          ...userData
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원 추가 오류:", error);
    return NextResponse.json(
      { error: "회원을 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
