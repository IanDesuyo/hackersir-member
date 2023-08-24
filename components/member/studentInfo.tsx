"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, type InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FcuVerifyButton } from "@/components/fcuVerifyButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/trpc/client";
import { type RouterOutputs } from "@/lib/trpc/root";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentDataFormSchema } from "@/lib/schemas/member";
import Link from "next/link";

type FormField<T> = {
  name: keyof T;
  label: string;
  placeholder: string;
  type: InputProps["type"];
};

type StudentDataProps = {
  userId: "me" | string;
  initialData: RouterOutputs["member"]["getStudentDataById"];
};

const StudentData: React.FC<StudentDataProps> = ({ userId, initialData }) => {
  const form = useForm({
    resolver: zodResolver(studentDataFormSchema),
    defaultValues: initialData ?? {},
  });

  const fields: FormField<z.infer<typeof studentDataFormSchema>>[] = [
    { name: "school", label: "學校", placeholder: "逢甲大學", type: "text" },
    { name: "realname", label: "姓名", placeholder: "黑喵喵", type: "text" },
    { name: "studentId", label: "學號", placeholder: "D0000000", type: "text" },
    { name: "department", label: "學院", placeholder: "資電學院", type: "text" },
    { name: "major", label: "科系", placeholder: "資訊工程學系", type: "text" },
    { name: "class", label: "班級", placeholder: "資訊工程系一年級乙班", type: "text" },
  ];

  const studentDataMutation = api.member.updateStudentDataById.useMutation();

  const onSubmit = (data: z.infer<typeof studentDataFormSchema>) => {
    return studentDataMutation.mutateAsync({ userId, ...data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
        <Card id="student-data" className=" focus:border-green-500">
          <CardHeader className="flex md:flex-row justify-between gap-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>社員資料</CardTitle>
              <CardDescription>
                請確保資料正確，以維護個人權利及社團行政處理。
                本社將依照個人資料保護法、相關法規及學校相關法規進行處理以及利用，詳細請參閱
                <Link href="/privacy" className="underline">
                  個資聲明
                </Link>
                。
              </CardDescription>
            </div>

            {initialData?.isVerified && !form.formState.isSubmitSuccessful ? ( // Because initialData won't be updated after mutation
              <Badge className="h-fit min-w-fit bg-success hover:bg-success/80 text-success-foreground">已驗證</Badge>
            ) : (
              <FcuVerifyButton />
            )}
          </CardHeader>

          <CardContent>
            <fieldset disabled={form.formState.isSubmitting} className="grid gap-4 grid-cols-1 md:grid-cols-4">
              {fields.map(({ name, ...props }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => <FormInputItem {...props} {...field} />}
                />
              ))}
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

type FormInputItemProps = InputProps & {
  label: string;
};
const FormInputItem: React.FC<FormInputItemProps> = ({ label, ...props }) => {
  return (
    <FormItem>
      <FormLabel className="text-lg font-bold leading-none tracking-tight">{label}</FormLabel>
      <FormControl>
        <Input className="text-lg" {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
