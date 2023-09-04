import { z } from "zod";

export const userIdOrMe = z.string().cuid().or(z.literal("me"));

export const yearNumber = z.number().int().min(2013).max(new Date().getFullYear()).default(new Date().getFullYear());
