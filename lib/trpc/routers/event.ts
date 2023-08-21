import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "..";

export const eventRouter = createTRPCRouter({
  getEvent: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input,
      },
    });

    return event;
  }),
});
