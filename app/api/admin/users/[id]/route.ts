import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";
import { authOptions, isAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * 특정 회원 조회 API
 * GET /api/admin/users/:id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // DB 연결
    await connectToDB();

    // 회원 조회
    const user = await User.findById(params.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("회원 조회 오류:", error);
    return NextResponse.json(
      { error: "회원을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 회원 정보 수정 API
 * PATCH /api/admin/users/:id
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 회원 존재 확인
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이메일 변경 시 중복 확인
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return NextResponse.json(
          { error: "이미 등록된 이메일입니다." },
          { status: 400 }
        );
      }
    }

    // 비밀번호 변경 시 해시 처리
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // 회원 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "회원 정보가 성공적으로 업데이트되었습니다.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("회원 정보 수정 오류:", error);
    return NextResponse.json(
      { error: "회원 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 회원 삭제 API
 * DELETE /api/admin/users/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // DB 연결
    await connectToDB();

    // 회원 존재 확인
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 회원 삭제
    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "회원이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("회원 삭제 오류:", error);
    return NextResponse.json(
      { error: "회원을 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
