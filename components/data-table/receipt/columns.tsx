"use client";

import type { RouterOutputs } from "@/lib/trpc/root";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
export type Receipt = NonNullable<RouterOutputs["receipt"]["getById"]>;

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "id",
    header: "收據編號",
  },
  {
    accessorKey: "title",
    header: "內容",
    cell: ({ row }) => {
      const { title, description } = row.original;
      return (
        <HoverCard>
          <HoverCardTrigger>{title}</HoverCardTrigger>

          <HoverCardContent>{description || "無備註"}</HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "金額",
  },
  {
    accessorKey: "isCompleted",
    header: "狀態",
    cell: ({ row }) => {
      const { bankLast5, paidAt, isCompleted } = row.original;
      return (
        <HoverCard>
          <HoverCardTrigger>
            <Badge variant={isCompleted ? "default" : "destructive"}>{isCompleted ? "已完成" : "未完成"}</Badge>
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
    accessorKey: "createdAt",
    header: "建立時間",
    cell: ({ row }) => {
      return row.original.createdAt.toLocaleString("zh-TW");
    },
  },
];
