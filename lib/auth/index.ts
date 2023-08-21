import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import { getServerSession as getNextAuthServerSession } from "next-auth/next";
import DiscordPrivider from "next-auth/providers/discord";
import GooglePrivider from "next-auth/providers/google";
import FcuProvider, { type FcuProfile } from "@/lib/auth/fcu";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

import { env } from "@/lib/env.mjs";

export const authProviders = [
  GooglePrivider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true, // Allow linking accounts with the same email address
  }),
  DiscordPrivider({
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
  FcuProvider({
    clientId: env.FCU_CLIENT_ID,
    clientSecret: "",
  }),
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: authProviders,
  callbacks: {
    signIn: async ({ account, user, profile }) => {
      if (account?.provider === "fcu-nid") {
        if (!("createdAt" in user)) {
          // Account is not linked to a user
          const currentSession = await getServerSession();

          if (!currentSession?.user?.id) {
            return "/?error=NotRegistered";
          }

          // Link account to current user
          user.id = currentSession.user.id;
        }

        // Update user's student data
        await updateFcuStudentData(user.id, profile as FcuProfile);
      }

      // Update user image
      user.image = profile?.image;

      return true;
    },
    session: async ({ session, user }) => {
      if (session) {
        session.user = user;
        session.member = await getSessionMemberStatus(session);
      }

      return session;
    },
  },
  pages: {
    newUser: "/join",
  },
};

export const getServerSession = () => {
  return getNextAuthServerSession(authOptions);
};

const getSessionMemberStatus = async (session: Session) => {
  const CURRENT_YEAR = await prisma.setting
    .findUniqueOrThrow({
      where: { id: "current_year" },
    })
    .then(setting => parseInt(setting.value));

  const memberStatus = await prisma.memberData.findUnique({
    where: { userId_year: { userId: session.user.id, year: CURRENT_YEAR } },
    select: { year: true, active: true, suspended: true },
  });

  return memberStatus ?? { year: CURRENT_YEAR, active: false, suspended: false };
};

export const enum Permission {
  Basic = 0x1,
  AdminRead = 0x2,
  AdminWrite = 0x4,
}

const updateFcuStudentData = async (userId: string, profile: FcuProfile) => {
  const data = {
    school: "逢甲大學",
    realname: profile.name,
    studentId: profile.id,
    eduEmail: profile.Email,
    department: profile.dept_name,
    major: profile.unit_name,
    class: profile.classname,
    // Set verification status
    isVerified: true,
  } satisfies Prisma.StudentDataUpdateInput;

  await prisma.studentData.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

export const hasPermissions = (session: Session | null, permissions: Permission[]) => {
  const p = permissions.reduce((acc, cur) => acc | cur, 0);

  if (!session || !session.user) {
    return false;
  }

  return (session.user.permission & p) === p;
};
