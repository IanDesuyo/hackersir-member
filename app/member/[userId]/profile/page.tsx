import MemberProfile from "@/components/member/profile";
import StudentData from "@/components/member/studentInfo";
import { getApi } from "@/lib/trpc/root";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MemberProfilePage({ params: { userId } }: { params: { userId: string } }) {
  const api = await getApi();

  const [profile, studentData] = await Promise.all([
    api.member.getProfile({ userId }),
    api.member.getStudentData({ userId }),
  ]);

  if (!profile) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <MemberProfile userId={userId} initialData={profile} />
      <StudentData userId={userId} initialData={studentData} />
    </div>
  );
}
