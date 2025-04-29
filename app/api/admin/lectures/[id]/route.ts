import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Lecture from "@/models/Lecture";
import { auth } from "@/auth";
import { authOptions, isAdmin } from "@/migration/lib/auth";

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

    // DB 연결
    await connectToDB();

    // 강의 조회
    const lecture = await Lecture.findById(params.id);
    if (!lecture) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(lecture);
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
    
    // DB 연결
    await connectToDB();

    // 강의 존재 확인
    const lecture = await Lecture.findById(params.id);
    if (!lecture) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 강의 정보 업데이트
    const updatedLecture = await Lecture.findByIdAndUpdate(
      params.id,
      { 
        $set: {
          ...data,
          updatedAt: new Date(),
          updatedBy: session.user.id
        } 
      },
      { new: true }
    );

    return NextResponse.json({
      message: "강의 정보가 성공적으로 업데이트되었습니다.",
      lecture: updatedLecture,
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

    // DB 연결
    await connectToDB();

    // 강의 존재 확인
    const lecture = await Lecture.findById(params.id);
    if (!lecture) {
      return NextResponse.json(
        { error: "강의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 강의 삭제
    await Lecture.findByIdAndDelete(params.id);

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
