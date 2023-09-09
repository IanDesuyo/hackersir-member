"use client";

import type { RouterOutputs } from "@/lib/trpc/root";
import type { ColumnDef } from "@tanstack/react-table";

export type UserSignin = NonNullable<RouterOutputs["signin"]["getByUserId"][0]>;

export const columns: ColumnDef<UserSignin>[] = [
  {
    accessorKey: "event.name",
    header: "活動名稱",
  },
  {
    accessorKey: "event.startAt",
    header: "活動時間",
    cell: ({ row }) => {
      const { startAt, endAt } = row.original.event;
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
    accessorKey: "signinAt",
    header: "簽到時間",
    cell: ({ row }) => {
      const { signinAt } = row.original;
      return <p>{signinAt.toLocaleString("zh-TW")}</p>;
    },
  },
];
