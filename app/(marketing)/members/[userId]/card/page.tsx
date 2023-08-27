import type { Metadata } from "next";
import MemberCard from "@/components/member/card";

export const metadata: Metadata = {
  title: "社員小卡",
};

export default function MemberCardPage({ params: { userId } }: { params: { userId: string } }) {
  return <MemberCard userId={userId} />;
}
