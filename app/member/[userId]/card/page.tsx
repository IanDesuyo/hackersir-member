import MemberCard from "@/components/member/card";

export default function MemberCardPage({ params: { userId } }: { params: { userId: string } }) {
  return <MemberCard userId={userId} />;
}
