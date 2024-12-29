'use client';
import { useState } from "react";
import UserAssessmentForm, { UserInfo } from "@/components/UserAssessmentForm";
import DynamicAssessment from "@/components/DynamicAssessment";

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {!userInfo ? (
        <UserAssessmentForm onSubmit={handleUserInfoSubmit} />
      ) : (
        <DynamicAssessment userInfo={userInfo} />
      )}
    </div>
  );
}
