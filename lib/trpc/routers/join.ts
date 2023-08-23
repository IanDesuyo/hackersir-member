import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, authenticatedProcedure } from "..";
import * as schema from "@/lib/schemas/join";

export const joinRouter = createTRPCRouter({
  getDetails: publicProcedure.query(async ({ ctx }) => {
    console.log("getDetails");

    const settings = await ctx.prisma.$transaction(
      ["applicable", "current_year", "member_vaild_until", "club_fee", "president"].map(id =>
        ctx.prisma.setting.findUniqueOrThrow({
          where: {
            id,
          },
        })
      )
    );

    const applicable = settings[0].value === "true";
    const currentYear = parseInt(settings[1].value);
    const memberVaildUntil = settings[2].value;
    const clubFee = parseInt(settings[3].value);
    const president = settings[4].value;

    // Check if user is already a member
    let isMember = false;

    if (ctx.session?.user) {
      const count = await ctx.prisma.memberData.count({
        where: {
          userId: ctx.session.user.id,
          year: currentYear,
        },
      });

      isMember = count > 0;
    }

    return {
      applicable,
      currentYear,
      memberVaildUntil,
      clubFee,
      president,
      isMember,
    };
  }),

  apply: authenticatedProcedure.input(schema.applyInput).mutation(async ({ ctx, input }) => {
    const settings = await ctx.prisma.$transaction(
      ["applicable", "current_year", "club_fee"].map(id =>
        ctx.prisma.setting.findUniqueOrThrow({
          where: {
            id,
          },
        })
      )
    );
    const applicable = settings[0].value === "true";
    const currentYear = parseInt(settings[1].value);
    const clubFee = parseInt(settings[2].value);

    if (!applicable) {
      throw new Error("Membership is not applicable");
    }

    // Check user is already a member or not
    let isMember = false;

    if (ctx.session?.user) {
      const c1 = await ctx.prisma.memberData.count({
        where: {
          userId: ctx.session.user.id,
          year: currentYear,
        },
      });

      isMember = c1 > 0;
    }

    if (isMember) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "User is already a member" });
    }

    // Check user has studentData
    const c2 = await ctx.prisma.studentData.count({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (c2 !== 1) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "User has no student data" });
    }

    const [memberData, receipt] = await ctx.prisma.$transaction(async prisma => {
      const receipt = await prisma.receipt.create({
        data: {
          userId: ctx.session.user.id,
          title: "逢甲大學黑客社 社費",
          amount: clubFee,
          bankLast5: input.paymentMethod === "bank_transfer" ? input.bankLast5 : null,
        },
      });

      const memberData = await prisma.memberData.create({
        data: {
          userId: ctx.session.user.id,
          year: currentYear,
          receiptId: receipt.id,
        },
      });

      return [memberData, receipt];
    });

    return { success: !!memberData, updatedAt: memberData.updatedAt };
  }),
});
