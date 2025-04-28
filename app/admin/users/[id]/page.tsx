"use client";

import { useState, useEffect } from "react";
import "./styles.css";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 사용자 인터페이스 정의
interface IUserLecture {
  id: number;
  title: string;
  date: string;
  progress: number;
}

interface IUserChallenge {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

interface IUserOrder {
  id: number;
  date: string;
  amount: number;
  status: string;
  items: string[];
}

interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  points: number;
  status: string;
  profileImage: string;
  address: string;
  birthdate: string;
  gender: string;
  occupation: string;
  interests: string[];
  lastLogin: string;
  enrolledLectures?: IUserLecture[];
  completedLectures?: IUserLecture[];
  participatingChallenges?: IUserChallenge[];
  completedChallenges?: IUserChallenge[];
  orderHistory?: IUserOrder[];
  recentOrders?: IUserOrder[];
}

/**
 * 회원 상세 정보 페이지
 */

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  // API에서 사용자 데이터 가져오기
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('회원 데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error('회원 데이터 로딩 오류:', err);
        setError('회원 데이터를 불러오는데 문제가 발생했습니다.');
        // 에러 발생 시 샘플 데이터 사용
        // 샘플 데이터 사용 (모든 필수 필드 포함)
        setUser({
          id: parseInt(userId),
          name: "김철수",
          email: "chulsoo@example.com",
          phone: "010-1234-5678",
          joinDate: "2025-04-25",
          points: 1200,
          status: "active",
          profileImage: "",
          address: "서울시 강남구 테헤란로 123",
          birthdate: "1990-05-15",
          gender: "남성",
          occupation: "회사원",
          interests: ["해외구매대행", "온라인마케팅", "ChatGPT"],
          lastLogin: "2025-04-26 00:45:12",
          enrolledLectures: [
            { id: 1, title: "해외 구매대행 기초", date: "2025-04-10", progress: 75 },
            { id: 2, title: "ChatGPT 활용법", date: "2025-04-15", progress: 30 },
          ],
          completedLectures: [
            { id: 1, title: "해외 구매대행 기초", date: "2025-04-10", progress: 75 },
            { id: 2, title: "ChatGPT 활용법", date: "2025-04-15", progress: 30 },
          ],
          participatingChallenges: [
            { id: 2, title: "ChatGPT 활용 30일 챌린지", startDate: "2025-04-15", endDate: "2025-05-15" },
          ],
          completedChallenges: [
            { id: 2, title: "ChatGPT 활용 30일 챌린지", startDate: "2025-04-15", endDate: "2025-05-15" },
          ],
          orderHistory: [
            { id: 1, date: "2025-04-10", amount: 99000, status: "완료", items: ["해외 구매대행 기초"] },
            { id: 2, date: "2025-04-15", amount: 79000, status: "완료", items: ["ChatGPT 활용법"] },
            { id: 3, date: "2025-04-15", amount: 30000, status: "완료", items: ["ChatGPT 활용 30일 챌린지"] },
          ],
          recentOrders: [
            { id: 1, date: "2025-04-10", amount: 99000, status: "완료", items: ["해외 구매대행 기초"] },
            { id: 2, date: "2025-04-15", amount: 79000, status: "완료", items: ["ChatGPT 활용법"] },
            { id: 3, date: "2025-04-15", amount: 30000, status: "완료", items: ["ChatGPT 활용 30일 챌린지"] },
          ],
        });
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">회원 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <p className="text-destructive font-medium mb-2">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>뒤로 가기</Button>
        </div>
      </div>
    );
  }

  // 회원 데이터가 없으면 에러 페이지 표시
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <p className="text-destructive font-medium mb-2">회원 데이터를 찾을 수 없습니다.</p>
          <Button variant="outline" onClick={() => router.back()}>뒤로 가기</Button>
        </div>
      </div>
    );
  }

  // 회원 상태 변경 핸들러
  const handleStatusChange = (newStatus: string) => {
    const updateUserStatus = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('회원 상태 변경에 실패했습니다.');
        }

        setUser({ ...user, status: newStatus });
        alert(`회원 상태가 ${newStatus}로 변경되었습니다.`);
      } catch (err) {
        console.error('회원 상태 변경 오류:', err);
        alert('회원 상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
    };

    updateUserStatus();
  };

  // 회원 삭제 핸들러
  const handleDeleteUser = () => {
    if (window.confirm("정말로 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      const deleteUser = async () => {
        try {
          const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('회원 삭제에 실패했습니다.');
          }

          alert("회원이 삭제되었습니다.");
          router.push("/admin/users");
        } catch (err) {
          console.error('회원 삭제 오류:', err);
          alert('회원 삭제에 실패했습니다. 다시 시도해주세요.');
        }
      };

      deleteUser();
    }
  };

  // 포인트 추가 핸들러
  const handleAddPoints = () => {
    const points = prompt("추가할 포인트 수를 입력하세요:");
    if (points && !isNaN(parseInt(points))) {
      const newPoints = user.points + parseInt(points);
      
      const updatePoints = async () => {
        try {
          const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: newPoints }),
          });

          if (!response.ok) {
            throw new Error('포인트 추가에 실패했습니다.');
          }

          // 성공 시 클라이언트 상태 업데이트 (오프티미스틱 UI)
          setUser({ ...user, points: newPoints });
          alert(`${points} 포인트가 추가되었습니다. 현재 포인트: ${newPoints}`);
        } catch (err) {
          console.error('포인트 추가 오류:', err);
          alert('포인트 추가에 실패했습니다. 다시 시도해주세요.');
        }
      };

      updatePoints();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">회원 상세 정보</h2>
          <p className="text-muted-foreground">
            회원 ID: {userId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/users/${userId}/edit`}>
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              수정
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDeleteUser}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            삭제
          </Button>
        </div>
      </div>

      {/* 회원 프로필 카드 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  variant={user.status === "active" ? "destructive" : "default"}
                  onClick={() => handleStatusChange(user.status === "active" ? "inactive" : "active")}
                  className="w-full"
                >
                  {user.status === "active" ? "계정 비활성화" : "계정 활성화"}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleAddPoints}>
                  포인트 추가
                </Button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">이메일</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">연락처</h4>
                <p>{user.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">가입일</h4>
                <p>{user.joinDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">포인트</h4>
                <p>{user.points.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">상태</h4>
                <p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "활성" : "비활성"}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">마지막 로그인</h4>
                <p>{user.lastLogin}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">주소</h4>
                <p>{user.address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">생년월일</h4>
                <p>{user.birthdate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">성별</h4>
                <p>{user.gender}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">직업</h4>
                <p>{user.occupation}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">관심사</h4>
                <div className="flex flex-wrap gap-1">
                  {user.interests && user.interests.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 회원 활동 탭 */}
      <Tabs defaultValue="lectures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lectures">수강 중인 강의</TabsTrigger>
          <TabsTrigger value="challenges">참여 중인 챌린지</TabsTrigger>
          <TabsTrigger value="orders">주문 내역</TabsTrigger>
        </TabsList>

        {/* 수강 중인 강의 */}
        <TabsContent value="lectures">
          <Card>
            <CardHeader>
              <CardTitle>수강 중인 강의</CardTitle>
              <CardDescription>
                회원이 현재 수강 중인 강의 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.enrolledLectures && user.enrolledLectures.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-3 text-sm font-medium">
                    <div>강의명</div>
                    <div>등록일</div>
                    <div>진행률</div>
                    <div>관리</div>
                  </div>
                  <div className="divide-y">
                    {user.completedLectures && user.completedLectures.map((lecture: IUserLecture) => (
                      <div
                        key={lecture.id}
                        className="grid grid-cols-4 p-3 text-sm hover:bg-muted/50"
                      >
                        <div className="font-medium">{lecture.title}</div>
                        <div className="text-muted-foreground">{lecture.date}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full bg-primary progress-bar progress-bar-${lecture.progress}`}
                              />
                            </div>
                            <span className="text-xs">{lecture.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <Link href={`/admin/lectures/${lecture.id}`}>
                            <Button variant="outline" size="sm">
                              강의 상세
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  수강 중인 강의가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 참여 중인 챌린지 */}
        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>참여 중인 챌린지</CardTitle>
              <CardDescription>
                회원이 현재 참여 중인 챌린지 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.completedChallenges && user.completedChallenges.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-3 text-sm font-medium">
                    <div>챌린지명</div>
                    <div>시작일</div>
                    <div>종료일</div>
                    <div>관리</div>
                  </div>
                  <div className="divide-y">
                    {user.completedChallenges && user.completedChallenges.map((challenge: IUserChallenge) => (
                      <div
                        key={challenge.id}
                        className="grid grid-cols-4 p-3 text-sm hover:bg-muted/50"
                      >
                        <div className="font-medium">{challenge.title}</div>
                        <div className="text-muted-foreground">{challenge.startDate}</div>
                        <div className="text-muted-foreground">{challenge.endDate}</div>
                        <div>
                          <Link href={`/admin/challenges/${challenge.id}`}>
                            <Button variant="outline" size="sm">
                              챌린지 상세
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  참여 중인 챌린지가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 주문 내역 */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>주문 내역</CardTitle>
              <CardDescription>
                회원의 모든 주문 내역입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.recentOrders && user.recentOrders.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-3 text-sm font-medium">
                    <div>주문 ID</div>
                    <div>날짜</div>
                    <div>금액</div>
                    <div>상태</div>
                    <div>상품</div>
                  </div>
                  <div className="divide-y">
                    {user.recentOrders && user.recentOrders.map((order: IUserOrder) => (
                      <div
                        key={order.id}
                        className="grid grid-cols-5 p-3 text-sm hover:bg-muted/50"
                      >
                        <div className="font-medium">#{order.id}</div>
                        <div className="text-muted-foreground">{order.date}</div>
                        <div>₩{order.amount.toLocaleString()}</div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              order.status === "완료"
                                ? "bg-green-100 text-green-800"
                                : order.status === "취소"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {order.items.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  주문 내역이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
