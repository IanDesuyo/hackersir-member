import { createTRPCRouter, authenticatedProcedure, adminReadProcedure, convertMeToUserId } from "..";
import { authProviders } from "@/lib/auth";
import * as schema from "@/lib/schemas/member";
import type { Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { SignJWT, jwtVerify, base64url } from "jose";

import { env } from "@/lib/env.mjs";

const JWT_SECRET = base64url.decode(env.NEXTAUTH_SECRET);

export const memberRouter = createTRPCRouter({
  getProfileById: authenticatedProcedure
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

  updateProfileById: authenticatedProcedure
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

  getStudentDataById: authenticatedProcedure
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

  updateStudentDataById: authenticatedProcedure
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

  getStatusById: authenticatedProcedure
    .input(schema.getStatusByIdInput)
    .use(convertMeToUserId)
    .query(async ({ ctx, input }) => {
      const { userId, year: _year } = input;
      let year = _year as number;

      if (!year) {
        year = await ctx.prisma.setting
          .findUniqueOrThrow({
            where: { id: "current_year" },
          })
          .then(setting => parseInt(setting.value));
      }

      const memberStatus = await ctx.prisma.memberData.findUnique({
        where: { userId_year: { userId, year } },
      });

      return memberStatus ?? { year, active: false, suspended: false, coins: 0 };
    }),

  getCodeById: authenticatedProcedure
    .input(schema.getCodeByIdInput)
    .use(convertMeToUserId)
    .query(async ({ ctx, input }) => {
      const nonce = randomBytes(4).toString("hex");

      const token = await new SignJWT({ nonce })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuer("member.hackersir.org")
        .setIssuedAt()
        .setSubject(input.userId)
        .setExpirationTime("3m")
        .sign(JWT_SECRET);

      return { token, validUntil: Date.now() + 3 * 60 * 1000 };
    }),

  verifyCode: adminReadProcedure.input(schema.verifyCodeInput).mutation(async ({ ctx, input }) => {
    try {
      const jwt = await jwtVerify(input.code, JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: "member.hackersir.org",
        clockTolerance: 5,
      });

      const userId = jwt.payload.sub;

      return { success: true, userId };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }),
});
