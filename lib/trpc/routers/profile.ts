import { createTRPCRouter, authenticatedProcedure, convertMeToUserId } from "..";
import { authProviders } from "@/lib/auth";
import * as schema from "@/lib/schemas/member";

export const profileRouter = createTRPCRouter({
  getByUserId: authenticatedProcedure
    .input(schema.userIdInput)
    .use(convertMeToUserId)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          accounts: {
            select: {
              provider: true,
            },
          },
        },
      });

      if (!user) {
        return null;
      }

      const accounts = authProviders.map(({ id, name, style }) => ({
        id,
        provider: name,
        style: {
          color: style?.textDark,
          backgroundColor: style?.bgDark,
        },
        connected: user.accounts.some(account => account.provider === id),
      }));

      return { ...user, accounts };
    }),

  updateByUserId: authenticatedProcedure
    .input(schema.updateProfileInput)
    .use(convertMeToUserId)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          name: input.name,
        },
        select: {
          id: true,
          updatedAt: true,
        },
      });

      return { success: !!user, userId: user.id, updatedAt: user.updatedAt };
    }),
});
