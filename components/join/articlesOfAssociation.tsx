"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ArticlesOfAssociationProps = {
  isAgreed?: boolean;
  onAgree?: () => void;
};

export const ArticlesOfAssociation: React.FC<ArticlesOfAssociationProps> = ({ isAgreed, onAgree }) => {
  const [isOpen, setOpen] = useState(false);
  const [content] = useState(async () => {
    try {
      const res = await fetch("https://cdn.jsdelivr.net/gh/HackerSir/Articles-of-association/rules.md");

      return res.text();
    } catch (e) {
      return "載入失敗, 請前往查看\nhttps://github.com/HackerSir/Articles-of-association/blob/master/rules.md";
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
          組織章程
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>逢甲大學黑客社 組織章程</DialogTitle>
        </DialogHeader>

        <div className="overflow-scroll max-h-[75vh] flex flex-col gap-8">
          <p className="text-md whitespace-pre-line">{content}</p>

          <Button onClick={handleAgree}>我已詳細閱讀，並同意遵守組織章程</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
