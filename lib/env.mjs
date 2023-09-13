import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    FCU_CLIENT_ID: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    SMTP_NAME: z.string().min(1),
    SMTP_FROM: z.string().email(),
    SMTP_URL: z.string().regex(/^smtps?:\/\/(\w+):(\w+)@.+/),
    DISCORD_BOT_TOKEN: z.string().min(1),
    DISCORD_GUILD_ID: z.string().min(1),
    DISCORD_ROLE_ID: z.string().min(1),
  },
  client: {
    GA_TRACKING_ID: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FCU_CLIENT_ID: process.env.FCU_CLIENT_ID,
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_NAME: process.env.SMTP_NAME,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_URL: process.env.SMTP_URL,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
    DISCORD_ROLE_ID: process.env.DISCORD_ROLE_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
});
