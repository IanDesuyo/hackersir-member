"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, type InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/trpc/client";
import { type RouterOutputs } from "@/lib/trpc/root";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventFormSchema } from "@/lib/schemas/event";

type FormField<T> = {
  name: keyof T;
  label: string;
  placeholder: string;
  type: InputProps["type"];
};

type EventProps = {
  eventId: string;
  initialData: RouterOutputs["event"]["getById"];
};

const Event: React.FC<EventProps> = ({ eventId, initialData }) => {
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData ?? {},
  });

  const fields: FormField<Omit<z.infer<typeof eventFormSchema>, "startAt" | "endAt">>[] = [
    { name: "name", label: "名稱", placeholder: "JavaScript: 從入門到入土", type: "text" },
    { name: "description", label: "簡介", placeholder: "此課程將教導...", type: "text" },
    { name: "type", label: "類型", placeholder: "活動", type: "text" },
    { name: "venue", label: "地點", placeholder: "世界某處", type: "text" },
    { name: "links", label: "相關連結", placeholder: "https://kktix.cc", type: "text" },
    { name: "lecturer", label: "講師", placeholder: "黑喵喵", type: "text" },
    { name: "lecturerDescription", label: "講師簡介", placeholder: "超電貓咪", type: "text" },
    { name: "lecturerImage", label: "講師圖片", placeholder: "https://imgur.com", type: "text" },
    { name: "lecturerLink", label: "講師連結", placeholder: "https://facebook.com", type: "text" },
  ];

  // TODO: use localized time
  const datetimeFields: FormField<Pick<z.infer<typeof eventFormSchema>, "startAt" | "endAt">>[] = [
    { name: "startAt", label: "開始時間 (UTC)", placeholder: "https://facebook.com", type: "datetime-local" },
    { name: "endAt", label: "結束時間 (UTC)", placeholder: "https://facebook.com", type: "datetime-local" },
  ];

  const eventMutation = api.event.updateById.useMutation();

  const onSubmit = (data: z.infer<typeof eventFormSchema>) => {
    return eventMutation.mutateAsync({ eventId, ...data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
        <Card id="student-data" className=" focus:border-green-500">
          <CardHeader className="flex md:flex-row justify-between gap-2">
            <CardTitle>修改活動</CardTitle>
          </CardHeader>

          <CardContent>
            <fieldset disabled={form.formState.isSubmitting} className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {fields.map(({ name, ...props }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => <FormInputItem {...props} {...field} />}
                />
              ))}

              {datetimeFields.map(({ name, ...props }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormInputItem
                      {...props}
                      {...field}
                      onChange={e => field.onChange(new Date(e.target.value + "Z"))}
                      value={field.value.toISOString().slice(0, 16)}
                    />
                  )}
                />
              ))}
            </fieldset>
          </CardContent>

          <CardFooter className="w-full flex justify-end gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              儲存
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default Event;

type FormInputItemProps = {
  label: string;
  value: any | null;
} & Omit<InputProps, "value">;

const FormInputItem: React.FC<FormInputItemProps> = ({ label, ...props }) => {
  return (
    <FormItem>
      <FormLabel className="text-lg font-bold leading-none tracking-tight">{label}</FormLabel>
      <FormControl>
        <Input className="text-lg" {...props} value={props.value ?? undefined} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
