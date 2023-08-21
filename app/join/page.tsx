import { type Metadata } from "next";
import EventCountdown from "@/components/eventCountdown";
import Steps from "@/components/join/steps";
import JoinDetail from "@/components/join/detail";

export const metadata: Metadata = {
  title: "申請入社",
  description: "想學習更多資安知識? 還在猶豫什麼, 趕緊的來加入我們!",
};

export default async function JoinPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-2xl font-bold">申請入社</p>
        <p className="text-sm text-neutral-500">想學習更多資安知識? 還在猶豫什麼, 趕緊的來加入我們!</p>
      </div>

      <JoinDetail />
      <Steps />
      <EventCountdown id="welcome-party" />
    </div>
  );
}
