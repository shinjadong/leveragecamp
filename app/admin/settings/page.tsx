"use client";

import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

/**
 * 관리자 설정 페이지
 */
export default function SettingsPage() {
  // 일반 설정
  const [siteName, setSiteName] = useState("레버리지캠프");
  const [siteDescription, setSiteDescription] = useState("성공적인 온라인 비즈니스를 위한 최고의 교육 플랫폼");
  const [contactEmail, setContactEmail] = useState("contact@leveragecamp.co.kr");
  const [contactPhone, setContactPhone] = useState("02-1234-5678");

  // SEO 설정
  const [metaTitle, setMetaTitle] = useState("레버리지캠프 | 온라인 비즈니스 교육 플랫폼");
  const [metaDescription, setMetaDescription] = useState("해외구매대행, ChatGPT, 온라인 마케팅 등 다양한 온라인 비즈니스 교육을 제공하는 레버리지캠프입니다.");
  const [ogImage, setOgImage] = useState("/images/og-image.jpg");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("G-XXXXXXXXXX");

  // 소셜 미디어 설정
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/leveragecamp");
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/leveragecamp");
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/leveragecamp");
  const [blogUrl, setBlogUrl] = useState("https://blog.leveragecamp.co.kr");

  // 기능 설정
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [enableComments, setEnableComments] = useState(true);
  const [enableChallenges, setEnableChallenges] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // 설정 저장 핸들러 (실제로는 API 호출)
  const handleSaveSettings = (tab: string) => {
    // 실제 구현에서는 API 호출로 설정 저장
    console.log(`${tab} 설정이 저장되었습니다.`);
    alert(`${tab} 설정이 저장되었습니다.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">설정</h2>
        <p className="text-muted-foreground">
          사이트 설정을 관리하고 변경할 수 있습니다.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">소셜 미디어</TabsTrigger>
          <TabsTrigger value="features">기능</TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
              <CardDescription>
                사이트의 기본 정보를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">사이트 이름</Label>
                <Input
                  id="site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">사이트 설명</Label>
                <Textarea
                  id="site-description"
                  value={siteDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSiteDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">연락처 이메일</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">연락처 전화번호</Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <Button onClick={() => handleSaveSettings("일반")}>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO 설정 */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO 설정</CardTitle>
              <CardDescription>
                검색 엔진 최적화를 위한 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">메타 타이틀</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  검색 결과에 표시될 페이지 제목입니다.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">메타 설명</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMetaDescription(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  검색 결과에 표시될 페이지 설명입니다.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="og-image">OG 이미지 URL</Label>
                <Input
                  id="og-image"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  소셜 미디어에서 공유될 때 표시될 이미지입니다.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ga-id">Google Analytics ID</Label>
                <Input
                  id="ga-id"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                />
              </div>
              <Button onClick={() => handleSaveSettings("SEO")}>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 소셜 미디어 설정 */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어 설정</CardTitle>
              <CardDescription>
                소셜 미디어 링크를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram-url">인스타그램 URL</Label>
                <Input
                  id="instagram-url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube-url">유튜브 URL</Label>
                <Input
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook-url">페이스북 URL</Label>
                <Input
                  id="facebook-url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-url">블로그 URL</Label>
                <Input
                  id="blog-url"
                  value={blogUrl}
                  onChange={(e) => setBlogUrl(e.target.value)}
                />
              </div>
              <Button onClick={() => handleSaveSettings("소셜 미디어")}>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 기능 설정 */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기능 설정</CardTitle>
              <CardDescription>
                사이트의 다양한 기능을 활성화하거나 비활성화합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registration">회원가입 활성화</Label>
                  <p className="text-xs text-muted-foreground">
                    새로운 회원의 가입을 허용합니다.
                  </p>
                </div>
                <Switch
                  id="registration"
                  checked={enableRegistration}
                  onCheckedChange={setEnableRegistration}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comments">댓글 기능 활성화</Label>
                  <p className="text-xs text-muted-foreground">
                    강의와 공지사항에 댓글을 달 수 있습니다.
                  </p>
                </div>
                <Switch
                  id="comments"
                  checked={enableComments}
                  onCheckedChange={setEnableComments}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="challenges">챌린지 기능 활성화</Label>
                  <p className="text-xs text-muted-foreground">
                    챌린지 참가 및 관련 기능을 활성화합니다.
                  </p>
                </div>
                <Switch
                  id="challenges"
                  checked={enableChallenges}
                  onCheckedChange={setEnableChallenges}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">유지보수 모드</Label>
                  <p className="text-xs text-muted-foreground">
                    사이트를 유지보수 모드로 전환합니다. 관리자만 접근 가능합니다.
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              <Button onClick={() => handleSaveSettings("기능")}>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 추가 설정 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">데이터베이스 백업</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              백업 생성
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">캐시 초기화</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              캐시 비우기
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">시스템 로그</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              로그 보기
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">시스템 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              정보 보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
