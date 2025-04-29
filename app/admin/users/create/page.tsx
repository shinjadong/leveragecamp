"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { toast } from "react-hot-toast";

/**
 * 회원 추가 페이지
 */

// 회원 정보 타입 정의
interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  points: number;
  status: 'active' | 'inactive';
  address: string;
  birthdate: string;
  gender: '남성' | '여성' | '기타' | '';
  occupation: string;
  interests: string[];
  bio: string;
}

// 에러 상태 타입 정의
type ErrorState = {
  [K in keyof UserData]?: string;
};

export default function UserCreatePage() {
  const router = useRouter();

  // 회원 정보 상태
  const [user, setUser] = useState<UserData>({
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
    interests: [],
    bio: "",
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState<ErrorState>({});

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

  // 폼 제출 처리
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitForm();
  };

  const handleCancel = () => {
    router.back();
  };

  const submitForm = async () => {
    // 입력값 검증
    if (!user.name) {
      toast.error("이름을 입력해주세요");
      return;
    }
    if (!user.email) {
      toast.error("이메일을 입력해주세요");
      return;
    }
    if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("올바른 이메일 형식이 아닙니다");
      return;
    }
    if (!user.password) {
      toast.error("비밀번호를 입력해주세요");
      return;
    }
    if (user.password !== user.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }
    if (!user.phone) {
      toast.error("전화번호를 입력해주세요");
      return;
    }
    if (isNaN(user.points)) {
      toast.error("포인트는 숫자만 입력 가능합니다");
      return;
    }
    if (user.birthdate && !user.birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      toast.error("생년월일은 YYYY-MM-DD 형식으로 입력해주세요");
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("사용자가 성공적으로 생성되었습니다");
      router.push('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : "사용자 생성 중 오류가 발생했습니다");
    }
  };

  // 회원 정보 변경 핸들러
  const handleChange = (field: keyof UserData, value: UserData[keyof UserData]) => {
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
        "interests" as keyof UserData,
        user.interests.filter((i) => i !== interest)
      );
    } else {
      handleChange("interests" as keyof UserData, [...user.interests, interest]);
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
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit">저장</Button>
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
                  onChange={(e) => handleChange("name" as keyof UserData, e.target.value)}
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
                  onChange={(e) => handleChange("email" as keyof UserData, e.target.value)}
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
                  onChange={(e) => handleChange("password" as keyof UserData, e.target.value)}
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
                  onChange={(e) => handleChange("confirmPassword" as keyof UserData, e.target.value)}
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
                  onChange={(e) => handleChange("phone" as keyof UserData, e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">포인트</Label>
                <Input
                  id="points"
                  type="number"
                  value={user.points}
                  onChange={(e) => handleChange("points" as keyof UserData, parseInt(e.target.value))}
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
                  onValueChange={(value) => handleChange("status" as keyof UserData, value as 'active' | 'inactive')}
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
                  onChange={(e) => handleChange("birthdate" as keyof UserData, e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <Select
                  value={user.gender}
                  onValueChange={(value) => handleChange("gender" as keyof UserData, value as '남성' | '여성' | '기타' | '')}
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
                  onChange={(e) => handleChange("occupation" as keyof UserData, e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={user.address}
                  onChange={(e) => handleChange("address" as keyof UserData, e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">자기소개</Label>
                <Textarea
                  id="bio"
                  value={user.bio}
                  onChange={(e) => handleChange("bio" as keyof UserData, e.target.value)}
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
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
