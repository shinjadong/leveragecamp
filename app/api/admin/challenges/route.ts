import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Challenge from "@/models/Challenge";
import { auth } from "@/auth";
import { authOptions, isAdmin } from "@/migration/lib/auth";

/**
 * 챌린지 목록 조회 API
 * GET /api/admin/challenges
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

    // 현재 날짜
    const now = new Date();

    // 필터 조건 구성
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { mentor: { $regex: search, $options: "i" } },
      ];
    }
    
    // 상태 필터링
    if (status !== "all") {
      if (status === "upcoming") {
        filter.startDate = { $gt: now };
      } else if (status === "active") {
        filter.startDate = { $lte: now };
        filter.endDate = { $gte: now };
      } else if (status === "completed") {
        filter.endDate = { $lt: now };
      }
    }

    // 챌린지 목록 조회
    const totalChallenges = await Challenge.countDocuments(filter);
    const challenges = await Challenge.find(filter)
      .sort({ startDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // 각 챌린지의 상태 계산
    const challengesWithStatus = challenges.map(challenge => {
      const challengeObj = challenge.toObject();
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      
      let status = "upcoming";
      if (now >= startDate && now <= endDate) {
        status = "active";
      } else if (now > endDate) {
        status = "completed";
      }
      
      return {
        ...challengeObj,
        status
      };
    });

    return NextResponse.json({
      challenges: challengesWithStatus,
      pagination: {
        total: totalChallenges,
        page,
        limit,
        totalPages: Math.ceil(totalChallenges / limit),
      },
    });
  } catch (error) {
    console.error("챌린지 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "챌린지 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 챌린지 추가 API
 * POST /api/admin/challenges
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

    // 새 챌린지 생성
    const newChallenge = new Challenge({
      ...data,
      createdBy: session.user.id,
      createdAt: new Date(),
      participants: data.participants || 0,
    });
    await newChallenge.save();

    return NextResponse.json(
      { message: "챌린지가 성공적으로 추가되었습니다.", challenge: newChallenge },
      { status: 201 }
    );
  } catch (error) {
    console.error("챌린지 추가 오류:", error);
    return NextResponse.json(
      { error: "챌린지를 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
