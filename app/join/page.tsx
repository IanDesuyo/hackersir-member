import { type Metadata } from "next";
import EventCountdown from "@/components/eventCountdown";
import Steps from "@/components/join/steps";
import { getApi } from "@/lib/trpc/root";
import ErrorMessage from "@/components/error";
import JoinSuccess from "@/components/join/success";
import { JoinNotice } from "@/components/join/notice";

export const metadata: Metadata = {
  title: "申請入社",
  description: "想學習更多資安知識? 還在猶豫什麼, 趕快加入我們!",
};

export default async function JoinPage() {
  const api = await getApi();
  const joinDetails = await api.join.getDetails();

  if (!joinDetails.applicable) {
    return <ErrorMessage title="不開放申請入社" message="若有疑問請聯繫社團幹部" />;
  }

  if (joinDetails.isMember) {
    return <JoinSuccess />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-2xl font-bold">申請入社</p>
        <p className="text-sm text-neutral-500">想學習更多資安知識? 還在猶豫什麼, 趕快加入我們!</p>
      </div>

      <JoinNotice />

      <Steps />
      <EventCountdown id="welcome-party" />
    </div>
  );
}
