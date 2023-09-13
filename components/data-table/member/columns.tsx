"use client";

import type { RouterOutputs } from "@/lib/trpc/root";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditMemberStatusButton } from "./actions";
import { cn } from "@/lib/utils";
import Icons from "@/components/icons";
export type Member = NonNullable<RouterOutputs["member"]["getAllMembers"][0]>;

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "studentInfo.realname",
    header: "姓名",
    cell: ({ row }) => {
      const { active, suspended } = row.original;
      const { realname } = row.original.studentInfo;

      return (
        <div className="flex gap-2 items-center">
          <p className="text-lg">{realname}</p>
          {active ? <Badge>社員</Badge> : <Badge variant="destructive">非社員</Badge>}
          {suspended && <Badge variant="destructive">已停權</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "studentInfo.school",
    header: "學校",
    cell: ({ row }) => {
      const { school, isVerified } = row.original.studentInfo;

      return (
        <div className="flex gap-2">
          {isVerified && <Icons.Verified />}
          <p>{school}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "studentInfo.major",
    header: "系級",
  },
  {
    accessorKey: "studentInfo.studentId",
    header: "學號",
  },
  {
    accessorKey: "receipt",
    header: "繳費狀態",
    cell: ({ row }) => {
      const { amount, bankLast5, paidAt, isCompleted } = row.original.receipt;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex gap-2">
              {isCompleted ? <Icons.Verified /> : <Icons.NotVerified />}
              <p>{isCompleted ? "已繳費" : "未繳費"}</p>
              <p>{amount} 元</p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <p>付款方式: {bankLast5 || "現金"}</p>
            <p>付款時間: {paidAt ? paidAt.toLocaleString("zh-TW") : "未付款"}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "操作",
    cell: ({ row }) => {
      const {
        userId,
        studentInfo: { realname },
        active,
        suspended,
      } = row.original;
      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/members/${userId}/profile`}>
            <Button variant="outline">編輯</Button>
          </Link>
          <EditMemberStatusButton userId={userId} name={realname} status={{ active, suspended }} />
        </div>
      );
    },
  },
];
