import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminReadProcedure } from "..";
import * as schema from "@/lib/schemas/dashboard";
import { Prisma } from "@prisma/client";

export const dashboardRouter = createTRPCRouter({
  getDetails: adminReadProcedure.query(async ({ ctx }) => {
    const currentYear = await ctx.prisma.setting
      .findUniqueOrThrow({
        where: {
          id: "current_year",
        },
      })
      .then(setting => parseInt(setting.value));

    const [activeCount, suspendedCount, applyCount] = await ctx.prisma.$transaction([
      ctx.prisma.memberData.count({
        where: {
          active: true,
          year: currentYear,
        },
      }),
      ctx.prisma.memberData.count({
        where: {
          suspended: true,
          year: currentYear,
        },
      }),
      ctx.prisma.memberData.count({
        where: {
          year: currentYear,
        },
      }),
    ]);

    return {
      activeCount,
      suspendedCount,
      applyCount,
    };
  }),

  search: adminReadProcedure.input(schema.searchInput).query(async ({ ctx, input }) => {
    const { query, search } = input;

    const userQuery: Prisma.UserWhereInput[] = [];

    if (search.includes("userId")) {
      userQuery.push({
        id: {
          contains: query,
        },
      });
    }

    if (search.includes("studentId")) {
      userQuery.push({
        studentInfo: {
          studentId: {
            contains: query,
          },
        },
      });
    }

    if (search.includes("realname")) {
      userQuery.push({
        studentInfo: {
          realname: {
            contains: query,
          },
        },
      });
    }

    const [users] = await ctx.prisma.$transaction([
      ctx.prisma.user.findMany({
        where: {
          OR: userQuery,
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return [
      {
        title: "社員",
        data: users.map(user => ({
          id: user.id,
          label: user.name,
          href: `/members/${user.id}`,
        })),
      },
    ];
  }),
});
