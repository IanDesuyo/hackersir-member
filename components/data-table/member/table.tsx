"use client";
import { api } from "@/lib/trpc/client";
import { DataTable } from "../data-table";
import { columns } from "./columns";
import { useState } from "react";
import { useDebounce } from "@/lib/client-utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type DashboardMemberTableProps = {};

export const DashboardMemberTable: React.FC<DashboardMemberTableProps> = () => {
  const [status, setStatus] = useState<"all" | "active" | "suspended" | "inactive">("all");
  const [queryState, setQuery] = useState("");
  const query = useDebounce(queryState, 500);

  const { data, isLoading } = api.member.getAll.useQuery(
    { status, query },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleDownload = async () => {
    const csvHeaders = [
      "userId",
      "學校",
      "科系",
      "班級",
      "學號",
      "姓名",
      "是否為社員",
      "是否遭停權",
      "匯款帳號後五碼",
      "付款時間",
      "是否完成繳費",
    ];

    if (!data) return;

    const csvData = data.map(
      d =>
        `${d.userId},${d.studentInfo.school},${d.studentInfo.major},${d.studentInfo.class},${d.studentInfo.studentId},${d.studentInfo.realname},${d.active},${d.suspended},${d.receipt.bankLast5},${d.receipt.paidAt},${d.receipt.isCompleted}`
    );

    const csv = [csvHeaders, ...csvData].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "社員清單.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

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

        <Button className="min-w-fit" onClick={handleDownload}>
          匯出當前資料
        </Button>
      </div>
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
    </div>
  );
};
