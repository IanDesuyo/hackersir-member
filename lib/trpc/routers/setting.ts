import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminReadProcedure, adminWriteProcedure } from "..";
import * as schema from "@/lib/schemas/dashboard";
import { addRoleToUser } from "@/lib/discord";
import { env } from "@/lib/env.mjs";

export const settingRouter = createTRPCRouter({
  getDiscordSyncInfo: adminReadProcedure.query(async ({ ctx }) => {
    const currentYear = await ctx.prisma.setting
      .findUniqueOrThrow({
        where: {
          id: "current_year",
        },
      })
      .then(setting => parseInt(setting.value));

    const lastSync = await ctx.prisma.setting.findUnique({
      where: { id: "system_discord_last_sync" },
    });

    const activeMemberDiscordCount = await ctx.prisma.user.count({
      where: {
        memberData: {
          some: {
            year: currentYear,
            active: true,
          },
        },
        accounts: {
          some: {
            provider: "discord",
          },
        },
      },
    });

    return {
      lastSync: lastSync ? new Date(lastSync.value) : null,
      activeMemberDiscordCount,
    };
  }),

  syncDiscord: adminWriteProcedure.mutation(async ({ ctx }) => {
    const currentYear = await ctx.prisma.setting
      .findUniqueOrThrow({
        where: {
          id: "current_year",
        },
      })
      .then(setting => parseInt(setting.value));

    const activeMemberDiscordIds = await ctx.prisma.user.findMany({
      where: {
        memberData: {
          some: {
            year: currentYear,
            active: true,
          },
        },
        accounts: {
          some: {
            provider: "discord",
          },
        },
      },
      select: {
        name: true,
        accounts: {
          where: {
            provider: "discord",
          },
          select: {
            provider: true,
            providerAccountId: true,
          },
        },
      },
    });

    const discordIds = activeMemberDiscordIds.map(user => user.accounts[0].providerAccountId);

    const syncTask = async (discordIds: string[]) => {
      console.log("[Discord] Starting sync task");
      for (const discordId of discordIds) {
        const { rateLimit } = await addRoleToUser(discordId, env.DISCORD_ROLE_ID);

        if (rateLimit.remaining < 1) {
          console.log("[Discord] Rate limit reached, sleeping for", rateLimit.reset * 1000);
          await new Promise(resolve => setTimeout(resolve, rateLimit.reset * 1000));
        }
      }
    };

    syncTask(discordIds);

    const lastSync = await ctx.prisma.setting.upsert({
      where: {
        id: "system_discord_last_sync",
      },
      update: {
        value: new Date().toISOString(),
      },
      create: {
        id: "system_discord_last_sync",
        value: new Date().toISOString(),
      },
    });

    return {
      lastSync: new Date(lastSync.value),
    };
  }),
});
