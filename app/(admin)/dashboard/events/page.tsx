import DashboardEventTable from "@/components/data-table/event/table";
import { getApi } from "@/lib/trpc/root";

export default async function DashboardMembersPage() {
  const api = await getApi();

  const data = await api.event.getAll({});

  return (
    <div className="flex gap-2 flex-col">
      <p className="text-2xl font-bold">活動管理</p>
      <DashboardEventTable data={data} />
    </div>
  );
}
