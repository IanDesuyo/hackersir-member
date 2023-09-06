import { z } from "zod";

export const userId = z.string().cuid();
export const userIdOrMe = userId.or(z.literal("me"));

export const yearNumber = z.number().int().min(2013).max(new Date().getFullYear());

export const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
});
