"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * 회원 정보 수정 페이지
 */
export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // 회원 정보 상태
  const [user, setUser] = useState({
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
    bio: "안녕하세요, 김철수입니다. 온라인 비즈니스에 관심이 많습니다.",
  });

  // 사용 가능한 관심사 목록
  const availableInterests = [
    "해외구매대행",
    "온라인마케팅",
    "ChatGPT",
    "이커머스",
    "아마존셀러",
    "유튜브",
    "블로그",
    "디지털노마드",
    "부업",
    "SNS마케팅",
  ];

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API 호출로 회원 정보 업데이트
    alert("회원 정보가 업데이트되었습니다.");
    router.push(`/admin/users/${userId}`);
  };

  // 회원 정보 변경 핸들러
  const handleChange = (field: string, value: any) => {
    setUser({ ...user, [field]: value });
  };

  // 관심사 토글 핸들러
  const toggleInterest = (interest: string) => {
    if (user.interests.includes(interest)) {
      handleChange(
        "interests",
        user.interests.filter((i) => i !== interest)
      );
    } else {
      handleChange("interests", [...user.interests, interest]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">회원 정보 수정</h2>
          <p className="text-muted-foreground">
            회원 ID: {userId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={handleSubmit}>저장</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              회원의 기본 정보를 수정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  프로필 이미지 변경
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">포인트</Label>
                  <Input
                    id="points"
                    type="number"
                    value={user.points}
                    onChange={(e) => handleChange("points", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={user.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">활성</SelectItem>
                      <SelectItem value="inactive">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">생년월일</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={user.birthdate}
                    onChange={(e) => handleChange("birthdate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">성별</Label>
                  <Select
                    value={user.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="성별 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="남성">남성</SelectItem>
                      <SelectItem value="여성">여성</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">직업</Label>
                  <Input
                    id="occupation"
                    value={user.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={user.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea
                    id="bio"
                    value={user.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 관심사 */}
        <Card>
          <CardHeader>
            <CardTitle>관심사</CardTitle>
            <CardDescription>
              회원의 관심사를 선택합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {availableInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={user.interests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <label
                    htmlFor={`interest-${interest}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
            <CardDescription>
              회원 계정과 관련된 고급 설정입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">비밀번호 재설정</Label>
              <div className="flex gap-2">
                <Input
                  id="reset-password"
                  type="password"
                  placeholder="새 비밀번호"
                />
                <Button variant="outline">비밀번호 변경</Button>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex flex-col space-y-1">
                <h4 className="text-sm font-medium">계정 삭제</h4>
                <p className="text-sm text-muted-foreground">
                  이 회원의 계정을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <Button variant="destructive">계정 삭제</Button>
            </div>
          </CardContent>
        </Card>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
