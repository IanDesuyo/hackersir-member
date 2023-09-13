import { z } from "zod";
import { authenticatedProcedure, convertMeToUserId, createTRPCRouter } from "..";
import { Permission, hasPermissions } from "@/lib/auth";
import * as schema from "@/lib/schemas/receipt";

export const receiptRouter = createTRPCRouter({
  getById: authenticatedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    let userId: string | undefined = ctx.session.user.id;

    // Check if user has permission to view all receipts
    if (hasPermissions(ctx.session, [Permission.AdminRead])) {
      userId = undefined;
    }

    const receipt = await ctx.prisma.receipt.findUnique({
      where: {
        id: input,
        userId,
      },
    });

    return receipt;
  }),

  getByUserId: authenticatedProcedure
    .input(schema.userIdInput)
    .use(convertMeToUserId)
    .query(async ({ ctx, input }) => {
      const receipts = await ctx.prisma.receipt.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: { createdAt: "desc" },
      });

      return receipts;
    }),
});
