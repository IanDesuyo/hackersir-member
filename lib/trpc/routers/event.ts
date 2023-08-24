import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "..";
import * as schema from "@/lib/schemas/event";

export const eventRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input,
      },
    });

    return event;
  }),

  getAll: publicProcedure.input(schema.getAllInput).query(async ({ ctx, input }) => {
    const events = await ctx.prisma.event.findMany({
      where: {
        startAt: {
          gte: input.startDate,
          lte: input.endDate,
        },
      },
      orderBy: {
        startAt: "asc",
      },
      take: input.limit,
      skip: input.offset,
    });

    return events;
  }),
});
