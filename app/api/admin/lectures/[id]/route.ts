import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Lecture, LECTURE_COLLECTION } from "@/models/Lecture";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 특정 강의 조회 API
 * GET /api/admin/lectures/:id
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

    // 강의 조회
    const lectureDoc = await db.collection(LECTURE_COLLECTION).doc(params.id).get();
    if (!lectureDoc.exists) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: lectureDoc.id,
      ...lectureDoc.data()
    });
  } catch (error) {
    console.error("강의 조회 오류:", error);
    return NextResponse.json(
      { error: "강의를 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 강의 정보 수정 API
 * PATCH /api/admin/lectures/:id
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
    
    // 강의 존재 확인
    const lectureRef = db.collection(LECTURE_COLLECTION).doc(params.id);
    const lectureDoc = await lectureRef.get();
    if (!lectureDoc.exists) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 강의 정보 업데이트
    await lectureRef.update({
      ...data,
      updatedAt: Timestamp.now(),
      updatedBy: session.user.id
    });

    // 업데이트된 강의 정보 조회
    const updatedDoc = await lectureRef.get();

    return NextResponse.json({
      message: "강의 정보가 성공적으로 업데이트되었습니다.",
      lecture: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      },
    });
  } catch (error) {
    console.error("강의 정보 수정 오류:", error);
    return NextResponse.json(
      { error: "강의 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 강의 삭제 API
 * DELETE /api/admin/lectures/:id
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

    // 강의 존재 확인
    const lectureRef = db.collection(LECTURE_COLLECTION).doc(params.id);
    const lectureDoc = await lectureRef.get();
    if (!lectureDoc.exists) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 강의 삭제
    await lectureRef.delete();

    return NextResponse.json({
      message: "강의가 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("강의 삭제 오류:", error);
    return NextResponse.json(
      { error: "강의를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
