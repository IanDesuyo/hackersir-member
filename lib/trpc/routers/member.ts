import {
  createTRPCRouter,
  authenticatedProcedure,
  adminReadProcedure,
  convertMeToUserId,
  adminWriteProcedure,
} from "..";
import * as schema from "@/lib/schemas/member";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import onMemberJoined from "@/lib/email/templates/onMemberJoined";
import { randomBytes } from "crypto";
import { SignJWT, jwtVerify, base64url } from "jose";

import { env } from "@/lib/env.mjs";

const JWT_SECRET = base64url.decode(env.NEXTAUTH_SECRET);

export const memberRouter = createTRPCRouter({
  getStatusByUserId: authenticatedProcedure
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

  getCodeByUserId: authenticatedProcedure
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

  // TODO: add pagination
  getAll: adminReadProcedure.input(schema.getAllInput).query(async ({ ctx, input }) => {
    const { year: _year, status, query } = input;
    let year = _year as number;

    if (!year) {
      year = await ctx.prisma.setting
        .findUniqueOrThrow({
          where: { id: "current_year" },
        })
        .then(setting => parseInt(setting.value));
    }

    const where = {
      year,
      ...(status === "active" && { active: true, suspended: false }),
      ...(status === "inactive" && { active: false }),
      ...(status === "suspended" && { suspended: true }),
      ...(query && {
        OR: [
          { userId: { contains: query } },
          { user: { studentInfo: { realname: { contains: query } } } },
          { user: { studentInfo: { studentId: { contains: query } } } },
        ],
      }),
    } as Prisma.MemberDataWhereInput;

    const _members = await ctx.prisma.memberData.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        userId: true,
        active: true,
        suspended: true,
        coins: true,
        receipt: {
          select: {
            amount: true,
            bankLast5: true,
            paidAt: true,
            isCompleted: true,
          },
        },
        user: {
          select: {
            studentInfo: true,
          },
        },
      },
    });

    const members = _members.map(member => ({
      ...member,
      receipt: member.receipt as NonNullable<typeof member.receipt>,
      studentInfo: member.user.studentInfo as NonNullable<typeof member.user.studentInfo>, // Already checked when join.apply
      user: undefined,
    }));

    return members;
  }),

  updateStatusByUserId: adminWriteProcedure.input(schema.updateMemberStatusInput).mutation(async ({ ctx, input }) => {
    const { userId, year: _year, active, suspended, sendEmail } = input;
    let year = _year as number;

    if (!year) {
      year = await ctx.prisma.setting
        .findUniqueOrThrow({
          where: { id: "current_year" },
        })
        .then(setting => parseInt(setting.value));
    }

    // Check user exists and is a member
    const memberExist = await ctx.prisma.memberData.count({
      where: {
        userId,
        year,
      },
    });

    if (memberExist !== 1) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "User does not have member data" });
    }

    // Update status
    const member = await ctx.prisma.memberData.update({
      where: { userId_year: { userId, year } },
      data: { active, suspended },
      select: {
        userId: true,
        active: true,
        suspended: true,
        receipt: {
          select: { id: true, isCompleted: true },
        },
        updatedAt: true,
      },
    });

    // Update receipt
    if (member.receipt && !member.receipt.isCompleted) {
      const receipt = await ctx.prisma.receipt.update({
        where: { id: member.receipt.id },
        data: { paidAt: new Date(), isCompleted: active },
      });

      // Send onMemberJoined email
      if (member.active && sendEmail) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: member.userId },
          select: { email: true, studentInfo: { select: { realname: true, studentId: true } } },
        });

        if (!user?.studentInfo) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "User does not have studentInfo" });
        }

        onMemberJoined({
          name: user.studentInfo.realname,
          studentId: user.studentInfo.studentId,
          receipt,
          email: user.email,
        });
      }
    }

    return { success: !!member, userId: member.userId, updatedAt: member.updatedAt };
  }),
});
