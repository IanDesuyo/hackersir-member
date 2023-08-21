"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const FcuVerifyButton: React.FC = () => {
  return (
    <Button type="button" onClick={() => signIn("fcu-nid")}>
      FCU NID 驗證
    </Button>
  );
};
