"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type NonDisclosureAgreementProps = {
  isAgreed?: boolean;
  onAgree?: () => void;
};

export const NonDisclosureAgreement: React.FC<NonDisclosureAgreementProps> = ({ isAgreed, onAgree }) => {
  const [isOpen, setOpen] = useState(false);
  const [content] = useState(async () => {
    try {
      const res = await fetch("https://cdn.jsdelivr.net/gh/HackerSir/Non-Disclosure-Agreement/NDA.md");

      return res.text();
    } catch (e) {
      return "載入失敗, 請前往查看\nhttps://github.com/HackerSir/Non-Disclosure-Agreement/blob/main/NDA.md";
    }
  });

  const handleAgree = () => {
    setOpen(false);
    onAgree?.();
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className={cn(isAgreed && "bg-success text-success-foreground")}>
          保密協議
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>逢甲大學黑客社 保密協議</DialogTitle>
        </DialogHeader>

        <div className="overflow-scroll max-h-[75vh] flex flex-col gap-8">
          <p className="text-md whitespace-pre-line">{content}</p>

          <Button onClick={handleAgree}>我同意上述條款，並同意於第一次參與社團活動時簽署紙本保密協議書</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
