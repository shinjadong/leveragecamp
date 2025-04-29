import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { User, USER_COLLECTION } from "@/models/User";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";
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

    // 회원 조회
    const userDoc = await db.collection(USER_COLLECTION).doc(params.id).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 비밀번호 필드 제외
    const userData = userDoc.data();
    delete userData?.password;

    return NextResponse.json({
      id: userDoc.id,
      ...userData
    });
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
    
    // 회원 존재 확인
    const userRef = db.collection(USER_COLLECTION).doc(params.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이메일 변경 시 중복 확인
    if (data.email && data.email !== userDoc.data()?.email) {
      const emailQuery = await db.collection(USER_COLLECTION)
        .where("email", "==", data.email)
        .get();
      if (!emailQuery.empty) {
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
    await userRef.update({
      ...data,
      updatedAt: Timestamp.now()
    });

    // 업데이트된 회원 정보 조회
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    delete updatedData?.password;

    return NextResponse.json({
      message: "회원 정보가 성공적으로 업데이트되었습니다.",
      user: {
        id: updatedDoc.id,
        ...updatedData
      },
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

    // 회원 존재 확인
    const userRef = db.collection(USER_COLLECTION).doc(params.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 회원 삭제
    await userRef.delete();

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
