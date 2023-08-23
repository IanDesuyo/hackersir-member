"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticlesOfAssociation } from "./articlesOfAssociation";
import { NonDisclosureAgreement } from "./nonDisclosureAgreement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Step } from "./step";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { api } from "@/lib/trpc/client";
import confetti, { type Options } from "canvas-confetti";
import { cn } from "@/lib/utils";

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
  const [isOpen, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>();
  const [bankLast5, setBankLast5] = useState<string>();

  const applyMutation = api.join.apply.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
  });

  const handleApply = () => {
    if (!paymentMethod) return;

    if (paymentMethod === "cash") {
      applyMutation.mutate({ paymentMethod });
    } else if (paymentMethod === "bank_transfer" && bankLast5 && bankLast5.length >= 5) {
      applyMutation.mutate({ paymentMethod, bankLast5 });
    } else {
      return alert("請填寫銀行後五碼"); // TODO: use toast
    }

    setOpen(false);
  };

  const isSent = applyMutation.isLoading || applyMutation.isSuccess;

  return (
    <>
      <Step step={4} title="確認並送出入社申請 🥰" description="確認你繳社費的方式, 並送出申請!" isCompleted={isSent}>
        <p>就快完成了!</p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={isSent}>確認入社申請</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>確認入社申請</DialogTitle>
              </DialogHeader>

              <div className="overflow-scroll max-h-[75vh] flex flex-col gap-8">
                最.. 最後一步了! 跟你確認一下社費的付款方式
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="付款方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">現金</SelectItem>
                    <SelectItem value="bank_transfer">匯款</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className={cn(paymentMethod !== "bank_transfer" && "hidden")}
                  placeholder="銀行後五碼 (不然我們不知道是誰匯的 😥)"
                  onChange={e => setBankLast5(e.target.value)}
                  value={bankLast5}
                />
                <Button onClick={handleApply}>送出入社申請</Button>
              </div>
            </DialogContent>
          </Dialog>
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
