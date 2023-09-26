import Link from "next/link";
import { Step, StepWrapper } from "@/components/join/step";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/auth";
import { FcuVerifyButton } from "../fcuVerifyButton";
import { Step1Login, Step3, Step4To5 } from "./client-components";
import { getApi } from "@/lib/trpc/root";

const Steps: React.FC = async () => {
  // Step 1: Login
  const session = await getServerSession();

  // Step 2: Student Data
  const api = await getApi();
  let studentData = null;
  if (session) {
    studentData = await api.studentData.getByUserId({ userId: "me" });
  }

  return (
    <StepWrapper>
      <Step step={1} title="建立帳號 👋" description="讓我們知道你是誰" isCompleted={!!session}>
        {!!session ? (
          <div>
            <p>
              哈囉~<span className="px-1">{session.user?.name}</span>!
            </p>
            <p>請繼續下一步！</p>
          </div>
        ) : (
          <Step1Login />
        )}
      </Step>

      <Step step={2} title="填寫個人資料 😎" description="我們需要你的個資" isCompleted={!!studentData}>
        {studentData ? (
          <p>
            你是<span className="px-1">{studentData.school}</span>的<span className="px-1">{studentData.realname}</span>
            對吧?
          </p>
        ) : (
          <div>
            <p>
              本社將依照個人資料保護法、相關法規及學校相關法規進行處理以及利用，詳細請參閱
              <Link href="/privacy" className="underline">
                個資聲明
              </Link>
              。
            </p>
            <p className="font-bold">逢甲大學學生請使用 NID 驗證</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <FcuVerifyButton />
              <Link href="/members/me/profile#student-data">
                <Button className="w-full">手動填寫</Button>
              </Link>
            </div>
          </div>
        )}
      </Step>

      <Step3 />

      <Step4To5 />
    </StepWrapper>
  );
};

export default Steps;
