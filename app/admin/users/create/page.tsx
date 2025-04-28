"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

/**
 * 회원 추가 페이지
 */
export default function UserCreatePage() {
  const router = useRouter();

  // 회원 정보 상태
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    points: 0,
    status: "active",
    address: "",
    birthdate: "",
    gender: "",
    occupation: "",
    interests: [] as string[],
    bio: "",
  });

  // 오류 상태
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // 폼 유효성 검사 스키마
  const userSchema = z.object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    points: z.number().nonnegative("포인트는 0 이상이어야 합니다."),
    status: z.enum(["active", "inactive"]),
    address: z.string().optional(),
    birthdate: z.string().optional(),
    gender: z.string().optional(),
    occupation: z.string().optional(),
    interests: z.array(z.string()).optional(),
    bio: z.string().optional(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 유효성 검사
      userSchema.parse(user);
      
      // 실제로는 API 호출로 회원 추가
      alert("새로운 회원이 추가되었습니다.");
      router.push("/admin/users");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Zod 오류 처리
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  // 회원 정보 변경 핸들러
  const handleChange = (field: string, value: any) => {
    setUser({ ...user, [field]: value });
    // 필드 변경 시 해당 필드의 오류 메시지 제거
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
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
          <h2 className="text-2xl font-bold tracking-tight">회원 추가</h2>
          <p className="text-muted-foreground">
            새로운 회원을 추가합니다.
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
              회원의 기본 정보를 입력합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  이메일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  비밀번호 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={user.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
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
                  className={errors.points ? "border-red-500" : ""}
                />
                {errors.points && (
                  <p className="text-xs text-red-500">{errors.points}</p>
                )}
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
