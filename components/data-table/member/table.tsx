"use client";
import { api } from "@/lib/trpc/client";
import { DataTable } from "../data-table";
import { columns } from "./columns";
import { useState } from "react";
import { useDebounce } from "@/lib/client-utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DashboardMemberTableProps = {};

export const DashboardMemberTable: React.FC<DashboardMemberTableProps> = () => {
  const [status, setStatus] = useState<"all" | "active" | "suspended" | "inactive">("all");
  const [queryState, setQuery] = useState("");
  const query = useDebounce(queryState, 500);

  const { data, isLoading } = api.member.getAllMembers.useQuery(
    { status, query },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2">
        <Select onValueChange={(v: any) => setStatus(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="過濾社員狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="active">現任社員</SelectItem>
            <SelectItem value="suspended">停權社員</SelectItem>
            <SelectItem value="inactive">未入社</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="搜尋姓名、學號、電子郵件..." onChange={e => setQuery(e.target.value)} />
      </div>
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
    </div>
  );
};
