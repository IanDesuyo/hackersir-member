import Icons from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApi } from "@/lib/trpc/root";

export default async function DashboardPage() {
  const api = await getApi();

  const { activeCount, suspendedCount, applyCount } = await api.dashboard.getDetails();

  return (
    <div>
      <h1 className="text-2xl">社團總覽</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已入社社員</CardTitle>
            <Icons.UserCheck />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已停權社員</CardTitle>
            <Icons.UserX />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{suspendedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總申請人數</CardTitle>
            <Icons.Users />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{applyCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
