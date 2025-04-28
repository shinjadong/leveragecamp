import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";
import { authOptions, isAdmin } from "@/lib/auth";

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

    // DB 연결
    await connectToDB();

    // 필터 조건 구성
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (status !== "all") {
      filter.status = status;
    }

    // 회원 목록 조회
    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password"); // 비밀번호 제외

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
    
    // DB 연결
    await connectToDB();

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      );
    }

    // 새 회원 생성
    const newUser = new User(data);
    await newUser.save();

    // 비밀번호 제외하고 응답
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { message: "회원이 성공적으로 추가되었습니다.", user: userResponse },
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
