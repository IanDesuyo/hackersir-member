import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "..";

export const eventRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input,
      },
    });

    return event;
  }),
});
