import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { memberStatusFormSchema } from "@/lib/schemas/member";
import { useToast } from "@/components/ui/use-toast";

type EditMemberStatusButtonProps = {
  userId: string;
  name: string;
  status: {
    active: boolean;
    suspended: boolean;
  };
};

export const EditMemberStatusButton: React.FC<EditMemberStatusButtonProps> = ({ userId, name, status }) => {
  const [isOpen, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(memberStatusFormSchema),
    defaultValues: {
      active: status.active,
      suspended: status.suspended,
      sendEmail: true,
    },
  });

  const queryContext = api.useContext();
  const memberStatusMutation = api.member.updateMemberStatusById.useMutation();

  const onSubmit = async (data: z.infer<typeof memberStatusFormSchema>) => {
    await memberStatusMutation.mutateAsync({ userId, ...data });

    toast({
      title: "成功",
      description: `已更改${name}的資格`,
    });

    queryContext.member.getAllMembers.invalidate();
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>更改資格</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>更改{name}的資格</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>社員</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suspended"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>停權</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={memberStatusMutation.isLoading}>
                送出
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
