import { createTRPCRouter, authenticatedProcedure, convertMeToUserId, adminReadProcedure } from "..";
import * as schema from "@/lib/schemas/signin";

export const signinRouter = createTRPCRouter({
  getByUserId: authenticatedProcedure
    .input(schema.userIdInput)
    .use(convertMeToUserId)
    .query(async ({ ctx, input }) => {
      const signins = await ctx.prisma.signIn.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: { signinAt: "desc" },
        select: {
          id: true,
          isOnline: true,
          signinAt: true,
          signoutAt: true,
          event: {
            select: {
              name: true,
              startAt: true,
              endAt: true,
            },
          },
        },
      });

      return signins;
    }),

  getByEventId: adminReadProcedure.input(schema.eventIdInput).query(async ({ ctx, input }) => {
    const signins = await ctx.prisma.signIn.findMany({
      where: {
        eventId: input.eventId,
      },
      orderBy: { signinAt: "desc" },
      select: {
        id: true,
        isOnline: true,
        signinAt: true,
        signoutAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return signins;
  }),
});
