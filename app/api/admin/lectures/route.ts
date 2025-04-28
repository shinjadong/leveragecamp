import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Lecture from "@/models/Lecture";
import { auth } from "@/auth";
import { authOptions, isAdmin } from "@/lib/auth";

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

    // DB 연결
    await connectToDB();

    // 필터 조건 구성
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }
    if (category !== "all") {
      filter.category = category;
    }
    if (status !== "all") {
      filter.status = status;
    }

    // 강의 목록 조회
    const totalLectures = await Lecture.countDocuments(filter);
    const lectures = await Lecture.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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
    
    // DB 연결
    await connectToDB();

    // 새 강의 생성
    const newLecture = new Lecture({
      ...data,
      createdBy: session.user.id,
    });
    await newLecture.save();

    return NextResponse.json(
      { message: "강의가 성공적으로 추가되었습니다.", lecture: newLecture },
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
