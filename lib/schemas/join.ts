import { z } from "zod";

export const applyInput = z.union([
  z.object({
    paymentMethod: z.literal("bank_transfer"),
    bankLast5: z.string(),
  }),
  z.object({
    paymentMethod: z.literal("cash"),
  }),
]);
