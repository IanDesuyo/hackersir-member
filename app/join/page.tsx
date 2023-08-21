import Steps from "@/components/join/steps";
import { getServerSession } from "@/lib/auth";

export default function JoinPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-2xl font-bold">申請入社</p>
        <p className="text-sm text-neutral-500">還在猶豫什麼? 趕緊的來加入我們!</p>
      </div>

      <Steps />
    </div>
  );
}
