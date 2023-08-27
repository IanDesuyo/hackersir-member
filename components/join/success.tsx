import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { getApi } from "@/lib/trpc/root";
import { type Options } from "canvas-confetti";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SuccessConfetti } from "./client-components";
import Icons from "@/components/icons";
import IconButton from "../iconButton";
import EventCountdown from "../eventCountdown";
import { JoinNotice } from "./notice";

const COFETTIS: Options[] = [
  {
    particleCount: 100,
    spread: 70,
    origin: { x: 0, y: 0.9 },
    angle: 55,
  },
  {
    particleCount: 100,
    spread: 70,
    origin: { x: 1, y: 0.9 },
    angle: 125,
  },
];

const JoinSuccess: React.FC = async () => {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  return (
    <div className="grid place-items-center mt-16 gap-10">
      <SuccessConfetti options={COFETTIS} interval={7500} />

      <div className="flex items-center flex-col gap-4">
        <Avatar className="hover:scale-105 transition-all w-32 h-auto aspect-square">
          <AvatarFallback>{session.user?.name}</AvatarFallback>
          <AvatarImage src={session.user?.image || "/static/images/default-avatar.png"} className="bg-white" />
        </Avatar>

        <p className="text-2xl font-bold ml-4 text-center">
          {session.user.name}, <br />
          我們已收到您的入社申請!
        </p>

        <p>別忘記在新生茶會或社課時間來找我們完成入社喔~</p>
      </div>

      <div className="flex gap-4">
        <Link href="/members/me/card">
          <IconButton icon="MemberCard">出示社員小卡</IconButton>
        </Link>
        <Link href="/events">
          <IconButton icon="Schedule">查看近期活動</IconButton>
        </Link>
      </div>

      <label htmlFor="join-notice" className="text-center text-sm">
        忘記注意事項了嗎? 點我!
      </label>

      <EventCountdown id="welcome-party" />

      <JoinNotice id="join-notice" defaultClose />
    </div>
  );
};

export default JoinSuccess;
