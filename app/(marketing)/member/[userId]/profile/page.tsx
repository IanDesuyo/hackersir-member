import type { Metadata } from "next";
import MemberProfile from "@/components/member/profile";
import MemberReceipt from "@/components/member/receipt";
import StudentData from "@/components/member/studentInfo";
import { getApi } from "@/lib/trpc/root";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "個人檔案",
};

export default async function MemberProfilePage({ params: { userId } }: { params: { userId: string } }) {
  const api = await getApi();

  const [profile, studentData] = await Promise.all([
    api.member.getProfileById({ userId }),
    api.member.getStudentDataById({ userId }),
  ]);

  if (!profile) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <MemberProfile userId={userId} initialData={profile} />
      <StudentData userId={userId} initialData={studentData} />
      <MemberReceipt userId={userId} />
    </div>
  );
}
