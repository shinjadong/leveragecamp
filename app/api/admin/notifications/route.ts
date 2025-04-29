import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { auth } from "@/auth";
import { authOptions, isAdmin } from "@/migration/lib/auth";

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

    // DB 연결
    await connectToDB();

    // 필터 조건 구성
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    if (category !== "all") {
      filter.category = category;
    }
    if (isImportant !== null) {
      filter.isImportant = isImportant === "true";
    }

    // 공지사항 목록 조회
    const totalNotifications = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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
    
    // DB 연결
    await connectToDB();

    // 새 공지사항 생성
    const newNotification = new Notification({
      ...data,
      author: session.user.name || "관리자",
      createdBy: session.user.id,
      createdAt: new Date(),
      viewCount: 0,
    });
    await newNotification.save();

    return NextResponse.json(
      { message: "공지사항이 성공적으로 추가되었습니다.", notification: newNotification },
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
