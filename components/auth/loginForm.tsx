"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Icons from "@/components/icons";
import Image from "next/image";
import Link from "next/link";

type LoginFormProps = {
  providers: {
    id: string;
    provider: string;
    logo?: string;
    style: {
      color?: string;
      backgroundColor?: string;
    };
  }[];
  callbackUrl?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ providers, callbackUrl }) => {
  return (
    <Card className="w-full">
      <CardHeader className="items-center">
        <Icons.Logo width={48} height={48} />
        <CardTitle>登入</CardTitle>
        <CardDescription>我們不喜歡密碼, 請使用第三方平台登入</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4">
        {providers.map(({ id, provider, logo, style }) => (
          <Button key={id} style={style} onClick={() => signIn(id, { callbackUrl })} className="p-6">
            {logo && <Image src={`/static/vendors${logo}`} width={24} height={24} alt={provider} className="mr-4" />}
            透過 {provider} 登入
          </Button>
        ))}

        <div className=" divide-x-0" />
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        <p>
          點選登入即表示您同意逢甲大學黑客社依照個人資料保護法、相關法規及學校相關法規對您的資料進行處理以及利用，詳細請參閱
          <Link href="/privacy" className="underline">
            個資聲明
          </Link>
          。
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
