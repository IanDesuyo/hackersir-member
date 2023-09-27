"use client";

import IconButton from "@/components/iconButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { RouterOutputs } from "@/lib/trpc/root";
import { useState } from "react";

type DiscordSyncProps = {
  initialData: RouterOutputs["setting"]["getDiscordSyncInfo"];
};

export const DiscordSync: React.FC<DiscordSyncProps> = ({ initialData }) => {
  const [lastSync, setLastSync] = useState(initialData.lastSync);
  const [syncAvailable, setSyncAvailable] = useState(
    initialData.lastSync ? (Date.now() - initialData.lastSync.getTime()) / 1000 > 60 : true // 60 seconds
  );

  const syncMutation = api.setting.syncDiscord.useMutation();

  const handleSync = async () => {
    setSyncAvailable(false);
    const { lastSync } = await syncMutation.mutateAsync();
    setLastSync(lastSync);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord 身分組同步</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p>
              上次同步時間: <span>{lastSync?.toLocaleString() || "無"}</span>
            </p>
            <p>
              以綁定 Discord 的社員: <span>{initialData.activeMemberDiscordCount}</span>
            </p>
          </div>

          <IconButton icon="Sync" onClick={handleSync} disabled={syncMutation.isLoading || !syncAvailable}>
            {syncMutation.isLoading || !syncAvailable ? "同步中" : "同步"}
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};
