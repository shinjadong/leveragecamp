import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * Firebase Auth 기반 회원가입 API
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "이름, 이메일, 비밀번호는 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    // Firebase Auth에 사용자 생성
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
      disabled: false,
    });

    // Firestore에 사용자 추가 정보 저장
    await adminDb.collection("users").doc(userRecord.uid).set({
      name,
      email,
      role: "user",
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다.", uid: userRecord.uid },
      { status: 201 }
    );
  } catch (error: any) {
    let msg = "회원가입 처리 중 오류가 발생했습니다.";
    if (error.code === "auth/email-already-exists") {
      msg = "이미 등록된 이메일 주소입니다.";
      return NextResponse.json({ message: msg }, { status: 409 });
    }
    console.error("회원가입 오류:", error);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
