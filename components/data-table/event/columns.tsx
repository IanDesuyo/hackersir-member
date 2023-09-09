"use client";

import type { RouterOutputs } from "@/lib/trpc/root";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Event = NonNullable<RouterOutputs["event"]["getAll"][0]>;

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "type",
    header: "類型",
  },
  {
    accessorKey: "name",
    header: "活動名稱",
  },
  {
    accessorKey: "startAt",
    header: "時間",
    cell: ({ row }) => {
      const { startAt, endAt } = row.original;
      return (
        <p>
          <span>{startAt.toLocaleString("zh-TW")}</span>
          <span> ~ </span>
          <span>{endAt.toLocaleString("zh-TW")}</span>
        </p>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "操作",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="outline">編輯</Button>
          </Link>
          <Link href={`/dashboard/events/${id}/signin`}>
            <Button>簽到</Button>
          </Link>
        </div>
      );
    },
  },
];
