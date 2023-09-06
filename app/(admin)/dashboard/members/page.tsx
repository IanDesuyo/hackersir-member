import { DashboardMemberTable } from "@/components/data-table/member/table";

export default async function DashboardMembersPage() {
  return (
    <div className="flex gap-2 flex-col">
      <p className="text-2xl font-bold">社員管理</p>
      <DashboardMemberTable />
    </div>
  );
}
