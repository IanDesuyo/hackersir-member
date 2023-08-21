"use client";

import { useState } from "react";
import { ArticlesOfAssociation } from "./articlesOfAssociation";
import { NonDisclosureAgreement } from "./nonDisclosureAgreement";
import { Step } from "./step";
import { Button } from "../ui/button";

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

export const Step4: React.FC = () => {
  return (
    <Step step={4} title="送出入社申請 🥰" description="跨出最後一步!" isCompleted={false}>
      <p>別忘記在新生茶會或社課時間來找我們完成入社喔~</p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button>送出申請</Button>
      </div>
    </Step>
  );
};
