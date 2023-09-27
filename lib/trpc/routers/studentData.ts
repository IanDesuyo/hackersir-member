import { createTRPCRouter, authenticatedProcedure, convertMeToUserId } from "..";
import * as schema from "@/lib/schemas/member";
import type { Prisma } from "@prisma/client";

export const studentDataRouter = createTRPCRouter({
  getByUserId: authenticatedProcedure
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

  updateByUserId: authenticatedProcedure
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
        select: {
          userId: true,
          updatedAt: true,
        },
      });

      return { success: !!student, userId: student.userId, updatedAt: student.updatedAt };
    }),
});
