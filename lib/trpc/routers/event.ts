import { z } from "zod";
import { adminWriteProcedure, createTRPCRouter, publicProcedure } from "..";
import * as schema from "@/lib/schemas/event";

export const eventRouter = createTRPCRouter({
  getById: publicProcedure.input(schema.eventIdInput).query(async ({ ctx, input }) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
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

  updateById: adminWriteProcedure.input(schema.updateByIdInput).mutation(async ({ ctx, input }) => {
    const { eventId, ...rest } = input;

    const event = await ctx.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...rest,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    return { success: !!event, eventId: event.id, updatedAt: event.updatedAt };
  }),
});
