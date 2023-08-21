import { createTRPCRouter, authenticatedProcedure, convertMeToUserId } from "..";
import { authProviders } from "@/lib/auth";
import * as schema from "@/lib/schemas/member";
import { Prisma } from "@prisma/client";

export const memberRouter = createTRPCRouter({
  getProfile: authenticatedProcedure
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

  updateProfile: authenticatedProcedure
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
      });

      return { success: !!user, updatedAt: user.updatedAt };
    }),

  getStudentData: authenticatedProcedure
    .input(schema.userIdInput)
    .use(convertMeToUserId)
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.studentData.findUnique({
        where: {
          userId: input.userId,
        },
      });

      return student;
    }),

  updateStudentData: authenticatedProcedure
    .input(schema.updateStudentDataInput)
    .use(convertMeToUserId)
    .mutation(async ({ ctx, input }) => {
      const data = {
        school: input.school,
        realname: input.realname,
        studentId: input.studentId,
        department: input.department,
        major: input.major,
        class: input.class,
        // Reset verification status
        isVerified: false,
      } satisfies Prisma.StudentDataUpdateInput;

      const student = await ctx.prisma.studentData.upsert({
        where: {
          userId: input.userId,
        },
        update: data,
        create: {
          userId: input.userId,
          ...data,
        },
      });

      return { success: !!student, updatedAt: student.updatedAt };
    }),
});
