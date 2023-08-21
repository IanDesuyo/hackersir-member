"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FcuVerifyButton } from "@/components/verifyButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/trpc/client";
import { type RouterOutputs } from "@/lib/trpc/root";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentDataFormSchema } from "@/lib/schemas/member";

type StudentDataProps = {
  userId: "me" | string;
  initialData: RouterOutputs["member"]["getStudentData"];
};

const StudentData: React.FC<StudentDataProps> = ({ userId, initialData }) => {
  const form = useForm({
    resolver: zodResolver(studentDataFormSchema),
    defaultValues: initialData ?? {},
  });

  const studentDataMutation = api.member.updateStudentData.useMutation();

  const onSubmit = (data: z.infer<typeof studentDataFormSchema>) => {
    return studentDataMutation.mutateAsync({ userId, ...data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
        <Card id="student-data" className=" focus:border-green-500">
          <CardHeader className="flex flex-row justify-between gap-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>社員資料</CardTitle>
              <CardDescription>請確保資料正確，以維護個人權利及社團行政處理。</CardDescription>
            </div>

            {initialData?.isVerified && !form.formState.isSubmitSuccessful ? ( // Because initialData won't be updated after mutation
              <Badge className="h-fit flex bg-success hover:bg-success/80 text-success-foreground">已驗證</Badge>
            ) : (
              <FcuVerifyButton />
            )}
          </CardHeader>

          <CardContent>
            <fieldset disabled={form.formState.isSubmitting} className="grid gap-4 grid-cols-1 md:grid-cols-4">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold leading-none tracking-tight">學校</FormLabel>
                    <FormControl>
                      <Input className="text-lg" placeholder="逢甲大學" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="realname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold leading-none tracking-tight">姓名</FormLabel>
                    <FormControl>
                      <Input className="text-lg" placeholder="黑喵喵" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold leading-none tracking-tight">學號</FormLabel>
                    <FormControl>
                      <Input className="text-lg" placeholder="D0000000" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold leading-none tracking-tight">學院</FormLabel>
                    <FormControl>
                      <Input className="text-lg" placeholder="資電學院" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold leading-none tracking-tight">科系</FormLabel>
                    <FormControl>
                      <Input className="text-lg" placeholder="資訊工程系" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold leading-none tracking-tight">班級</FormLabel>
                    <FormControl>
                      <Input className="text-lg" placeholder="資訊工程系一年級乙班" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </CardContent>

          <CardFooter className="w-full flex justify-end gap-4">
            <p className="text-sm text-muted-foreground">修改社員資料將重置驗證狀態</p>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              儲存
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default StudentData;
