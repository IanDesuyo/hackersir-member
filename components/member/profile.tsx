"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/trpc/client";
import { type RouterOutputs } from "@/lib/trpc/root";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { profileFormSchema } from "@/lib/schemas/member";

type MemberProfileProps = {
  userId: "me" | string;
  initialData: NonNullable<RouterOutputs["member"]["getProfileById"]>;
};

const MemberProfile: React.FC<MemberProfileProps> = ({ userId, initialData }) => {
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const profileMutation = api.member.updateProfileById.useMutation();

  const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
    return profileMutation.mutateAsync({ userId, name: data.name });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.error)} onBlur={form.handleSubmit(onSubmit, console.error)}>
        <Card id="profile">
          <CardHeader>
            <CardTitle>個人檔案</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 flex-col md:flex-row">
                  <Avatar className="w-32 h-auto aspect-square hover:scale-105 transition-all">
                    <AvatarFallback>{initialData.name}</AvatarFallback>
                    <AvatarImage src={initialData.image || "/static/images/default-avatar.png"} className="bg-white" />
                  </Avatar>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-bold leading-none tracking-tight">暱稱</FormLabel>
                        <FormDescription>我們該如何稱呼你呢?</FormDescription>
                        <FormControl>
                          <Input
                            className="text-lg"
                            placeholder="乂煞氣A黑貓喵乂"
                            {...field}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xl font-bold leading-none tracking-tight">綁定社群帳號</p>
                  <p className="text-sm text-muted-foreground">
                    綁定社群帳號可以使用社群帳號登入<span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-row gap-2 h-10">
                    {initialData.accounts.map(account => (
                      <Button
                        key={account.provider}
                        type="button"
                        style={account.style}
                        disabled={account.connected}
                        onClick={() => signIn(account.id)}
                      >
                        {account.provider}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <p className="w-full flex justify-end text-sm text-muted-foreground">
              *: 綁定 Discord 即可獲取
              <Link href="https://discord.com/invite/VCfC43Te3T">逢甲大學黑客社 交流群</Link>的社員身份組
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default MemberProfile;
