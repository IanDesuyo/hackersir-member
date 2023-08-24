import { z } from "zod";

export const getAllInput = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(50).default(10).optional(),
  offset: z.number().int().default(0).optional(),
});
