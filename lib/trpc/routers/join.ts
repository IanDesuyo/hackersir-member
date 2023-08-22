import { createTRPCRouter, publicProcedure, authenticatedProcedure } from "..";

export const joinRouter = createTRPCRouter({
  getDetails: publicProcedure.query(async ({ ctx }) => {
    console.log("getDetails");

    const settings = await ctx.prisma.$transaction(
      ["applicable", "current_year", "member_vaild_until", "club_fee"].map(id =>
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
      isMember,
    };
  }),

  apply: authenticatedProcedure.mutation(async ({ ctx }) => {
    const settings = await ctx.prisma.setting.findUniqueOrThrow({
      where: {
        id: "current_year",
      },
    });

    const currentYear = parseInt(settings.value);

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

    if (isMember) {
      throw new Error("User is already a member");
    }

    const memberData = await ctx.prisma.memberData.create({
      data: {
        userId: ctx.session.user.id,
        year: currentYear,
      },
    });

    return { success: !!memberData, updatedAt: memberData.updatedAt };
  }),
});
