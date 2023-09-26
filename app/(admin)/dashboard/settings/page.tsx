import { getApi } from "@/lib/trpc/root";
import { DiscordSync } from "@/components/dashboard/settings/discordSync";

export default async function DashboardSettingsPage() {
  const api = await getApi();

  const discordSyncInfo = await api.setting.getDiscordSyncInfo();

  return (
    <div className="flex gap-2 flex-col">
      <p className="text-2xl font-bold">系統設定</p>

      <DiscordSync initialData={discordSyncInfo} />
    </div>
  );
}
