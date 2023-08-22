"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticlesOfAssociation } from "./articlesOfAssociation";
import { NonDisclosureAgreement } from "./nonDisclosureAgreement";
import { Step } from "./step";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { api } from "@/lib/trpc/client";
import confetti, { type Options } from "canvas-confetti";

export const Step1Login: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button className="w-full" onClick={() => signIn()}>
        登入
      </Button>
    </div>
  );
};

export const Step3: React.FC = () => {
  const [status, setStatus] = useState({ aos: false, nda: false });

  return (
    <Step
      step={3}
      title="同意社團條款 🫡"
      description="為確保社員權益，請務必詳閱以下條款"
      isCompleted={status.aos && status.nda}
    >
      <div className="grid grid-cols-2 gap-2">
        <ArticlesOfAssociation onAgree={() => setStatus(prev => ({ ...prev, aos: true }))} isAgreed={status.aos} />
        <NonDisclosureAgreement onAgree={() => setStatus(prev => ({ ...prev, nda: true }))} isAgreed={status.nda} />
      </div>
    </Step>
  );
};

export const Step4To5: React.FC = () => {
  const router = useRouter();

  const applyMutation = api.join.apply.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.push("/join?success");
      }, 3000);
    },
  });

  const isSent = applyMutation.isLoading || applyMutation.isSuccess;

  return (
    <>
      <Step step={4} title="送出入社申請 🥰" description="跨出最後一步!" isCompleted={isSent}>
        <p>別忘記在新生茶會或社課時間來找我們完成入社喔~</p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button onClick={() => applyMutation.mutate()} disabled={isSent}>
            送出申請
          </Button>
        </div>
      </Step>

      <Step step={5} title="完成 🎉" description="喝罐快樂水爽一下吧" isCompleted={applyMutation.isSuccess} />
    </>
  );
};

type SuccessConfettiProps = {
  options: Options[];
  interval: number;
};

export const SuccessConfetti: React.FC<SuccessConfettiProps> = ({ options, interval }) => {
  useEffect(() => {
    const tada = () => {
      options.forEach(option => {
        confetti(option);
      });
    };
    tada();

    const timer = setInterval(tada, interval);

    return () => {
      clearInterval(timer);
    };
  });

  return null;
};
